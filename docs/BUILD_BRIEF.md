# 빌드 브리프 — 정적 수업 안내 사이트

## 목표
`docs/CONTENT.md`의 원고를 자구 그대로 사용해, 고등학생 대상 수업 안내 단일 페이지 정적 사이트를 만든다. PPT 대용으로 교실 대형 화면에 띄워 강의하고, 학생이 상시 참고하며, 처음 보는 사람도 전체를 이해할 수 있어야 한다.

## 파일 구조 (이미 있는 자산은 삭제·이동 금지)
- `index.html` (신규)
- `styles.css` (신규)
- `script.js` (신규)
- `img/hero-bg.png`, `img/char-boy.png`, `img/char-girl.png` (있음)
- `files/학습지_*.pdf` 4개 (있음)

## 기술 제약
- 순수 HTML/CSS/JS. 외부 JS 라이브러리 금지. 빌드 도구 금지 (Vercel 정적 배포).
- 폰트: Pretendard CDN — `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css` + fallback 'Malgun Gothic', sans-serif.
- `lang="ko"`, 시맨틱 태그(header/nav/main/section/footer), 이미지 alt, 제목 위계.
- 외부 링크는 `target="_blank" rel="noopener"`.
- 반응형: 모바일(≤640px)·태블릿·데스크톱. 교실 대형 화면(1920px)에서 글자가 큼직하게 보여야 함.

## 디자인
- 컬러 토큰: RED `#E85B4C`, RED 연한 배경 `#FDEEEC`, GREEN `#3D8E7A`, GREEN 연한 배경 `#E9F5F1`, 잉크 `#26292E`, 보조 `#6B7280`, 배경 `#F7F8FA`, 파랑 액센트 `#3E6DB5`.
- 분위기: 밝고 귀엽고 깨끗한 학교 프로젝트 사이트. 라운드 큰 카드(16~24px), 부드러운 그림자, 충분한 여백.
- 히어로: `img/hero-bg.png`를 배경(하늘이 왼쪽에 넓음 — 텍스트는 왼쪽), 남녀 캐릭터 PNG를 오른쪽 하단에 나란히 배치(모바일에서는 축소). 제목의 RED는 RED 색, GREEN은 GREEN 색으로 강조.
- 상단 고정(nav): 사이트명 축약 "RED RED GREEN GREEN" + 앵커 링크(CONTENT.md의 내비게이션). 스크롤 시 배경 흰색+그림자. 모바일은 햄버거.
- 증거 흐름 다이어그램: 5개의 스텝 칩을 화살표로 연결(가로, 모바일 세로). RED 단계는 RED 톤, GREEN 단계는 GREEN 톤.
- 도구 카드: 2열 그리드(모바일 1열). 카드마다 번호 필 배지.
- 의뢰문: 문서(편지)처럼 보이는 흰 카드, 왼쪽 GREEN 굵은 보더, 하단 고지 줄은 옅은 주황 배경.
- 섹션 진입 시 부드러운 fade-up (IntersectionObserver, prefers-reduced-motion 존중).
- 스크롤 스파이로 nav 현재 섹션 표시.

## 문구 규칙 (중요)
- CONTENT.md의 문구를 바꾸지 말 것. 특히 "자구 그대로"라고 표시된 목록(면접 문항 4, 분석 기준 4, GREEN 세 질문, 문장 시작 표현)은 한 글자도 수정 금지.
- 새 문구를 창작하지 말 것. 버튼·라벨도 CONTENT.md에 있는 것만 사용.
- 이모지는 CONTENT.md에 있는 것(✍ 💻 🌐)만.

## 완료 기준
- index.html을 브라우저로 열면 모든 섹션이 CONTENT.md 순서대로 렌더링된다.
- 모든 링크 동작(GAS 새 탭, PDF 다운로드, 사전 링크, 앵커 스크롤).
- 콘솔 에러 0. 모바일 375px에서 가로 스크롤 없음.
