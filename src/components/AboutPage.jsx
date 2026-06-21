// About — DreamIT Biz의 AI 교육 프로그램 소개.
// 콘텐츠 출처: github.com/aebonlee/rest (AI Reboot Academy) 리포지토리 About/README.
const SERIF = "'Noto Serif KR', serif"
const NEWS = "'Newsreader', serif"
const NAVY = '#1E3A5F'
const TERRA = '#C2603D'
const BORDER = '#E2D9C9'
const container = { maxWidth: 1100, margin: '0 auto', padding: '0 40px' }

const curriculum = [
  { course: '선수과정', hours: '20H (4일)', body: 'AI 기초, ChatGPT·Gemini·Solar, 웹 기초' },
  { course: '정규과정 DT', hours: '52H (13일)', body: 'AI 자동화, 프롬프트, 바이브코딩, 프로젝트 구현' },
  { course: '기술코칭', hours: '8H (4회)', body: '1:1·팀 기술 코칭, 코드 리뷰' },
]

const publicPages = [
  ['Home', '과정 개요·핵심 정보·CTA'],
  ['Curriculum', '3단계 커리큘럼 상세(선수·정규·기술코칭)'],
  ['Schedule', '일자별 일정표'],
  ['Competition', 'AI 리부트 경진대회 안내'],
  ['Resources', 'AI 도구·LLM 가이드·참고자료'],
]
const lmsPages = [
  ['Dashboard', '출석·과제·진도 통계, 최근 공지'],
  ['Materials', '학습자료 다운로드(카테고리 필터)'],
  ['Assignments', '과제 목록·제출·채점'],
  ['Teams · Projects', '팀 구성, 개인미니·팀미니·실전 프로젝트'],
  ['Q&A', '질의응답 게시판'],
]
const tech = ['React 19 + Vite 7 + TypeScript', 'Supabase (DB·Auth)', 'Google·Kakao·Email 로그인', 'GitHub Pages 배포']

export default function AboutPage() {
  return (
    <div style={{ ...container, paddingBottom: 100 }}>
      {/* HERO */}
      <header style={{ padding: '72px 0 8px', textAlign: 'center' }}>
        <div style={{ fontFamily: NEWS, fontStyle: 'italic', fontSize: 16, color: TERRA, marginBottom: 12 }}>About · DreamIT Biz AI Education</div>
        <h1 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 42, letterSpacing: '-0.025em', lineHeight: 1.2 }}>
          AI Reboot Academy
        </h1>
        <p style={{ fontSize: 16.5, color: '#5A5246', marginTop: 14, lineHeight: 1.7 }}>쉬었음청년 대상 AI·바이브코딩 교육과정 LMS</p>
        <a href="https://rest.dreamitbiz.com" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 22, background: NAVY, color: '#fff', textDecoration: 'none', fontSize: 14.5, fontWeight: 600, padding: '12px 24px', borderRadius: 11 }}>
          rest.dreamitbiz.com <span style={{ fontFamily: NEWS }}>→</span>
        </a>
      </header>

      {/* OVERVIEW */}
      <section style={{ marginTop: 56, background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 18, padding: '34px 38px' }}>
        <Kicker>Overview</Kicker>
        <p style={{ fontSize: 16, color: '#3D372E', lineHeight: 1.85, marginTop: 12 }}>
          쉬었음청년을 위한 AI 기술과 바이브코딩 교육과정을 운영하는 학습관리시스템(LMS)입니다.
          총 80시간(선수과정 20H + 정규과정 DT 52H + 기술코칭 8H) 교육을 통해 AI 리부트 경진대회 출품을 목표로 합니다.
        </p>
        <p style={{ fontSize: 14.5, color: '#6F665A', lineHeight: 1.7, marginTop: 14 }}>
          본 조선대학교 AI특강을 비롯한 DreamIT Biz의 AI 교육 프로그램은 동일한 설계 철학—실습 중심·단계별 역량 형성·현장 적용—을 공유합니다.
        </p>
      </section>

      {/* CURRICULUM */}
      <section style={{ marginTop: 28 }}>
        <Kicker>Curriculum</Kicker>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {curriculum.map((c, i) => (
            <div key={i} style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 14, padding: '18px 22px', display: 'flex', gap: 20, alignItems: 'baseline', flexWrap: 'wrap' }}>
              <div style={{ minWidth: 110, fontFamily: SERIF, fontWeight: 700, fontSize: 17, color: NAVY }}>{c.course}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: TERRA, background: '#F3E1D5', borderRadius: 999, padding: '4px 12px' }}>{c.hours}</div>
              <div style={{ flex: '1 1 280px', fontSize: 15, color: '#3D372E', lineHeight: 1.6 }}>{c.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ marginTop: 36 }}>
        <Kicker>Features</Kicker>
        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 16 }}>
          <FeatureCard title="공개 페이지" rows={publicPages} />
          <FeatureCard title="학생 LMS · 로그인" rows={lmsPages} accent />
        </div>
        <div style={{ marginTop: 16, background: NAVY, color: '#EAE4D8', borderRadius: 16, padding: '24px 28px' }}>
          <div style={{ fontFamily: NEWS, fontStyle: 'italic', fontSize: 14, color: '#C99A7E', marginBottom: 12 }}>관리자 패널</div>
          <p style={{ fontSize: 14.5, lineHeight: 1.7, color: '#B6BECB' }}>수강생 관리 · 자료 업로드 · 과제 출제/채점 · 출석 관리 · 공지 · 팀 편성 · 프로젝트 관리</p>
        </div>
      </section>

      {/* TECH + ORG */}
      <section style={{ marginTop: 36 }}>
        <Kicker>Tech &amp; Operator</Kicker>
        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 18, marginTop: 16 }}>
          <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 16, padding: '22px 26px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 12, letterSpacing: '0.03em' }}>TECH STACK</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {tech.map((t, i) => (
                <li key={i} style={{ fontSize: 13.5, color: '#3D372E', background: '#F4F6F9', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '7px 12px' }}>{t}</li>
              ))}
            </ul>
          </div>
          <div style={{ background: '#FBF3EC', border: '1px solid #F0DDCB', borderRadius: 16, padding: '22px 26px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TERRA, marginBottom: 12, letterSpacing: '0.03em' }}>운영 · 강사</div>
            <div style={{ fontSize: 15.5, fontWeight: 600, color: '#1B1916' }}>이애본</div>
            <div style={{ fontSize: 14, color: '#5A4636', marginTop: 4, lineHeight: 1.6 }}>한신대학교 AI.SW대학 / DreamIT Biz</div>
            <div style={{ fontSize: 13.5, color: '#7A6A57', marginTop: 8 }}>aebon@hs.ac.kr</div>
          </div>
        </div>
      </section>
    </div>
  )
}

function Kicker({ children }) {
  return <div style={{ fontFamily: NEWS, fontStyle: 'italic', fontSize: 15, color: TERRA }}>{children}</div>
}

function FeatureCard({ title, rows, accent }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 16, padding: '22px 26px' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: accent ? TERRA : NAVY, marginBottom: 14, letterSpacing: '0.03em' }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rows.map(([k, v], i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
            <span style={{ minWidth: 116, fontSize: 13.5, fontWeight: 600, color: '#1B1916' }}>{k}</span>
            <span style={{ fontSize: 13.5, color: '#6F665A', lineHeight: 1.55 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
