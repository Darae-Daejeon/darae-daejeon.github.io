/* =========================================================
   data.js 자동 생성
   계정(Darae-Daejeon)의 공개 저장소를 모두 훑어서, 폴더마다 있는
   project.json 을 모아 data.js 를 다시 만듭니다.

   - 기관·종류·시리즈 설정 : data/config.json
   - 깃허브 폴더가 없는 사업(드라이브 링크 등) : data/local.json
   - 공통 계산 코드 : data/helpers.js
   실행 : node scripts/build-data.mjs
   로컬 테스트 : LOCAL_ROOT=/폴더 node scripts/build-data.mjs  (저장소들이 LOCAL_ROOT/<저장소이름> 에 있을 때)
   ========================================================= */
import fs from 'node:fs';
import path from 'node:path';

const OWNER = process.env.OWNER || 'Darae-Daejeon';
const HUB = process.env.HUB_REPO || 'darae-daejeon.github.io';
const LOCAL = process.env.LOCAL_ROOT;
const TOKEN = process.env.GITHUB_TOKEN;
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const TYPES = ['event', 'news', 'survey', 'report'];

const warn = [];
const read = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));

async function api(url) {
  const r = await fetch('https://api.github.com' + url, {
    headers: { Accept: 'application/vnd.github+json', ...(TOKEN ? { Authorization: 'Bearer ' + TOKEN } : {}) }
  });
  if (!r.ok) throw new Error(`GitHub API ${r.status} ${url}`);
  return r.json();
}
async function raw(repo, branch, file) {
  const r = await fetch(`https://raw.githubusercontent.com/${OWNER}/${repo}/${branch}/${encodeURI(file)}`);
  if (!r.ok) throw new Error(`파일 읽기 실패 ${r.status} ${repo}/${file}`);
  return r.text();
}

/* 저장소마다 [{dir, json}] 와 파일 목록 */
async function scanRemote() {
  const repos = [];
  for (let page = 1; ; page++) {
    const list = await api(`/users/${OWNER}/repos?per_page=100&type=owner&page=${page}`);
    repos.push(...list);
    if (list.length < 100) break;
  }
  const out = [];
  for (const r of repos) {
    if (r.private || r.fork || r.archived || r.name.toLowerCase() === HUB.toLowerCase()) continue;
    const tree = await api(`/repos/${OWNER}/${r.name}/git/trees/${r.default_branch}?recursive=1`);
    if (tree.truncated) warn.push(`${r.name}: 파일이 너무 많아 일부만 확인됨`);
    const files = tree.tree.filter((t) => t.type === 'blob').map((t) => t.path);
    for (const f of files.filter((f) => /(^|\/)project\.json$/.test(f))) {
      out.push({ repo: r.name, dir: path.posix.dirname(f), text: await raw(r.name, r.default_branch, f), files });
    }
  }
  return out;
}
function scanLocal() {
  const out = [];
  for (const repo of fs.readdirSync(LOCAL)) {
    const base = path.join(LOCAL, repo);
    if (repo.toLowerCase() === HUB.toLowerCase() || !fs.existsSync(path.join(base, '.git'))) continue;
    const files = [];
    (function walk(d, rel) {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        if (e.name === '.git' || e.name === 'node_modules') continue;
        const r = rel ? rel + '/' + e.name : e.name;
        e.isDirectory() ? walk(path.join(d, e.name), r) : files.push(r);
      }
    })(base, '');
    for (const f of files.filter((f) => /(^|\/)project\.json$/.test(f))) {
      out.push({ repo, dir: path.posix.dirname(f), text: fs.readFileSync(path.join(base, f), 'utf8'), files });
    }
  }
  return out;
}

const isPath = (n) => typeof n === 'string' && /[\/.]/.test(n) && !/^https?:/.test(n);

