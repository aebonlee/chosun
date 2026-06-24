// 공용 실습 가이드 — Claude 웹에서 따라하는 단계별 복사용 프롬프트 UI.
// title, lead(노드), steps([{n,title,desc,prompt}]), tip(노드)를 받아 렌더링한다.
import { useState } from 'react'

const SERIF = "'Noto Serif KR', serif"
const NEWS = "'Newsreader', serif"
const NAVY = '#1E3A5F'
const TERRA = '#C2603D'
const BORDER = '#E2D9C9'

function CopyButton({ text }) {
  const [done, setDone] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text; document.body.appendChild(ta); ta.select()
      try { document.execCommand('copy') } catch { /* noop */ }
      document.body.removeChild(ta)
    }
    setDone(true)
    setTimeout(() => setDone(false), 1500)
  }
  return (
    <button
      onClick={copy}
      style={{ flexShrink: 0, background: done ? '#2E7D55' : NAVY, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, padding: '7px 14px', borderRadius: 8 }}
    >
      {done ? '복사됨 ✓' : '프롬프트 복사'}
    </button>
  )
}

export default function PracticeGuide({ title, lead, steps, tip }) {
  return (
    <div>
      <h2 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 25, color: NAVY, letterSpacing: '-0.01em' }}>{title}</h2>
      <p style={{ fontSize: 15.5, color: '#5A5246', marginTop: 10, lineHeight: 1.7 }}>{lead}</p>

      {/* 시작 안내 */}
      <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 14, background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 14, padding: '14px 18px' }}>
        <div style={{ fontFamily: SERIF, fontWeight: 700, color: NAVY, fontSize: 15 }}>시작하기</div>
        <div style={{ fontSize: 14, color: '#5A5246', flex: 1, lineHeight: 1.6 }}>
          Claude 웹을 열고 새 대화를 시작한 뒤, 1단계부터 차례로 프롬프트를 붙여넣으세요. 한 대화 안에서 이어가면 앞 단계 내용을 기억합니다.
        </div>
        <a href="https://claude.ai/new" target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 7, background: TERRA, color: '#fff', textDecoration: 'none', fontSize: 13.5, fontWeight: 700, padding: '9px 16px', borderRadius: 999 }}>Claude 웹 열기 <span style={{ fontFamily: NEWS }}>↗</span></a>
      </div>

      {/* 단계별 프롬프트 */}
      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {steps.map((s) => (
          <div key={s.n} style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 18px 4px' }}>
              <div style={{ flexShrink: 0, width: 30, height: 30, borderRadius: '50%', background: NAVY, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: NEWS, fontSize: 15 }}>{s.n}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 17, color: NAVY }}>{s.title}</h3>
                <p style={{ fontSize: 13.5, color: '#7A7263', marginTop: 4, lineHeight: 1.55 }}>{s.desc}</p>
              </div>
              <CopyButton text={s.prompt} />
            </div>
            <pre style={{
              margin: '8px 18px 18px', background: '#FBF8F2', border: `1px solid ${BORDER}`, borderRadius: 10,
              padding: '14px 16px', fontSize: 13, lineHeight: 1.6, color: '#1B1916', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              fontFamily: "'SFMono-Regular', ui-monospace, Menlo, Consolas, monospace",
            }}>{s.prompt}</pre>
          </div>
        ))}
      </div>

      {/* 팁 */}
      {tip && (
        <div style={{ marginTop: 20, background: '#F1ECE1', borderRadius: 14, padding: '16px 18px', fontSize: 13.5, color: '#5A5246', lineHeight: 1.7 }}>
          <b style={{ color: NAVY }}>활용 팁</b> — {tip}
        </div>
      )}
    </div>
  )
}
