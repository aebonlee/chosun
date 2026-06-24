// 강의계획서 제작 — Claude 웹(claude.ai)에서 따라하며 강의계획서를 만드는 실습 예제.
// 한신대 「AI·SW개론」 강의계획서를 표본으로, 단계별 복사용 프롬프트를 제공한다.
import { useState } from 'react'

const SERIF = "'Noto Serif KR', serif"
const NEWS = "'Newsreader', serif"
const NAVY = '#1E3A5F'
const TERRA = '#C2603D'
const BORDER = '#E2D9C9'

const STEPS = [
  {
    n: 1,
    title: '역할 설정 + 기본정보로 뼈대 만들기',
    desc: 'Claude에게 강의계획서 설계 전문가 역할을 주고, 과목 기본정보를 입력해 개요·목표·역량연계를 먼저 만든다.',
    prompt: `당신은 대학 강의계획서 작성을 돕는 교육과정 설계 전문가입니다.
아래 기본정보를 바탕으로 한 학기(15주) 대학 강의계획서 초안을 만들어 주세요.

[기본정보]
- 교과목명: AI·SW개론 (학수번호 AS001-D)
- 소속/대상: AI·SW계열 1학년 · 계열공통(전공기초)
- 학점/시간: 3학점(이론 3) / 주 3시간
- 수업방식: 강의중심 + 패들렛 활용
- 과목 성격: AI·SW 신입생이 SW·DS·AIoT·AI·XR·HMI 분야의 기본 원리를 이해하고,
  컴퓨팅적 사고와 프로그래밍 기초 역량을 기르는 입문 과목

먼저 다음 3가지를 각 5~7문장으로 작성해 주세요.
① 수업개요  ② 수업목표 및 내용  ③ 핵심역량(전공능력)과 교과목의 연계성`,
  },
  {
    n: 2,
    title: '평가방식 설계',
    desc: '평가 비율과 항목별 세부 기준·유의사항을 구체화한다. AI 활용 규칙도 명시한다.',
    prompt: `이 과목의 평가방식을 아래 비율로 구체화해 주세요. 항목별 세부 기준과 유의사항을 포함합니다.

- 출석 20% (지각·조퇴·결석 감점 규정 포함)
- 중간고사 20% (오픈북·온라인, 100점 만점, 통과 점수 안내)
- 기말고사 20% (오픈북·온라인, 100점 만점)
- 과제 40% (개인 또는 팀 프로젝트, 주차별 퀴즈 포함)

조건: 시험·과제 모두 AI 활용이 가능하되 "출처를 명확히 밝히고 개인의 분석·견해를
반드시 포함"하는 것을 필수 규정으로 명확히 적어 주세요.`,
  },
  {
    n: 3,
    title: '15주차 수업진행계획 표',
    desc: '주차별 학습목표·학습내용·과제/평가를 표로 생성한다. 중간(8주)·기말(15주) 시험 배치 포함.',
    prompt: `위 강의계획을 바탕으로 15주차 수업진행계획 표를 만들어 주세요.
열 구성: [주차 | 학습목표 | 교재·학습내용(키워드) | 과제/평가].
아래 흐름을 반영하고, 각 주차에 구체적 키워드를 채워 주세요.

1주 오리엔테이션·4차 산업혁명 / 2주 컴퓨터 개요 / 3주 컴퓨터 구조(CPU·메모리) /
4주 소프트웨어·운영 / 5주 운영체제(프로세스·스레드) / 6주 네트워크·인터넷(TCP/IP) /
7주 최신 컴퓨팅 응용(클라우드·빅데이터·블록체인) / 8주 중간고사 /
9주 인공지능·빅데이터(머신러닝·딥러닝) / 10주 멀티미디어·확장현실(VR/AR/메타버스) /
11주 4차 산업혁명 핵심기술(IoT·스마트시티) / 12주 최신 IT 트렌드(엣지·양자컴퓨팅) /
13주 컴퓨팅 사고·프로그래밍(Python 기초) / 14주 데이터과학·컴퓨터 보안 / 15주 기말고사`,
  },
  {
    n: 4,
    title: '과제 설계',
    desc: '학습목표와 연결된 과제 4종을 목적·산출물·제출형식·평가포인트와 함께 설계한다.',
    prompt: `이 과목의 과제 4가지를 학습목표와 연결해 설계해 주세요.
각 과제마다 [목적 / 산출물 / 제출 형식 / 평가 포인트]를 적습니다.

예시 주제:
1) 생성형 AI로 설계하는 나의 진로 (현재·미래 일기)
2) GitHub와 노션 셋팅하기
3) AI 기반 이미지 인식·생성 기술 활용 프로젝트
4) 프로그래밍 언어 기초 문법 학습 및 실습 (바이브코딩)

모든 과제에 "AI 활용 가능, 단 출처 명시·개인 분석 필수" 조건을 포함해 주세요.`,
  },
  {
    n: 5,
    title: '제출용 문서로 통합 + 검토',
    desc: '지금까지 만든 내용을 공식 강의계획서 한 문서로 합치고, 어투를 다듬은 뒤 보완점을 받는다.',
    prompt: `지금까지 작성한 내용을 대학 제출용 강의계획서 한 문서로 통합해 주세요.

순서: ① 기본정보 표 → ② 수업개요·수업목표·핵심역량 연계 →
③ 평가방식 → ④ 과제 → ⑤ 15주차 수업진행계획 표.

문장은 '~한다 / ~할 수 있다' 형식의 공식적 어투로 다듬고,
마지막에 "담당 교수가 추가로 확인하면 좋을 점 3가지"를 제안해 주세요.`,
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

export default function SyllabusPractice() {
  return (
    <div>
      <h2 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 25, color: NAVY, letterSpacing: '-0.01em' }}>강의계획서 제작</h2>
      <p style={{ fontSize: 15.5, color: '#5A5246', marginTop: 10, lineHeight: 1.7 }}>
        Claude 웹(claude.ai)에서 아래 프롬프트를 순서대로 복사·입력하면, 한 학기 강의계획서를 단계별로 완성할 수 있습니다.
        예시는 「AI·SW개론」(1학년·3학점·15주) 강의계획서이며, <b>[기본정보]를 본인 과목으로 바꾸면</b> 어떤 과목이든 동일하게 만들 수 있습니다.
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
        <b style={{ color: NAVY }}>활용 팁</b> — 결과가 마음에 들지 않으면 "표를 더 자세히", "평가 비율을 30/30/40으로", "전공 용어를 쉽게 풀어서"처럼
        한 문장으로 수정 요청하세요. 완성 후에는 "이 강의계획서의 부족한 점을 평가자 관점에서 지적해줘"로 검토까지 맡길 수 있습니다.
      </div>
    </div>
  )
}
