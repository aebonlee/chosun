// 루브릭 제작 — Claude 웹(claude.ai)에서 따라하며 과제 평가 루브릭을 만드는 실습 예제.
// 「AI·SW개론」 과제(AI 기반 이미지 인식·생성 프로젝트)를 표본으로, 단계별 복사용 프롬프트를 제공한다.
import { useState } from 'react'

const SERIF = "'Noto Serif KR', serif"
const NEWS = "'Newsreader', serif"
const NAVY = '#1E3A5F'
const TERRA = '#C2603D'
const BORDER = '#E2D9C9'

const STEPS = [
  {
    n: 1,
    title: '평가 대상 입력 + 평가기준 도출',
    desc: 'Claude에게 루브릭 설계 전문가 역할을 주고, 과제 정보를 입력해 핵심 평가요소(기준)를 뽑는다.',
    prompt: `당신은 대학 수업의 평가 루브릭 설계 전문가입니다.
아래 과제를 공정하고 명료하게 평가할 루브릭을 함께 만들려 합니다.

[평가 대상]
- 과목: AI·SW개론 (1학년 전공기초)
- 과제: AI 기반 이미지 인식·생성 기술 활용 프로젝트 (개인 또는 팀)
- 배점: 총 100점 (과목 전체 평가의 '과제 40%'에 해당)
- 조건: AI 활용 가능, 단 출처 명시·개인 분석/견해 포함 필수

먼저 이 과제를 평가할 핵심 평가기준 4~6개를 제안하고,
각 기준이 무엇을 보는지 한 줄로 설명해 주세요.
(예: 문제정의 / 기술 활용 / 결과·완성도 / 분석·고찰 / 출처·윤리 / 발표·협업)`,
  },
  {
    n: 2,
    title: '성취수준(척도)과 배점 설계',
    desc: '단계별 척도와 기준별 배점을 합계 100점이 되도록 설계한다.',
    prompt: `위에서 정한 평가기준에 대해 4단계 성취수준(척도)을 설계해 주세요.

- 척도: 매우 우수(A) / 우수(B) / 보통(C) / 미흡(D)
- 각 기준의 배점 비중을 합계 100점이 되도록 배분
- 단계별 점수 구간(예: A 90~100%, B 75~89% …)도 함께 제시

이 루브릭은 출석·시험과 별개로 '과제'에만 적용하는 기준임을 전제로 합니다.`,
  },
  {
    n: 3,
    title: '루브릭 표 작성 (수준별 기술문)',
    desc: '기준×척도 표를 완성하고, 각 칸에 그 수준에서 보이는 구체적 특징을 한 문장으로 적는다.',
    prompt: `이제 아래 열로 된 루브릭 표를 완성해 주세요.
[평가기준 | 배점 | 매우 우수 | 우수 | 보통 | 미흡]

각 칸에는 그 수준에서 보이는 구체적 행동·산출물 특징을 한 문장으로 기술합니다(수준별 기술문).
'AI를 활용했으나 출처를 밝히지 않거나 개인의 분석이 없는 경우'는
감점 사유로 표 아래에 명확히 명시해 주세요.`,
  },
  {
    n: 4,
    title: '점수 환산 + 피드백 템플릿',
    desc: '채점 시 사용할 점수 합산 방식과, 학생에게 줄 피드백 문구 템플릿을 만든다.',
    prompt: `이 루브릭으로 채점할 때 사용할 다음 두 가지를 만들어 주세요.

① 점수 환산 방법: 기준별 점수를 합산하는 예시(가상의 학생 1명 채점 예시 포함)
② 피드백 문구 템플릿: [잘한 점 / 보완할 점 / 다음 단계 제안] 3단 구성

피드백은 격려하되 구체적이고, 학생이 다음 과제에 곧바로 적용할 수 있는 조언이 되도록 해 주세요.`,
  },
  {
    n: 5,
    title: '안내문으로 통합 + 검토',
    desc: '학생에게 사전 공개할 한 페이지 안내문으로 정리하고, 공정성·명료성 보완점을 받는다.',
    prompt: `완성한 루브릭을 학생에게 사전 공개할 '한 페이지 안내문'으로 정리해 주세요.

순서: ① 과제 개요·제출 형식 → ② 루브릭 표 → ③ 평가 유의사항(AI 활용 규칙 포함).

끝으로 "이 루브릭이 공정성·명료성·변별력 측면에서 부족한 점"을
평가 전문가 관점에서 3가지 지적하고 개선안을 제안해 주세요.`,
  },
]

