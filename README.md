# darae-daejeon.github.io

다래 허브 — https://darae-daejeon.github.io

| 주소 | 내용 |
|---|---|
| `/` | 행사·뉴스레터·수요조사 아카이브 (메인) |
| `/smk/` | 기술소개자료(SMK) 목록 |
| `/stats/` | 실적 집계 (내부용, 메인에 링크 없음) |

## 고치는 법
- 내용은 `data.js`(실적 대장) 하나만 고치면 세 페이지가 같이 바뀜
- 새 사업: `projects`에 한 줄, 기술소개서가 있으면 `smk`에 기술마다 한 줄
- `index.html`·`smk/`·`stats/`의 `?v=날짜` 숫자를 고칠 때마다 바꾸면 방문자 브라우저가 옛 파일을 안 씀
- 썸네일: 카드용은 `assets/thumbs/`(4:5), SMK용은 `assets/smk/`(4:3)

## 저장소 주소 규칙
`darae-daejeon.github.io/기관/연도-사업명/` — 저장소 = 기관(etri, kribb, kist, dicia), 폴더 = 사업
