---
target: homepage index.html
date: 2026-09-01
total_score: 19
max_score: 40
p0_count: 2
p1_count: 2
na_heuristics: ""
---

# Impeccable critique — 수업 안내 홈 (index.html)

Method: dual-agent (A: designer · B: impeccable detect)

Surface: https://redgreen-web.vercel.app · `C:\project\redgreen-web\index.html`
Mode: Operate + Read (고1 수업 스위치보드). Not Persuade.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 1 | 지금 몇 차시인지 없음. 홈 필에 aria-current 없음 |
| 2 | Match System / Real World | 2 | 차시·학습지는 맞음. FGI·Interview·표 ID는 고1 운영 언어가 아님 |
| 3 | User Control and Freedom | 2 | 메뉴 Escape는 됨. 다른 차시를 숨기는 컨트롤 없음 |
| 4 | Consistency and Standards | 2 | 1R/2B/3G는 일관. meaning-grid가 모형과 뜻 기준에 중복 |
| 5 | Error Prevention | 3 | 실명 금지·KOSIS 더하지 않기 문구는 좋음. 안전이 CTA 뒤에 있음 |
| 6 | Recognition Rather Than Recall | 1 | 오늘 할 일을 기억해야 함. 홈이 차시를 기억하지 않음 |
| 7 | Flexibility and Efficiency | 2 | 필로 점프는 됨. 초심자 경로가 전부 한꺼번에 열림 |
| 8 | Aesthetic and Minimalist Design | 1 | 브랜드는 분명. 페이지는 바인더 통째 |
| 9 | Error Recovery | 2 | 차트 라벨 겹침이 읽기 오류를 만듦 |
| 10 | Help and Documentation | 3 | 가이드 페이지는 맞음. 홈이 매뉴얼과 스위치보드를 섞음 |
| **Total** | | **19/40** | **Poor → Acceptable 경계** |

Cognitive load checklist: **7/8 실패**. 도착 시 선택지 5개 이상.

## Design Specificity Verdict

**LLM:** 이 수업용으로 쓰였다. RED/GREEN 워드마크, 차시 색, 말풍선, 학교 배경. 실패는 취향이 아니라 IA.

**Detector (B):** 로컬 5파일 265건, 라이브 홈 45건. `overused-font` 0. `ai-color-palette`는 브랜드 RED/GREEN이 아니라 다섯 번째 토큰 `--violet #8B5CF6`. `side-tab`은 의뢰문 왼쪽 보더(잠긴 편지 은유) — 형태 탐지는 맞으나  accidental slop로 읽으면 오판. 진짜 품질 이슈는 대비: 흰 글자 on `#F59E0B` **2.1:1**, 활성 내비 hover **1.1:1**.

## Overall Impression

브랜드는 이미 수업이다. 첫 화면이 교과서다. 학생은 오늘 할 일을, 심사위원은 질문하기–탐구하기–쓰기를 30초 안에 못 본다.

## What's Working

1. 말풍선+카드가 교육과정 한 장면.
2. 오류 예방 카피(쓰지 않는 것, 전국 vs 우리, 범위).
3. 차시 색 밴딩. `#tools`는 이미 「지금 차시만」을 알고 있다.

## Priority Issues

### P0 — 첫 화면이 차시 스위치보드가 아님
의뢰문+KOSIS 차트+8항목이 `#flow`보다 앞이다.
- **Fix:** 히어로 아래 1 질문하기 / 2 탐구하기 / 3 쓰기 탭. 각 탭 ≤3 행동(의뢰·학습지·웹앱). 의뢰문은 그 행동 뒤에.
- **Command:** `/impeccable distill` + `/impeccable onboard`

### P0 — 안전이 RED 문 뒤에 있음
히어로 주버튼이 GAS. 안전 약속은 TOC 5.
- **Fix:** 히어로/차시 패널에 한 줄: 실명·학번 쓰지 않기 · 거친 말은 초성.
- **Command:** `/impeccable harden`

### P1 — 선택지 과다 + 학습지 실종
필 5 + TOC 7 + 자료실 12. 학습지 PDF는 자료실 6번.
- **Fix:** 헤더를 오늘/가이드/갤러리/자료로. TOC는 접기. 학습지를 차시 패널에.
- **Command:** `/impeccable distill` + `/impeccable clarify`

### P1 — 대비·차트 읽기
흰 글자 on amber 2.1:1, 활성+hover 1.1:1. 2021/2025 차트 숫자 겹침. 라이브 `line-length` 86–148ch.
- **Fix:** 필은 잉크 글자+연한 바탕. 720px 이하 표 기본. 라벨 오프셋.
- **Command:** `/impeccable audit` + `/impeccable typeset`

### P2 — 3칸 문법이 두 개, 3차시 카드가 소설
meaning-grid가 모형과 뜻 기준에 중복. 3차시 카드가 한눈에 깨짐.
- **Fix:** 질문하기–탐구하기–쓰기 3칸만. 3차시는 5줄+자세히.
- **Command:** `/impeccable layout`

## Persona Red Flags

- **Jordan (첫 수업):** 빨간 버튼 vs 연구소 공문 vs 표 ID. 오늘이 뭔지 모름.
- **Casey (휴대폰):** 햄버거 12개. 차트 가로 스크롤. 3차시 카드가 함정.
- **오늘 1차시 학생:** 필요한 것은 의뢰 오늘 줄·학습지 1·RED·안전 한 줄. 받는 것은 3차시 사이트+전국 통계.
- **심사위원 30초:** KOSIS를 보고 사이버폭력 통계 수업으로 오해할 수 있음. 세 단계는 편지 뒤에 있음.

## Minor

- TOC 「연구소가 보낸 의뢰」 잔향
- h2 「3차시, 이렇게」 → 「세 차시」
- skip link 없음
- viz 가짜 tabpanel
- GAS Index.html 대비 14건 (coral 2.8:1)

## Questions

See chat close.
