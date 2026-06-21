import { useState } from 'react'
import { caseSections, promptTechniques } from '../appendixCases'

const SERIF = "'Noto Serif KR', serif"
const NEWS = "'Newsreader', serif"
const NAVY = '#1E3A5F'
const TERRA = '#C2603D'
const BORDER = '#E2D9C9'

// Day 1 부록 — 분야·단과대학·업무별 Claude 활용 사례집.
// 좌측 섹션 내비 + 사례 카드(상황·복사용 프롬프트·산출물·검증 체크포인트).
export default function AppendixCases() {
  const [active, setActive] = useState(0)

  const go = (i) => {
    setActive(i)
    document.getElementById(`case-sec-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 40px' }}>
      {/* 헤더 */}
      <header style={{ padding: '64px 0 8px', textAlign: 'center' }}>
        <div style={{ fontFamily: NEWS, fontStyle: 'italic', fontSize: 16, color: TERRA, marginBottom: 12 }}>Appendix · Use Cases</div>
        <h1 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 42, letterSpacing: '-0.025em' }}>Claude 활용 사례집</h1>
        <p style={{ fontSize: 16, color: '#6F665A', marginTop: 16, lineHeight: 1.7, maxWidth: 640, margin: '16px auto 0' }}>
          연구를 넘어 강의·심사·코드·행정까지 — 분야·단과대학·업무별로 바로 복사해 쓰는 프롬프트와 검증 체크포인트입니다.<br />
          [대괄호] 항목을 본인 자료로 바꿔 사용하세요.
        </p>
      </header>

      <div className="cases-grid" style={{ display: 'grid', gridTemplateColumns: '232px 1fr', gap: 44, alignItems: 'start', padding: '40px 0 100px' }}>
        {/* 좌측 섹션 내비 */}
        <aside className="cases-aside" style={{ position: 'sticky', top: 90 }}>
          <div style={{ fontFamily: NEWS, fontStyle: 'italic', fontSize: 14, color: TERRA, marginBottom: 14 }}>Sections</div>
          {caseSections.map((s, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              style={{
                width: '100%', textAlign: 'left', display: 'block', cursor: 'pointer',
                background: active === i ? '#fff' : 'transparent',
                border: active === i ? `1px solid ${BORDER}` : '1px solid transparent',
                borderLeft: active === i ? `3px solid ${NAVY}` : '3px solid transparent',
                borderRadius: 9, padding: '9px 12px', marginBottom: 3, fontFamily: 'inherit',
                fontSize: 13.5, lineHeight: 1.4, color: active === i ? '#1B1916' : '#5A5246',
                fontWeight: active === i ? 600 : 500,
              }}
            >
              {s.title}
              <span style={{ display: 'block', fontSize: 11.5, color: '#9A8F7D', marginTop: 2 }}>{s.cases.length}개 사례</span>
            </button>
          ))}
          <button
            onClick={() => document.getElementById('case-technique')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ width: '100%', textAlign: 'left', display: 'block', cursor: 'pointer', background: 'transparent', border: '1px solid transparent', borderLeft: '3px solid transparent', borderRadius: 9, padding: '9px 12px', marginTop: 6, fontFamily: 'inherit', fontSize: 13.5, color: '#5A5246', fontWeight: 500 }}
          >
            프롬프트 테크닉
            <span style={{ display: 'block', fontSize: 11.5, color: '#9A8F7D', marginTop: 2 }}>정확도 6가지</span>
          </button>
        </aside>

        {/* 사례 본문 */}
        <div style={{ minWidth: 0 }}>
          {caseSections.map((sec, i) => (
            <section key={i} id={`case-sec-${i}`} style={{ marginBottom: 56, scrollMarginTop: 90 }}>
              <div style={{ fontFamily: NEWS, fontStyle: 'italic', fontSize: 14, color: TERRA, marginBottom: 6 }}>{sec.kicker}</div>
              <h2 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 27, letterSpacing: '-0.02em', color: '#1B1916' }}>{sec.title}</h2>
              <p style={{ fontSize: 15, color: '#6F665A', marginTop: 8, lineHeight: 1.65 }}>{sec.desc}</p>

              <div className="case-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 18, marginTop: 22 }}>
                {sec.cases.map((c, j) => (
                  <CaseCard key={j} c={c} />
                ))}
              </div>
            </section>
          ))}

          {/* 프롬프트 테크닉 */}
          <section id="case-technique" style={{ scrollMarginTop: 90 }}>
            <div style={{ fontFamily: NEWS, fontStyle: 'italic', fontSize: 14, color: TERRA, marginBottom: 6 }}>Prompt Techniques</div>
            <h2 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 27, letterSpacing: '-0.02em' }}>{promptTechniques.title}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14, marginTop: 22 }}>
              {promptTechniques.techniques.map((t, i) => (
                <div key={i} style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '16px 18px' }}>
                  <span style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, color: NAVY, background: '#E3EAF2', borderRadius: 6, padding: '3px 9px', marginBottom: 9 }}>{t.tag}</span>
                  <div style={{ fontSize: 14.5, color: '#3D372E', lineHeight: 1.55 }}>{t.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 18, background: '#FBF3EC', border: '1px solid #F0DDCB', borderRadius: 12, padding: '16px 20px' }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '0.04em', color: TERRA, marginBottom: 8 }}>주의</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {promptTechniques.cautions.map((c, i) => (
                  <li key={i} style={{ display: 'flex', gap: 9, fontSize: 14, color: '#5A4636', lineHeight: 1.5 }}>
                    <span style={{ color: TERRA, flexShrink: 0 }}>◆</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function CaseCard({ c }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(c.prompt).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    })
  }
  return (
    <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 22px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: NAVY, letterSpacing: '0.01em' }}>{c.college}</div>
      <h3 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 18.5, letterSpacing: '-0.015em', color: '#1B1916', margin: '4px 0 0' }}>{c.title}</h3>
      <div style={{ fontSize: 12.5, color: '#8A8170', marginTop: 6 }}>상황 · {c.situation}</div>

      <div style={{ position: 'relative', marginTop: 14 }}>
        <button
          onClick={copy}
          style={{ position: 'absolute', top: 8, right: 8, zIndex: 2, fontSize: 11.5, fontWeight: 600, color: copied ? '#fff' : '#CFC8BA', background: copied ? TERRA : 'rgba(255,255,255,0.08)', border: `1px solid ${copied ? TERRA : 'rgba(255,255,255,0.18)'}`, borderRadius: 7, padding: '4px 9px', cursor: 'pointer', fontFamily: 'inherit' }}
        >{copied ? '복사됨 ✓' : '복사'}</button>
        <pre style={{ margin: 0, background: '#1B1916', color: '#EAE4D8', borderRadius: 11, padding: '16px 18px', fontSize: 12.5, lineHeight: 1.65, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: "'IBM Plex Sans KR', ui-monospace, monospace" }}>{c.prompt}</pre>
      </div>

      <div style={{ fontSize: 13.5, color: '#3D372E', lineHeight: 1.55, marginTop: 14, background: '#F4F6F9', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '11px 14px' }}>
        <span style={{ fontWeight: 700, color: NAVY }}>산출물</span> · {c.output}
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0', display: 'flex', flexWrap: 'wrap', gap: 7 }}>
        {c.checks.map((ck, i) => (
          <li key={i} style={{ fontSize: 12, color: '#5A4636', background: '#FBF3EC', border: '1px solid #F0DDCB', borderRadius: 999, padding: '4px 11px' }}>
            ✓ {ck}
          </li>
        ))}
      </ul>
    </div>
  )
}
