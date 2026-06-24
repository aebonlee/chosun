import { useState, useEffect, useRef } from 'react'
import { heroStats, overviewItems, days, prep, infoCards } from './data'
import LoginModal from './components/LoginModal'
import LectureNotes from './components/LectureNotes'
import LabModules from './components/LabModules'
import AppendixCases from './components/AppendixCases'
import AboutPage from './components/AboutPage'
import Resources from './components/Resources'
import RecommendSites from './components/RecommendSites'
import AuthoringTools from './components/AuthoringTools'
import { lectureDays } from './lectureNotes'
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
  const [openMenu, setOpenMenu] = useState(null) // 'prompt' | 'day1' | 'day2' | null
  const { user, signOut } = useAuth()
  const open = () => setShowLogin(true)

  useEffect(() => {
    const onHash = () => { setHash(window.location.hash); setOpenMenu(null) }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const route = hash.replace(/^#/, '').split('/')[0]
  const lectureSub = route === 'lecture' ? (hash.split('/')[1] || 'intro') : null
  const authoringSub = route === 'authoring' ? (hash.split('/')[1] || 'lecture') : null
  const PromptView = PROMPT_VIEWS[route]
  const view = route === 'about' ? 'about' : route === 'resources' ? 'resources' : route === 'lecture' ? 'lecture' : route === 'labs' ? 'labs' : route === 'cases' ? 'cases' : route === 'recommend' ? 'recommend' : route === 'authoring' ? 'authoring' : PromptView ? 'prompt' : 'home'
  const goRoute = (r) => (e) => { e.preventDefault(); setOpenMenu(null); window.location.hash = '#' + r; window.scrollTo({ top: 0 }) }
  const goLectureItem = (id) => (e) => { e.preventDefault(); setOpenMenu(null); window.location.hash = '#lecture/' + id; window.scrollTo({ top: 0 }) }

  const day1Ids = new Set(['intro', ...lectureDays[0].sessions.map((s) => s.id)])
  const promptItems = [
    { key: 'prompt-guide', title: '프롬프트 가이드', active: route === 'prompt-guide', onClick: goRoute('prompt-guide') },
    { key: 'prompt-practice', title: '프롬프트 연습장', active: route === 'prompt-practice', onClick: goRoute('prompt-practice') },
    { key: 'prompt-gallery', title: '프롬프트 갤러리', active: route === 'prompt-gallery', onClick: goRoute('prompt-gallery') },
    { key: 'prompt-eval', title: '프롬프트 평가', active: route === 'prompt-eval', onClick: goRoute('prompt-eval') },
  ]
  const goHome = (e) => { e.preventDefault(); window.location.hash = ''; window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const goSection = (id) => (e) => {
    e.preventDefault()
    window.location.hash = ''
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 60)
  }

  return (
    <div style={{ background: '#F6F2EA', color: '#1B1916', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(246,242,234,0.86)', backdropFilter: 'blur(10px)', borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ ...container, height: 66, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="#" onClick={goHome} style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'inherit' }}>
            <div style={{ width: 30, height: 30, borderRadius: 7, background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: NEWS, fontSize: 17, fontStyle: 'italic' }}>C</div>
            <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 16, letterSpacing: '-0.01em' }}>조선대학교 AI특강</span>
          </a>
          <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <a href="#about" onClick={goRoute('about')} style={{ color: route === 'about' ? NAVY : '#5A5246', textDecoration: 'none', fontSize: 14, fontWeight: route === 'about' ? 700 : 500 }}>About</a>
            <a href="#curriculum" onClick={goSection('curriculum')} style={{ color: '#5A5246', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>커리큘럼</a>
            <a href="#labs" onClick={goRoute('labs')} style={{ color: route === 'labs' ? NAVY : '#5A5246', textDecoration: 'none', fontSize: 14, fontWeight: route === 'labs' ? 700 : 500 }}>실습 모듈</a>
            <a href="#cases" onClick={goRoute('cases')} style={{ color: route === 'cases' ? NAVY : '#5A5246', textDecoration: 'none', fontSize: 14, fontWeight: route === 'cases' ? 700 : 500, whiteSpace: 'nowrap' }}>활용 사례집</a>

            <NavMenu id="prompt" label="프롬프트" active={['prompt-guide', 'prompt-practice', 'prompt-gallery', 'prompt-eval'].includes(route)} openMenu={openMenu} setOpenMenu={setOpenMenu} items={promptItems} />

            <a href="#resources" onClick={goRoute('resources')} style={{ color: route === 'resources' ? NAVY : '#5A5246', textDecoration: 'none', fontSize: 14, fontWeight: route === 'resources' ? 700 : 500, whiteSpace: 'nowrap' }}>교육공학자료</a>
            {(() => {
              const day1Active = view === 'lecture' && day1Ids.has(lectureSub)
              const day2Active = view === 'lecture' && lectureSub && !day1Ids.has(lectureSub)
              const dayBtn = (active) => ({
                display: 'inline-flex', alignItems: 'center', textDecoration: 'none', whiteSpace: 'nowrap',
                fontSize: 13.5, fontWeight: 700, letterSpacing: '0.01em', padding: '6px 15px', borderRadius: 999,
                border: `1.5px solid ${NAVY}`, color: active ? '#fff' : NAVY, background: active ? NAVY : 'transparent',
                transition: 'background .15s, color .15s',
              })
              const onEnter = (active) => (e) => { if (!active) { e.currentTarget.style.background = NAVY; e.currentTarget.style.color = '#fff' } }
              const onLeave = (active) => (e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = NAVY } }
              return (
                <>
                  <a href="#lecture/d1-s1" onClick={goLectureItem('d1-s1')} style={dayBtn(day1Active)} onMouseEnter={onEnter(day1Active)} onMouseLeave={onLeave(day1Active)}>Day 1</a>
                  <a href="#lecture/d2-s1" onClick={goLectureItem('d2-s1')} style={dayBtn(day2Active)} onMouseEnter={onEnter(day2Active)} onMouseLeave={onLeave(day2Active)}>Day 2</a>
                </>
              )
            })()}

            <a href="#authoring/lecture" onClick={goRoute('authoring/lecture')} style={{ color: route === 'authoring' ? NAVY : '#5A5246', textDecoration: 'none', fontSize: 14, fontWeight: route === 'authoring' ? 700 : 500, whiteSpace: 'nowrap' }}>강의안제작</a>

            <a href="#recommend" onClick={goRoute('recommend')} style={{ color: route === 'recommend' ? NAVY : '#5A5246', textDecoration: 'none', fontSize: 14, fontWeight: route === 'recommend' ? 700 : 500, whiteSpace: 'nowrap' }}>추천사이트</a>

            {user ? (
              <UserMenu user={user} signOut={signOut} />
            ) : (
              <button onClick={open} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: NAVY, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 600, padding: '9px 18px', borderRadius: 999 }}>로그인</button>
            )}
          </div>
        </div>
      </nav>

      {view === 'about' ? (
        <AboutPage />
      ) : view === 'resources' ? (
        <Resources />
      ) : view === 'lecture' ? (
        <LectureNotes user={user} onRequestLogin={open} />
      ) : view === 'labs' ? (
        <LabModules />
      ) : view === 'cases' ? (
        <AppendixCases />
      ) : view === 'recommend' ? (
        <RecommendSites />
      ) : view === 'authoring' ? (
        <AuthoringTools sub={authoringSub} />
      ) : view === 'prompt' ? (
        <PromptView />
      ) : (
      <>
      {/* HERO */}
      <header style={{ ...container, maxWidth: 1320, padding: '84px 40px 72px', position: 'relative' }}>
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
        <h1 className="hero-h1" style={{ position: 'relative', zIndex: 1, fontFamily: SERIF, fontWeight: 700, fontSize: 62, lineHeight: 1.14, letterSpacing: '-0.025em', maxWidth: 1180, marginBottom: 26 }}>
          Claude 기반<br /><span style={{ color: TERRA }}>연구 업무 활용</span> &amp;<br />AX 브릿지 교과목 설계
        </h1>
        <p style={{ fontSize: 19, lineHeight: 1.6, color: '#5A5246', maxWidth: 860, marginBottom: 42 }}>
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

      {/* PREP */}
      <section id="prep" style={{ ...container, padding: '90px 40px 40px' }}>
        <div className="prep-wrap" style={{ background: '#F4ECD8', border: '1px solid #E7D9B8', borderRadius: 24, padding: '48px 52px' }}>
          <div style={{ marginBottom: 30 }}>
            <div style={{ fontFamily: NEWS, fontStyle: 'italic', fontSize: 16, color: '#A8732E', marginBottom: 14 }}>Before You Come</div>
            <h2 className="section-h2" style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 34, letterSpacing: '-0.02em', lineHeight: 1.3 }}>교육 전 준비사항</h2>
            <p style={{ fontSize: 15, color: '#6B5B3C', marginTop: 16, lineHeight: 1.7, maxWidth: 680 }}>원활한 실습 진행을 위해 아래 항목을 미리 준비해 주세요. 계정 발급과 기본 설정은 1교시 시작 전에 마칩니다.</p>
          </div>
          <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
            {prep.map((p, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 13, padding: '20px 22px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ minWidth: 26, height: 26, borderRadius: '50%', background: NAVY, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontFamily: NEWS, flexShrink: 0 }}>{p.no}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1B1916' }}>{p.title}</div>
                  <div style={{ fontSize: 14, color: '#7A7163', marginTop: 4, lineHeight: 1.55 }}>{p.desc}</div>
                  {p.detail && <div style={{ fontSize: 13.5, color: '#6B5B3C', marginTop: 10, lineHeight: 1.65 }}>{p.detail}</div>}
                  {p.checklist && (
                    <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {p.checklist.map((c, j) => (
                        <li key={j} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', fontSize: 13.5, color: '#5A5246', lineHeight: 1.5 }}>
                          <span style={{ color: '#A8732E', flexShrink: 0, fontWeight: 700 }}>✓</span>{c}
                        </li>
                      ))}
                    </ul>
                  )}
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
      <footer style={{ marginTop: 'auto', background: '#1B1916', color: '#A39C90', padding: '48px 0' }}>
        <div style={{ ...container, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: TERRA, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: NEWS, fontStyle: 'italic', fontSize: 16 }}>C</div>
            <span style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 15, color: '#EAE4D8' }}>Claude 기반 연구 업무 활용 &amp; AX 브릿지 교과목 설계</span>
          </div>
          <div style={{ fontSize: 13.5 }}>조선대학교 전임 교원 교육 · 2026. 6. 24 – 25</div>
        </div>
        <div style={{ ...container, marginTop: 28, paddingTop: 22, borderTop: '1px solid #2E2A24', textAlign: 'center' }}>
          <div style={{ fontSize: 13, lineHeight: 1.9, color: '#9A938A' }}>
            대표 : 이애본(Ph.D) <span style={{ color: '#4A453E' }}>|</span> 한신대학교 AI·SW대학 겸임교수 <span style={{ color: '#4A453E' }}>|</span> 사업자등록번호 : 601-45-20154 <span style={{ color: '#4A453E' }}>|</span> 통신판매신고번호 : 제2024-수원팔달-0584호 <span style={{ color: '#4A453E' }}>|</span> 출판사 신고번호 : 제2026-000026호
          </div>
          <div style={{ marginTop: 10, fontSize: 12.5, color: '#7A746B' }}>
            &copy; 2025 드림아이티비즈(DreamIT Biz). All rights reserved.
          </div>
        </div>
      </footer>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  )
}

