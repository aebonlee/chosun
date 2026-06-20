import { useState, useMemo } from 'react'
import { PromptPage } from './PromptPractice'

const SERIF = "'Noto Serif KR', serif"
const NAVY = '#1E3A5F'
const TERRA = '#C2603D'
const BORDER = '#E2D9C9'

const categories = [
  { key: 'all', label: '전체' },
  { key: 'coding', label: '코딩' },
  { key: 'writing', label: '글쓰기' },
  { key: 'analysis', label: '분석' },
  { key: 'creative', label: '크리에이티브' },
  { key: 'business', label: '비즈니스' },
]

const galleryItems = [
  { category: 'coding', title: '코드 리뷰 요청', desc: '코드의 품질, 보안, 성능을 종합적으로 리뷰합니다.', prompt: '다음 코드를 리뷰해주세요. 아래 관점에서 분석해주세요:\n1. 코드 품질 및 가독성\n2. 잠재적 버그\n3. 보안 취약점\n4. 성능 개선점\n5. 리팩토링 제안\n\n```\n[코드를 여기에 붙여넣기]\n```' },
  { category: 'coding', title: '디버깅 도우미', desc: '에러 메시지를 분석하고 해결 방법을 제시합니다.', prompt: '다음 에러를 분석하고 해결 방법을 알려주세요:\n\n<error>\n[에러 메시지]\n</error>\n\n<context>\n- 언어/프레임워크: [예: React, Node.js]\n- 발생 상황: [어떤 작업 중 발생했는지]\n</context>' },
  { category: 'coding', title: 'API 엔드포인트 설계', desc: 'RESTful API 엔드포인트를 설계합니다.', prompt: '다음 요구사항에 맞는 RESTful API를 설계해주세요:\n\n<requirements>\n- 리소스: [예: 사용자, 게시글]\n- 필요한 기능: CRUD + [추가 기능]\n- 인증 방식: JWT\n</requirements>\n\n각 엔드포인트에 대해 URL, 메서드, 요청/응답 스키마를 포함해주세요.' },
  { category: 'writing', title: '기술 블로그 작성', desc: '기술 블로그 포스트를 구조적으로 작성합니다.', prompt: '다음 주제로 기술 블로그 포스트를 작성해주세요:\n\n주제: [주제]\n대상 독자: [예: 주니어 개발자]\n길이: 약 2000자\n\n구조:\n1. 흥미로운 도입부\n2. 핵심 개념 설명\n3. 실제 코드 예제\n4. 실무 적용 팁\n5. 정리 및 다음 단계' },
  { category: 'writing', title: '이메일 작성', desc: '비즈니스 이메일을 효과적으로 작성합니다.', prompt: '다음 상황에 맞는 비즈니스 이메일을 작성해주세요:\n\n<situation>\n- 목적: [예: 프로젝트 진행 상황 공유]\n- 수신자: [예: 팀 매니저]\n- 톤: [예: 공손하지만 간결하게]\n- 포함할 내용: [핵심 포인트 나열]\n</situation>' },
  { category: 'analysis', title: '데이터 분석 보고서', desc: '데이터를 분석하고 인사이트를 도출합니다.', prompt: '다음 데이터를 분석하고 보고서를 작성해주세요:\n\n<data>\n[데이터를 여기에 붙여넣기]\n</data>\n\n분석 요구사항:\n1. 주요 트렌드 파악\n2. 이상치 탐지\n3. 핵심 인사이트 3가지\n4. 개선을 위한 제안사항\n5. 시각화 추천 (차트 유형)' },
  { category: 'analysis', title: '경쟁사 분석', desc: '경쟁사를 체계적으로 분석합니다.', prompt: '다음 기업들의 경쟁 분석을 수행해주세요:\n\n<companies>\n- 우리 회사: [회사명] - [주요 제품]\n- 경쟁사 1: [회사명]\n- 경쟁사 2: [회사명]\n</companies>\n\n분석 항목:\n1. 제품/서비스 비교\n2. 가격 전략\n3. 시장 포지셔닝\n4. 강점/약점 (SWOT)\n5. 차별화 기회' },
  { category: 'creative', title: '마케팅 카피 생성', desc: '다양한 채널에 맞는 마케팅 카피를 생성합니다.', prompt: '다음 제품에 대한 마케팅 카피를 작성해주세요:\n\n<product>\n- 제품명: [제품명]\n- 타겟: [대상 고객]\n- USP: [핵심 차별점]\n- 톤: [예: 전문적, 친근한, 유머러스]\n</product>\n\n각 채널별로 작성:\n1. 소셜 미디어 (Instagram, 280자 이내)\n2. 이메일 제목 + 본문 (3줄)\n3. 랜딩 페이지 헤드라인 + 서브카피\n4. 검색 광고 (Google Ads, 90자 이내)' },
  { category: 'creative', title: '스토리 아이디어 생성', desc: '창작 스토리 아이디어를 생성합니다.', prompt: '다음 조건으로 독창적인 스토리 아이디어 3개를 만들어주세요:\n\n<constraints>\n- 장르: [예: SF, 판타지, 스릴러]\n- 배경: [예: 근미래, 중세, 현대 도시]\n- 분위기: [예: 긴장감, 따뜻함, 미스터리]\n- 테마: [예: 성장, 사랑, 정의]\n</constraints>\n\n각 아이디어에 포함할 것:\n1. 한 줄 로그라인\n2. 주인공 설명\n3. 핵심 갈등\n4. 플롯 개요 (3-4줄)' },
  { category: 'business', title: '회의록 정리', desc: '회의 내용을 체계적으로 정리합니다.', prompt: '다음 회의 내용을 정리해주세요:\n\n<meeting_notes>\n[회의 내용을 여기에 붙여넣기]\n</meeting_notes>\n\n정리 형식:\n1. 회의 개요 (일시, 참석자, 목적)\n2. 핵심 논의 사항 (요약)\n3. 결정 사항\n4. Action Items (담당자, 기한 포함)\n5. 다음 회의 안건' },
  { category: 'business', title: '프로젝트 계획서', desc: '프로젝트 계획서를 작성합니다.', prompt: '다음 프로젝트의 계획서를 작성해주세요:\n\n<project>\n- 프로젝트명: [프로젝트명]\n- 목표: [주요 목표]\n- 기간: [예: 3개월]\n- 팀 규모: [예: 5명]\n- 예산: [예: 5천만원]\n</project>\n\n포함할 내용:\n1. 프로젝트 개요\n2. 마일스톤 및 일정\n3. 역할과 책임\n4. 리스크 분석\n5. 성공 지표 (KPI)' },
  { category: 'analysis', title: '문서 요약', desc: '긴 문서를 핵심 내용 중심으로 요약합니다.', prompt: '다음 문서를 요약해주세요:\n\n<document>\n[문서 내용을 여기에 붙여넣기]\n</document>\n\n요약 형식:\n1. 한 줄 요약 (핵심 메시지)\n2. 주요 포인트 (3-5개 불릿)\n3. 세부 요약 (300자 이내)\n4. 키워드 태그 (5개)\n5. 후속 조치 필요 사항' },
]

