"""교정쇄 페이지 빌더 (2026-09-29)

docs/src/*.src.html 의 자리표시를 펼쳐 루트에 HTML을 쓴다.
  {{fix:원래 말|바꾼 말}}  빨간 삭제 부호 + 초록 삽입표와 바꾼 말
  {{wordmark}}            슬러그·끝 쪽 워드마크
  {{lead}} {{arrow}} {{plus}} {{check}} {{circle}} {{cards76}}
손으로 루트 HTML을 고치지 말고 .src.html을 고친 뒤 다시 돌린다.
실행: python docs/src/build_pages.py
"""
import pathlib, re

ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = ROOT / "docs" / "src"

STRIKE = ('<svg class="ink r" data-draw viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">'
          '<path pathLength="1" d="M0 5.6 C22 4.4 52 6.2 86 5.1 C95 4.8 99 8.9 95.5 9.3 C91.5 9.6 92 3.2 100 1.2"/></svg>')
CARET = ('<svg class="caret ink g" data-draw viewBox="0 0 12 8" aria-hidden="true">'
         '<path pathLength="1" d="M1 7.4 L6 1 L11 7.4"/></svg>')

def fix(m):
    old, new = m.group(1), m.group(2)
    return (f'<span class="fix"><del>{old}{STRIKE}</del>{CARET}'
            f'<span class="visually-hidden"> 을 바꾼 말 </span><ins>{new}</ins></span>')

WORDMARK = ('<a class="wordmark" href="index.html"><img src="img/brand/wordmark.svg" width="758" height="292" '
            'alt="모르고 막 쓰면 RED RED, 뜻 알고 바꾸면 GREEN GREEN — 처음으로"></a>')
LEAD = ('<svg class="lead ink r rtl" data-draw viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true">'
        '<path pathLength="1" d="M100 4.2 C70 3.6 40 4.6 3 4 M9 .6 L2.6 4 L9 7.4"/></svg>')
ARROW = ('<svg class="arr ink p" viewBox="0 0 24 12" aria-hidden="true">'
         '<path d="M1 6h21M17 1.5 22 6l-5 4.5"/></svg>')
PLUS = ('<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">'
        '<path d="M7 1v12M1 7h12"/></svg>')
CHECK = ('<svg class="ink g" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8.6 6.2 12.6 14 3.2"/></svg>')
CIRCLE = ('<svg class="ink r" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">'
          '<path pathLength="1" d="M14 30 C3 22 10 6 44 4 C76 2 98 10 96 22 C94 34 60 39 32 37 C14 36 5 28 12 17 C16 11 26 8 34 7"/></svg>')

def cards76():
    # 76장 가운데 51장(67%)이 반응 없음. 순서는 알 수 없으므로 고르게 흩어 그린다.
    cells = []
    placed = 0
    for i in range(76):
        want = round((i + 1) * 51 / 76)
        no = want > placed
        if no:
            placed += 1
        cells.append('<i class="no"></i>' if no else '<i></i>')
    return ('<div class="cards76" role="img" aria-label="RED 카드 76장 가운데 51장에 들은 사람의 반응이 적혀 있지 않다">'
            + "".join(cells) + "</div>")

def build(src: pathlib.Path):
    s = src.read_text(encoding="utf-8")
    s = re.sub(r"\{\{include:([^}]+)\}\}", lambda m: (SRC / m.group(1)).read_text(encoding="utf-8"), s)
    s = re.sub(r"\{\{fix:([^|}]+)\|([^}]+)\}\}", fix, s)
    s = (s.replace("{{wordmark}}", WORDMARK).replace("{{lead}}", LEAD).replace("{{arrow}}", ARROW)
          .replace("{{plus}}", PLUS).replace("{{check}}", CHECK).replace("{{circle}}", CIRCLE)
          .replace("{{cards76}}", cards76()))
    left = re.findall(r"\{\{[^}]*\}\}", s)
    assert not left, f"펼치지 못한 자리표시: {left}"
    out = ROOT / src.name.replace(".src.html", ".html")
    out.write_text(s, encoding="utf-8", newline="\n")
    print("wrote", out.name)

if __name__ == "__main__":
    for f in sorted(SRC.glob("*.src.html")):
        build(f)