function CopyButton({ text }) {
  const [done, setDone] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text; document.body.appendChild(ta); ta.select()
      try { document.execCommand('copy') } catch { /* noop */ }
      document.body.removeChild(ta)
    }
    setDone(true)
    setTimeout(() => setDone(false), 1500)
  }
  return (
    <button
      onClick={copy}
      style={{ flexShrink: 0, background: done ? '#2E7D55' : NAVY, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, padding: '7px 14px', borderRadius: 8 }}
    >
      {done ? '복사됨 ✓' : '프롬프트 복사'}
    </button>
  )
}

export default function RubricPractice() {
  return (
    <div>
      <h2 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 25, color: NAVY, letterSpacing: '-0.01em' }}>루브릭 제작</h2>
      <p style={{ fontSize: 15.5, color: '#5A5246', marginTop: 10, lineHeight: 1.7 }}>
        Claude 웹(claude.ai)에서 아래 프롬프트를 순서대로 복사·입력하면, 과제 평가 루브릭을 단계별로 완성할 수 있습니다.
        예시는 「AI·SW개론」의 'AI 기반 이미지 인식·생성 프로젝트' 과제이며, <b>[평가 대상]을 본인 과제로 바꾸면</b> 어떤 과제든 동일하게 만들 수 있습니다.
      </p>

      {/* 시작 안내 */}
      <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 14, background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 14, padding: '14px 18px' }}>
        <div style={{ fontFamily: SERIF, fontWeight: 700, color: NAVY, fontSize: 15 }}>시작하기</div>
        <div style={{ fontSize: 14, color: '#5A5246', flex: 1, lineHeight: 1.6 }}>
          Claude 웹을 열고 새 대화를 시작한 뒤, 1단계부터 차례로 프롬프트를 붙여넣으세요. 한 대화 안에서 이어가면 앞 단계 내용을 기억합니다.
        </div>
        <a href="https://claude.ai/new" target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 7, background: TERRA, color: '#fff', textDecoration: 'none', fontSize: 13.5, fontWeight: 700, padding: '9px 16px', borderRadius: 999 }}>Claude 웹 열기 <span style={{ fontFamily: NEWS }}>↗</span></a>
      </div>

      {/* 단계별 프롬프트 */}
      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {STEPS.map((s) => (
          <div key={s.n} style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 18px 4px' }}>
              <div style={{ flexShrink: 0, width: 30, height: 30, borderRadius: '50%', background: NAVY, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: NEWS, fontSize: 15 }}>{s.n}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 17, color: NAVY }}>{s.title}</h3>
                <p style={{ fontSize: 13.5, color: '#7A7263', marginTop: 4, lineHeight: 1.55 }}>{s.desc}</p>
              </div>
              <CopyButton text={s.prompt} />
            </div>
            <pre style={{
              margin: '8px 18px 18px', background: '#FBF8F2', border: `1px solid ${BORDER}`, borderRadius: 10,
              padding: '14px 16px', fontSize: 13, lineHeight: 1.6, color: '#1B1916', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              fontFamily: "'SFMono-Regular', ui-monospace, Menlo, Consolas, monospace",
            }}>{s.prompt}</pre>
          </div>
        ))}
      </div>

      {/* 팁 */}
      <div style={{ marginTop: 20, background: '#F1ECE1', borderRadius: 14, padding: '16px 18px', fontSize: 13.5, color: '#5A5246', lineHeight: 1.7 }}>
        <b style={{ color: NAVY }}>활용 팁</b> — 다른 과제(진로 일기, GitHub·노션 셋팅, 바이브코딩 등)에도 1단계의 <b>[평가 대상]</b>만 바꿔
        같은 흐름으로 루브릭을 만들 수 있습니다. 척도를 3단계로 줄이거나 가중치를 바꾸고 싶으면 "척도를 3단계로", "발표 비중을 30%로"처럼 한 문장으로 요청하세요.
      </div>
    </div>
  )
}
