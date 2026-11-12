/* 다래 허브 화면 — 내용은 data.js(실적 대장)에서 읽음. 이 파일은 고치지 않아도 됨 */
(function () {
  var D = window.DARAE, ROOT = window.HUB_ROOT || '';
  function V() { return window.HUB_VARIANT || 'drag'; }   // drag / coverflow / thumbs
  var q = new URLSearchParams(location.search);
  var TODAY = q.get('today') ? new Date(q.get('today') + 'T00:00:00+09:00') : new Date();
  var TABS = [['all', 'ALL'], ['event', 'EVENTS'], ['news', 'NEWSLETTER'], ['survey', 'SURVEY']];
  var WEEK = '일월화수목금토';
  function $(id) { return document.getElementById(id); }
  function thumbSrc(n) { return ROOT + 'assets/thumbs/' + n + '.jpg'; }
  function dateOf(p) { return p.date ? new Date(p.date + 'T' + (p.time || '23:59') + ':00+09:00') : null; }

  /* ---------- 다음 행사 (오늘 이후 가장 가까운 행사, 없으면 가장 최근 행사) ---------- */
  function hero() {
    var ev = D.projects.filter(function (p) { return p.type === 'event' && p.date; })
      .sort(function (a, b) { return dateOf(a) - dateOf(b); });
    var up = ev.filter(function (p) { return dateOf(p) >= TODAY; });
    var p = up[0] || ev[ev.length - 1]; if (!p) return;
    var isNext = !!up[0], d = dateOf(p);
    var a = $('next'), pill = $('pill');
    a.href = pill.href = D.href(p.url);
    pill.textContent = (isNext ? 'NEXT EVENT' : 'LATEST EVENT') + ' ↗';
    $('mosaic').innerHTML = (p.mosaic || [p.thumb]).map(function (n) { return '<img src="' + thumbSrc(n) + '" alt="">'; }).join('') +
      '<div class="dday" id="dday"></div>';
    $('mosaic').style.gridTemplateColumns = 'repeat(' + (p.mosaic ? p.mosaic.length : 1) + ',1fr)';
    var days = Math.ceil((new Date(p.date + 'T00:00:00+09:00') - new Date(TODAY.toDateString())) / 864e5);
    $('dday').textContent = !isNext ? 'DONE' : days > 0 ? 'D-' + days : 'D-DAY';
    $('next-kind').textContent = (isNext ? 'Next Event · ' : 'Latest Event · ') + (p.kind || '행사');
    $('next-title').textContent = p.title;
    var t = D.techsOf(p);
    $('next-meta').innerHTML =
      '<dt>DATE</dt><dd>' + D.fmt(p.date) + '(' + WEEK[d.getDay()] + ')' + (p.time ? ' ' + p.time : '') + '</dd>' +
      (p.place ? '<dt>PLACE</dt><dd>' + p.place + '</dd>' : '') +
      (t ? '<dt>TECH</dt><dd>소개 기술 ' + t + '건</dd>' : '');
  }

  /* ---------- 숫자 띠 (전체 연도 누적) ---------- */
  function stats() {
    var ev = D.projects.filter(function (p) { return p.type === 'event'; }).length;
    var nw = D.projects.filter(function (p) { return p.type === 'news'; }).length;
    var tc = D.projects.reduce(function (n, p) { return n + D.techsOf(p); }, 0);
    $('n-event').dataset.n = ev; $('n-tech').dataset.n = tc; $('n-news').dataset.n = nw;
    var sm = D.smk.length;
    if ($('n-tech-sub')) $('n-tech-sub').innerHTML = '기술소개서(SMK) <b>' + sm + '</b> + 뉴스레터 소개 기술 <b>' + (tc - sm) + '</b>';
    document.querySelectorAll('.num[data-n]').forEach(function (el) {
      var end = +el.dataset.n, sup = el.querySelector('sup').outerHTML, s = null;
      function step(t) { if (!s) s = t; var k = Math.min((t - s) / 1200, 1); el.innerHTML = Math.round(end * (1 - Math.pow(1 - k, 3))) + sup; if (k < 1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    });
  }

  /* ---------- 아카이브 ---------- */
  var cy = TODAY.getFullYear();
  var state = {
    year: q.get('year') || (D.years.indexOf(cy) > -1 ? String(cy) : String(D.years[0])),
    type: q.get('type') || 'all',
    org: (q.get('org') || 'all').toLowerCase()
  };
  if (state.year !== 'all' && D.years.indexOf(+state.year) < 0) state.year = String(D.years[0]);
  if (!TABS.some(function (t) { return t[0] === state.type; })) state.type = 'all';
  if (state.org !== 'all' && !D.org[state.org]) state.org = 'all';

  function match(p, s) {
    return (s.year === 'all' || p.year === +s.year) && (s.type === 'all' || p.type === s.type) &&
      (s.org === 'all' || p.org.indexOf(s.org) > -1);
  }
  function count(s) { return D.projects.filter(function (p) { return match(p, s); }).length; }
  function withS(k, v) { var o = { year: state.year, type: state.type, org: state.org }; o[k] = v; return o; }

  function thumbHTML(p) {
    if (p.mosaic) return '<div class="mini">' + p.mosaic.map(function (n) { return '<img src="' + thumbSrc(n) + '" alt="" loading="lazy">'; }).join('') + '</div>';
    if (p.thumb) return '<img src="' + thumbSrc(p.thumb) + '" alt="' + p.title + '" loading="lazy">';
    return '<div class="tile-fill"><b>' + (p.issue || D.orgNames(p)) + '</b><small>' + D.types[p.type] + '</small></div>';
  }
  /* 진행 중: 날짜가 오늘 이후인 행사(행사일)·수요조사(마감일) */
  function live(p) {
    if (!p.date || (p.type !== 'event' && p.type !== 'survey')) return '';
    var d = Math.ceil((new Date(p.date + 'T00:00:00+09:00') - new Date(TODAY.toDateString())) / 864e5);
    if (d < 0) return '';
    var dd = d === 0 ? 'D-DAY' : 'D-' + d;
    return p.type === 'survey' ? '진행중 · 마감 ' + dd : '진행중 · ' + dd;
  }
  function card(p, inSeries) {
    var top = inSeries ? (p.issue || '') : D.orgNames(p) + ' · ' + (p.dateLabel || D.fmt(p.date) || p.issue || p.year);
    var title = inSeries || !p.series ? p.title : (D.series[p.series] ? D.series[p.series].name + ' — ' : '') + (p.issue ? p.issue + ' ' : '') + p.title;
    var lv = live(p);
    var a = '<a class="card" href="' + D.href(p.url) + '" target="_blank" rel="noopener">' +
      '<div class="thumb">' + thumbHTML(p) + '<span class="badge">' + D.types[p.type] + '</span>' + (lv ? '<span class="live-tag"><i></i>' + lv + '</span>' : '') + '<span class="go">↗</span></div>' +
      '<div class="cap"><div class="mono">' + top + '</div><h3>' + title + '</h3></div></a>';
    var n = D.smkOf(p.id).length;
    var link = n ? '<a class="smk-link" href="' + ROOT + 'smk/?p=' + p.id + '">기술소개서 ' + n + '건 보기 →</a>' : '';
    return inSeries ? a + link : '<div class="item rv' + (lv ? ' live' : '') + '">' + a + link + '</div>';
  }
  function seriesBlock(key, list) {
    var S = D.series[key] || { name: key, desc: '' };
    var p0 = list[0], words = S.name.split(' ');
    var info = '<div class="s-info"><span class="mono">Series · ' + D.orgNames(p0) + ' · ' + p0.year + '</span>' +
      '<h3>' + words.map(function (w) { return '<span>' + w + '</span>'; }).join(' ') + '</h3><p>' + S.desc + '</p>' +
      '<div class="s-foot"><span class="s-count">' + list.length + '<small>ISSUES</small></span>' +
      '<div class="s-nav"><button type="button" class="s-prev" aria-label="이전">←</button><button type="button" class="s-next" aria-label="다음">→</button></div></div></div>';
    var body;
    if (V() === 'thumbs') {
      body = '<div class="s-body"><div class="swiper s-track s-main"><div class="swiper-wrapper">' + list.map(function (p) {
        return '<div class="swiper-slide"><div class="s-feature"><a class="card" href="' + D.href(p.url) + '" target="_blank" rel="noopener"><div class="thumb">' + thumbHTML(p) + '<span class="go">↗</span></div></a>' +
          '<div><div class="mono">' + (p.issue || '') + '</div><h4>' + p.title + '</h4><div class="meta">소개 기술 ' + D.techsOf(p) + '건</div>' +
          '<a class="open" href="' + D.href(p.url) + '" target="_blank" rel="noopener">뉴스레터 열기 ↗</a></div></div></div>';
      }).join('') + '</div></div>' +
        '<div class="swiper s-thumbs"><div class="swiper-wrapper">' + list.map(function (p) {
          return '<div class="swiper-slide">' + (p.thumb ? '<img src="' + thumbSrc(p.thumb) + '" alt="' + (p.issue || '') + '">' : '<div style="width:64px;height:80px;border-radius:10px;background:var(--paper)"></div>') + '</div>';
        }).join('') + '</div></div></div>';
    } else {
      body = '<div class="s-body"><div class="swiper s-track ' + V() + '"><div class="swiper-wrapper">' +
        list.map(function (p) { return '<div class="swiper-slide">' + card(p, true) + '</div>'; }).join('') +
        '</div></div><div class="s-bar"></div></div>';
    }
    return '<section class="series rv">' + info + body + '</section>';
  }

  function initSeries(sec) {
    var prev = sec.querySelector('.s-prev'), next = sec.querySelector('.s-next');
    var track = sec.querySelector('.s-track');
    if (!window.Swiper) {                                   // 라이브러리를 못 불러오면 가로 스크롤로 동작
      var w = track.querySelector('.swiper-wrapper');
      function upd() { prev.disabled = w.scrollLeft < 4; next.disabled = w.scrollLeft > w.scrollWidth - w.clientWidth - 4; track.classList.toggle('at-end', next.disabled); }
      prev.onclick = function () { w.scrollBy({ left: -w.clientWidth * .8, behavior: 'smooth' }); };
      next.onclick = function () { w.scrollBy({ left: w.clientWidth * .8, behavior: 'smooth' }); };
      w.addEventListener('scroll', upd, { passive: true }); upd(); return;
    }
    var nav = { prevEl: prev, nextEl: next };
    if (V() === 'thumbs') {
      var th = new Swiper(sec.querySelector('.s-thumbs'), { slidesPerView: 'auto', spaceBetween: 10, freeMode: true, watchSlidesProgress: true });
      new Swiper(track, { spaceBetween: 24, navigation: nav, keyboard: { enabled: true }, thumbs: { swiper: th }, grabCursor: true });
      return;
    }
    if (V() === 'coverflow') {
      var sw = new Swiper(track, {
        effect: 'coverflow', centeredSlides: true, slidesPerView: 'auto', grabCursor: true,
        coverflowEffect: { rotate: 32, stretch: 0, depth: 160, modifier: 1, slideShadows: false },
        navigation: nav, keyboard: { enabled: true }
      });
      track.addEventListener('click', function (e) {             // 옆 카드는 누르면 가운데로, 가운데 카드만 열림
        var sl = e.target.closest('.swiper-slide'); if (!sl) return;
        var i = [].indexOf.call(sl.parentNode.children, sl);
        if (i !== sw.activeIndex) { e.preventDefault(); sw.slideTo(i); }
      }, true);
      return;
    }
    var s = new Swiper(track, {
      slidesPerView: 'auto', spaceBetween: 16, grabCursor: true,
      freeMode: { enabled: true, momentumRatio: .6 },
      mousewheel: { forceToAxis: true }, keyboard: { enabled: true },
      navigation: nav, scrollbar: { el: sec.querySelector('.s-bar'), draggable: true }
    });
    function end() { track.classList.toggle('at-end', s.isEnd); }
    s.on('progress', end); s.on('reachEnd', end); end();
  }

  function render() {
    $('arch-year').textContent = state.year === 'all' ? 'ALL' : state.year;
    var yb = $('years-row');
    if (D.years.length > 1) {
      yb.classList.remove('hide');
      $('years').innerHTML = D.years.map(function (y) { return '<button data-y="' + y + '"' + (String(y) === state.year ? ' class="on"' : '') + '>' + y + '</button>'; }).join('') +
        '<button class="txt' + (state.year === 'all' ? ' on' : '') + '" data-y="all">전체</button>';
    } else yb.classList.add('hide');
    $('tabs').innerHTML = TABS.map(function (t) {
      return '<button data-f="' + t[0] + '"' + (t[0] === state.type ? ' class="on"' : '') + '>' + t[1] + '<span class="c">' + count(withS('type', t[0])) + '</span></button>';
    }).join('');
    $('orgs').innerHTML = [{ id: 'all', name: '전체' }].concat(D.orgs).map(function (o) {
      var n = count(withS('org', o.id)), off = !n && o.id !== 'all';
      return '<button data-o="' + o.id + '"' + (o.id === state.org ? ' class="on"' : '') + (off ? ' disabled style="opacity:.3;cursor:default"' : '') + '>' + o.name + '<span class="c">' + n + '</span></button>';
    }).join('');

    var list = D.projects.filter(function (p) { return match(p, state); });
    var groups = {}, singles = [];
    list.forEach(function (p) { if (p.series) (groups[p.series] = groups[p.series] || []).push(p); else singles.push(p); });
    var blocks = [];
    Object.keys(groups).forEach(function (k) {
      var g = groups[k].sort(function (a, b) { return (b.order || 0) - (a.order || 0); });
      if (g.length > 1) blocks.push({ k: k, g: g, y: g[0].year }); else singles.push(g[0]);
    });
    singles.sort(function (a, b) { return b.year - a.year || ((b.date || '') > (a.date || '') ? 1 : -1); });
    blocks.sort(function (a, b) { return b.y - a.y; });
    var html = singles.map(function (p) { return card(p, false); }).join('') +
      blocks.map(function (b) { return seriesBlock(b.k, b.g); }).join('');
    var grid = $('grid'); grid.innerHTML = html;
    $('empty').classList.toggle('hide', list.length > 0);

    // 이전 연도 보기 버튼
    var older = D.years.filter(function (y) { return state.year !== 'all' && y < +state.year; })[0];
    $('older').innerHTML = older ? '<button data-y="' + older + '">' + older + '년 자료 보기 →</button>' : '';

    grid.querySelectorAll('.series').forEach(initSeries);
    var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .1 }) : null;
    grid.querySelectorAll('.rv').forEach(function (c, i) { c.style.transitionDelay = (i % 4) * 70 + 'ms'; io ? io.observe(c) : c.classList.add('in'); });

    var u = new URL(location.href);
    ['year', 'type', 'org'].forEach(function (k) {
      var def = k === 'year' ? (D.years.indexOf(cy) > -1 ? String(cy) : String(D.years[0])) : 'all';
      state[k] === def ? u.searchParams.delete(k) : u.searchParams.set(k, state[k]);
    });
    try { history.replaceState(null, '', u); } catch (e) {}
  }

  function on(id, attr, key) {
    $(id).addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || b.disabled) return;
      state[key] = b.dataset[attr]; render();
      if (id === 'older') $('archive').scrollIntoView({ behavior: 'smooth' });
    });
  }
  on('tabs', 'f', 'type'); on('orgs', 'o', 'org'); on('years', 'y', 'year'); on('older', 'y', 'year');
  document.querySelectorAll('[data-jump]').forEach(function (a) { a.addEventListener('click', function () { state.type = a.dataset.jump; render(); }); });

  /* ---------- SMK 띠: 기술소개서 썸네일이 흐르는 바로가기 ---------- */
  function smkBand() {
    var el = $('smkband'); if (!el || !D.smk.length) return;
    var pick = [], seen = {}, per = {};                     // 사업마다 골고루 최대 14장
    D.smk.forEach(function (x) { per[x.p] = (per[x.p] || []).concat(x); });
    var keys = Object.keys(per), i = 0;
    while (pick.length < Math.min(14, D.smk.length)) { var k = keys[i % keys.length], l = per[k]; if (l.length) { var x = l.shift(); if (!seen[x.thumb]) { seen[x.thumb] = 1; pick.push(x); } } i++; if (i > 200) break; }
    var tile = function (x) { return '<span class="sb-card"><img src="' + ROOT + 'assets/smk/' + x.thumb + '.jpg" alt="" loading="lazy"><b>' + x.title + '</b></span>'; };
    var projs = keys.length;
    $('sb-count').textContent = D.smk.length;
    if ($('nav-smk')) $('nav-smk').textContent = D.smk.length;
    $('sb-sub').textContent = projs + '개 사업 · ' + D.orgs.filter(function (o) { return D.smk.some(function (x) { return D.byId[x.p].org.indexOf(o.id) > -1; }); }).length + '개 기관';
    $('sb-track').innerHTML = pick.map(tile).join('') + pick.map(tile).join('');
  }

  hero(); stats(); smkBand(); render();
  if (q.get('type') || q.get('org') || q.get('year')) $('archive').scrollIntoView();
  window.HUB_RERENDER = render;
})();