// 상단 nav 드롭다운 (프롬프트 / Day1 / Day2 공용)
function NavMenu({ id, label, active, openMenu, setOpenMenu, items }) {
  const ref = useRef(null)
  const isOpen = openMenu === id
  useEffect(() => {
    if (!isOpen) return
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpenMenu(null) }
    const onKey = (e) => { if (e.key === 'Escape') setOpenMenu(null) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [isOpen, setOpenMenu])

  return (
    <div ref={ref} style={{ position: 'relative' }} onMouseEnter={() => setOpenMenu(id)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setOpenMenu(isOpen ? null : id)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '6px 0', whiteSpace: 'nowrap', color: active ? NAVY : '#5A5246', fontSize: 14, fontWeight: active ? 700 : 500 }}
      >
        {label} <span style={{ fontSize: 10, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}>▾</span>
      </button>
      {isOpen && (
        <div role="menu" style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', paddingTop: 10, zIndex: 60 }}>
          <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12, boxShadow: '0 16px 40px rgba(27,25,22,0.16)', padding: 6, width: 'max-content', minWidth: 150, maxWidth: 300 }}>
            {items.map((it) => (
              <a
                key={it.key}
                href={it.href || '#'}
                role="menuitem"
                target={it.href ? '_blank' : undefined}
                rel={it.href ? 'noopener noreferrer' : undefined}
                onClick={it.href ? () => setOpenMenu(null) : it.onClick}
                style={{ display: 'flex', gap: 10, alignItems: 'baseline', padding: '10px 14px', borderRadius: 9, textDecoration: 'none', fontSize: 14, fontWeight: it.active ? 700 : 500, color: it.active ? NAVY : '#3C3730', background: it.active ? '#F1ECE1' : 'transparent' }}
                onMouseEnter={(e) => { if (!it.active) e.currentTarget.style.background = '#F6F2EA' }}
                onMouseLeave={(e) => { if (!it.active) e.currentTarget.style.background = 'transparent' }}
              >
                {it.meta && <span style={{ fontFamily: NEWS, fontSize: 12.5, color: '#9A8F7D', flexShrink: 0, minWidth: 78 }}>{it.meta}</span>}
                <span style={{ lineHeight: 1.4, whiteSpace: 'nowrap' }}>{it.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// 로그인 후 상단 우측 동그라미 아바타 + 드롭다운(이름·이메일·로그아웃)
function UserMenu({ user, signOut }) {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [open])
  const name = displayName(user) || '회원'
  const initial = name.trim().charAt(0).toUpperCase()
  return (
    <div ref={ref} style={{ position: 'relative', display: 'flex' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        title={`${name}님`}
        style={{ width: 36, height: 36, borderRadius: '50%', background: NAVY, color: '#fff', border: 'none', cursor: 'pointer', fontFamily: SERIF, fontWeight: 700, fontSize: 15, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0, lineHeight: 1 }}
      >
        {initial}
      </button>
      {open && (
        <div role="menu" style={{ position: 'absolute', top: '100%', right: 0, paddingTop: 10, zIndex: 60 }}>
          <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12, boxShadow: '0 16px 40px rgba(27,25,22,0.16)', padding: 8, minWidth: 170 }}>
            <div style={{ padding: '8px 12px 10px', borderBottom: `1px solid ${BORDER}`, marginBottom: 6 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>{name}님</div>
              {user?.email && <div style={{ fontSize: 12, color: '#9A8F7D', marginTop: 2, wordBreak: 'break-all' }}>{user.email}</div>}
            </div>
            <button
              onClick={() => { setOpen(false); signOut() }}
              style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 600, color: '#5A5246', padding: '9px 12px', borderRadius: 8 }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#F6F2EA' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              로그아웃
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
