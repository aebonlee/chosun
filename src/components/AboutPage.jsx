// About — 조선대학교 AI특강 소개 페이지.
// 구성은 github.com/aebonlee/rest(About/README) 형식을 참고하되, 콘텐츠는 본 과정(조선대)에 맞춤.
import { heroStats, overviewItems, days } from '../data'

const SERIF = "'Noto Serif KR', serif"
const NEWS = "'Newsreader', serif"
const NAVY = '#1E3A5F'
const TERRA = '#C2603D'
const BORDER = '#E2D9C9'
const container = { maxWidth: 1100, margin: '0 auto', padding: '0 40px' }

const structure = [
  ['Day 1·2 강의안', '교시별 학습목표·개념 심화·라이브 데모·실습 랩·기술 노트(로그인)'],
  ['실습 모듈', '단계별 실습 과제와 진행 가이드'],
  ['활용 사례집', '단과대학·분야·업무별 복사용 프롬프트와 예상 산출물'],
  ['프롬프트 도구', '가이드·연습장·갤러리·평가'],
]

const bizAreas = [
  ['생성형 AI 교육', '대학·공공기관 맞춤형 AI 활용 교육과정 설계·운영'],
  ['LMS·교육 플랫폼 개발', '학습관리시스템(LMS)과 교육 웹사이트 자체 구축'],
  ['프롬프트·바이브코딩', '실무 중심 커리큘럼과 실습 콘텐츠 제작'],
  ['LLM 활용 컨설팅', 'Claude 등 생성형 AI의 연구·업무·강의 적용 자문'],
]

