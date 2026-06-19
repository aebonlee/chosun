import { useState, useMemo } from 'react'
import { PromptPage } from './PromptPractice'

const SERIF = "'Noto Serif KR', serif"
const NEWS = "'Newsreader', serif"
const NAVY = '#1E3A5F'
const TERRA = '#C2603D'
const BORDER = '#E2D9C9'

// 6대 평가 기준 (각 0~3점, 총 18점). detect()는 키워드·구조 휴리스틱.
const criteria = [
  {
    key: 'role', title: '역할·페르소나', desc: '명확한 역할(전문성, 관점)을 부여했는가?',
    why: '역할을 지정하면 모델이 해당 전문가의 어휘·판단 기준·디테일로 답합니다. 같은 질문도 "전문가로서" 답하면 깊이가 달라집니다.',
    tip: '"당신은 10년 경력의 시니어 백엔드 개발자입니다"처럼 역할과 전문성을 구체적으로 지정하세요.',
    detect: (t) => {
      const role = /당신은|너는|역할|as an?\s|you are|act as|전문가|시니어|senior|경력|개발자|디자이너|마케터|컨설턴트|카피라이터|분석가|변호사|의사|expert|engineer|designer|consultant|writer|analyst/i.test(t)
      const specific = /시니어|senior|\d+\s*년|\d+\s*years|경력|전문가|expert|박사|phd/i.test(t)
      if (role && specific) return { score: 3, ko: '역할과 전문성이 구체적으로 지정됨' }
      if (role) return { score: 2, ko: '역할은 있으나 전문성 묘사가 약함' }
      return { score: 0, ko: '역할/페르소나 지정이 없음' }
    },
  },
  {
    key: 'context', title: '맥락·배경', desc: '작업에 필요한 배경 정보와 목적을 제공했는가?',
    why: '모델은 당신의 상황을 모릅니다. 대상 독자·목적·도메인을 알려주면 추측 대신 맥락에 맞는 결과를 냅니다.',
    tip: '대상 독자, 제품/도메인, 이 결과물이 쓰일 곳 등 "왜"를 함께 적으면 품질이 크게 올라갑니다.',
    detect: (t) => {
      let n = 0
      if (/<context>|배경|맥락|목적|우리(는|\s?회사)|제품|서비스|대상|타겟|target|고객|상황|프로젝트|because|since|audience|goal/i.test(t)) n++
      if (t.length > 150) n++
      if (/\[[^\]]+\]/.test(t)) n++
      if (n >= 2) return { score: 3, ko: '배경·목적 등 맥락이 충분함' }
      if (n === 1) return { score: 2, ko: '맥락이 일부 제공됨' }
      return { score: 0, ko: '배경/목적 정보가 없음' }
    },
  },
  {
    key: 'task', title: '구체적 지시', desc: '무엇을 해야 하는지 모호하지 않고 구체적인가?',
    why: '모호한 지시는 모호한 답을 부릅니다. 측정 가능한 수치(개수·길이·범위)가 있으면 결과가 예측 가능해집니다.',
    tip: '"좋게 만들어줘" 대신 "X를 3개 항목으로, 각 1~2문장으로 작성"처럼 측정 가능하게 지시하세요.',
    detect: (t) => {
      const verb = /작성|만들|생성|분석|요약|설명|리뷰|평가|번역|수정|개선|추천|정리|작성해|write|create|generate|analyz|summariz|explain|review|translat|improve|list|draft/i.test(t)
      const quant = /\d+\s*(개|가지|줄|문장|단어|자|단계|items?|points?|words?|sentences?|steps?)|이내|이하|이상|최대|최소|within|under|at most/i.test(t)
      if (verb && quant) return { score: 3, ko: '구체적 동작 + 측정 가능한 범위 지시' }
      if (verb) return { score: 2, ko: '할 일은 있으나 구체성이 부족함' }
      if (t.trim().length > 0) return { score: 1, ko: '지시가 모호함' }
      return { score: 0, ko: '지시가 없음' }
    },
  },
  {
    key: 'format', title: '출력 형식', desc: '원하는 출력 형식·구조를 명시했는가?',
    why: '형식을 정하지 않으면 매번 다른 모양의 답이 옵니다. 형식을 못박으면 자동화·재사용이 쉬워집니다.',
    tip: '표, JSON, 마크다운, 항목 수, 글자 수 등 원하는 형식을 명확히 지정하세요(구조화 출력 활용도 가능).',
    detect: (t) => {
      let n = 0
      if (/형식|포맷|format|<format>|표(로|\s?형식)?|테이블|table|json|마크다운|markdown|불릿|bullet|리스트|목록|번호|단계별|항목|csv/i.test(t)) n++
      if (/(^|\n)\s*(-|\d+\.|•|\*)\s/.test(t)) n++
      if (n >= 2) return { score: 3, ko: '출력 형식이 명확히 지정됨' }
      if (n === 1) return { score: 2, ko: '형식 힌트가 일부 있음' }
      return { score: 0, ko: '출력 형식 지정이 없음' }
    },
  },
  {
    key: 'constraints', title: '제약·규칙', desc: '톤, 길이, 금지사항 등 제약을 제시했는가?',
    why: '제약은 결과의 경계를 정합니다. 길이·톤·금지사항을 정하면 엉뚱하거나 과한 답을 막을 수 있습니다.',
    tip: '"전문 용어 금지", "200자 이내", "정중한 톤"처럼 경계를 정하면 결과가 안정적입니다.',
    detect: (t) => {
      const c = /이내|이하|글자|단어\s?이내|금지|하지\s?마|말\s?것|제외|제한|톤|말투|어조|tone|정중|격식|formal|반드시|필수|must|avoid|don'?t|do not|없이|만\s?사용|간결|concise|한국어로|영어로/gi
      const hits = (t.match(c) || []).length
      if (hits >= 2) return { score: 3, ko: '톤·길이·금지 등 제약이 충분함' }
      if (hits === 1) return { score: 2, ko: '제약이 일부 있음' }
      return { score: 0, ko: '제약/규칙이 없음' }
    },
  },
  {
    key: 'examples', title: '예시(Few-shot)', desc: '원하는 결과의 예시를 1개 이상 제공했는가?',
    why: '예시는 백 마디 설명보다 강력합니다. 입력→출력 예를 보여주면 모델이 패턴을 그대로 따라합니다.',
    tip: '입력→출력 예시를 한두 개 보여주면 모델이 패턴을 빠르게 학습합니다(가장 강력한 기법 중 하나).',
    detect: (t) => {
      const ex = /예시|예:|예\)|보기|example|e\.?g\.|<example>|샘플|sample|다음과\s?같|아래와\s?같|input.*output|입력.*출력|few-?shot/gi
      const hits = (t.match(ex) || []).length
      if (hits >= 1 && /<example>|예시|example/i.test(t)) return { score: 3, ko: '예시(Few-shot)가 포함됨' }
      if (hits >= 1) return { score: 2, ko: '예시 유사 표현이 있음' }
      return { score: 0, ko: '예시가 없음' }
    },
  },
]

