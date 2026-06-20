import { useState } from 'react'
import Diagram from './Diagram'

const SERIF = "'Noto Serif KR', serif"
const NEWS = "'Newsreader', serif"
const NAVY = '#1E3A5F'
const TERRA = '#C2603D'
const BORDER = '#E2D9C9'

const templates = [
  {
    title: '기본 질문',
    desc: '간단한 질문 형식의 프롬프트',
    prompt: '다음 개념을 초등학생도 이해할 수 있도록 쉽게 설명해주세요:\n\n[개념: 인공지능]',
  },
  {
    title: '시스템 프롬프트 예시',
    desc: '역할과 규칙을 설정하는 시스템 프롬프트',
    prompt: '[System]\n당신은 10년 경력의 시니어 Python 개발자입니다.\n- 코드는 항상 타입 힌트를 포함하세요\n- PEP 8 스타일 가이드를 따르세요\n- 설명은 한국어로 해주세요\n\n[User]\nFastAPI로 JWT 인증 미들웨어를 만들어주세요.',
  },
  {
    title: 'XML 태그 활용',
    desc: 'XML 태그로 구조화된 프롬프트',
    prompt: '<context>\n우리 회사는 B2B SaaS 스타트업입니다.\n주력 제품은 프로젝트 관리 도구입니다.\n타겟 고객은 50~200명 규모의 중소기업입니다.\n</context>\n\n<task>\n위 맥락을 바탕으로 랜딩 페이지 카피를 작성해주세요.\n</task>\n\n<format>\n- 헤드라인 (10단어 이내)\n- 서브헤드라인 (20단어 이내)\n- CTA 버튼 텍스트\n- 주요 특징 3가지 (각 1~2문장)\n</format>',
  },
  {
    title: 'Chain of Thought',
    desc: '단계별 사고를 유도하는 프롬프트',
    prompt: '다음 문제를 단계별로 풀어주세요. 각 단계에서 추론 과정을 명확히 보여주세요.\n\n문제: 한 가게에서 사과 3개에 5,000원, 귤 5개에 4,000원에 판매합니다.\n사과 12개와 귤 15개를 사면 총 얼마인가요?\n\n<thinking>\n1단계: 사과 1개의 가격을 계산\n2단계: 귤 1개의 가격을 계산\n3단계: 사과 12개의 총 가격을 계산\n4단계: 귤 15개의 총 가격을 계산\n5단계: 전체 합계를 계산\n</thinking>',
  },
  {
    title: '역할극 프롬프트',
    desc: '특정 역할을 부여하는 프롬프트',
    prompt: '당신은 실리콘밸리의 유명 VC 파트너입니다.\n투자 경험: 15년, 100개 이상의 스타트업 투자\n전문 분야: AI/ML, SaaS, 핀테크\n\n다음 스타트업 피치를 평가해주세요:\n\n"우리는 AI 기반 코드 리뷰 자동화 도구를 만들고 있습니다.\n현재 MAU 5,000명이며, MRR $50K입니다.\nSeed 라운드로 $2M을 모집하려고 합니다."\n\n평가 항목:\n1. 시장 기회\n2. 경쟁 우위\n3. 팀/제품 리스크\n4. 투자 매력도 (1-10점)\n5. 핵심 질문 3가지',
  },
]

export default function PromptPractice() {
  const [promptText, setPromptText] = useState('')
  const [output, setOutput] = useState('')

  const run = () => {
    setOutput('[ 미리보기 모드 ] 이 연습장은 프롬프트를 직접 작성·구조화해 보는 공간입니다.\n실제 응답은 Claude(claude.ai)에 붙여넣어 확인하세요.\n\n---\n입력한 프롬프트:\n\n' + promptText)
  }
  const clear = () => { setPromptText(''); setOutput('') }

  return (
    <PromptPage kicker="Prompt Playground" title="프롬프트 연습장" desc="다양한 템플릿을 불러와 프롬프트 작성을 연습해 보세요. 작성한 프롬프트는 복사해 Claude에 붙여넣어 결과를 확인할 수 있습니다." diagram={{ type: 'flow', steps: ['템플릿 선택', '프롬프트 작성', '복사', 'claude.ai에서 실행'] }}>
      <div className="prompt-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={panel}>
          <h3 style={panelH}>프롬프트 입력</h3>
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="프롬프트를 입력하거나 아래 템플릿을 선택하세요…"
            style={textarea}
          />
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button onClick={run} disabled={!promptText.trim()} style={btn(NAVY, !promptText.trim())}>미리보기</button>
            <button onClick={clear} style={btnOutline}>초기화</button>
          </div>
        </div>
        <div style={panel}>
          <h3 style={panelH}>결과</h3>
          <div style={{ ...output ? {} : { color: '#9A8F7D' }, whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.7, color: output ? '#3D372E' : '#9A8F7D', minHeight: 220 }}>
            {output || '프롬프트를 입력하고 미리보기를 눌러보세요.\n\n작성한 프롬프트를 복사해 claude.ai에 붙여넣으면 실제 응답을 확인할 수 있습니다.'}
          </div>
        </div>
      </div>

      <h3 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 22, marginTop: 48, marginBottom: 18 }}>템플릿 프롬프트</h3>
      <div className="prompt-grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {templates.map((t, i) => (
          <button key={i} onClick={() => { setPromptText(t.prompt); setOutput(''); window.scrollTo({ top: 0, behavior: 'smooth' }) }} style={{ ...card, textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#1B1916' }}>{t.title}</div>
            <div style={{ fontSize: 14, color: '#7A7163', marginTop: 8, lineHeight: 1.55 }}>{t.desc}</div>
          </button>
        ))}
      </div>
    </PromptPage>
  )
}

// --- shared bits ---
export function PromptPage({ kicker, title, desc, diagram, children }) {
  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: '56px 40px 100px', animation: 'floatIn .35s ease both' }}>
      <div style={{ fontFamily: NEWS, fontStyle: 'italic', fontSize: 16, color: TERRA, marginBottom: 12 }}>{kicker}</div>
      <h1 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 40, letterSpacing: '-0.025em' }}>{title}</h1>
      {desc && <p style={{ fontSize: 16.5, color: '#5A5246', marginTop: 16, lineHeight: 1.7, maxWidth: 760 }}>{desc}</p>}
      {diagram && (
        <div style={{ marginTop: 24, background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 14, padding: '22px 24px', maxWidth: 860 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '0.04em', color: NAVY, marginBottom: 12 }}>한눈에 보기</div>
          <Diagram spec={diagram} />
        </div>
      )}
      <div style={{ marginTop: 40 }}>{children}</div>
    </div>
  )
}

const panel = { background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }
const panelH = { fontFamily: SERIF, fontWeight: 600, fontSize: 17, marginBottom: 14 }
const textarea = { width: '100%', minHeight: 220, background: '#FBFAF7', border: `1px solid ${BORDER}`, borderRadius: 11, padding: '14px 16px', fontSize: 14, lineHeight: 1.7, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', color: '#1B1916', outline: 'none', resize: 'vertical', whiteSpace: 'pre-wrap' }
const card = { background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 14, padding: 22 }
export const btn = (bg, disabled) => ({ background: disabled ? '#9FB0C2' : bg, color: '#fff', border: 'none', borderRadius: 11, padding: '12px 22px', fontSize: 15, fontWeight: 600, cursor: disabled ? 'default' : 'pointer', fontFamily: 'inherit' })
const btnOutline = { background: '#fff', color: '#5A5246', border: `1px solid ${BORDER}`, borderRadius: 11, padding: '12px 22px', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }
