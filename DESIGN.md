---
name: 모르고 막 쓰면 RED RED, 뜻 알고 바꾸면 GREEN GREEN
description: 고1 공통국어2 3차시 수업의 공개 포트폴리오. 한 장의 교정쇄로 조판했다.
colors:
  paper: "#ffffff"
  desk: "#e6e8e9"
  ink: "#161616"
  ink-2: "#3b3b3b"
  pencil: "#58626b"
  rule: "#dadcdd"
  rule-2: "#eeefef"
  red-pen: "#d42a1f"
  red-ink: "#b1221a"
  red-wash: "#fbe9e7"
  green-pen: "#14774a"
  green-wash: "#e5f2ea"
typography:
  display-hero:
    fontFamily: "Pretendard, Malgun Gothic, Apple SD Gothic Neo, sans-serif"
    fontSize: "clamp(3rem, 8.2vw, 6rem)"
    fontWeight: 900
    lineHeight: 1.04
    letterSpacing: "-0.04em"
  display:
    fontFamily: "Pretendard, Malgun Gothic, Apple SD Gothic Neo, sans-serif"
    fontSize: "clamp(1.9rem, 3.7vw, 3.05rem)"
    fontWeight: 900
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  headline-lesson:
    fontFamily: "Pretendard, Malgun Gothic, Apple SD Gothic Neo, sans-serif"
    fontSize: "clamp(1.5rem, 2.7vw, 2.1rem)"
    fontWeight: 900
    lineHeight: 1.28
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Pretendard, Malgun Gothic, Apple SD Gothic Neo, sans-serif"
    fontSize: "1.3rem"
    fontWeight: 800
    lineHeight: 1.35
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Pretendard, Malgun Gothic, Apple SD Gothic Neo, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Pretendard, Malgun Gothic, Apple SD Gothic Neo, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.6
  proof-line:
    fontFamily: "Nanum Myeongjo, Batang, AppleMyungjo, serif"
    fontSize: "clamp(2.4rem, 5vw, 3.6rem)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  student-word:
    fontFamily: "Nanum Myeongjo, Batang, AppleMyungjo, serif"
    fontSize: "clamp(1.7rem, 3.2vw, 2.4rem)"
    fontWeight: 800
    lineHeight: 1.2
  student-sentence:
    fontFamily: "Nanum Myeongjo, Batang, AppleMyungjo, serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.75
  pen-memo:
    fontFamily: "Nanum Pen Script, Nanum Myeongjo, cursive"
    fontSize: "1.35rem"
    fontWeight: 400
    lineHeight: 1.25
  margin-note:
    fontFamily: "Pretendard, Malgun Gothic, Apple SD Gothic Neo, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  none: "0"
  focus: "2px"
spacing:
  text-column: "40rem"
  margin-column: "19rem"
  rail-column: "9.5rem"
  gap: "clamp(1.5rem, 3vw, 3.25rem)"
  sheet-pad: "clamp(1rem, 4vw, 4.5rem)"
  chapter: "clamp(4.5rem, 9vw, 8rem)"
  sheet-max: "88rem"
components:
  slug-nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "0.35rem 0.75rem"
  slug-nav-go:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "0.35rem 0.75rem"
  margin-note:
    textColor: "{colors.pencil}"
    typography: "{typography.margin-note}"
  margin-note-pen:
    textColor: "{colors.pencil}"
    typography: "{typography.pen-memo}"
  gallery-entry:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1.25rem 0 1.4rem"
  gallery-search:
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.45rem 0"
---

# Design System: 모르고 막 쓰면 RED RED, 뜻 알고 바꾸면 GREEN GREEN

> 이 문서는 2026-09-29 배포 직전 빌드(`proof.css`·`proof.js`·`index.html`·`gallery.html`·`brand.html`·`img/brand/`)에서 뽑았다. 값의 근거는 계획이 아니라 코드다. 토큰 원본은 `proof.css`의 `:root`이며, 이 문서의 frontmatter와 어긋나면 코드가 이긴다.
>
> **쪽은 생성물이다.** 루트의 `index.html`·`gallery.html`·`brand.html`은 `docs/src/*.src.html`을 `docs/src/build_pages.py`가 펼친 결과다(매크로 `{{fix:원래 말|바꾼 말}}`·`{{wordmark}}`·`{{circle}}`·`{{arrow}}`·`{{check}}`·`{{plus}}`·`{{cards76}}`·`{{include:…}}`). 루트 HTML을 손으로 고치지 않는다 — 원본을 고치고 빌더를 다시 돌린다. 로고 SVG는 `docs/src/build_brand.py`, PNG는 `docs/src/shoot.py png`가 만든다.

