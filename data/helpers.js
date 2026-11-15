/* ---------- 공통 계산 (고치지 않아도 됨) ---------- */
(function (D) {
  D.org = {}; D.orgs.forEach(function (o) { D.org[o.id] = o; });
  D.byId = {}; D.projects.forEach(function (p) { D.byId[p.id] = p; });
  D.smkOf = function (pid) { return D.smk.filter(function (s) { return s.p === pid; }); };
  D.techsOf = function (p) { var n = D.smkOf(p.id).length; return n || p.techs || 0; };
  D.years = D.projects.map(function (p) { return p.year; })
    .filter(function (y, i, a) { return a.indexOf(y) === i; }).sort(function (a, b) { return b - a; });
  D.orgNames = function (p) { return p.org.map(function (o) { return D.org[o] ? D.org[o].name : o; }).join(' · '); };
  D.href = function (u) { return /^https?:/.test(u) ? u : D.base + u; };
  D.fmt = function (d) { return d ? d.replace(/-/g, '.') : ''; };
  /* 썸네일 주소: 이름만 있으면 허브 assets/ 폴더, 경로(/나 .포함)면 그 경로 그대로 */
  D.img = function (n, kind, root) { if (/^https?:/.test(n)) return n; return /[\/.]/.test(n) ? (root || '') + n : (root || '') + 'assets/' + kind + '/' + n + '.jpg'; };
})(window.DARAE);
