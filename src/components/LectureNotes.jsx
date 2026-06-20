import { useEffect, useMemo, useState } from 'react'
import { intro, lectureDays } from '../lectureNotes'
import Diagram from './Diagram'

const SERIF = "'Noto Serif KR', serif"
const NEWS = "'Newsreader', serif"
const NAVY = '#1E3A5F'
const TERRA = '#C2603D'
const BORDER = '#E2D9C9'

// 사이드바에서 선택 가능한 모든 항목을 평탄화 (intro + 모든 세션)
const ALL_ITEMS = [intro, ...lectureDays.flatMap((d) => d.sessions)]

export default function LectureNotes({ user, onRequestLogin }) {
  const [activeId, setActiveId] = useState(() => {
    const sub = typeof window !== 'undefined' ? window.location.hash.split('/')[1] : ''
    return ALL_ITEMS.some((i) => i.id === sub) ? sub : 'intro'
  })

  // 해시(#lecture/<id>) ↔ activeId 동기화
  useEffect(() => {
    const onHash = () => {
      const sub = window.location.hash.split('/')[1]
      if (ALL_ITEMS.some((i) => i.id === sub)) setActiveId(sub)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const select = (id) => {
    setActiveId(id)
    window.location.hash = `#lecture/${id}`
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const active = useMemo(() => ALL_ITEMS.find((i) => i.id === activeId) || intro, [activeId])

  // 현재 보고 있는 날짜 (intro는 Day 1에 속함)
  const day1Ids = useMemo(() => new Set(['intro', ...lectureDays[0].sessions.map((s) => s.id)]), [])
  const curDayIdx = day1Ids.has(activeId) ? 0 : 1
  const curDay = lectureDays[curDayIdx]

  // 로그인 게이트
  if (!user) {
    return (
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '120px 40px 160px', textAlign: 'center' }}>
        <div style={{ fontFamily: NEWS, fontStyle: 'italic', fontSize: 16, color: TERRA, marginBottom: 14 }}>Members Only</div>
        <h2 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 34, letterSpacing: '-0.02em' }}>학습강의안은 로그인 후<br />이용할 수 있습니다</h2>
        <p style={{ fontSize: 16, color: '#6F665A', marginTop: 16, lineHeight: 1.7 }}>
          조선대학교 교원 교육 참여자 확인을 위해<br />구글 또는 카카오 계정으로 로그인해 주세요.
        </p>
        <button
          onClick={onRequestLogin}
          style={{ marginTop: 32, display: 'inline-flex', alignItems: 'center', gap: 9, background: NAVY, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 600, padding: '15px 34px', borderRadius: 12 }}
        >
          로그인하고 강의안 보기 <span style={{ fontFamily: NEWS }}>→</span>
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 40px' }}>
      <div className="lecture-grid" style={{ display: 'grid', gridTemplateColumns: '264px 1fr', gap: 48, alignItems: 'start', padding: '56px 0 100px' }}>

        {/* 왼쪽 메뉴 — 현재 날짜의 교시만 표시 */}
        <aside className="lecture-aside" style={{ position: 'sticky', top: 90 }}>
          <div style={{ fontFamily: NEWS, fontStyle: 'italic', fontSize: 15, color: TERRA, marginBottom: 16 }}>Lecture Notes</div>

          {curDayIdx === 0 && (
            <SideLink
              label="과정 개요 & 사용 안내"
              active={activeId === intro.id}
              onClick={() => select(intro.id)}
            />
          )}

          <div style={{ marginTop: curDayIdx === 0 ? 24 : 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontFamily: NEWS, fontStyle: 'italic', fontSize: 14, color: curDay.accent }}>{curDay.day}</span>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: curDay.accent, background: curDay.chipBg, padding: '3px 9px', borderRadius: 999 }}>{curDay.date}</span>
            </div>
            <div style={{ fontSize: 13, color: '#8A8170', marginBottom: 10, paddingLeft: 2 }}>{curDay.title}</div>
            <a
              href={`${import.meta.env.BASE_URL}ppt/chosun-ai-day${curDayIdx + 1}.pptx`}
              download={`조선대AI특강_Day${curDayIdx + 1}.pptx`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600, color: curDay.accent, textDecoration: 'none', background: curDay.chipBg, border: `1px solid ${curDay.accent}22`, borderRadius: 8, padding: '7px 11px', marginBottom: 10 }}
            >↓ Day {curDayIdx + 1} 강의안 PPT 다운로드</a>
            {curDay.sessions.map((s, i) => (
              <SideLink
                key={s.id}
                no={i + 1}
                label={s.title}
                active={activeId === s.id}
                accent={curDay.accent}
                onClick={() => select(s.id)}
              />
            ))}
          </div>
        </aside>

        {/* 본문 */}
        <article style={{ minWidth: 0, animation: 'floatIn .35s ease both' }}>
          <Content item={active} />

          {/* 이전/다음 날짜 이동 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 52, borderTop: `1px solid ${BORDER}`, paddingTop: 26 }}>
            {curDayIdx === 1
              ? <button onClick={() => select('d1-s1')} style={dayNavBtn(false)}>← Day 1 · Claude 기반 연구 업무 활용</button>
              : <span />}
            {curDayIdx === 0
              ? <button onClick={() => select('d2-s1')} style={dayNavBtn(true)}>Day 2 · AX 브릿지 교과목 설계 →</button>
              : <span />}
          </div>
        </article>
      </div>
    </div>
  )
}

function SideLink({ no, label, active, accent = NAVY, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', textAlign: 'left', display: 'flex', gap: 9, alignItems: 'flex-start',
        background: active ? '#fff' : 'transparent',
        border: active ? `1px solid ${BORDER}` : '1px solid transparent',
        borderLeft: active ? `3px solid ${accent}` : '3px solid transparent',
        borderRadius: 9, padding: '9px 12px', cursor: 'pointer', marginBottom: 3,
        fontFamily: 'inherit', fontSize: 14, lineHeight: 1.4,
        color: active ? '#1B1916' : '#5A5246', fontWeight: active ? 600 : 500,
      }}
    >
      {no != null && <span style={{ fontFamily: NEWS, fontSize: 13, color: accent, minWidth: 16 }}>{no}</span>}
      <span>{label}</span>
    </button>
  )
}

function Content({ item }) {
  const isSession = !!item.time
  return (
    <>
      {isSession && (
        <div style={{ fontFamily: NEWS, fontSize: 15, color: TERRA, marginBottom: 10, letterSpacing: '0.01em' }}>{item.time}</div>
      )}
      <h1 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 38, lineHeight: 1.2, letterSpacing: '-0.025em' }}>{item.title}</h1>
      <p style={{ fontSize: 17, color: '#5A5246', marginTop: 18, lineHeight: 1.7, maxWidth: 720 }}><Lines text={item.summary} /></p>

      {item.objectives && (
        <Block title="학습 목표">
          <ul style={ulS}>
            {item.objectives.map((o, i) => (
              <li key={i} style={liS}><Bullet />{o}</li>
            ))}
          </ul>
        </Block>
      )}

      {item.diagram && (
        <Block title="한눈에 보기">
          <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 14, padding: '22px 24px' }}>
            <Diagram spec={item.diagram} />
          </div>
        </Block>
      )}

      {item.sections?.map((sec, i) => (
        <div key={i} style={{ marginTop: 38 }}>
          <h3 style={h3S}>{sec.heading}</h3>
          {sec.paragraphs?.map((p, j) => (
            <p key={j} style={{ fontSize: 15.5, color: '#3D372E', lineHeight: 1.8, marginTop: 12 }}><Lines text={p} /></p>
          ))}
          {sec.bullets && (
            <ul style={{ ...ulS, marginTop: 14 }}>
              {sec.bullets.map((b, j) => (
                <li key={j} style={liS}><Bullet />{b}</li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {item.example && (
        <Block title="사례 · 예시">
          {item.example.scenario && (
            <p style={{ fontSize: 15.5, color: '#3D372E', lineHeight: 1.75, marginBottom: 16 }}><Lines text={item.example.scenario} /></p>
          )}
          <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '0.04em', color: NAVY, marginBottom: 8 }}>입력 (프롬프트)</div>
          <pre style={preDark}>{item.example.input}</pre>
          <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '0.04em', color: TERRA, margin: '18px 0 8px' }}>예상 출력</div>
          <div style={{ background: '#F4F6F9', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '16px 18px', fontSize: 14.5, color: '#3D372E', lineHeight: 1.75, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{item.example.output}</div>
        </Block>
      )}

      {item.slides && (
        <Block title="강의안 · 핵심정리">
          <p style={{ fontSize: 14, color: '#7A7163', marginTop: -4, marginBottom: 16 }}>이 교시에서 다루는 핵심 내용을 항목별로 정리했습니다.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {item.slides.map((sl, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ flexShrink: 0, fontFamily: NEWS, fontSize: 14, color: '#fff', background: NAVY, width: 30, height: 30, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 15.5, fontWeight: 600, color: '#1B1916', lineHeight: 1.4 }}>{sl.title}</div>
                  {sl.points && (
                    <ul style={{ ...ulS, marginTop: 9, gap: 6 }}>
                      {sl.points.map((p, j) => (
                        <li key={j} style={{ ...liS, fontSize: 14, color: '#5A5246', lineHeight: 1.55 }}><Bullet color={TERRA} />{p}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Block>
      )}

      {item.practice && (
        <Block title={item.practice.title} accent>
          <ol style={{ listStyle: 'none', counterReset: 'step', padding: 0, margin: 0 }}>
            {item.practice.steps.map((s, i) => (
              <li key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '11px 0', borderBottom: i < item.practice.steps.length - 1 ? '1px solid #EDE5D7' : 'none' }}>
                <span style={{ minWidth: 26, height: 26, borderRadius: '50%', background: NAVY, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontFamily: NEWS, flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontSize: 15.5, color: '#3D372E', lineHeight: 1.6, paddingTop: 2 }}>{s}</span>
              </li>
            ))}
          </ol>
        </Block>
      )}

      {item.promptExample && (
        <div style={{ marginTop: 34 }}>
          <h3 style={h3S}>예시 프롬프트</h3>
          <pre style={{ marginTop: 14, background: '#1B1916', color: '#EAE4D8', borderRadius: 14, padding: '22px 24px', fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: "'IBM Plex Sans KR', ui-monospace, monospace" }}>{item.promptExample}</pre>
        </div>
      )}

      {item.recap && (
        <Block title="이 교시 요약">
          <div style={{ background: '#FBF8F1', border: `1px solid ${BORDER}`, borderLeft: `3px solid ${TERRA}`, borderRadius: '0 12px 12px 0', padding: '18px 22px' }}>
            <ul style={{ ...ulS, margin: 0, gap: 12 }}>
              {item.recap.map((n, i) => (
                <li key={i} style={{ ...liS, color: '#3D372E', lineHeight: 1.7 }}>
                  <Bullet color={TERRA} /><Lines text={n} />
                </li>
              ))}
            </ul>
          </div>
        </Block>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, marginTop: 34 }}>
        {item.output && (
          <div style={{ flex: '1 1 240px', background: '#F4F6F9', border: `1px solid ${BORDER}`, borderRadius: 14, padding: '20px 22px' }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '0.04em', color: NAVY, marginBottom: 8 }}>◆ 산출물</div>
            <div style={{ fontSize: 15.5, color: '#1B1916', fontWeight: 600, lineHeight: 1.5 }}>{item.output}</div>
          </div>
        )}
        {item.tips && (
          <div style={{ flex: '2 1 320px', background: '#FBF3EC', border: '1px solid #F0DDCB', borderRadius: 14, padding: '20px 22px' }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '0.04em', color: TERRA, marginBottom: 10 }}>TIP</div>
            <ul style={{ ...ulS, margin: 0 }}>
              {item.tips.map((t, i) => (
                <li key={i} style={{ ...liS, color: '#5A4636' }}><Bullet color={TERRA} />{t}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  )
}

function Block({ title, accent, children }) {
  return (
    <div style={{ marginTop: 38 }}>
      <h3 style={{ ...h3S, color: accent ? TERRA : '#1B1916' }}>{title}</h3>
      <div style={{ marginTop: 14 }}>{children}</div>
    </div>
  )
}

// 마침표(.) 기준 문장별 줄바꿈. 숫자 뒤 마침표(예: "2026. 6. 24")는 보호.
function Lines({ text }) {
  const parts = String(text).split(/(?<=[^\d]\.)\s+/).filter(Boolean)
  return parts.map((s, i) => (
    <span key={i} style={{ display: 'block' }}>{s}</span>
  ))
}

function Bullet({ color = NAVY }) {
  return <span style={{ color, fontFamily: NEWS, marginRight: 10, flexShrink: 0 }}>◆</span>
}

function dayNavBtn(primary) {
  return { background: primary ? NAVY : '#fff', color: primary ? '#fff' : '#5A5246', border: `1px solid ${primary ? NAVY : BORDER}`, borderRadius: 11, padding: '13px 22px', fontSize: 14.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', lineHeight: 1.35, textAlign: primary ? 'right' : 'left' }
}

const h3S = { fontFamily: SERIF, fontWeight: 600, fontSize: 21, letterSpacing: '-0.015em', color: '#1B1916' }
const ulS = { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }
const liS = { display: 'flex', alignItems: 'flex-start', fontSize: 15.5, color: '#3D372E', lineHeight: 1.65 }
const preDark = { margin: 0, background: '#1B1916', color: '#EAE4D8', borderRadius: 12, padding: '18px 20px', fontSize: 13.5, lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: "'IBM Plex Sans KR', ui-monospace, monospace" }