## Overview

**Creative North Star: "교정쇄 한 장"**

모든 화면은 출판 교정지 한 장이다. 새하얀 용지에 먹색으로 조판한 본문이 있고, 학생이 쓰던 말에 빨간 펜으로 줄을 긋고 그 위에 초록 펜으로 바꾼 말을 적는다. 넓은 오른쪽 교정 여백에는 반드시 그 교정의 근거 — 누가 무슨 말을 했는지(면담 응답), 수치의 출처, 심사 기준 — 가 연필색 메모로 붙고, 지시선이 메모에서 교정 부호까지 이어진다. 교정의 근거가 규칙이 아니라 사람의 말이라는 것이 이 체계의 핵심이다.

밀도는 인쇄물 수준으로 높고, 장식은 없다. 구분은 칠한 면이 아니라 괘선(1px 연한 괘선, 2px 먹 괘선)으로 한다. 용지는 책상색 바탕 위에 놓이며 재단선 표시와 쪽 번호가 교정지라는 사실을 확인해 준다. 움직임은 펜으로 한 번 긋는 순간 하나뿐이다.

거부하는 것은 교육 사례 사이트의 둥근 카드와 파스텔 아이콘, 크림색 종이, 바른말 캠페인 포스터처럼 읽히는 모든 것이다.

