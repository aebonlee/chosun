// 실습:따라하기 — 강의 관련 5종 + 논문 작성 5종을 좌측 그룹 메뉴(흰 박스)로 제공.
// 좌측 메뉴는 로고 아래(콘텐츠 상단)에서 시작하며 스크롤 시 고정된다.
import MajorChatBot from './MajorChatBot'
import SyllabusPractice from './SyllabusPractice'
import RubricPractice from './RubricPractice'
import AssignmentPractice from './AssignmentPractice'
import ExamPractice from './ExamPractice'
import PracticeGuide from './PracticeGuide'
import { paperGuides } from './paperGuides'

const SERIF = "'Noto Serif KR', serif"
const NEWS = "'Newsreader', serif"
const NAVY = '#1E3A5F'
const TERRA = '#C2603D'
const BORDER = '#E2D9C9'
const container = { maxWidth: 1180, margin: '0 auto', padding: '0 40px' }

// 좌측 메뉴 그룹 (각 그룹 = 흰 박스 하나)
const MENU_GROUPS = [
  {
    no: '1', title: '강의 관련',
    items: [
      { key: 'lecture', title: '강의계획서 제작' },
      { key: 'rubric', title: '루브릭 제작' },
      { key: 'assignment', title: '과제 출제' },
      { key: 'exam', title: '시험문제 출제' },
      { key: 'chatbot', title: '전공 챗봇' },
    ],
  },
  {
    no: '2', title: '논문 작성',
    items: [
      { key: 'paper-search', title: '논문 검색하기' },
      { key: 'paper-collect', title: '논문 자료 수집하기' },
      { key: 'paper-write', title: '논문 작성하기' },
      { key: 'paper-review', title: '논문 검토하기' },
      { key: 'paper-eval', title: '논문 평가하기' },
    ],
  },
]
const ALL_ITEMS = MENU_GROUPS.flatMap((g) => g.items)

export default function AuthoringTools({ sub, user, onRequestLogin }) {
  const current = ALL_ITEMS.find((m) => m.key === sub) || ALL_ITEMS[0]

  const renderContent = () => {
    switch (current.key) {
      case 'chatbot': return <MajorChatBot user={user} onRequestLogin={onRequestLogin} />
      case 'lecture': return <SyllabusPractice />
      case 'rubric': return <RubricPractice />
      case 'assignment': return <AssignmentPractice />
      case 'exam': return <ExamPractice />
      default:
        if (paperGuides[current.key]) return <PracticeGuide {...paperGuides[current.key]} />
        return null
    }
  }

  return (
    <div style={{ ...container, paddingTop: 28, paddingBottom: 100 }}>
      <div className="authoring-layout" style={{ display: 'grid', gridTemplateColumns: '230px 1fr', gap: 40, alignItems: 'start' }}>
        {/* LEFT MENU — 타이틀 + 그룹별 흰 박스, 콘텐츠 상단에서 시작 / 스크롤 시 고정 */}
        <aside style={{ position: 'sticky', top: 84, alignSelf: 'start' }}>
          <div style={{ fontFamily: NEWS, fontStyle: 'italic', fontSize: 14, color: TERRA, marginBottom: 4, paddingLeft: 2 }}>Hands-on</div>
          <h2 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 22, color: NAVY, letterSpacing: '-0.01em', marginBottom: 14, paddingLeft: 2 }}>AI 워크숍</h2>

          {MENU_GROUPS.map((g) => (
            <div key={g.no} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#7A7263', margin: '0 0 7px 4px' }}>
                <span style={{ color: TERRA }}>{g.no}.</span> {g.title}
              </div>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 14, padding: 8 }}>
                {g.items.map((m) => {
                  const active = m.key === current.key
                  return (
                    <a
                      key={m.key}
                      href={`#authoring/${m.key}`}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 13px', borderRadius: 9, textDecoration: 'none', fontSize: 14, fontWeight: active ? 700 : 500, color: active ? '#fff' : '#3C3730', background: active ? NAVY : 'transparent', transition: 'background .15s, color .15s' }}
                      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = '#F1ECE1' }}
                      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent' }}
                    >
                      {m.title}
                    </a>
                  )
                })}
              </nav>
            </div>
          ))}

          {/* 실습결과 패들렛 (새 탭) */}
          <a
            href="https://padlet.com/aebon/chosun2606"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 12, textDecoration: 'none', background: '#FB6B9D', color: '#fff', fontSize: 14, fontWeight: 700, boxShadow: '0 8px 20px rgba(251,107,157,0.35)' }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
              <rect x="3" y="3" width="18" height="18" rx="4.5" fill="#fff" />
              <rect x="6" y="6" width="5" height="5" rx="1.3" fill="#FB6B9D" />
              <rect x="13" y="6" width="5" height="5" rx="1.3" fill="#FB6B9D" />
              <rect x="6" y="13" width="5" height="5" rx="1.3" fill="#FB6B9D" />
              <rect x="13" y="13" width="5" height="5" rx="1.3" fill="#FB6B9D" />
            </svg>
            실습결과 패들렛
          </a>
        </aside>

        {/* CONTENT — 좌측 메뉴와 동일한 상단 지점에서 시작 */}
        <section>{renderContent()}</section>
      </div>
    </div>
  )
}