export default function AboutPage() {
  return (
    <div style={{ ...container, paddingBottom: 100 }}>
      {/* HERO */}
      <header style={{ padding: '72px 0 8px', textAlign: 'center' }}>
        <div style={{ fontFamily: NEWS, fontStyle: 'italic', fontSize: 16, color: TERRA, marginBottom: 12 }}>About · 조선대학교 전임 교원 AI특강</div>
        <h1 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 40, letterSpacing: '-0.025em', lineHeight: 1.22 }}>
          Claude 기반 <span style={{ color: TERRA }}>연구 업무 활용</span> &amp;<br />AX 브릿지 교과목 설계
        </h1>
        <p style={{ fontSize: 16.5, color: '#5A5246', marginTop: 16, lineHeight: 1.7 }}>
          조선대학교 전임 교원을 위한 2일·14시간 실습 중심 생성형 AI 과정
        </p>
        <div className="stats-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0, marginTop: 36, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
          {heroStats.map((s, i) => (
            <div key={i} style={{ padding: '24px 14px', textAlign: 'center', borderRight: i < heroStats.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
              <div style={{ fontFamily: NEWS, fontSize: 32, fontWeight: 500, color: NAVY, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#7A7163', marginTop: 8 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </header>

      {/* OVERVIEW */}
      <section style={{ marginTop: 48, background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 18, padding: '34px 38px' }}>
        <Kicker>Overview</Kicker>
        <p style={{ fontSize: 16, color: '#3D372E', lineHeight: 1.85, marginTop: 12 }}>
          <Lines text="본 과정은 전공을 막론하고 모든 전임 교원이 생성형 AI(Claude)를 연구와 강의에 곧바로 적용할 수 있도록 설계한 실습 중심 교육입니다. Day 1에서는 논문 리뷰·학술 글쓰기·데이터 분석·제안서 작성 등 연구 업무 전반을, Day 2에서는 교과목에 AI를 접목하는 교수 설계 전 과정을 다룹니다." />
        </p>
        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 22 }}>
          {overviewItems.map((o, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'baseline', padding: '12px 0', borderTop: '1px solid #F0EADD' }}>
              <span style={{ fontFamily: NEWS, fontSize: 13, color: TERRA, minWidth: 22 }}>{o.no}</span>
              <span style={{ minWidth: 78, fontSize: 13.5, fontWeight: 600, color: '#1B1916' }}>{o.label}</span>
              <span style={{ fontSize: 14, color: '#5A5246', lineHeight: 1.55 }}>{o.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CURRICULUM */}
      <section style={{ marginTop: 28 }}>
        <Kicker>Curriculum</Kicker>
        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 16 }}>
          {days.map((d, i) => (
            <div key={i} style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', background: d.headBg, borderBottom: '1px solid #EDE5D7' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: NEWS, fontStyle: 'italic', fontSize: 14, color: d.accent }}>{d.day}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: d.accent, background: d.chipBg, padding: '4px 11px', borderRadius: 999 }}>{d.date}</span>
                </div>
                <h3 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 20, letterSpacing: '-0.02em', marginTop: 10, color: '#1B1916' }}>{d.title}</h3>
              </div>
              <ul style={{ listStyle: 'none', padding: '14px 24px 20px', margin: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
                {d.sessions.map((se, j) => (
                  <li key={j} style={{ display: 'flex', gap: 12, fontSize: 13.5, color: '#3D372E', lineHeight: 1.5 }}>
                    <span style={{ fontFamily: NEWS, fontSize: 12.5, color: '#9A8F7D', minWidth: 78 }}>{se.time}</span>
                    <span>{se.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* STRUCTURE */}
      <section style={{ marginTop: 36 }}>
        <Kicker>학습 구성</Kicker>
        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 16 }}>
          {structure.map(([k, v], i) => (
            <div key={i} style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 14, padding: '18px 22px' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>{k}</div>
              <div style={{ fontSize: 14, color: '#6F665A', marginTop: 6, lineHeight: 1.6 }}>{v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COMPANY */}
      <section style={{ marginTop: 36 }}>
        <Kicker>운영사 소개 · DreamIT Biz</Kicker>
        <div style={{ marginTop: 16, background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 18, padding: '30px 34px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: NEWS, fontStyle: 'italic', fontSize: 22 }}>D</div>
            <div>
              <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 22, letterSpacing: '-0.01em' }}>드림아이티비즈 <span style={{ fontSize: 14, fontWeight: 500, color: '#9A8F7D' }}>DreamIT Biz</span></div>
              <div style={{ fontSize: 13.5, color: TERRA, fontWeight: 600, marginTop: 2 }}>생성형 AI 교육 · 학습 플랫폼(LMS) 개발 전문</div>
            </div>
          </div>
          <p style={{ fontSize: 15, color: '#3D372E', lineHeight: 1.85, marginTop: 18 }}>
            <Lines text="드림아이티비즈는 생성형 AI 교육과 학습관리시스템(LMS) 개발을 전문으로 하는 기업입니다. 전공과 직무를 막론하고 누구나 AI를 실제 연구·업무·강의에 적용할 수 있도록 실습 중심 교육을 설계·운영하며, 교육에 필요한 학습 플랫폼과 웹사이트를 직접 구축합니다. 대학 교원 연수부터 청년·재직자 대상 과정까지 다양한 기관과 협력해 왔으며, 본 조선대학교 AI특강 또한 드림아이티비즈가 설계·운영합니다." />
          </p>
          <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 20 }}>
            {bizAreas.map(([k, v], i) => (
              <div key={i} style={{ background: '#F4F6F9', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 18px' }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: NAVY }}>{k}</div>
                <div style={{ fontSize: 13.5, color: '#6F665A', marginTop: 5, lineHeight: 1.55 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 18, fontSize: 13.5, color: '#7A6A57' }}>
            웹 · <a href="https://dreamitbiz.com" target="_blank" rel="noreferrer" style={{ color: NAVY, fontWeight: 600 }}>dreamitbiz.com</a>
          </div>
        </div>
      </section>

      {/* INSTRUCTOR */}
      <section style={{ marginTop: 28 }}>
        <Kicker>담당 강사 소개</Kicker>
        <div style={{ marginTop: 16, background: NAVY, color: '#EAE4D8', borderRadius: 18, padding: '32px 36px', display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flexShrink: 0, width: 84, height: 84, borderRadius: 20, background: TERRA, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: SERIF, fontWeight: 700, fontSize: 34 }}>이</div>
          <div style={{ minWidth: 0, flex: '1 1 360px' }}>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 24, color: '#fff' }}><span style={{ fontFamily: NEWS, fontStyle: 'italic', color: '#C99A7E', marginRight: 6 }}>Ph.D.</span>이애본 <span style={{ fontSize: 15, fontWeight: 500, color: '#C99A7E' }}>대표 · 담당 강사</span></div>
            <div style={{ fontSize: 14.5, color: '#B6BECB', marginTop: 6 }}>드림아이티비즈(DreamIT Biz) 대표 · 한신대학교 AI.SW대학</div>
            <p style={{ fontSize: 14.5, color: '#CDD4DE', lineHeight: 1.8, marginTop: 14 }}>
              <Lines text="생성형 AI 교육과 학습 플랫폼 개발을 이끌며, 대학·공공기관을 대상으로 AI 활용·바이브코딩 교육을 다수 설계·운영해 왔습니다. 연구 업무 자동화부터 교과목 AI 접목 설계까지, 전공과 무관하게 현장에 바로 적용할 수 있는 실습 중심 교육을 지향합니다. 본 조선대학교 AI특강의 커리큘럼 설계와 강의를 직접 맡고 있습니다." />
            </p>
            <div style={{ fontSize: 13.5, color: '#9FA8B6', marginTop: 12 }}>문의 · aebon@hs.ac.kr</div>
          </div>
        </div>
      </section>
    </div>
  )
}

function Kicker({ children }) {
  return <div style={{ fontFamily: NEWS, fontStyle: 'italic', fontSize: 15, color: TERRA }}>{children}</div>
}

// 마침표(.) 기준 문장별 줄바꿈. 숫자 뒤 마침표는 보호.
function Lines({ text }) {
  const parts = String(text).split(/(?<=[^\d]\.)\s+/).filter(Boolean)
  return parts.map((s, i) => <span key={i} style={{ display: 'block' }}>{s}</span>)
}