const levelLabels = ['없음', '미흡', '보통', '우수']

const examples = [
  {
    topic: '마케팅 카피', before: '신제품 마케팅 문구 써줘.', beforeScore: 3, afterScore: 16,
    after: `당신은 B2B SaaS 카피라이터입니다.\n[제품] 50~200명 규모 중소기업용 프로젝트 관리 도구\n[목표] 무료 체험 가입 전환\n\n랜딩 페이지 카피를 작성하세요.\n- 헤드라인(10단어 이내) 1개\n- 서브헤드라인(20단어 이내) 1개\n- CTA 버튼 문구 2개\n- 핵심 특징 3가지(각 1문장)\n전문 용어는 피하고 신뢰감 있는 톤으로 작성하세요.`,
  },
  {
    topic: '코드 리뷰', before: '이 코드 고쳐줘.', beforeScore: 2, afterScore: 17,
    after: `당신은 Python 보안에 밝은 시니어 리뷰어입니다.\n아래 FastAPI 라우터를 리뷰하세요.\n\n<목표> 운영 배포 전 보안·성능 점검 </목표>\n<출력 형식>\n1. 발견한 문제 (심각도: 높음/중간/낮음)\n2. 수정 코드 (타입 힌트 포함, PEP 8)\n3. 한 줄 요약\n</출력 형식>\n추측이 아니라 코드에 근거해 지적하세요.\n\n[여기에 코드]`,
  },
  {
    topic: '문서 요약', before: '이 문서 요약해줘.', beforeScore: 2, afterScore: 16,
    after: `당신은 임원 보고를 돕는 비서입니다.\n아래 보고서를 바쁜 CEO가 30초 안에 읽도록 요약하세요.\n\n<형식>\n- 핵심 결론 1문장\n- 주요 근거 3개(불릿)\n- 권장 다음 행동 1개\n</형식>\n숫자·고유명사는 원문 그대로 유지하고, 추측은 넣지 마세요.\n\n[여기에 문서]`,
  },
]