export default function PromptGallery() {
  const [cat, setCat] = useState('all')
  const [expanded, setExpanded] = useState(null)
  const [copiedIdx, setCopiedIdx] = useState(null)

  const filtered = useMemo(() => cat === 'all' ? galleryItems : galleryItems.filter((i) => i.category === cat), [cat])

  const copy = (text, idx) => {
    navigator.clipboard?.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  return (
    <PromptPage kicker="Prompt Gallery" title="프롬프트 갤러리" desc="바로 사용할 수 있는 프롬프트 템플릿 예제입니다. 클릭해서 확인하고 [대괄호] 부분을 수정해서 사용하세요." diagram={{ type: 'flow', steps: ['카테고리 선택', '템플릿 확인', '[대괄호] 수정', '복사 · 사용'] }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
        {categories.map((c) => (
          <button key={c.key} onClick={() => { setCat(c.key); setExpanded(null) }} style={{
            cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, padding: '9px 18px', borderRadius: 999,
            border: `1px solid ${cat === c.key ? NAVY : BORDER}`, background: cat === c.key ? NAVY : '#fff', color: cat === c.key ? '#fff' : '#5A5246',
          }}>{c.label}</button>
        ))}
      </div>

      <div className="prompt-grid2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
        {filtered.map((item, idx) => {
          const open = expanded === idx
          return (
            <div key={idx} onClick={() => setExpanded(open ? null : idx)} style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 16, padding: 26, cursor: 'pointer' }}>
              <div style={{ display: 'inline-block', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.04em', color: TERRA, background: '#FBF3EC', padding: '4px 10px', borderRadius: 6, marginBottom: 12 }}>
                {categories.find((c) => c.key === item.category)?.label}
              </div>
              <h3 style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 600, color: '#1B1916' }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: '#7A7163', marginTop: 8, lineHeight: 1.55 }}>{item.desc}</p>
              <pre style={{ marginTop: 14, background: '#1B1916', color: '#EAE4D8', borderRadius: 11, padding: '16px 18px', fontSize: 13, lineHeight: 1.65, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'ui-monospace, Menlo, monospace', maxHeight: open ? 'none' : 96, overflow: 'hidden' }}>
                {open ? item.prompt : item.prompt.slice(0, 120) + '…'}
              </pre>
              {open && (
                <button onClick={(e) => { e.stopPropagation(); copy(item.prompt, idx) }} style={{ marginTop: 12, width: '100%', background: NAVY, color: '#fff', border: 'none', borderRadius: 10, padding: '11px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {copiedIdx === idx ? '복사됨 ✓' : '프롬프트 복사'}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </PromptPage>
  )
}
