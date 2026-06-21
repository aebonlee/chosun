// 날짜(Day)별 강의안을 자체완결형(self-contained) HTML 문서로 생성·다운로드.
// lectureNotes.js 의 구조화 데이터를 인쇄/배포에 적합한 정적 HTML로 직렬화한다.
// 정적 사이트(GitHub Pages)에서 서버 없이 미리보기·다운로드·PDF 인쇄가 모두 가능하도록 설계.
import { intro, lectureDays } from '../lectureNotes'

const NAVY = '#1E3A5F'
const TERRA = '#C2603D'
const BORDER = '#E2D9C9'

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const ul = (items, accent = NAVY) =>
  !items?.length
    ? ''
    : `<ul class="bullets">${items
        .map((b) => `<li><span class="bx" style="color:${accent}">◆</span>${esc(b)}</li>`)
        .join('')}</ul>`

function sectionHtml(sec) {
  const ps = (sec.paragraphs || []).map((p) => `<p>${esc(p)}</p>`).join('')
  return `<div class="sec"><h3>${esc(sec.heading)}</h3>${ps}${ul(sec.bullets)}</div>`
}

function deepDiveHtml(dd) {
  if (!dd?.length) return ''
  const blocks = dd
    .map((d) => {
      const body = (Array.isArray(d.body) ? d.body : [d.body]).map((p) => `<p>${esc(p)}</p>`).join('')
      const term = d.term ? `<div class="termbox"><b>용어</b> · ${esc(d.term)}</div>` : ''
      return `<div class="dd"><div class="ddh">${esc(d.heading)}</div>${body}${term}</div>`
    })
    .join('')
  return `<div class="block"><h4>개념 심화</h4>${blocks}</div>`
}

function walkthroughHtml(w) {
  if (!w?.steps?.length) return ''
  const steps = w.steps
    .map((s, i) => {
      const input = s.input ? `<div class="lbl navy">입력</div><pre class="dark">${esc(s.input)}</pre>` : ''
      const output = s.output ? `<div class="lbl terra">예상 출력</div><div class="soft">${esc(s.output)}</div>` : ''
      const note = s.note ? `<div class="notebox"><b>강사 노트</b> · ${esc(s.note)}</div>` : ''
      return `<li class="wstep"><div class="wnum">${i + 1}</div><div class="wbody"><div class="wdo">${esc(s.do)}</div>${input}${output}${note}</div></li>`
    })
    .join('')
  return `<div class="block"><h4>${esc(w.title || '라이브 데모 워크스루')}</h4>
    <p class="hint">강사가 화면에서 함께 따라 하는 시연 흐름입니다.</p>
    <ol class="wlist">${steps}</ol></div>`
}

function exampleHtml(ex) {
  if (!ex) return ''
  const scenario = ex.scenario ? `<p class="scenario">${esc(ex.scenario)}</p>` : ''
  return `<div class="block"><h4>사례 · 예시</h4>${scenario}
    <div class="lbl navy">입력 (프롬프트)</div><pre class="dark">${esc(ex.input)}</pre>
    <div class="lbl terra">예상 출력</div><div class="soft">${esc(ex.output)}</div></div>`
}

function slidesHtml(slides) {
  if (!slides?.length) return ''
  const rows = slides
    .map(
      (sl, i) => `<div class="slide"><div class="snum">${i + 1}</div><div>
        <div class="stitle">${esc(sl.title)}</div>
        ${ul(sl.points, TERRA)}</div></div>`,
    )
    .join('')
  return `<div class="block"><h4>강의안 · 핵심정리</h4>${rows}</div>`
}

function practiceHtml(p) {
  if (!p) return ''
  const steps = p.steps
    .map((s, i) => `<li><span class="pnum">${i + 1}</span><span>${esc(s)}</span></li>`)
    .join('')
  return `<div class="block"><h4 class="terra">${esc(p.title)}</h4><ol class="steps">${steps}</ol></div>`
}

function objectivesHtml(obj) {
  if (!obj?.length) return ''
  return `<div class="block"><h4>학습 목표</h4>${ul(obj)}</div>`
}

function recapHtml(recap) {
  if (!recap?.length) return ''
  return `<div class="block"><h4>이 교시 요약</h4><div class="recap">${ul(recap, TERRA)}</div></div>`
}

function outputTipsHtml(item) {
  const out = item.output
    ? `<div class="card out"><div class="lbl navy">◆ 산출물</div><div class="cardv">${esc(item.output)}</div></div>`
    : ''
  const tips = item.tips?.length
    ? `<div class="card tip"><div class="lbl terra">TIP</div>${ul(item.tips, TERRA)}</div>`
    : ''
  return out || tips ? `<div class="cards">${out}${tips}</div>` : ''
}

