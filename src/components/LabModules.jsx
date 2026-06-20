import { useEffect, useMemo, useState } from 'react'
import { labs } from '../data'
import Diagram from './Diagram'

const SERIF = "'Noto Serif KR', serif"
const NEWS = "'Newsreader', serif"
const NAVY = '#1E3A5F'
const TERRA = '#C2603D'
const BORDER = '#E2D9C9'

const GROUPS = [
  { tag: 'RESEARCH', label: '연구 활용', accent: '#1E3A5F' },
  { tag: 'TEACHING', label: '교과목 설계', accent: '#A8521F' },
]

export default function LabModules() {
  const [activeNo, setActiveNo] = useState(() => {
    const sub = typeof window !== 'undefined' ? window.location.hash.split('/')[1] : ''
    return labs.some((l) => l.no === sub) ? sub : labs[0].no
  })

  useEffect(() => {
    const onHash = () => {
      const sub = window.location.hash.split('/')[1]
      if (labs.some((l) => l.no === sub)) setActiveNo(sub)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const select = (no) => {
    setActiveNo(no)
    window.location.hash = `#labs/${no}`
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const lab = useMemo(() => labs.find((l) => l.no === activeNo) || labs[0], [activeNo])

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 40px' }}>
      <div className="lecture-grid" style={{ display: 'grid', gridTemplateColumns: '264px 1fr', gap: 48, alignItems: 'start', padding: '56px 0 100px' }}>

        {/* 좌측 하위 메뉴 */}
        <aside className="lecture-aside" style={{ position: 'sticky', top: 90 }}>
          <div style={{ fontFamily: NEWS, fontStyle: 'italic', fontSize: 15, color: TERRA, marginBottom: 16 }}>Hands-on Labs</div>
          {GROUPS.map((g) => (
            <div key={g.tag} style={{ marginTop: 22 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.06em', color: g.accent, marginBottom: 10, paddingLeft: 2 }}>{g.tag} · {g.label}</div>
              {labs.filter((l) => l.tag === g.tag).map((l) => {
                const on = l.no === activeNo
                return (
                  <button
                    key={l.no}
                    onClick={() => select(l.no)}
                    style={{
                      width: '100%', textAlign: 'left', display: 'flex', gap: 9, alignItems: 'flex-start',
                      background: on ? '#fff' : 'transparent',
                      border: on ? `1px solid ${BORDER}` : '1px solid transparent',
                      borderLeft: on ? `3px solid ${g.accent}` : '3px solid transparent',
                      borderRadius: 9, padding: '9px 12px', cursor: 'pointer', marginBottom: 3,
                      fontFamily: 'inherit', fontSize: 14, lineHeight: 1.4,
                      color: on ? '#1B1916' : '#5A5246', fontWeight: on ? 600 : 500,
                    }}
                  >
                    <span style={{ fontFamily: NEWS, fontSize: 13, color: g.accent, minWidth: 16 }}>{l.no}</span>
                    <span>{l.title}</span>
                  </button>
                )
              })}
            </div>
          ))}
        </aside>

        {/* 본문 */}
        <article style={{ minWidth: 0, animation: 'floatIn .35s ease both' }}>
          <div style={{ display: 'inline-block', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.06em', color: lab.ink, background: lab.tint, padding: '5px 12px', borderRadius: 6, marginBottom: 14 }}>{lab.tag}</div>
          <h1 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 38, lineHeight: 1.2, letterSpacing: '-0.025em' }}>{lab.title}</h1>
          <p style={{ fontSize: 17, color: '#5A5246', marginTop: 18, lineHeight: 1.7, maxWidth: 720 }}>{lab.summary}</p>

          {lab.diagram && (
            <Block title="한눈에 보기">
              <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 14, padding: '22px 24px' }}><Diagram spec={lab.diagram} /></div>
            </Block>
          )}

          {lab.objectives && (
            <Block title="학습 목표">
              <ul style={ulS}>{lab.objectives.map((o, i) => <li key={i} style={liS}><span style={{ color: lab.ink, marginRight: 10, fontFamily: NEWS, flexShrink: 0 }}>◆</span>{o}</li>)}</ul>
            </Block>
          )}

          {lab.steps && (
            <Block title="진행 절차">
              <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {lab.steps.map((s, i) => (
                  <li key={i} style={{ display: 'flex', gap: 13, alignItems: 'flex-start', fontSize: 15.5, color: '#3D372E', lineHeight: 1.6 }}>
                    <span style={{ minWidth: 26, height: 26, borderRadius: '50%', background: lab.ink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontFamily: NEWS, flexShrink: 0 }}>{i + 1}</span>
                    <span style={{ paddingTop: 2 }}>{s}</span>
                  </li>
                ))}
              </ol>
            </Block>
          )}

          {lab.promptExample && (
            <Block title="예시 프롬프트">
              <pre style={{ margin: 0, background: '#1B1916', color: '#EAE4D8', borderRadius: 12, padding: '18px 20px', fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: "'IBM Plex Sans KR', ui-monospace, monospace" }}>{lab.promptExample}</pre>
            </Block>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, marginTop: 34 }}>
            <div style={{ flex: '1 1 240px', background: '#F4F6F9', border: `1px solid ${BORDER}`, borderRadius: 14, padding: '20px 22px' }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '0.04em', color: NAVY, marginBottom: 8 }}>◆ 산출물</div>
              <div style={{ fontSize: 15.5, color: '#1B1916', fontWeight: 600, lineHeight: 1.5 }}>{lab.output}</div>
            </div>
            {lab.tips && (
              <div style={{ flex: '2 1 320px', background: '#FBF3EC', border: '1px solid #F0DDCB', borderRadius: 14, padding: '20px 22px' }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '0.04em', color: TERRA, marginBottom: 10 }}>TIP</div>
                <ul style={{ ...ulS, margin: 0 }}>{lab.tips.map((t, i) => <li key={i} style={{ ...liS, color: '#5A4636' }}><span style={{ color: TERRA, marginRight: 10, fontFamily: NEWS, flexShrink: 0 }}>◆</span>{t}</li>)}</ul>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  )
}

function Block({ title, children }) {
  return (
    <div style={{ marginTop: 38 }}>
      <h3 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 21, letterSpacing: '-0.015em', color: '#1B1916' }}>{title}</h3>
      <div style={{ marginTop: 14 }}>{children}</div>
    </div>
  )
}

const ulS = { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }
const liS = { display: 'flex', alignItems: 'flex-start', fontSize: 15.5, color: '#3D372E', lineHeight: 1.65 }
