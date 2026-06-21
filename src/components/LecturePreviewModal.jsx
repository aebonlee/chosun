import { useEffect, useMemo, useRef } from 'react'
import { lectureDays } from '../lectureNotes'
import { buildDayHtml, downloadDayHtml } from '../lib/lectureExport'

const SERIF = "'Noto Serif KR', serif"
const NEWS = "'Newsreader', serif"
const NAVY = '#1E3A5F'
const TERRA = '#C2603D'
const BORDER = '#E2D9C9'

// 날짜(Day)별 강의안 미리보기 모달.
// iframe srcDoc 으로 실제 다운로드본과 동일한 문서를 렌더링하고,
// 인쇄(PDF 저장) · HTML 다운로드 · PPT 다운로드를 한 곳에서 제공한다.
export default function LecturePreviewModal({ dayIdx, onClose }) {
  const frameRef = useRef(null)
  const day = lectureDays[dayIdx]
  const html = useMemo(() => buildDayHtml(dayIdx), [dayIdx])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  if (!day) return null

  // iframe 내부 문서를 인쇄 → 사용자가 "PDF로 저장" 선택 가능
  const printDoc = () => {
    const win = frameRef.current?.contentWindow
    if (!win) return
    win.focus()
    win.print()
  }

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(27,25,22,0.55)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#F6F2EA', borderRadius: 18, width: 'min(900px, 96vw)', height: 'min(88vh, 980px)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 70px rgba(27,25,22,0.4)' }}
      >
        {/* 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '18px 22px', borderBottom: `1px solid ${BORDER}`, background: '#fff' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: NEWS, fontStyle: 'italic', fontSize: 13, color: TERRA }}>Lecture Notes Preview</div>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 18, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {day.day} · {day.date} — {day.title}
            </div>
          </div>
          <button onClick={onClose} aria-label="닫기" style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 9, border: `1px solid ${BORDER}`, background: '#fff', cursor: 'pointer', fontSize: 18, color: '#5A5246', lineHeight: 1 }}>×</button>
        </div>

        {/* 미리보기 본문 */}
        <div style={{ flex: 1, minHeight: 0, background: '#E9E3D8', padding: 14 }}>
          <iframe
            ref={frameRef}
            title={`${day.day} 강의안 미리보기`}
            srcDoc={html}
            style={{ width: '100%', height: '100%', border: `1px solid ${BORDER}`, borderRadius: 10, background: '#fff' }}
          />
        </div>

        {/* 액션 바 */}
        <div className="lec-preview-actions" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 22px', borderTop: `1px solid ${BORDER}`, background: '#fff', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, color: '#8A8170', marginRight: 'auto' }}>
            {day.sessions.length}개 교시{dayIdx === 0 ? ' + 과정 개요' : ''} 전체 강의안
          </span>
          <button onClick={printDoc} style={btn(false)}>🖨 인쇄 · PDF 저장</button>
          <button onClick={() => downloadDayHtml(dayIdx)} style={btn(false)}>↓ HTML 다운로드</button>
          <a
            href={`${import.meta.env.BASE_URL}ppt/chosun-ai-day${dayIdx + 1}.pptx`}
            download={`조선대AI특강_${day.day.replace(/\s+/g, '')}.pptx`}
            style={{ ...btn(true), textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >↓ PPT 다운로드</a>
        </div>
      </div>
    </div>
  )
}

function btn(primary) {
  return {
    background: primary ? NAVY : '#fff',
    color: primary ? '#fff' : '#3C3730',
    border: `1px solid ${primary ? NAVY : BORDER}`,
    borderRadius: 10,
    padding: '10px 16px',
    fontSize: 13.5,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    whiteSpace: 'nowrap',
  }
}