function promptHtml(prompt) {
  if (!prompt) return ''
  return `<div class="block"><h4>실습 랩 · 복사용 프롬프트</h4>
    <p class="hint">아래 프롬프트를 복사해 [대괄호] 항목을 본인 자료로 바꿔 바로 사용하세요.</p>
    <pre class="dark">${esc(prompt)}</pre></div>`
}

function techNoteHtml(note) {
  if (!note?.length) return ''
  return `<div class="block"><h4>기술 노트</h4><div class="technote">${ul(note, NAVY)}</div></div>`
}

function checklistHtml(list) {
  if (!list?.length) return ''
  const rows = list.map((c) => `<li><span class="ck">✓</span>${esc(c)}</li>`).join('')
  return `<div class="block"><h4>완료 체크리스트</h4><ul class="checklist">${rows}</ul></div>`
}

function introHtml(it) {
  const secs = (it.sections || []).map(sectionHtml).join('')
  return `<section class="item intro">
    <div class="kicker">과정 개요</div>
    <h2>${esc(it.title)}</h2>
    <p class="summary">${esc(it.summary)}</p>
    ${secs}
  </section>`
}

function sessionHtml(s, no) {
  return `<section class="item">
    <div class="time">${esc(s.time)}</div>
    <h2><span class="no">${no}교시</span> ${esc(s.title)}</h2>
    <p class="summary">${esc(s.summary)}</p>
    ${objectivesHtml(s.objectives)}
    ${(s.sections || []).map(sectionHtml).join('')}
    ${deepDiveHtml(s.deepDive)}
    ${exampleHtml(s.example)}
    ${slidesHtml(s.slides)}
    ${walkthroughHtml(s.walkthrough)}
    ${practiceHtml(s.practice)}
    ${promptHtml(s.promptExample)}
    ${techNoteHtml(s.techNote)}
    ${recapHtml(s.recap)}
    ${checklistHtml(s.checklist)}
    ${outputTipsHtml(s)}
  </section>`
}

