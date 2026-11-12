/* =========================================================
   다래 실적 대장
   이 파일 하나만 고치면 허브(/), SMK 목록(/smk/), 실적 집계(/stats/)가 같이 바뀝니다.

   새 사업 추가 순서
   1. projects 에 한 줄 추가 (연도·기관·종류·제목·날짜·주소)
   2. 기술소개서가 있으면 smk 에 기술마다 한 줄씩 추가 (p 에 사업 id)
   3. 뉴스레터처럼 SMK 없이 기술만 소개하면 projects 의 techs 에 건수 입력
   ========================================================= */

window.DARAE = {

  base: 'https://darae-daejeon.github.io/',

  /* 기관: 필터 버튼 순서대로 */
  orgs: [
    { id: 'kist',  name: 'KIST',  full: '한국과학기술연구원' },
    { id: 'etri',  name: 'ETRI',  full: '한국전자통신연구원' },
    { id: 'kribb', name: 'KRIBB', full: '한국생명공학연구원' },
    { id: 'dicia', name: 'DICIA', full: '대전정보문화산업진흥원' },
    { id: 'jbnu',  name: '전북대', full: '전북대학교' }
  ],

  types: { event: '행사', news: '뉴스레터', survey: '수요조사' },

  /* 시리즈: 같은 series 값을 가진 뉴스레터가 2건 이상이면 허브에서 한 칸으로 묶임 */
  series: {
    'etri-tech-series-2026': {
      name: 'ETRI TECH SERIES',
      desc: 'ETRI 유망기술을 다래 기업 DB에 소개하는 기술이전 중개 뉴스레터'
    }
  },

  /* ---------- 사업 목록 ----------
     id     : 겹치지 않는 이름
     year   : 연도 (연도 버튼·집계 기준)
     type   : event / news / survey
     org    : 기관 id (여러 개 가능)
     date   : 행사일·마감일 (YYYY-MM-DD, 없으면 비움)
     url    : darae-daejeon.github.io/ 뒤 주소
     short  : SMK 목록·집계에 쓰는 짧은 이름
     thumb  : assets/thumbs/ 안의 썸네일 이름 (mosaic 은 4장 묶음)
     techs  : 소개 기술 건수 (smk 목록이 있으면 자동 계산이라 비움)
  */
  projects: [
    { id: 'kist-jbnu-partnering-2026', year: 2026, type: 'event', org: ['kist', 'jbnu'],
      title: 'KIST-전북대 탄소복합·이차전지소재 공동기술상담회', kind: '공동기술상담회', short: 'KIST-전북대 상담회',
      date: '2026-12-16', time: '10:00', place: '전북테크비즈센터 2층 다목적실',
      url: 'kist/2026-jbnu-partnering/', mosaic: ['kj1', 'kj2', 'kj3', 'kj4'] },

    { id: 'dicia-ax-survey-2026', year: 2026, type: 'survey', org: ['dicia'],
      title: '대전 물류기업 스마트물류 AX 수요조사', kind: '수요조사', short: 'DICIA 수요조사',
      parent: '지역 물류기업 스마트물류 AX 전략수립 용역',
      date: '2026-12-10', dateLabel: '~ 2026.12.10',
      url: 'dicia/2026-logistics-ax-strategy/survey/', thumb: 'dicia-survey' },

    { id: 'kribb-bioresource-2026', year: 2026, type: 'event', org: ['kribb'],
      title: '한국생명공학연구원 생물자원(균주·특허) 기술설명회', kind: '기술설명회', short: 'KRIBB 생물자원 설명회',
      date: '2026-09-17', time: '13:30', place: '전북테크비즈센터 2층',
      url: 'kribb/2026-bioresource-briefing/', thumb: 'kribb' },

    { id: 'kist-battery-2026', year: 2026, type: 'event', org: ['kist'],
      title: '2026 KIST 유망기술 설명회 — 차세대 전지 기술이전', kind: '기술설명회', short: 'KIST 차세대 전지 설명회',
      date: '2026-06-23', time: '14:00', place: '코엑스 308호',
      url: 'kist/2026-battery-briefing/', thumb: 'kist-connect' },

    { id: 'etri-ts-vol10', year: 2026, type: 'news', org: ['etri'], series: 'etri-tech-series-2026', order: 10,
      issue: 'Vol.10', title: '차세대 보안기술', techs: 8,
      url: 'etri/2026-tech-series/vol10-security/', thumb: 'vol10' },
    { id: 'etri-ts-vol08', year: 2026, type: 'news', org: ['etri'], series: 'etri-tech-series-2026', order: 8,
      issue: 'Vol.8', title: '차세대 AI반도체·컴퓨팅', techs: 10,
      url: 'etri/2026-tech-series/vol08-ai-semiconductor/', thumb: 'vol8' },
    { id: 'etri-ts-vol07', year: 2026, type: 'news', org: ['etri'], series: 'etri-tech-series-2026', order: 7,
      issue: 'Vol.7', title: 'AI·SW 혁신기술', techs: 10,
      url: 'etri/2026-tech-series/vol07-ai-sw/', thumb: 'vol7' },
    { id: 'etri-ts-vol05', year: 2026, type: 'news', org: ['etri'], series: 'etri-tech-series-2026', order: 5,
      issue: 'Vol.5', title: '메타버스 혁신기술', techs: 10,
      url: 'etri/2026-tech-series/vol05-metaverse/', thumb: 'vol5' },
    { id: 'etri-ts-vol04', year: 2026, type: 'news', org: ['etri'], series: 'etri-tech-series-2026', order: 4,
      issue: 'Vol.4', title: '차세대 보안기술', techs: 12,
      url: 'etri/2026-tech-series/vol04-security/', thumb: 'vol4' },
    { id: 'etri-ts-medical', year: 2026, type: 'news', org: ['etri'], series: 'etri-tech-series-2026', order: 0,
      issue: 'Medical AI', title: '의료·헬스케어 AI 기술이전 안내', short: 'ETRI 의료AI',
      url: 'etri/2026-tech-series/medical-ai/', thumb: 'medical' }
  ],

  /* ---------- 기술소개서(SMK) 목록 ----------
     p      : 사업 id
     no     : 사업 안 번호
     inst   : 연구 소속
     url    : darae-daejeon.github.io/ 뒤 주소
     thumb  : assets/smk/ 안의 썸네일 이름
  */
  smk: [
    { p: 'kist-jbnu-partnering-2026', no: 'T01', field: '탄소복합소재', inst: 'KIST 전북분원', title: '빈틈 메운 초강력 CNT 복합섬유', url: 'kist/2026-jbnu-partnering/assets/docs/T01_SMK.jpg', thumb: 'kj-T01' },
    { p: 'kist-jbnu-partnering-2026', no: 'T02', field: '탄소복합소재', inst: 'KIST 전북분원', title: '원료 막힘 없는 CNT 연속합성 장치', url: 'kist/2026-jbnu-partnering/assets/docs/T02_SMK.jpg', thumb: 'kj-T02' },
    { p: 'kist-jbnu-partnering-2026', no: 'T03', field: '탄소복합소재', inst: 'KIST 전북분원', title: '전도도 3.3배 높인 질소 도핑 탄소', url: 'kist/2026-jbnu-partnering/assets/docs/T03_SMK.jpg', thumb: 'kj-T03' },
    { p: 'kist-jbnu-partnering-2026', no: 'T04', field: '탄소복합소재', inst: 'KIST 전북분원', title: '폐아라미드로 만든 고방열 복합체', url: 'kist/2026-jbnu-partnering/assets/docs/T04_SMK.jpg', thumb: 'kj-T04' },
    { p: 'kist-jbnu-partnering-2026', no: 'T05', field: '탄소복합소재', inst: 'KIST 전북분원', title: 'BNNT 불순물 잡는 초간단 정제법', url: 'kist/2026-jbnu-partnering/assets/docs/T05_SMK.jpg', thumb: 'kj-T05' },
    { p: 'kist-jbnu-partnering-2026', no: 'T06', field: '탄소복합소재', inst: 'KIST 전북분원', title: '구리보다 가볍고 전류 큰 섬유 전선', url: 'kist/2026-jbnu-partnering/assets/docs/T06_SMK.jpg', thumb: 'kj-T06' },
    { p: 'kist-jbnu-partnering-2026', no: 'T07', field: '탄소복합소재', inst: 'KIST 전북분원', title: '열처리로 강도 4배 높인 CNT 섬유', url: 'kist/2026-jbnu-partnering/assets/docs/T07_SMK.jpg', thumb: 'kj-T07' },
    { p: 'kist-jbnu-partnering-2026', no: 'T08', field: '탄소복합소재', inst: '전북대학교', title: '제철소 부생가스로 바로 발전하는 SOFC', url: 'kist/2026-jbnu-partnering/assets/docs/T08_SMK.jpg', thumb: 'kj-T08' },
    { p: 'kist-jbnu-partnering-2026', no: 'T09', field: '탄소복합소재', inst: 'KIST 전북분원', title: '붕소·질소 동시도핑 고전도 CNT 섬유', url: 'kist/2026-jbnu-partnering/assets/docs/T09_SMK.jpg', thumb: 'kj-T09' },
    { p: 'kist-jbnu-partnering-2026', no: 'T10', field: '탄소복합소재', inst: 'KIST 전북분원', title: '산화그래핀이 메운 고강도 CNT 섬유', url: 'kist/2026-jbnu-partnering/assets/docs/T10_SMK.jpg', thumb: 'kj-T10' },
    { p: 'kist-jbnu-partnering-2026', no: 'T11', field: '탄소복합소재', inst: '전북대학교', title: '메탄에서 수소 뽑고 담는 Mg 합금', url: 'kist/2026-jbnu-partnering/assets/docs/T11_SMK.jpg', thumb: 'kj-T11' },
    { p: 'kist-jbnu-partnering-2026', no: 'T12', field: '탄소복합소재', inst: '전북대학교', title: '100% PP 초경량 자기강화복합재', url: 'kist/2026-jbnu-partnering/assets/docs/T12_SMK.jpg', thumb: 'kj-T12' },
    { p: 'kist-jbnu-partnering-2026', no: 'T13', field: '탄소복합소재', inst: '전북대학교', title: '곡면까지 감싸는 BNNT 중성자 차폐막', url: 'kist/2026-jbnu-partnering/assets/docs/T13_SMK.jpg', thumb: 'kj-T13' },
    { p: 'kist-jbnu-partnering-2026', no: 'T14', field: '이차전지', inst: '전북대학교', title: '분산제 없이 방사선으로 푸는 CNT', url: 'kist/2026-jbnu-partnering/assets/docs/T14_SMK.jpg', thumb: 'kj-T14' },
    { p: 'kist-jbnu-partnering-2026', no: 'T15', field: '이차전지', inst: '전북대학교', title: '296% 늘어나는 신축성 분리막', url: 'kist/2026-jbnu-partnering/assets/docs/T15_SMK.jpg', thumb: 'kj-T15' },
    { p: 'kist-jbnu-partnering-2026', no: 'T16', field: '이차전지', inst: 'KIST 전북분원', title: '10만 번 충전에도 끄떡없는 섬유 전극', url: 'kist/2026-jbnu-partnering/assets/docs/T16_SMK.jpg', thumb: 'kj-T16' },
    { p: 'kist-jbnu-partnering-2026', no: 'T17', field: '이차전지', inst: '전북대학교', title: '폐배터리 가루로 새 양극재 직행', url: 'kist/2026-jbnu-partnering/assets/docs/T17_SMK.jpg', thumb: 'kj-T17' },
    { p: 'kist-jbnu-partnering-2026', no: 'T18', field: '탄소복합소재', inst: '전북대학교', title: '400℃도 견디는 CNT 편광필름', url: 'kist/2026-jbnu-partnering/assets/docs/T18_SMK.jpg', thumb: 'kj-T18' },
    { p: 'kist-jbnu-partnering-2026', no: 'T19', field: '탄소복합소재', inst: '전북대학교', title: '50배 싼 카본블랙 스마트 광셔터', url: 'kist/2026-jbnu-partnering/assets/docs/T19_SMK.jpg', thumb: 'kj-T19' },
    { p: 'kist-jbnu-partnering-2026', no: 'T20', field: '이차전지', inst: '전북대학교', title: '불길 늦추는 에어로겔 배터리 케이스', url: 'kist/2026-jbnu-partnering/assets/docs/T20_SMK.jpg', thumb: 'kj-T20' },

    { p: 'kribb-bioresource-2026', no: '01', field: '바이오·건강기능', inst: 'KRIBB', who: '이정숙', sub: 'Bifidobacterium pseudolongum KGMB04131', title: '지방간 질환 예방·개선용 비피도박테리움 균주', url: 'kribb/2026-bioresource-briefing/smk/smk2.html', thumb: 'kribb-smk2' },
    { p: 'kribb-bioresource-2026', no: '02', field: '바이오·농업', inst: 'KRIBB', who: '이지영', sub: 'Pseudomonas sp. JBR1', title: '염 스트레스 내성 슈도모나스 균주', url: 'kribb/2026-bioresource-briefing/smk/smk1.html', thumb: 'kribb-smk1' },
    { p: 'kribb-bioresource-2026', no: '03', field: '바이오·건강기능', inst: 'KRIBB', who: '김성훈', sub: 'Lactobacillus plantarum CK401', title: '락토바실러스 유래 다당체 항인플루엔자 조성물', url: 'kribb/2026-bioresource-briefing/smk/smk3.html', thumb: 'kribb-smk3' },
    { p: 'kribb-bioresource-2026', no: '04', field: '바이오·건강기능', inst: 'KRIBB', who: '강지영', sub: 'Companilactobacillus zhachilii L113', title: '프리바이오틱스 LCMP 상호작용 프로바이오틱스 균주', url: 'kribb/2026-bioresource-briefing/smk/smk4.html', thumb: 'kribb-smk4' },

    { p: 'kist-battery-2026', no: '01-1', field: '수소·연료전지', inst: 'KIST 수소·연료전지연구단', who: '유성종', title: '고성능 고내구성 수전해 담지 촉매', url: 'kist/2026-battery-briefing/smk/kist-smk-1.html', thumb: 'kist-smk1' },
    { p: 'kist-battery-2026', no: '01-2', field: '수소·연료전지', inst: 'KIST 수소·연료전지연구단', who: '유성종', title: '초임계 유체를 이용한 귀금속 함량 제어 연료전지·수전해 촉매', url: 'kist/2026-battery-briefing/smk/kist-smk-1.html', thumb: 'kist-smk1', note: '01-1 문서 2쪽' },
    { p: 'kist-battery-2026', no: '02', field: '수소·연료전지', inst: 'KIST 수소·연료전지연구단', who: '이소영', title: '중고온용 Ce-Hydrogen phosphate-PBI 고분자 분리막', url: 'kist/2026-battery-briefing/smk/kist-smk-2.html', thumb: 'kist-smk2' },
    { p: 'kist-battery-2026', no: '03', field: '수소·연료전지', inst: 'KIST 수소·연료전지연구단', who: '김진영', title: '산화방지제 함유 강화복합막 연료전지', url: 'kist/2026-battery-briefing/smk/kist-smk-3.html', thumb: 'kist-smk3' },
    { p: 'kist-battery-2026', no: '04', field: '이차전지', inst: 'KIST 에너지저장연구센터', who: '김세영', title: '이종 원소 도핑 할라이드계 비정질 소듐 슈퍼컨덕터', url: 'kist/2026-battery-briefing/smk/kist-smk-4.html', thumb: 'kist-smk4' },
    { p: 'kist-battery-2026', no: '05', field: '이차전지', inst: 'KIST 지속가능미래기술연구본부', who: '정경윤', title: '고성능 차세대 소듐 이차전지', url: 'kist/2026-battery-briefing/smk/kist-smk-5.html', thumb: 'kist-smk5' },
    { p: 'kist-battery-2026', no: '06', field: '이차전지', inst: 'KIST 에너지저장연구센터', who: '유정근', title: '리튬이차전지용 후막 전극 소재 및 공정기술', url: 'kist/2026-battery-briefing/smk/kist-smk-6.html', thumb: 'kist-smk6' },

    { p: 'etri-ts-medical', no: '01', field: '의료 AI', inst: 'ETRI 의료정보연구실', who: '최재훈 외', title: '미래 건강 예측을 위한 의료지능 딥러닝 엔진 기술', url: 'etri/2026-tech-series/medical-ai/smk/tech-01.html', thumb: 'etri-tech1' },
    { p: 'etri-ts-medical', no: '02', field: '의료 AI', inst: 'ETRI 의료정보연구실', who: '최재훈 외', title: '미래 건강상태·예후 예측 헬스케어 인공지능 기술', url: 'etri/2026-tech-series/medical-ai/smk/tech-02.html', thumb: 'etri-tech2' },
    { p: 'etri-ts-medical', no: '03', field: '의료 AI', inst: 'ETRI 의료정보연구실', who: '최재훈 외', title: '개인 맞춤형 건강관리 프로그램 계획 AI 헬스케어 기술', url: 'etri/2026-tech-series/medical-ai/smk/tech-03.html', thumb: 'etri-tech3' },
    { p: 'etri-ts-medical', no: '04', field: '의료 AI', inst: 'ETRI 의료정보연구실', who: '최재훈', title: '미래 건강상태 맞춤 예측·최적 관리 인공지능 기술', url: 'etri/2026-tech-series/medical-ai/smk/tech-04.html', thumb: 'etri-tech4' }
  ]
};

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
})(window.DARAE);