function fromFolder({ repo, dir, text, files }) {
  const where = `${repo}/${dir}/project.json`;
  let p;
  try { p = JSON.parse(text); } catch (e) { warn.push(`${where}: JSON 형식 오류로 건너뜀 (${e.message})`); return null; }
  const prefix = repo + '/' + (dir === '.' ? '' : dir + '/');
  for (const k of ['id', 'year', 'type', 'org', 'title']) {
    if (p[k] === undefined || p[k] === '') { warn.push(`${where}: ${k} 가 없어 건너뜀`); return null; }
  }
  if (!TYPES.includes(p.type)) { warn.push(`${where}: type 은 ${TYPES.join('/')} 중 하나여야 함`); return null; }
  if (typeof p.org === 'string') p.org = [p.org];
  if (!p.url) p.url = prefix;
  else if (!/^https?:/.test(p.url)) p.url = prefix + p.url.replace(/^\.\//, '');
  if (isPath(p.thumb)) p.thumb = prefix + p.thumb.replace(/^\.\//, '');
  if (p.mosaic) p.mosaic = p.mosaic.map((m) => (isPath(m) ? prefix + m.replace(/^\.\//, '') : m));
  if (!p.thumb && !p.mosaic && !p.drive) {
    const here = dir === '.' ? '' : dir + '/';
    const f = ['thumb.jpg', 'thumb.png', 'thumb.webp', 'og.jpg', 'og.png'].find((n) => files.includes(here + n));
    if (f) p.thumb = prefix + f; else warn.push(`${where}: 썸네일이 없음 (폴더에 thumb.jpg 를 넣으면 자동 사용)`);
  }
  const smk = (p.smk || []).map((s) => {
    const x = { p: p.id, ...s };
    if (x.url && !/^https?:/.test(x.url)) x.url = prefix + x.url.replace(/^\.\//, '');
    if (isPath(x.thumb)) x.thumb = prefix + x.thumb.replace(/^\.\//, '');
    return x;
  });
  delete p.smk;
  return { p, smk };
}

const cfg = read('data/config.json');
const local = read('data/local.json');
const found = LOCAL ? scanLocal() : await scanRemote();

const projects = [], smk = [], seen = new Map();
const add = (p, s, from) => {
  if (seen.has(p.id)) { warn.push(`id "${p.id}" 가 ${seen.get(p.id)} 와 ${from} 에 겹쳐 뒤의 것을 건너뜀`); return; }
  seen.set(p.id, from); projects.push(p); smk.push(...s);
};
for (const l of local) {
  const { smk: s = [], ...p } = l;
  add(p, s.map((x) => ({ p: p.id, ...x })), 'data/local.json');
}
for (const f of found) {
  const r = fromFolder(f);
  if (r) add(r.p, r.smk, `${f.repo}/${f.dir}`);
}

/* 최신 연도 → 날짜 → order 순 */
projects.sort((a, b) => b.year - a.year || (b.date || '').localeCompare(a.date || '') || (b.order || 0) - (a.order || 0));

const head = `/* =========================================================
   다래 실적 대장 — 자동 생성 파일, 직접 고치지 마세요.
   ${new Date().toISOString().slice(0, 10)} · 사업 ${projects.length}건 · SMK ${smk.length}건

   새 사업은 해당 기관 저장소의 사업 폴더에 project.json 을 넣으면 자동으로 반영됩니다.
   기관·종류 설정은 data/config.json, 깃허브 폴더가 없는 사업은 data/local.json
   ========================================================= */
`;
const body = 'window.DARAE = ' + JSON.stringify({ ...cfg, projects, smk }, null, 2) + ';\n\n';
const out = head + body + fs.readFileSync(path.join(ROOT, 'data/helpers.js'), 'utf8');

const target = path.join(ROOT, 'data.js');
const strip = (s) => s.replace(/^ {3}\d{4}-\d{2}-\d{2} · /m, '');
const old = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : '';
if (strip(old) !== strip(out)) { fs.writeFileSync(target, out); console.log('data.js 갱신'); }
else console.log('변경 없음');
console.log(`사업 ${projects.length}건 (폴더 ${found.length} + 직접 ${local.length}) · SMK ${smk.length}건`);
if (warn.length) { console.log('\n확인 필요:'); warn.forEach((w) => console.log(' - ' + w)); }
