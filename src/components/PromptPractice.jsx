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

// 정확한 실습을 위한 자가 점검 항목 — 입력 텍스트에서 5요소(+예시) 포함 여부를 휴리스틱으로 감지
const checks = [
  { key: 'role', label: '역할', test: (t) => /당신은|너는|역할|as an?\s|you are|act as|전문가|시니어|senior|경력|개발자|디자이너|마케터|컨설턴트|분석가|연구자|교수|expert/i.test(t), tip: '"당신은 OO 분야 전문가입니다"처럼 역할·전문성을 지정합니다.' },
  { key: 'context', label: '맥락·배경', test: (t) => /<context>|배경|맥락|목적|대상|독자|타겟|상황|because|since|audience|goal/i.test(t) || t.length > 140, tip: '대상 독자·목적·배경 등 "왜" 필요한지를 함께 적습니다.' },
  { key: 'task', label: '구체적 지시', test: (t) => /작성|만들|생성|분석|요약|설명|리뷰|평가|번역|수정|정리|추천|작성해|write|create|generate|analyz|summar|explain|review/i.test(t), tip: '무엇을 해야 하는지 동작을 분명한 동사로 지시합니다.' },
  { key: 'format', label: '출력 형식', test: (t) => /형식|포맷|표(로|\s|$)|테이블|json|마크다운|불릿|리스트|목록|번호|단계|항목|\d+\s*(개|가지|문장|줄|단어|자)/i.test(t), tip: '표·목록·항목 수·글자 수 등 원하는 출력 형식을 지정합니다.' },
  { key: 'constraints', label: '제약·규칙', test: (t) => /이내|이하|이상|글자|금지|하지\s?마|말\s?것|제외|톤|말투|어조|정중|격식|반드시|필수|없이|간결|한국어로|영어로/i.test(t), tip: '길이·어조·금지사항 등 출력의 경계를 정합니다.' },
  { key: 'examples', label: '예시(선택)', test: (t) => /예시|예:|예\)|보기|example|e\.?g\.|<example>|샘플|sample|입력.*출력/i.test(t), tip: '원하는 결과의 예시를 1개 이상 주면 품질이 크게 오릅니다(선택).' },
]

export default function PromptPractice() {
  const [promptText, setPromptText] = useState('')
  const [copied, setCopied] = useState(false)

  const results = checks.map((c) => ({ ...c, ok: !!promptText.trim() && c.test(promptText) }))
  const core = results.slice(0, 5)
  const coreOk = core.filter((r) => r.ok).length
  const ready = coreOk >= 4

  const copy = async () => {
    try { await navigator.clipboard.writeText(promptText) } catch { /* noop */ }
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }
  const clear = () => setPromptText('')

  return (
    <PromptPage
      kicker="Prompt Playground"
      title="프롬프트 연습장"
      desc="이 연습장은 좋은 프롬프트를 직접 작성·점검해 보는 공간입니다. 프롬프트를 쓰면 오른쪽에서 5대 구성요소가 갖춰졌는지 실시간으로 점검해 줍니다. 점검을 통과하면 복사해 claude.ai에 붙여넣어 실제 응답을 확인하세요."
      diagram={{ type: 'flow', steps: ['작성 / 템플릿', '5요소 자가 점검', '복사', 'claude.ai에서 실행'] }}
    >
      <div className="prompt-2col" style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 20 }}>
        <div style={panel}>
          <h3 style={panelH}>프롬프트 작성</h3>
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="프롬프트를 직접 작성하거나 아래 템플릿을 불러와 수정해 보세요…"
            style={textarea}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, flexWrap: 'wrap', gap: 10 }}>
            <span style={{ fontSize: 13, color: '#9A8F7D' }}>글자 수 {promptText.length}</span>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={copy} disabled={!promptText.trim()} style={btn(NAVY, !promptText.trim())}>{copied ? '복사됨 ✓' : '프롬프트 복사'}</button>
              <button onClick={clear} style={btnOutline}>초기화</button>
            </div>
          </div>
          <p style={{ fontSize: 13, color: '#7A7163', marginTop: 14, lineHeight: 1.6 }}>※ 복사한 프롬프트를 <strong style={{ color: NAVY }}>claude.ai</strong>에 붙여넣어 실제 응답을 확인하고, 결과를 보며 프롬프트를 다듬어 보세요.</p>
        </div>

        <div style={panel}>
          <h3 style={panelH}>프롬프트 점검</h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
            <span style={{ fontFamily: NEWS, fontSize: 30, fontWeight: 500, color: ready ? '#0B7A4B' : NAVY }}>{coreOk}</span>
            <span style={{ fontSize: 14, color: '#7A7163' }}>/ 5 핵심 요소 {ready ? '· 준비 완료' : ''}</span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
            {results.map((r) => (
              <li key={r.key} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: '50%', background: r.ok ? '#0B7A4B' : '#EDE7DC', color: r.ok ? '#fff' : '#9A8F7D', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, marginTop: 1 }}>{r.ok ? '✓' : ''}</span>
                <div>
                  <span style={{ fontSize: 14.5, fontWeight: 600, color: r.ok ? '#1B1916' : '#5A5246' }}>{r.label}</span>
                  {!r.ok && <div style={{ fontSize: 13, color: '#7A7163', marginTop: 3, lineHeight: 1.5 }}>{r.tip}</div>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h3 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 22, marginTop: 48, marginBottom: 6 }}>템플릿 프롬프트</h3>
      <p style={{ fontSize: 14, color: '#7A7163', marginBottom: 18 }}>잘 구조화된 예시입니다. 불러와서 [대괄호]를 본인 내용으로 바꾸며 5요소를 익혀 보세요.</p>
      <div className="prompt-grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {templates.map((t, i) => (
          <button key={i} onClick={() => { setPromptText(t.prompt); window.scrollTo({ top: 0, behavior: 'smooth' }) }} style={{ ...card, textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}>
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
