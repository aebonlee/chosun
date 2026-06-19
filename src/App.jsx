import { useState, useEffect, useRef } from 'react'
import { heroStats, overviewItems, days, labs, prep, infoCards } from './data'
import LoginModal from './components/LoginModal'
import LectureNotes from './components/LectureNotes'
import PromptGuide from './components/PromptGuide'
import PromptPractice from './components/PromptPractice'
import PromptGallery from './components/PromptGallery'
import PromptEval from './components/PromptEval'
import { useAuth, displayName } from './lib/useAuth'

const PROMPT_VIEWS = {
  'prompt-guide': PromptGuide,
  'prompt-practice': PromptPractice,
  'prompt-gallery': PromptGallery,
  'prompt-eval': PromptEval,
}

const SERIF = "'Noto Serif KR', serif"
const NEWS = "'Newsreader', serif"
const NAVY = '#1E3A5F'
const TERRA = '#C2603D'
const BORDER = '#E2D9C9'
const container = { maxWidth: 1180, margin: '0 auto', padding: '0 40px' }

export default function App() {
  const [showLogin, setShowLogin] = useState(false)
  const [hash, setHash] = useState(window.location.hash)
  const [promptOpen, setPromptOpen] = useState(false)
  const promptRef = useRef(null)
  const { user, signOut } = useAuth()
  const open = () => setShowLogin(true)

  useEffect(() => {
    const onHash = () => { setHash(window.location.hash); setPromptOpen(false) }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // 드롭다운 바깥 클릭 / ESC 로 닫기
  useEffect(() => {
    if (!promptOpen) return
    const onDown = (e) => { if (promptRef.current && !promptRef.current.contains(e.target)) setPromptOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setPromptOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [promptOpen])

  const route = hash.replace(/^#/, '').split('/')[0]
  const PromptView = PROMPT_VIEWS[route]
  const view = route === 'lecture' ? 'lecture' : PromptView ? 'prompt' : 'home'
  const goLecture = (e) => { e.preventDefault(); window.location.hash = '#lecture/intro'; window.scrollTo({ top: 0 }) }
  const goRoute = (r) => (e) => { e.preventDefault(); setPromptOpen(false); window.location.hash = '#' + r; window.scrollTo({ top: 0 }) }
  const goHome = (e) => { e.preventDefault(); window.location.hash = ''; window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const goSection = (id) => (e) => {
    e.preventDefault()
    window.location.hash = ''
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 60)
  }

  return (
    <div style={{ background: '#F6F2EA', color: '#1B1916', minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(246,242,234,0.86)', backdropFilter: 'blur(10px)', borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ ...container, height: 66, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="#" onClick={goHome} style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'inherit' }}>
            <div style={{ width: 30, height: 30, borderRadius: 7, background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: NEWS, fontSize: 17, fontStyle: 'italic' }}>C</div>
            <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 16, letterSpacing: '-0.01em' }}>조선대학교 AI특강</span>
          </a>
          <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <a href="#curriculum" onClick={goSection('curriculum')} style={{ color: '#5A5246', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>커리큘럼</a>
            <a href="#labs" onClick={goSection('labs')} style={{ color: '#5A5246', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>실습 모듈</a>

            <div ref={promptRef} style={{ position: 'relative' }} onMouseEnter={() => setPromptOpen(true)}>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={promptOpen}
                onClick={() => setPromptOpen((v) => !v)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '6px 0', color: ['prompt-guide', 'prompt-practice', 'prompt-gallery'].includes(route) ? NAVY : '#5A5246', fontSize: 14, fontWeight: ['prompt-guide', 'prompt-practice', 'prompt-gallery'].includes(route) ? 700 : 500 }}
              >
                프롬프트 <span style={{ fontSize: 10, transform: promptOpen ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}>▾</span>
              </button>
              {promptOpen && (
                <div role="menu" style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', paddingTop: 10, zIndex: 60 }}>
                  <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12, boxShadow: '0 16px 40px rgba(27,25,22,0.16)', padding: 6, minWidth: 184 }}>
                    {[['prompt-guide', '프롬프트 가이드'], ['prompt-practice', '프롬프트 연습장'], ['prompt-gallery', '프롬프트 갤러리']].map(([r, label]) => (
                      <a
                        key={r}
                        href={'#' + r}
                        role="menuitem"
                        onClick={goRoute(r)}
                        style={{ display: 'block', padding: '11px 14px', borderRadius: 9, textDecoration: 'none', fontSize: 14.5, whiteSpace: 'nowrap', fontWeight: route === r ? 700 : 500, color: route === r ? NAVY : '#3C3730', background: route === r ? '#F1ECE1' : 'transparent' }}
                        onMouseEnter={(e) => { if (route !== r) e.currentTarget.style.background = '#F6F2EA' }}
                        onMouseLeave={(e) => { if (route !== r) e.currentTarget.style.background = 'transparent' }}
                      >{label}</a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <a href="#prompt-eval" onClick={goRoute('prompt-eval')} style={{ color: route === 'prompt-eval' ? NAVY : '#5A5246', textDecoration: 'none', fontSize: 14, fontWeight: route === 'prompt-eval' ? 700 : 500 }}>프롬프트 평가</a>

            <a href="#prep" onClick={goSection('prep')} style={{ color: '#5A5246', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>준비사항</a>
            <a href="#lecture/intro" onClick={goLecture} style={{ color: view === 'lecture' ? NAVY : '#5A5246', textDecoration: 'none', fontSize: 14, fontWeight: view === 'lecture' ? 700 : 600 }}>학습강의안</a>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: NAVY }}>{displayName(user)}님</span>
                <button onClick={signOut} style={{ background: '#fff', color: '#5A5246', border: `1px solid ${BORDER}`, cursor: 'pointer', fontSize: 13.5, fontWeight: 600, padding: '8px 16px', borderRadius: 999 }}>로그아웃</button>
              </div>
            ) : (
              <button onClick={open} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: NAVY, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 600, padding: '9px 18px', borderRadius: 999 }}>로그인</button>
            )}
          </div>
        </div>
      </nav>

      {view === 'lecture' ? (
        <LectureNotes user={user} onRequestLogin={open} />
      ) : view === 'prompt' ? (
        <PromptView />
      ) : (
      <>
      {/* HERO */}
      <header style={{ ...container, padding: '84px 40px 72px', position: 'relative' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 999, padding: '7px 16px', marginBottom: 30 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: TERRA, display: 'inline-block' }}></span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#7A4A33', letterSpacing: '0.01em' }}>전임 교원 대상 · 오프라인 실습 과정</span>
        </div>
        <div className="hero-logo" aria-hidden="true" style={{ position: 'absolute', top: 72, right: 16, width: 180, height: 180, zIndex: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', inset: '-10%', background: 'radial-gradient(circle, rgba(217,119,87,0.18), transparent 66%)' }} />
          <svg viewBox="0 0 120 120" width="180" height="180" style={{ position: 'relative', animation: 'floatBob 6s ease-in-out infinite', filter: 'drop-shadow(0 16px 28px rgba(194,96,61,0.28))' }}>
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * 30) * Math.PI / 180
              const r0 = 13, r1 = i % 2 === 0 ? 47 : 33
              return (
                <line key={i}
                  x1={(60 + Math.cos(a) * r0).toFixed(1)} y1={(60 + Math.sin(a) * r0).toFixed(1)}
                  x2={(60 + Math.cos(a) * r1).toFixed(1)} y2={(60 + Math.sin(a) * r1).toFixed(1)}
                  stroke="#D9774F" strokeWidth="7" strokeLinecap="round" />
              )
            })}
          </svg>
        </div>
        <h1 className="hero-h1" style={{ position: 'relative', zIndex: 1, fontFamily: SERIF, fontWeight: 700, fontSize: 62, lineHeight: 1.14, letterSpacing: '-0.025em', maxWidth: 880, marginBottom: 26 }}>
          Claude 기반 <span style={{ color: TERRA }}>연구 업무 활용</span> &amp;<br />AX 브릿지 교과목 설계
        </h1>
        <p style={{ fontSize: 19, lineHeight: 1.6, color: '#5A5246', maxWidth: 620, marginBottom: 42 }}>
          논문 리뷰부터 제안서 작성, 교과목 AI 접목과 과목 에이전트 구축까지<br />— 학과를 막론하고 따라 할 수 있는 실습 중심 2일 과정입니다.
        </p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <a href="#curriculum" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: NAVY, color: '#fff', textDecoration: 'none', fontSize: 15, fontWeight: 600, padding: '14px 26px', borderRadius: 11 }}>커리큘럼 살펴보기 <span style={{ fontFamily: NEWS }}>→</span></a>
          <a href="#prep" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: '#fff', border: `1px solid ${BORDER}`, color: '#1B1916', textDecoration: 'none', fontSize: 15, fontWeight: 600, padding: '14px 26px', borderRadius: 11 }}>준비물 확인</a>
        </div>

        <div className="stats-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0, marginTop: 64, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
          {heroStats.map((s, i) => (
            <div key={i} style={{ padding: '28px 16px', textAlign: 'center', borderRight: i < heroStats.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
              <div style={{ fontFamily: NEWS, fontSize: 38, fontWeight: 500, color: NAVY, lineHeight: 1, letterSpacing: '-0.01em' }}>{s.value}</div>
              <div style={{ fontSize: 13.5, color: '#7A7163', marginTop: 9, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </header>

      {/* OVERVIEW */}
      <section id="overview" style={{ background: NAVY, color: '#EAE4D8', padding: '96px 0' }}>
        <div style={container}>
          <div className="overview-wrap grid-overview" style={{ display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: 72, alignItems: 'start' }}>
            <div>
              <div style={{ fontFamily: NEWS, fontStyle: 'italic', fontSize: 16, color: '#C99A7E', marginBottom: 16 }}>Overview</div>
              <h2 className="section-h2" style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 36, lineHeight: 1.3, letterSpacing: '-0.02em', color: '#fff' }}>학과를 막론한<br />실습 중심 교육</h2>
              <p style={{ fontSize: 15.5, lineHeight: 1.75, color: '#B6BECB', marginTop: 24 }}>전 학과 교원이 자신의 연구와 강의에 곧바로 적용할 수 있도록, 난이도를 낮춘 단계별 실습으로 설계했습니다.</p>
            </div>
            <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              {overviewItems.map((o, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 15, padding: 24 }}>
                  <div style={{ fontFamily: NEWS, fontSize: 13, color: '#C99A7E', letterSpacing: '0.04em', marginBottom: 12 }}>{o.no}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 6 }}>{o.label}</div>
                  <div style={{ fontSize: 14.5, lineHeight: 1.6, color: '#AFB7C4' }}>{o.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CURRICULUM */}
      <section id="curriculum" style={{ ...container, padding: '100px 40px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <div style={{ fontFamily: NEWS, fontStyle: 'italic', fontSize: 16, color: TERRA, marginBottom: 14 }}>Curriculum</div>
          <h2 className="section-h2" style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 42, letterSpacing: '-0.025em' }}>2일 · 14시간 커리큘럼</h2>
          <p style={{ fontSize: 16, color: '#6F665A', marginTop: 16 }}>매일 10:00 – 18:00 · 하루 7교시(50분 수업 + 10분 휴식) · 점심 12:00 – 13:00</p>
        </div>

        <div className="grid-curriculum grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginTop: 56 }}>
          {days.map((d, i) => (
            <div key={i} style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 20, overflow: 'hidden' }}>
              <div style={{ padding: '30px 32px', borderBottom: '1px solid #EDE5D7', background: d.headBg }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: NEWS, fontStyle: 'italic', fontSize: 15, color: d.accent }}>{d.day}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: d.accent, background: d.chipBg, padding: '5px 12px', borderRadius: 999 }}>{d.date}</span>
                </div>
                <h3 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 25, letterSpacing: '-0.02em', marginTop: 12, color: '#1B1916' }}>{d.title}</h3>
                <p style={{ fontSize: 14, color: '#6F665A', marginTop: 8, lineHeight: 1.55 }}>{d.subtitle}</p>
              </div>
              <div style={{ padding: '12px 32px 30px' }}>
                {d.sessions.map((se, j) => (
                  <div key={j}>
                    {se.afterLunch && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', color: '#B0A691' }}>
                        <span style={{ fontFamily: NEWS, fontSize: 13, minWidth: 92, letterSpacing: '0.01em' }}>12:00–13:00</span>
                        <span style={{ flex: 1, height: 1, background: '#EDE5D7' }}></span>
                        <span style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '0.06em' }}>점심</span>
                        <span style={{ flex: 1, height: 1, background: '#EDE5D7' }}></span>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 18, padding: '18px 0', borderBottom: '1px solid #F0EADD' }}>
                      <div style={{ fontFamily: NEWS, fontSize: 14, color: '#9A8F7D', minWidth: 92, paddingTop: 2, letterSpacing: '0.01em' }}>{se.time}</div>
                      <div>
                        <div style={{ fontSize: 15.5, fontWeight: 600, color: '#1B1916', lineHeight: 1.4 }}>{se.title}</div>
                        <div style={{ fontSize: 14, color: '#7A7163', marginTop: 5, lineHeight: 1.55 }}>{se.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LABS */}
      <section id="labs" style={{ ...container, padding: '90px 40px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 48 }}>
          <div>
            <div style={{ fontFamily: NEWS, fontStyle: 'italic', fontSize: 16, color: TERRA, marginBottom: 14 }}>Hands-on Labs</div>
            <h2 className="section-h2" style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 42, letterSpacing: '-0.025em' }}>8개 실습 모듈</h2>
          </div>
          <p style={{ fontSize: 15, color: '#6F665A', maxWidth: 380, lineHeight: 1.6 }}>각 모듈은 완성된 산출물을 직접 만들어 보는 것으로 마무리됩니다. 강의 후 그대로 본인 업무에 재사용하세요.</p>
        </div>

        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }}>
          {labs.map((l, i) => (
            <div key={i} style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 18, padding: 30, display: 'flex', gap: 22, alignItems: 'flex-start' }}>
              <div style={{ minWidth: 54, height: 54, borderRadius: 13, background: l.tint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: NEWS, fontSize: 21, color: l.ink, fontWeight: 500 }}>{l.no}</div>
              <div>
                <div style={{ display: 'inline-block', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.06em', color: l.ink, background: l.tint, padding: '4px 10px', borderRadius: 6, marginBottom: 12 }}>{l.tag}</div>
                <h3 style={{ fontSize: 17.5, fontWeight: 600, color: '#1B1916', lineHeight: 1.4, letterSpacing: '-0.01em' }}>{l.title}</h3>
                <p style={{ fontSize: 14.5, color: '#7A7163', marginTop: 9, lineHeight: 1.6 }}>{l.desc}</p>
                <div style={{ fontSize: 13, color: '#9A8F7D', marginTop: 14, display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ fontFamily: NEWS, color: TERRA }}>◆</span> 산출물 · {l.output}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PREP */}
      <section id="prep" style={{ ...container, padding: '90px 40px 40px' }}>
        <div className="prep-wrap grid-prep" style={{ background: '#F4ECD8', border: '1px solid #E7D9B8', borderRadius: 24, padding: 56, display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 56, alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: NEWS, fontStyle: 'italic', fontSize: 16, color: '#A8732E', marginBottom: 14 }}>Before You Come</div>
            <h2 className="section-h2" style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 34, letterSpacing: '-0.02em', lineHeight: 1.3 }}>교육 전 준비사항</h2>
            <p style={{ fontSize: 15, color: '#6B5B3C', marginTop: 18, lineHeight: 1.7 }}>원활한 실습 진행을 위해 아래 항목을 미리 준비해 주세요. 계정 발급과 기본 설정은 1교시 시작 전에 마칩니다.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {prep.map((p, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 13, padding: '20px 22px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ minWidth: 26, height: 26, borderRadius: '50%', background: NAVY, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontFamily: NEWS }}>{p.no}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1B1916' }}>{p.title}</div>
                  <div style={{ fontSize: 14, color: '#7A7163', marginTop: 4, lineHeight: 1.55 }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INFO */}
      <section id="info" style={{ ...container, padding: '90px 40px 100px' }}>
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
          {infoCards.map((c, i) => (
            <div key={i} style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 18, padding: 32 }}>
              <div style={{ fontFamily: NEWS, fontStyle: 'italic', fontSize: 14, color: TERRA, marginBottom: 18 }}>{c.kicker}</div>
              {c.rows.map((r, j) => (
                <div key={j} style={{ padding: '14px 0', borderTop: '1px solid #F0EADD' }}>
                  <div style={{ fontSize: 13, color: '#9A8F7D', fontWeight: 500 }}>{r.k}</div>
                  <div style={{ fontSize: 15.5, color: '#1B1916', fontWeight: 600, marginTop: 4, lineHeight: 1.5 }}>{r.v}</div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 56 }}>
          {user ? (
            <div style={{ fontSize: 16, color: '#5A5246' }}>
              <span style={{ fontFamily: SERIF, fontWeight: 600, color: NAVY }}>{displayName(user)}</span>님, 환영합니다. 교육 안내를 확인해 주세요.
            </div>
          ) : (
            <button onClick={open} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: TERRA, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 600, padding: '16px 36px', borderRadius: 12 }}>
              구글·카카오로 로그인 <span style={{ fontFamily: NEWS }}>→</span>
            </button>
          )}
        </div>
      </section>
      </>
      )}

      {/* FOOTER */}
      <footer style={{ background: '#1B1916', color: '#A39C90', padding: '48px 0' }}>
        <div style={{ ...container, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: TERRA, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: NEWS, fontStyle: 'italic', fontSize: 16 }}>C</div>
            <span style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 15, color: '#EAE4D8' }}>Claude 기반 연구 업무 활용 &amp; AX 브릿지 교과목 설계</span>
          </div>
          <div style={{ fontSize: 13.5 }}>조선대학교 전임 교원 교육 · 2026. 6. 24 – 25</div>
        </div>
      </footer>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  )
}
