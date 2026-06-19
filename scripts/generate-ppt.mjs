// 강의안(lectureNotes.js) → 날짜별 PPT(.pptx) 생성
// 사용: npm i -D pptxgenjs && npm run ppt   (결과: public/ppt/chosun-ai-day1.pptx, day2.pptx)
// pptxgenjs는 상시 의존성이 아니므로 필요할 때만 임시 설치합니다.
import pptxgen from 'pptxgenjs'
import { lectureDays } from '../src/lectureNotes.js'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const FONT = '맑은 고딕'
const NAVY = '1E3A5F', TERRA = 'C2603D', CREAM = 'F6F2EA', INK = '1B1916', MUTE = '7A7163', PAPER = 'FFFFFF', SAND = 'C99A7E', STEEL = 'B6BECB'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'public', 'ppt')
mkdirSync(outDir, { recursive: true })

function buildDeck(day, dayNo) {
  const pptx = new pptxgen()
  pptx.layout = 'LAYOUT_WIDE' // 13.333 x 7.5 (16:9)
  pptx.author = '조선대학교 AI특강'
  pptx.title = `조선대학교 AI특강 Day ${dayNo} — ${day.title}`

  // 표지
  const cover = pptx.addSlide()
  cover.background = { color: CREAM }
  cover.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.38, h: 7.5, fill: { color: NAVY } })
  cover.addText('조선대학교 AI특강', { x: 0.95, y: 2.25, w: 11.5, h: 0.5, fontFace: FONT, fontSize: 18, bold: true, color: TERRA })
  cover.addText(`Day ${dayNo}`, { x: 0.95, y: 2.75, w: 11.5, h: 1.0, fontFace: FONT, fontSize: 54, bold: true, color: NAVY })
  cover.addText(day.title, { x: 0.95, y: 3.85, w: 11.5, h: 0.9, fontFace: FONT, fontSize: 32, bold: true, color: INK })
  cover.addText(`${day.date}  ·  10:00–18:00  ·  7교시 (50분 수업 + 10분 휴식)`, { x: 0.95, y: 4.85, w: 11.5, h: 0.5, fontFace: FONT, fontSize: 16, color: MUTE })

  day.sessions.forEach((ses, idx) => {
    // 교시 구분 슬라이드
    const sec = pptx.addSlide()
    sec.background = { color: NAVY }
    sec.addText(`${idx + 1}교시  ·  ${ses.time}`, { x: 0.95, y: 2.3, w: 11.5, h: 0.5, fontFace: FONT, fontSize: 18, bold: true, color: SAND })
    sec.addText(ses.title, { x: 0.95, y: 2.85, w: 11.5, h: 1.2, fontFace: FONT, fontSize: 36, bold: true, color: 'FFFFFF' })
    if (ses.objectives) {
      sec.addText(ses.objectives.map((o) => ({ text: o, options: { bullet: { code: '2022', indent: 16 }, fontSize: 15, color: STEEL, paraSpaceAfter: 8 } })), { x: 0.95, y: 4.4, w: 11.5, h: 2.2, fontFace: FONT, valign: 'top' })
    }

    // 핵심정리(slides) → 내용 슬라이드
    ;(ses.slides || []).forEach((sl) => {
      const cs = pptx.addSlide()
      cs.background = { color: PAPER }
      cs.addShape(pptx.ShapeType.rect, { x: 0.6, y: 0.55, w: 1.5, h: 0.11, fill: { color: TERRA } })
      cs.addText(`Day ${dayNo} · ${idx + 1}교시 · ${ses.time}`, { x: 0.6, y: 0.72, w: 9, h: 0.4, fontFace: FONT, fontSize: 12, bold: true, color: TERRA })
      cs.addText(sl.title, { x: 0.6, y: 1.08, w: 12.1, h: 1.0, fontFace: FONT, fontSize: 28, bold: true, color: NAVY, valign: 'top' })
      if (sl.points && sl.points.length) {
        cs.addText(sl.points.map((p) => ({ text: p, options: { bullet: { code: '2022', indent: 20 }, fontSize: 19, color: INK, paraSpaceAfter: 14 } })), { x: 0.85, y: 2.3, w: 11.6, h: 4.5, fontFace: FONT, valign: 'top', lineSpacingMultiple: 1.1 })
      }
      cs.addText(`조선대학교 AI특강 · Day ${dayNo} — ${day.title}`, { x: 0.6, y: 7.05, w: 11, h: 0.3, fontFace: FONT, fontSize: 10, color: MUTE })
    })
  })

  return pptx
}

for (let i = 0; i < lectureDays.length; i++) {
  const dayNo = i + 1
  const pptx = buildDeck(lectureDays[i], dayNo)
  const file = join(outDir, `chosun-ai-day${dayNo}.pptx`)
  await pptx.writeFile({ fileName: file })
  console.log('✓ 생성:', file)
}