const STYLE = `
  *{box-sizing:border-box}
  body{margin:0;background:#F6F2EA;color:#1B1916;
    font-family:'Noto Serif KR',serif;line-height:1.7;
    -webkit-print-color-adjust:exact;print-color-adjust:exact}
  .wrap{max-width:820px;margin:0 auto;padding:48px 40px 80px}
  .cover{border-bottom:3px solid ${NAVY};padding-bottom:28px;margin-bottom:40px}
  .cover .day{font-size:15px;color:${TERRA};font-weight:700;letter-spacing:.04em}
  .cover h1{font-size:34px;line-height:1.25;letter-spacing:-.02em;margin:10px 0 6px}
  .cover .date{font-size:14px;color:#7A7163}
  .cover .meta{margin-top:18px;font-size:13px;color:#8A8170}
  .item{margin-bottom:46px;page-break-inside:avoid}
  .item .time{font-size:14px;color:${TERRA};margin-bottom:6px}
  .item h2{font-size:25px;line-height:1.3;letter-spacing:-.02em;margin:0 0 12px;
    border-bottom:1px solid ${BORDER};padding-bottom:12px}
  .item h2 .no{font-size:13px;color:#fff;background:${NAVY};border-radius:6px;
    padding:3px 9px;margin-right:8px;vertical-align:middle}
  .intro .kicker{font-size:13px;color:${TERRA};font-weight:700;letter-spacing:.05em}
  .summary{font-size:16px;color:#3D372E;margin:0 0 8px}
  .sec{margin-top:22px}
  h3{font-size:18px;margin:0 0 8px;color:#1B1916}
  h4{font-size:16px;margin:26px 0 10px;color:${NAVY}}
  h4.terra,.terra{color:${TERRA}}
  p{font-size:15px;color:#3D372E;margin:8px 0}
  .bullets{list-style:none;padding:0;margin:8px 0}
  .bullets li{display:flex;gap:9px;font-size:14.5px;color:#3D372E;margin:7px 0}
  .bx{flex-shrink:0}
  .block{margin-top:8px}
  .scenario{font-size:14.5px}
  .lbl{font-size:12px;font-weight:700;letter-spacing:.04em;margin:14px 0 7px}
  .lbl.navy{color:${NAVY}}.lbl.terra{color:${TERRA}}
  pre.dark{background:#1B1916;color:#EAE4D8;border-radius:10px;padding:16px 18px;
    font-size:13px;line-height:1.7;white-space:pre-wrap;word-break:break-word;
    font-family:'IBM Plex Sans KR',ui-monospace,monospace;margin:0}
  .soft{background:#F4F6F9;border:1px solid ${BORDER};border-radius:10px;
    padding:14px 16px;font-size:14px;color:#3D372E;white-space:pre-wrap;word-break:break-word}
  .slide{display:flex;gap:14px;background:#fff;border:1px solid ${BORDER};
    border-radius:10px;padding:14px 16px;margin:9px 0;page-break-inside:avoid}
  .snum{flex-shrink:0;width:28px;height:28px;border-radius:7px;background:${NAVY};
    color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px}
  .stitle{font-size:15px;font-weight:600;color:#1B1916}
  .steps{list-style:none;counter-reset:s;padding:0;margin:0}
  .steps li{display:flex;gap:13px;padding:9px 0;border-bottom:1px solid #EDE5D7;
    font-size:15px;color:#3D372E}
  .steps li:last-child{border-bottom:none}
  .pnum{flex-shrink:0;width:25px;height:25px;border-radius:50%;background:${NAVY};
    color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px}
  .hint{font-size:13px;color:#7A7163;margin:0 0 8px}
  .recap{background:#FBF8F1;border:1px solid ${BORDER};border-left:3px solid ${TERRA};
    border-radius:0 10px 10px 0;padding:14px 18px}
  .technote{background:#EEF1F6;border:1px solid ${BORDER};border-left:3px solid ${NAVY};
    border-radius:0 10px 10px 0;padding:14px 18px}
  .checklist{list-style:none;padding:0;margin:0;display:grid;gap:8px}
  .checklist li{display:flex;gap:10px;background:#fff;border:1px solid ${BORDER};
    border-radius:10px;padding:11px 15px;font-size:14.5px;color:#3D372E;page-break-inside:avoid}
  .ck{color:${TERRA};font-weight:700;flex-shrink:0}
  .dd{background:#fff;border:1px solid ${BORDER};border-radius:12px;padding:16px 18px;margin:10px 0;page-break-inside:avoid}
  .ddh{font-size:15px;font-weight:700;color:${NAVY};margin-bottom:6px}
  .termbox{margin-top:10px;background:#F4F6F9;border:1px solid ${BORDER};border-radius:9px;padding:9px 13px;font-size:13px;color:#5A5246}
  .termbox b{color:${TERRA}}
  .wlist{list-style:none;padding:0;margin:0;display:grid;gap:14px}
  .wstep{display:flex;gap:12px;background:#fff;border:1px solid ${BORDER};border-radius:12px;padding:16px 18px;page-break-inside:avoid}
  .wnum{flex-shrink:0;width:26px;height:26px;border-radius:7px;background:${TERRA};color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px}
  .wbody{min-width:0;flex:1}
  .wdo{font-size:15px;font-weight:600;color:#1B1916;margin-bottom:4px}
  .notebox{margin-top:10px;background:#FBF3EC;border:1px solid #F0DDCB;border-radius:9px;padding:9px 13px;font-size:13px;color:#5A4636}
  .notebox b{color:${TERRA}}
  .cards{display:flex;flex-wrap:wrap;gap:16px;margin-top:18px}
  .card{flex:1 1 240px;border-radius:12px;padding:16px 18px}
  .card.out{background:#F4F6F9;border:1px solid ${BORDER}}
  .card.tip{background:#FBF3EC;border:1px solid #F0DDCB}
  .cardv{font-size:15px;font-weight:600;color:#1B1916;margin-top:6px}
  .foot{margin-top:50px;border-top:1px solid ${BORDER};padding-top:20px;
    font-size:12.5px;color:#9A8F7D;text-align:center}
  @page{margin:18mm 14mm}
  @media print{body{background:#fff}.wrap{padding:0;max-width:none}}
`

// 특정 Day(0|1) 의 전체 강의안 HTML 문자열을 생성한다.
export function buildDayHtml(dayIdx) {
  const day = lectureDays[dayIdx]
  if (!day) return ''
  const includeIntro = dayIdx === 0
  const items =
    (includeIntro ? introHtml(intro) : '') +
    day.sessions.map((s, i) => sessionHtml(s, i + 1)).join('')
  const title = `조선대 AI특강 · ${day.day} 강의안 — ${day.title}`
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600;700&family=IBM+Plex+Sans+KR:wght@400;500&display=swap" rel="stylesheet">
<style>${STYLE}</style></head>
<body><div class="wrap">
  <header class="cover">
    <div class="day">${esc(day.day)} · ${esc(day.date)}</div>
    <h1>${esc(day.title)}</h1>
    <div class="meta">조선대학교 전임 교원 교육 · Claude 기반 연구 업무 활용 &amp; AX 브릿지 교과목 설계</div>
    <div class="meta">강사 이애본 (aebon@hs.ac.kr) · 드림아이티비즈(DreamIT Biz) 대표 · 한신대학교 AI.SW대학 겸임교수</div>
  </header>
  ${items}
  <div class="foot">조선대학교 AI특강 강의안 · ${esc(day.day)} (${esc(day.date)}) · 본 자료는 교육 참여자용입니다.</div>
</div></body></html>`
}

// Day 강의안 HTML 파일을 브라우저에서 다운로드한다.
export function downloadDayHtml(dayIdx) {
  const day = lectureDays[dayIdx]
  if (!day) return
  const html = buildDayHtml(dayIdx)
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `조선대AI특강_${day.day.replace(/\s+/g, '')}_강의안.html`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