const challenges = [
  { weak: '블로그 글 써줘.', hint: '주제, 대상 독자, 길이, 톤, 구조(소제목/리스트), 포함할 키워드를 더해보세요.' },
  { weak: '데이터 분석해줘.', hint: '데이터의 형태, 분석 목적, 원하는 지표, 결과 형식(표/차트 설명), 가정 처리 방식을 명시하세요.' },
  { weak: '이메일 답장 써줘.', hint: '발신자 관계, 답장의 목적, 톤, 길이, 반드시 포함/배제할 내용을 더하고 원문 맥락을 붙이세요.' },
]

export default function PromptEval() {
  const [promptText, setPromptText] = useState('')
  const [scores, setScores] = useState(Array(criteria.length).fill(null))
  const [reasons, setReasons] = useState(Array(criteria.length).fill(null))
  const [scored, setScored] = useState(false)

  const handleScore = () => {
    const results = criteria.map((c) => c.detect(promptText))
    setScores(results.map((r) => r.score))
    setReasons(results.map((r) => r.ko))
    setScored(true)
  }
  const setScore = (idx, val) => {
    setScores((prev) => { const n = [...prev]; n[idx] = n[idx] === val ? null : val; return n })
    setScored(true)
  }
  const resetAll = () => { setScores(Array(criteria.length).fill(null)); setReasons(Array(criteria.length).fill(null)); setScored(false); setPromptText('') }

  const rawTotal = useMemo(() => scores.reduce((s, v) => s + (v ?? 0), 0), [scores])
  const answered = scores.filter((s) => s !== null).length
  const score = Math.round((rawTotal / (criteria.length * 3)) * 100)
  const grade = useMemo(() => {
    if (answered === 0) return null
    if (score >= 89) return { letter: 'A', ko: '우수한 프롬프트', color: '#059669' }
    if (score >= 67) return { letter: 'B', ko: '좋은 프롬프트', color: '#2563EB' }
    if (score >= 39) return { letter: 'C', ko: '보통 — 보완 필요', color: '#D97706' }
    return { letter: 'D', ko: '초안 — 대폭 개선 필요', color: '#DC2626' }
  }, [score, answered])
  const weakPoints = criteria.map((c, i) => ({ c, s: scores[i] })).filter((x) => x.s !== null && x.s <= 1)

  return (
    <PromptPage kicker="Prompt Evaluation" title="프롬프트 평가 실습" desc='평가할 프롬프트를 입력하고 "채점해보기"를 누르면 6대 기준으로 자동 채점합니다. 항목별 근거와 개선점을 확인하고, 점수를 직접 보정할 수도 있습니다.'>
      {/* 입력 + 결과 */}
      <div className="prompt-2col" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
        <div style={panel}>
          <h3 style={panelH}>평가할 프롬프트</h3>
          <textarea value={promptText} onChange={(e) => setPromptText(e.target.value)} placeholder="평가하고 싶은 프롬프트를 붙여넣으세요…" style={textarea} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, flexWrap: 'wrap', gap: 10 }}>
            <span style={{ fontSize: 13, color: '#9A8F7D' }}>글자 수: {promptText.length}</span>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleScore} disabled={!promptText.trim()} style={btn(NAVY, !promptText.trim())}>채점해보기</button>
              <button onClick={resetAll} style={btnOutline}>초기화</button>
            </div>
          </div>
          <p style={{ fontSize: 12.5, color: '#9A8F7D', marginTop: 12, lineHeight: 1.6 }}>※ 키워드·구조 기반 자동 분석으로 점수를 추정합니다. 학습용 가이드이며, 각 항목을 직접 보정해 최종 판단하세요.</p>
        </div>
        <div style={{ ...panel, textAlign: 'center' }}>
          <h3 style={panelH}>평가 결과</h3>
          <div style={{ fontFamily: NEWS, fontSize: 64, fontWeight: 500, lineHeight: 1.1, color: grade ? grade.color : '#C9C0B0' }}>
            {score}<span style={{ fontSize: 22, color: '#9A8F7D' }}> / 100</span>
          </div>
          {grade ? (
            <>
              <div style={{ display: 'inline-block', marginTop: 12, background: grade.color, color: '#fff', fontWeight: 700, fontSize: 18, width: 40, height: 40, lineHeight: '40px', borderRadius: 10 }}>{grade.letter}</div>
              <p style={{ fontSize: 15, fontWeight: 600, marginTop: 10, color: '#1B1916' }}>{grade.ko}</p>
            </>
          ) : (
            <p style={{ fontSize: 14, color: '#9A8F7D', marginTop: 10 }}>프롬프트를 입력하고 "채점해보기"를 눌러보세요.</p>
          )}
          <div style={{ height: 8, background: '#EDE7DC', borderRadius: 999, marginTop: 18, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${score}%`, background: grade ? grade.color : NAVY, transition: 'width .4s ease' }} />
          </div>
        </div>
      </div>

      {/* 루브릭 */}
      <h2 style={sectionTitle}>6대 평가 기준</h2>
      <p style={{ fontSize: 15, color: '#6F665A', marginBottom: 20 }}>각 기준은 0~3점입니다. 채점 후 항목마다 "왜 중요한지"와 자동 분석 근거가 표시됩니다.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {criteria.map((c, i) => (
          <div key={c.key} style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 14, padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 600, color: '#1B1916' }}>{c.title}</span>
              {scores[i] !== null && <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{scores[i]}/3</span>}
              <span style={{ fontSize: 14, color: '#7A7163' }}>· {c.desc}</span>
            </div>
            <p style={{ fontSize: 14, color: '#6F665A', marginTop: 10, lineHeight: 1.6 }}>ⓘ {c.why}</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
              {levelLabels.map((lv, val) => (
                <button key={val} onClick={() => setScore(i, val)} style={{
                  cursor: 'pointer', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600, padding: '8px 14px', borderRadius: 9, display: 'flex', alignItems: 'center', gap: 6,
                  border: `1px solid ${scores[i] === val ? NAVY : BORDER}`, background: scores[i] === val ? NAVY : '#fff', color: scores[i] === val ? '#fff' : '#5A5246',
                }}><span style={{ fontFamily: NEWS }}>{val}</span> {lv}</button>
              ))}
            </div>
            {reasons[i] && <div style={{ fontSize: 13.5, color: '#5A5246', marginTop: 12, background: '#F4F6F9', borderRadius: 9, padding: '10px 14px' }}>🔍 {reasons[i]}</div>}
          </div>
        ))}
      </div>

      {/* 개선 제안 */}
      {scored && (weakPoints.length > 0 ? (
        <div style={{ marginTop: 28, background: '#FBF3EC', border: '1px solid #F0DDCB', borderRadius: 14, padding: '22px 24px' }}>
          <h3 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 18, color: TERRA, marginBottom: 12 }}>개선 제안</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {weakPoints.map((x) => (
              <li key={x.c.key} style={{ fontSize: 14.5, color: '#5A4636', lineHeight: 1.6 }}><strong style={{ color: '#1B1916' }}>{x.c.title}:</strong> {x.c.tip}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div style={{ marginTop: 28, background: '#ECF6F0', border: '1px solid #CDE7D8', borderRadius: 14, padding: '22px 24px' }}>
          <h3 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 18, color: '#0B7A4B', marginBottom: 8 }}>잘 작성된 프롬프트입니다!</h3>
          <p style={{ fontSize: 14.5, color: '#3D5A4B', margin: 0, lineHeight: 1.6 }}>6대 기준을 고르게 충족했습니다. 실제 결과를 보며 세부 표현을 다듬어 보세요.</p>
        </div>
      ))}

      {/* Before → After */}
      <h2 style={sectionTitle}>Before → After 개선 사례</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {examples.map((ex, i) => (
          <div key={i} style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 14, padding: 24 }}>
            <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 17, marginBottom: 14 }}>{ex.topic}</div>
            <div className="prompt-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#DC2626', background: '#FBEAEA', padding: '3px 10px', borderRadius: 6 }}>Before</span>
                  <span style={{ fontSize: 13, color: '#9A8F7D', fontFamily: NEWS }}>{Math.round((ex.beforeScore / 18) * 100)} / 100</span>
                </div>
                <pre style={preBox}>{ex.before}</pre>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#0B7A4B', background: '#E6F4EC', padding: '3px 10px', borderRadius: 6 }}>After</span>
                  <span style={{ fontSize: 13, color: '#9A8F7D', fontFamily: NEWS }}>{Math.round((ex.afterScore / 18) * 100)} / 100</span>
                </div>
                <pre style={preBox}>{ex.after}</pre>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 실습 과제 */}
      <h2 style={sectionTitle}>실습 과제 — 직접 개선해보세요</h2>
      <div className="prompt-grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {challenges.map((ch, i) => (
          <div key={i} style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 14, padding: 22 }}>
            <div style={{ fontFamily: NEWS, fontSize: 22, color: TERRA }}>{i + 1}</div>
            <pre style={{ ...preBox, marginTop: 8 }}>{ch.weak}</pre>
            <p style={{ fontSize: 13.5, color: '#7A7163', marginTop: 12, lineHeight: 1.6 }}>✦ {ch.hint}</p>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 14, color: '#6F665A', marginTop: 20, lineHeight: 1.6 }}>→ 위 과제를 개선한 뒤, 상단 입력창에 붙여넣고 "채점해보기"로 점수를 확인하세요. 67점 이상을 목표로!</p>
    </PromptPage>
  )
}

const panel = { background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }
const panelH = { fontFamily: SERIF, fontWeight: 600, fontSize: 17, marginBottom: 14 }
const textarea = { width: '100%', minHeight: 200, background: '#FBFAF7', border: `1px solid ${BORDER}`, borderRadius: 11, padding: '14px 16px', fontSize: 14, lineHeight: 1.7, fontFamily: 'ui-monospace, Menlo, monospace', color: '#1B1916', outline: 'none', resize: 'vertical', whiteSpace: 'pre-wrap' }
const sectionTitle = { fontFamily: SERIF, fontWeight: 700, fontSize: 26, letterSpacing: '-0.02em', marginTop: 52, marginBottom: 14 }
const preBox = { background: '#1B1916', color: '#EAE4D8', borderRadius: 11, padding: '16px 18px', fontSize: 13, lineHeight: 1.65, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'ui-monospace, Menlo, monospace', margin: 0 }
const btn = (bg, disabled) => ({ background: disabled ? '#9FB0C2' : bg, color: '#fff', border: 'none', borderRadius: 11, padding: '11px 20px', fontSize: 14.5, fontWeight: 600, cursor: disabled ? 'default' : 'pointer', fontFamily: 'inherit' })
const btnOutline = { background: '#fff', color: '#5A5246', border: `1px solid ${BORDER}`, borderRadius: 11, padding: '11px 20px', fontSize: 14.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }
