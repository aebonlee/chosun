// 추천사이트 — DreamIT Biz가 구축·운영하는 교육 사이트 모음.
// 새 사이트는 아래 siteGroups 배열에 한 줄씩 추가하면 카드로 자동 노출된다.
const SERIF = "'Noto Serif KR', serif"
const NEWS = "'Newsreader', serif"
const NAVY = '#1E3A5F'
const TERRA = '#C2603D'
const BORDER = '#E2D9C9'
const container = { maxWidth: 1100, margin: '0 auto', padding: '0 40px' }

// 카테고리별 사이트 목록 — 항목 추가 시 { name, desc, url, tags } 한 줄만 넣으면 된다.
const siteGroups = [
  {
    category: '대학 사례',
    note: '대학·전공 맞춤형으로 구축한 교육 플랫폼',
    sites: [
      {
        name: '한국기술교육대학교',
        desc: '컴퓨팅 사고(CT)와 Python 기초를 브라우저에서 바로 실행하며 배우는 교육 플랫폼.',
        url: 'https://koreatech.dreamitbiz.com',
        tags: ['컴퓨팅사고', 'Python', '실습'],
      },
      {
        name: 'AI·SW 개론',
        desc: 'SW·DS·AIoT·AI·XR·HMI 분야를 탐색하는 컴퓨터과학 기초 입문 과정.',
        url: 'https://aisw.dreamitbiz.com',
        tags: ['AI', 'SW 개론', '분야 탐색'],
      },
      {
        name: '서울과학기술대학교',
        desc: '전체 교수 대상 생성형 AI 활용 강의 — SeoulTech AI Lecture.',
        url: 'https://seoultech.dreamitbiz.com',
        tags: ['생성형 AI', '교수 대상', 'Auth'],
      },
      {
        name: '한라대학교',
        desc: '2026 하계 방학특강 — AI기초·바이브코딩·생성형AI 3개 과정.',
        url: 'https://halla.dreamitbiz.com',
        tags: ['하계 특강', '바이브코딩', 'Auth'],
      },
      {
        name: '서울대학교',
        desc: '하계 계절학기 PBL LMS — 제주 생태포럼 해커톤 연계 15차시 과정.',
        url: 'https://snu.dreamitbiz.com',
        tags: ['PBL', '계절학기', 'Auth'],
      },
      {
        name: '삼육대학교',
        desc: '생성형 AI 실무 역량 강화 특강 — 과정별 학습자료·로그인(9/14·15·21·22).',
        url: 'https://syu.dreamitbiz.com',
        tags: ['생성형 AI', '실무 특강', 'Auth'],
      },
    ],
  },
  {
    category: '논문작성 관련',
    note: '연구 설계부터 통계 분석·발표까지 논문 작성 전 과정 지원',
    sites: [
      {
        name: '논문 작성 자료 보드',
        desc: '논문 작성에 필요한 참고 자료·템플릿·사례를 한곳에 모은 패들렛 보드(paper25).',
        url: 'https://padlet.com/aebon/paper25',
        tags: ['Padlet', '자료 모음', '논문'],
      },
      {
        name: 'DreamIT Research · 조사방법론',
        desc: '연구설계·표본추출·측정·설문조사·실험연구·질적연구·연구윤리까지 사회과학 조사방법론 학습.',
        url: 'https://research.dreamitbiz.com',
        tags: ['조사방법론', '연구설계', '연구윤리'],
      },
      {
        name: 'DreamIT Statistics · 통계학',
        desc: '기술통계·확률론·추론통계·가설검정·회귀분석·분산분석·베이지안까지 체계적으로 학습.',
        url: 'https://statistics.dreamitbiz.com',
        tags: ['통계학', '가설검정', '회귀분석'],
      },
      {
        name: 'DreamIT 프레젠테이션',
        desc: 'PPT·스피치·시각디자인·스토리텔링과 미리캔버스·캔바·파워포인트 등 발표 도구 활용법.',
        url: 'https://presentation.dreamitbiz.com',
        tags: ['발표', '시각자료', '스토리텔링'],
      },
      {
        name: 'AI Literacy · AI 리터러시',
        desc: 'AI 기초·활용·윤리·미래를 다루는 AI 시대 필수 교양 학습 플랫폼.',
        url: 'https://ai-literacy.dreamitbiz.com',
        tags: ['AI 교양', '활용', '윤리'],
      },
    ],
  },
]

function SiteCard({ site }) {
  const host = site.url.replace(/^https?:\/\//, '')
  return (
    <a
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex', flexDirection: 'column', gap: 12,
        background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 16,
        padding: '26px 24px', textDecoration: 'none', color: 'inherit',
        transition: 'transform .15s, box-shadow .15s, border-color .15s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 18px 38px rgba(27,25,22,0.12)'; e.currentTarget.style.borderColor = '#D4C7AF' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = BORDER }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <h3 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 19, letterSpacing: '-0.01em', lineHeight: 1.3 }}>{site.name}</h3>
        <span style={{ fontFamily: NEWS, fontSize: 18, color: TERRA, flexShrink: 0, lineHeight: 1 }}>↗</span>
      </div>
      <p style={{ fontSize: 14.5, color: '#5A5246', lineHeight: 1.65, margin: 0, flex: 1 }}>{site.desc}</p>
      {site.tags?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {site.tags.map((t) => (
            <span key={t} style={{ fontSize: 12, fontWeight: 600, color: NAVY, background: '#F1ECE1', borderRadius: 999, padding: '4px 11px' }}>{t}</span>
          ))}
        </div>
      )}
      <div style={{ fontFamily: NEWS, fontSize: 13, color: '#9A8F7D', borderTop: `1px solid ${BORDER}`, paddingTop: 12 }}>{host}</div>
    </a>
  )
}

export default function RecommendSites() {
  return (
    <div style={{ ...container, paddingBottom: 100 }}>
      {/* HERO */}
      <header style={{ padding: '72px 0 12px', textAlign: 'center' }}>
        <div style={{ fontFamily: NEWS, fontStyle: 'italic', fontSize: 16, color: TERRA, marginBottom: 12 }}>Recommended · 추천사이트</div>
        <h1 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 40, letterSpacing: '-0.025em', lineHeight: 1.22 }}>
          함께 둘러보면 좋은<br /><span style={{ color: TERRA }}>교육 사이트</span> 모음
        </h1>
        <p style={{ fontSize: 16.5, color: '#5A5246', marginTop: 16, lineHeight: 1.7 }}>
          DreamIT Biz가 대학·기관과 함께 구축·운영하는 생성형 AI·SW 교육 플랫폼을 소개합니다.
        </p>
      </header>

      {siteGroups.map((group) => (
        <section key={group.category} style={{ marginTop: 56 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 20, paddingBottom: 14, borderBottom: `2px solid ${NAVY}` }}>
            <h2 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 23, color: NAVY, letterSpacing: '-0.01em' }}>{group.category}</h2>
            {group.note && <span style={{ fontSize: 14, color: '#7A7263' }}>{group.note}</span>}
            <span style={{ marginLeft: 'auto', fontFamily: NEWS, fontSize: 14, color: '#9A8F7D' }}>{group.sites.length}곳</span>
          </div>
          <div className="recommend-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {group.sites.map((site) => (
              <SiteCard key={site.url} site={site} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
