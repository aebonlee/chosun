// 강의안제작 — 강의안/루브릭/과제/시험문제 제작 + 전공 챗봇.
// 좌측 메뉴는 로고 아래(콘텐츠 상단)에서 시작하며, 마지막 항목은 전공학과별 AI 챗봇.
import MajorChatBot from './MajorChatBot'
import SyllabusPractice from './SyllabusPractice'
import RubricPractice from './RubricPractice'

const SERIF = "'Noto Serif KR', serif"
const NEWS = "'Newsreader', serif"
const NAVY = '#1E3A5F'
const TERRA = '#C2603D'
const BORDER = '#E2D9C9'
const container = { maxWidth: 1180, margin: '0 auto', padding: '0 40px' }

export const authoringMenu = [
  { key: 'lecture', title: '강의계획서 제작', lead: 'Claude 웹에서 단계별 프롬프트로 한 학기 강의계획서를 만듭니다.' },
  { key: 'rubric', title: '루브릭 제작', lead: '평가 기준·배점·수준별 기술문(루브릭)을 설계합니다.' },
  { key: 'assignment', title: '과제 출제', lead: '학습 목표에 맞춘 과제와 제출 가이드를 구성합니다.' },
  { key: 'exam', title: '시험문제 출제', lead: '난이도별 문항과 정답·해설을 출제합니다.' },
  { key: 'chatbot', title: '전공 챗봇', lead: '전공학과별 AI 챗봇 (OpenAI·Claude 키 선택 입력).' },
]

function Stub({ current }) {
  return (
    <div>
      <h2 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 25, color: NAVY, letterSpacing: '-0.01em' }}>{current.title}</h2>
      <p style={{ fontSize: 15.5, color: '#5A5246', marginTop: 10, lineHeight: 1.7 }}>{current.lead}</p>
      <div style={{ marginTop: 24, background: '#fff', border: `1px dashed ${BORDER}`, borderRadius: 16, padding: '48px 32px', textAlign: 'center' }}>
        <div style={{ fontFamily: NEWS, fontSize: 30, color: TERRA, marginBottom: 12 }}>✎</div>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 18, color: NAVY }}>준비 중</div>
        <p style={{ fontSize: 14, color: '#7A7263', marginTop: 8, lineHeight: 1.65 }}>
          「{current.title}」 기능은 곧 제공될 예정입니다.
        </p>
      </div>
    </div>
  )
}

export default function AuthoringTools({ sub, user, onRequestLogin }) {
  const current = authoringMenu.find((m) => m.key === sub) || authoringMenu[0]

  return (
    <div style={{ ...container, paddingTop: 28, paddingBottom: 100 }}>
      <div className="authoring-layout" style={{ display: 'grid', gridTemplateColumns: '230px 1fr', gap: 40, alignItems: 'start' }}>
        {/* LEFT MENU — 타이틀 + 메뉴, 콘텐츠 상단(로고 아래)에서 시작 / 스크롤 시 고정 */}
        <aside style={{ position: 'sticky', top: 84, alignSelf: 'start' }}>
          <div style={{ fontFamily: NEWS, fontStyle: 'italic', fontSize: 14, color: TERRA, marginBottom: 4, paddingLeft: 2 }}>Hands-on</div>
          <h2 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 22, color: NAVY, letterSpacing: '-0.01em', marginBottom: 16, paddingLeft: 2 }}>실습:따라하기</h2>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 14, padding: 8 }}>
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

        {/* CONTENT — 좌측 메뉴와 동일한 상단 지점에서 시작 */}
        <section>
          {current.key === 'chatbot'
            ? <MajorChatBot user={user} onRequestLogin={onRequestLogin} />
            : current.key === 'lecture'
            ? <SyllabusPractice />
            : current.key === 'rubric'
            ? <RubricPractice />
            : <Stub current={current} />}
        </section>
      </div>
    </div>
  )
}
