// 강의안제작 — 강의안/루브릭/과제/시험문제 제작 도구 모음(현재는 구성만).
// 상단 드롭다운과 동일한 항목을 왼쪽 사이드 메뉴로도 제공해 접근성을 높였다.
const SERIF = "'Noto Serif KR', serif"
const NEWS = "'Newsreader', serif"
const NAVY = '#1E3A5F'
const TERRA = '#C2603D'
const BORDER = '#E2D9C9'
const container = { maxWidth: 1180, margin: '0 auto', padding: '0 40px' }

export const authoringMenu = [
  { key: 'lecture', title: '강의안 제작', lead: '학습 목표와 차시 구성을 바탕으로 강의안 초안을 만듭니다.' },
  { key: 'rubric', title: '루브릭 제작', lead: '평가 기준·배점·수준별 기술문(루브릭)을 설계합니다.' },
  { key: 'assignment', title: '과제 출제', lead: '학습 목표에 맞춘 과제와 제출 가이드를 구성합니다.' },
  { key: 'exam', title: '시험문제 출제', lead: '난이도별 문항과 정답·해설을 출제합니다.' },
]

export default function AuthoringTools({ sub }) {
  const current = authoringMenu.find((m) => m.key === sub) || authoringMenu[0]

  return (
    <div style={{ ...container, paddingTop: 64, paddingBottom: 100 }}>
      {/* HERO */}
      <header style={{ marginBottom: 36 }}>
        <div style={{ fontFamily: NEWS, fontStyle: 'italic', fontSize: 16, color: TERRA, marginBottom: 10 }}>Authoring · 강의안제작</div>
        <h1 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 34, letterSpacing: '-0.02em', lineHeight: 1.25 }}>
          강의 준비를 돕는 <span style={{ color: TERRA }}>제작 도구</span>
        </h1>
        <p style={{ fontSize: 16, color: '#5A5246', marginTop: 12, lineHeight: 1.7 }}>
          강의안·루브릭·과제·시험문제까지, 수업 설계에 필요한 산출물을 한곳에서 준비합니다.
        </p>
      </header>

      <div className="authoring-layout" style={{ display: 'grid', gridTemplateColumns: '230px 1fr', gap: 40, alignItems: 'start' }}>
        {/* LEFT MENU */}
        <aside style={{ position: 'sticky', top: 86 }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 14, padding: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#9A8F7D', letterSpacing: '0.04em', padding: '8px 12px 6px' }}>제작 메뉴</div>
            {authoringMenu.map((m) => {
              const active = m.key === current.key
              return (
                <a
                  key={m.key}
                  href={`#authoring/${m.key}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 13px', borderRadius: 9, textDecoration: 'none', fontSize: 14.5, fontWeight: active ? 700 : 500, color: active ? '#fff' : '#3C3730', background: active ? NAVY : 'transparent', transition: 'background .15s, color .15s' }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = '#F1ECE1' }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent' }}
                >
                  {m.title}
                </a>
              )
            })}
          </nav>
        </aside>

        {/* CONTENT (구성만 — 스텁) */}
        <section>
          <h2 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 25, color: NAVY, letterSpacing: '-0.01em' }}>{current.title}</h2>
          <p style={{ fontSize: 15.5, color: '#5A5246', marginTop: 10, lineHeight: 1.7 }}>{current.lead}</p>
          <div style={{ marginTop: 24, background: '#fff', border: `1px dashed ${BORDER}`, borderRadius: 16, padding: '48px 32px', textAlign: 'center' }}>
            <div style={{ fontFamily: NEWS, fontSize: 30, color: TERRA, marginBottom: 12 }}>✎</div>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 18, color: NAVY }}>준비 중</div>
            <p style={{ fontSize: 14, color: '#7A7263', marginTop: 8, lineHeight: 1.65 }}>
              「{current.title}」 기능은 곧 제공될 예정입니다.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