**Key Characteristics:**
- 흰 용지(#ffffff) + 먹 조판, 색은 빨간 펜·초록 펜 두 자루
- 상태는 색이 아니라 부호 모양이 가른다(줄 긋기·빗금 대 삽입표·실선)
- 글꼴 셋, 할 일도 셋: 고딕 활자 · 명조 본문 · 손글씨 펜
- 쪽 격자 = 차례 레일 | 본문 약 40rem | 교정 여백 19rem
- 모서리 0, 칠한 상자 없음, 괘선으로만 나눈다
- 움직임 하나: 펜 긋기 0.55초 + 지시선 0.7초, 한 번만

## Colors

흰 용지에 먹, 연필 회색, 그리고 뜻을 지는 펜 두 자루.

### Primary
- **빨간 펜** (`red-pen`): 삭제 부호(가로줄과 끝 고리), 조사한 말, 낮아진 값(빗금 막대), 짚어 두는 문단의 위 괘선, 「현재 위치」 동그라미, 포커스 링. 흰 바탕 대비 5.0.
- **빨간 글자** (`red-ink`): 예비 토큰. 연한 빨강 바탕 위에 글자를 얹을 때를 위해 정의돼 있으나(대비 5.6) 현재 빌드에서 쓰는 곳이 없다.

### Secondary
- **초록 펜** (`green-pen`): 삽입표(∨)와 그 위에 적은 바꾼 말, 올라간 값(실선 막대), 「바꾼 뒤」 상자의 굵은 테두리. 흰 바탕 대비 5.6.

### Neutral
- **용지** (`paper`): 모든 쪽의 바탕. 순백. 크림색·누런색으로 바꾸지 않는다.
- **책상** (`desk`): 용지 바깥. 넓은 화면에서 용지 둘레로 보인다.
- **먹** (`ink`): 조판 글자, 2px 굵은 괘선, 채운 버튼, 기본 막대.
- **먹 2** (`ink-2`): 부제·리드·보조 본문.
- **연필** (`pencil`): 여백 메모, 출처, 쪽 번호, 비활성 차례 항목. 흰 바탕 대비 6.0.
- **괘선** (`rule`, `rule-2`): 1px 구분 괘선, 막대의 빈 트랙.
- **연한 빨강·연한 초록** (`red-wash`, `green-wash`): 예비 토큰. 정의돼 있으나 현재 빌드에서 쓰는 곳이 없다(짚어 두는 문단도 칠하지 않은 위 괘선이다). 빗금 막대의 연한 칸(#f3b7b2)만 같은 계열의 직접 값이다.

### Named Rules
**The Two Pens Rule.** 빨강은 「모르고 쓴 말」과 교정자의 표시(줄 긋기·현재 위치 동그라미와 차례 밑줄·키보드 포커스 링·검색 칸 포커스 밑줄), 초록은 「뜻을 알고 바꾼 말」에만 쓴다. 넓은 면을 빨강·초록으로 칠하지 않고, 마우스 올림·텍스트 선택에도 빨강·초록을 쓰지 않는다.

**The Ink Hover Rule.** 마우스 올림과 선택은 먹으로만 반응한다. 링크는 밑줄이 1px에서 2px로 굵어지고, 접는 세부 제목·내려받기 목록·갤러리 항목·갤러리 줄의 말은 밑줄이 생긴다. 먹으로 채운 주 행동(`.slug nav a.go`, `.galrow .all`)은 뒤집혀 흰 바탕 + 먹 글자가 되고, 갤러리 줄의 「전체 보기」는 안쪽 2px 먹 테두리를 얻는다. 테두리만 있는 슬러그 링크는 먹으로 채워진다. 텍스트 선택(`::selection`)은 먹 바탕에 흰 글자.

**The Shape Carries Meaning Rule.** 빨강과 초록은 적록 색각에서 가장 헷갈리는 짝이므로 뜻은 늘 모양이 함께 진다. 빨강 = 줄 긋기·135도 빗금, 초록 = 삽입표·위에 적은 손글씨·실선 채움, 처음 값 = 세로 점선. 흑백으로 인쇄해도 읽혀야 한다. 새 도표·범례를 만들 때 이 세 무늬 가운데 하나를 반드시 붙인다.

**The White Paper Rule.** 용지는 #ffffff다. 따뜻한 오프화이트·크림으로 「종이 느낌」을 내지 않는다. 종이임은 재단선·슬러그·쪽 번호가 말한다.

## Typography

**Display Font:** Pretendard (Malgun Gothic, Apple SD Gothic Neo 폴백) — `fonts/`에 woff2 6종 내장
**Body Font:** Pretendard(조판 정보) / 나눔명조(학생 문장) — 나눔명조는 Google Fonts CDN
**Pen Font:** 나눔펜(Nanum Pen Script) — Google Fonts CDN

**Character:** 교정지의 인쇄 활자(고딕 Black), 교정할 원고(명조), 교정자의 손(펜). 셋은 서로 대신하지 않는다.

### Hierarchy
- **Display hero** (900, clamp(3rem, 8.2vw, 6rem), 1.04, -0.04em): 쪽마다 하나인 첫 쪽 제목.
- **Display** (900, clamp(1.9rem, 3.7vw, 3.05rem), 1.2, -0.03em): 장 제목.
- **Headline lesson** (900, clamp(1.5rem, 2.7vw, 2.1rem), 1.28): 차시 제목. 차시 이름은 제목의 첫 말로 같은 크기·굵기에 연필색만 입힌다.
- **Title** (800, 1.3rem, 1.35): 장 안의 소제목(h3).
- **Body** (400, 1.0625rem, 1.75): 본문. 본문 칸 40rem ≈ 한 줄 68자. `word-break: keep-all`.
- **Label** (600~800, 0.8125rem): 쪽 번호·출처·도표 축·범례·학급 표기.
- **Proof line / Student word** (명조 800, clamp(2.4rem,5vw,3.6rem) / clamp(1.7rem,3.2vw,2.4rem)): 교정 대상이 되는 학생의 말, 조사한 말, 사례 줄.
- **Student sentence** (명조 400, 1.1875rem, 1.75): 학생 성찰 인용, 차시 설명(1.125rem/1.85), 면담 문항.
- **Pen memo** (나눔펜 400, 1.35rem, 1.25): 바꾼 말(부모 글자의 1.18em)과 짧은 여백 메모.

### Named Rules
**The Three Jobs Rule.** Pretendard는 제목과 조판 정보, 나눔명조는 학생이 쓴 문장과 조사한 말, 나눔펜은 바꾼 말과 짧은 메모에만. 학생 문장을 고딕으로, 제목을 명조로 바꾸지 않는다.

**The Pen Is Short Rule.** 손글씨는 한 화면에 몇 줄을 넘기지 않는다. 문단을 펜 글씨로 조판하지 않는다.

**The Replacement Is Largest Rule.** 조사한 거친 말을 제목만큼 크게 세우지 않는다. 교정 한 곳에서 가장 눈에 띄는 것은 초록 바꾼 말이다. 거친 말은 초성만 보고 알아볼 수 있으면 초성으로 적는다.

## Layout

한 쪽 = 교정 용지 한 장(`.sheet`, 최대 88rem, 가운데). 용지 안의 격자(`.page`)는 세 칸이다: **차례 레일 9.5rem | 본문 minmax(0, 40rem) | 교정 여백 19rem**, 칸 사이 `clamp(1.5rem, 3vw, 3.25rem)`, 용지 안쪽 여백 `clamp(1rem, 4vw, 4.5rem)`. 본문은 2열(`.col`), 여백 메모는 3열(`.mar`), 도표·목록처럼 넓게 쓰는 것은 2~3열(`.wide`). 차례 레일은 고정(fixed) 위치로 떠 있다.

- **1180px 이하**: 레일을 숨기고 격자는 본문 40rem | 여백 minmax(12rem, 16rem) 두 칸. 차례는 슬러그 아래 가로 줄(`.chips`)로 내려오고 현재 장은 빨간 밑줄 2px.
- **820px 이하**: 한 칸. 여백 메모는 본문 아래로 내려오고 지시선과 재단선은 그리지 않는다.
- **1500px 이상**: 책상이 용지 둘레로 40px 보이고 재단선이 용지 바깥 모서리로 나간다.
- 560px 이하에서는 정의 목록·척도 표·타임라인이 한 줄씩 쌓인다.

리듬: 장과 장 사이 `clamp(4.5rem, 9vw, 8rem)`, 장 끝에 쪽 번호 줄(`.folio`). 본문 문단 간격 1rem. 목록·표의 행은 위 괘선 1px로 나누고 묶음의 시작은 2px 먹 괘선으로 연다.

**The Margin Is Grammar Rule.** 출처·심사 기준·면담 응답은 본문 문장 안이 아니라 오른쪽 교정 여백으로 간다. 새 장을 만들면 `.mar` 칸을 먼저 채울 근거가 있는지 확인한다.

## Elevation & Depth

평평하다. 깊이는 한 겹뿐이다: 책상 위에 놓인 용지(`.sheet`)와, 본문에 붙인 학습지 사진(`.sheetimg`)만 부드러운 그림자를 갖는다. 그 밖의 모든 층은 괘선으로 나눈다. 고정 슬러그와 차례 줄은 흰 바탕(96% 불투명)과 아래 괘선 1px로 떠 있다.

### Shadow Vocabulary
- **용지** (`box-shadow: 0 1px 2px rgba(0,0,0,.06), 0 18px 48px -18px rgba(0,0,0,.18)`): 책상 위 교정 용지 한 장.
- **붙인 지면** (`box-shadow: 0 1px 2px rgba(0,0,0,.12), 0 10px 24px -14px rgba(0,0,0,.35)`): 용지 위에 올려 둔 학습지 사진.

**The Paper Only Rule.** 그림자는 종이 실물(용지, 붙인 지면)에만 준다. 카드·버튼·메모에 그림자를 주지 않는다.

## Shapes

모서리는 모두 직각(0)이다. 둥근 것은 포커스 링의 2px뿐이다. 형태 언어는 조판 괘선과 교정 부호다: 1px 연한 괘선, 2px 먹 괘선, 점선(아직 하지 않은 일·견본), 그리고 펜 획 — 둥근 끝(`stroke-linecap: round`)의 빨간 줄(2.4)·초록 삽입표(2.2)·연필 지시선(1.2~1.3). 펜 획은 `vector-effect: non-scaling-stroke`로 크기와 상관없이 같은 굵기다. 재단선은 용지 네 귀퉁이의 18px ㄱ자(`.crop.k-tl`·`k-tr`·`k-bl`·`k-br`, #8c9296).

## Components

### 교정 한 곳 (`.fix`, 매크로 `{{fix:원래 말|바꾼 말}}`)
이 체계의 서명. 원래 말(`del`)은 지우지 않고 빨간 펜 SVG로 가로줄과 끝 고리를 긋는다. 바꾼 말(`ins`)은 그 위(padding-top 1.3em 자리)에 초록 나눔펜으로 적고, 초록 삽입표(∨)가 둘을 잇는다. 순서: 빨간 줄 긋기 → 0.4초 뒤 삽입표 → 0.45초 뒤 바꾼 말이 나타남. 바꾼 말이 긴 명제(`.thesis .fix`)에서는 위에 띄우지 않고 줄 그은 말 바로 뒤에 이어 적는다.

### 여백 메모와 지시선 (`.mnote`, `data-anchor`)
연필색 0.875rem 고딕 메모. `.mnote.pen`은 나눔펜 1.35rem. 펜 메모는 가리키는 부호의 색을 따른다: 삭제 부호를 가리키면 `.r`(빨강), 바꾼 말을 가리키면 `.g`(초록), 그 밖에는 연필. `data-anchor="요소 id"`를 주면 `proof.js`가 메모 왼쪽에서 교정 부호의 줄 그은 말 끝까지 곡선 지시선과 화살촉을 실제로 긋는다(820px 초과에서만, 창 크기·폰트 로딩 뒤 다시 계산). 심사 기준 메모(`.judge`)와 출처(`.src`)도 여백에 둔다.

### 짚어 두는 문단 (`.flag`)
바탕을 칠하지 않는다. 위 괘선 2px과 굵은 첫 말만. 빨강 괘선 = 못 된 것·내려간 것, `.flag.plain`은 먹 괘선.

### 슬러그와 쪽 번호 (`.slug`, `.tally`, `.folio`)
- **슬러그**: 용지 맨 위 고정 줄. 워드마크(2.35rem 높이) · 인쇄 정보(연필 0.8125rem, 860px 이하 숨김) · 오른쪽 바로 가기. 바로 가기 링크는 먹 1px 테두리의 직각 상자로 마우스를 올리면 먹으로 채워지고, 주 행동(`.go`)은 먹으로 채워져 있다가 마우스를 올리면 흰 바탕 + 먹 글자로 뒤집힌다.
- **첫 쪽 셈 줄**(`.tally`): 먹 1px 위 괘선 아래 「76장 → 24편 → 24장」처럼 굵은 수 + 연필 화살표. 표 숫자는 `tabular-nums`.
- **쪽 번호**(`.folio`): 장 끝에만 둔다. 1px 괘선 아래 좌우로 벌린 0.8125rem 연필 줄(위 여백 clamp(3.5rem, 7vw, 5.5rem)).

### 차례와 현재 위치
레일의 차례는 연필 600, 지금 읽는 장(`aria-current`)은 먹 800에 빨간 펜 동그라미(`{{circle}}`)가 왼쪽에서 오른쪽으로 그어진다(0.5초). 갤러리 반 필터(`.gal-filters button[aria-pressed]`)도 같은 동그라미를 쓴다. 동그라미는 「현재 위치」 하나에만 친다.

### 도표 (`.bars`, `.cards76`, `.legend`)
막대는 괘선 트랙(`rule-2`) 위에 채움. 기본 = 먹 실선, 올라간 값(`.up`) = 초록 실선, 낮은 값(`.low`) = 빨강 135도 빗금, 처음 값(`.first`) = 회색 세로 점선. 76장 카드 격자는 19열, 반응 없는 카드(`.no`)는 빨강 빗금. 범례는 막대와 같은 무늬 견본을 쓴다. 막대는 화면에 들어오면 0.8초 동안 값만큼 찬다.

### 차시 (`.lesson`)
2px 먹 위 괘선으로 여는 한 차시. 연필색 차시 이름 + 먹 제목, 명조로 적은 실제로 한 일(`.did`), 먹 테두리 시간 띠(`.tl`, 도입 칸은 먹 채움), 접는 세부(`details`, 열면 + 가 45도 돈다). 여백에는 학습지 사진과 내려받기.

### 사례 (`.case`)
학급·조(0.875rem 800) 머리줄, 명조 800 사례 줄(교정 한 곳 포함), 8.5rem 정의 칸의 `dl`. 학생 말 인용은 명조와 낫표 「」. 약한 점(`dt.weak`)은 빨강 글자.

### 갤러리 목록 (`.entry`)
테두리·바탕 없는 목록 항목, 아래 괘선 1px, minmax(19rem, 1fr) 자동 격자. 학급(연필 800) · 조사한 말(명조 800 큰 글자) · 한 줄 요약 · 「포스터 읽기」. 마우스를 올리면 조사한 말과 「포스터 읽기」에 1px 밑줄이 생긴다(색은 먹 그대로). 견본 항목은 점선 네모 표시. 검색 칸은 밑줄 1px만, 포커스 시 빨강 2px 밑줄.

### 규칙·절차 목록 (`.rules`, `.howto`)
번호를 연필색 펜 글씨(나눔펜 1.5rem)로 적는 목록. 지킬 규칙(`.rules`)과 따라 할 절차(`.howto`) 모두 번호는 연필이다 — 번호는 삭제도 대체도 아니므로 빨강·초록을 쓰지 않는다. 행마다 위 괘선. 학생 생각 갈래 표지(`.kinds`)의 펜 글자도 연필이다.

### 계획 표시 (`.plan`)
먹 1px 점선 상자의 작은 굵은 글자. 아직 하지 않은 일에만 붙여 실시한 사실과 구분한다.

### 워드마크와 부호
`img/brand/wordmark.svg`(「RED RED」에 삭제 부호, 삽입표 위 「GREEN GREEN」, 모두 윤곽선), 전체 이름판·흰색판, `mark.svg`(글자 없이 두 부호, 파비콘). 둘레에 「RED」 글자 높이만큼 비우고, 화면 32px·인쇄 12mm보다 작으면 부호를 쓴다. 손으로 고치지 않고 `build_brand.py`로 다시 만든다.

### 움직임 문법
저작한 순간은 하나다: 교정 부호가 화면에 들어오면(`IntersectionObserver`, 아래 12% 여백) 펜으로 **한 번** 긋는다 — 빨간 줄 clip-path 드러내기 0.55초 → 초록 삽입표와 바꾼 말 → 여백 지시선 stroke-dashoffset 0.7초(0.5초 지연). 곡선은 `cubic-bezier(.16, 1, .3, 1)` 하나. 선 그리기는 점선 길이 계산이 아니라 clip-path로 해서 어느 크기에서나 같다. 딸린 움직임은 현재 장 동그라미, 막대 차오름(0.8초), 조용한 등장(`.rise`, 12px·0.6초)뿐. **줄인 움직임 설정이면 처음부터 그어진 상태**이고, JS가 없거나 인쇄할 때도 모두 그어져 보인다.

## Do's and Don'ts

### Do:
- **Do** 쪽을 고칠 때 `docs/src/*.src.html`을 고치고 `docs/src/build_pages.py`를 다시 돌린다. 루트 HTML은 생성물이다.
- **Do** 빨간 줄 옆에는 면담 응답이나 출처를 여백 메모로 붙이고, `data-anchor`로 지시선을 잇는다.
- **Do** 빨강·초록의 뜻에 늘 모양을 함께 준다: 줄 긋기·빗금 / 삽입표·실선.
- **Do** 학생 문장과 조사한 말은 나눔명조, 바꾼 말은 나눔펜 초록으로 적는다.
- **Do** 묶음은 2px 먹 괘선으로 열고 행은 1px 괘선으로 나눈다.
- **Do** 마우스 올림은 먹으로만 반응하게 한다: 밑줄이 생기거나 굵어지고, 채운 버튼은 흰 바탕 + 먹으로 뒤집힌다.
- **Do** 모든 수치에 출처를 달고, 아직 하지 않은 일은 점선 상자(`.plan`)로 표시한다.
- **Do** 학생은 학년·반·조까지만 적는다. 거친 말은 초성만 보고 알아보면 초성으로 적는다.

### Don't:
- **Don't** 바른말 구호·표어·캠페인 포스터처럼 보이게 만든다.
- **Don't** 순화어 목록이나 맞춤법 교정처럼 보이게 만든다.
- **Don't** 조사한 거친 말을 제목만큼 크게 세운다 — 가장 크게 쓰는 것은 바꾼 말이다.
- **Don't** 빨강·초록을 배경색·장식으로 칠하거나 색만으로 뜻을 가른다.
- **Don't** 크림색 종이, 이모지, 둥근 카드와 파스텔 아이콘을 쓴다.
- **Don't** 카드·버튼·메모에 그림자나 둥근 모서리를 준다.
- **Don't** 마우스 올림·선택·목록 번호에 빨강이나 초록을 쓴다.
- **Don't** 펜 긋기 말고 다른 움직임을 저작하거나, 같은 부호를 두 번 긋는다.
