const select = document.querySelector('#diagram-select');
const status = document.querySelector('#status');
const container = document.querySelector('#diagram');
const viewport = document.querySelector('#viewport');
const source = document.querySelector('#source');
const buttons = [...document.querySelectorAll('button')];
let mermaid;
let diagrams;
let svg;
let dimensions;
let scale = 1;
let sequence = 0;

function zoom(value) {
  scale = Math.min(3, Math.max(0.05, value));
  svg.style.width = `${dimensions.width * scale}px`;
  svg.style.height = `${dimensions.height * scale}px`;
  document.querySelector('#zoom-level').textContent = `${Math.round(scale * 100)}%`;
}
function fit() { zoom(Math.min(1, (viewport.clientWidth - 40) / dimensions.width)); }

async function render() {
  const current = ++sequence;
  buttons.forEach(button => { button.disabled = true; });
  source.hidden = true;
  status.textContent = '다이어그램을 렌더링하는 중입니다…';
  container.replaceChildren();
  document.querySelector('#code').textContent = '';
  try {
    const selected = diagrams.find(item => item.path === select.value);
    const response = await fetch(`./${selected.path}`);
    if (!response.ok) throw new Error(`원본을 불러올 수 없습니다 (${response.status}).`);
    const code = await response.text();
    if (current !== sequence) return;
    const result = await mermaid.render(`erd-${current}`, code);
    if (current !== sequence) return;
    container.innerHTML = result.svg;
    result.bindFunctions?.(container);
    svg = container.querySelector('svg');
    dimensions = svg.viewBox.baseVal;
    fit();
    viewport.scrollTo(0, 0);
    document.querySelector('#code').textContent = code;
    source.href = `./${selected.path}`;
    source.hidden = false;
    buttons.forEach(button => { button.disabled = false; });
    status.textContent = `${selected.title} · 확대하거나 스크롤하여 테이블을 확인하세요.`;
  } catch (error) {
    if (current === sequence) {
      container.replaceChildren();
      status.textContent = `렌더링 실패: ${error.message}`;
    }
  }
}

select.addEventListener('change', () => {
  location.hash = encodeURIComponent(select.value);
});
window.addEventListener('hashchange', () => {
  select.value = diagrams.some(item => item.path === decodeURIComponent(location.hash.slice(1)))
    ? decodeURIComponent(location.hash.slice(1)) : diagrams[0].path;
  void render();
});
document.querySelector('#zoom-in').addEventListener('click', () => zoom(scale * 1.25));
document.querySelector('#zoom-out').addEventListener('click', () => zoom(scale / 1.25));
document.querySelector('#fit').addEventListener('click', fit);

try {
  ({ default: mermaid } = await import('https://cdn.jsdelivr.net/npm/mermaid@12.0.0/dist/mermaid.esm.min.mjs'));
  mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: 'default',
    fontFamily: '"Noto Sans KR", "Malgun Gothic", sans-serif', maxTextSize: 200000,
    er: { useMaxWidth: false } });
  const response = await fetch('./diagrams.json');
  if (!response.ok) throw new Error(`목록을 불러올 수 없습니다 (${response.status}).`);
  diagrams = await response.json();
  for (const item of diagrams) select.add(new Option(item.title, item.path));
  const requested = decodeURIComponent(location.hash.slice(1));
  select.value = diagrams.some(item => item.path === requested) ? requested : diagrams[0].path;
  select.disabled = false;
  await render();
} catch (error) {
  status.textContent = `페이지를 준비할 수 없습니다: ${error.message}. 새로고침해주세요.`;
}
