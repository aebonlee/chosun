// 조선대 교원 교육.dc.html 의 renderVals() 에서 그대로 옮긴 콘텐츠 데이터

export const heroStats = [
  { value: '2일', label: '총 14시간 집중 과정' },
  { value: '8', label: '단계별 실습 모듈' },
  { value: '45명', label: '전임 교원 정원' },
  { value: '1:2', label: '주강사 + 보조강사 지도' },
]

export const overviewItems = [
  { no: '01', label: '교육 대상', value: '조선대학교 전임 교원 (학과 무관, 약 45명)' },
  { no: '02', label: '교육 일정', value: '2026년 6월 24일(수) – 25일(목)' },
  { no: '03', label: '교육 시간', value: '매일 10:00 – 18:00 · 1일 7시간' },
  { no: '04', label: '교육 장소', value: '조선대학교 (오프라인 진행)' },
  { no: '05', label: '운영 방식', value: '강의 + 밀착 실습, 보조강사 1명 동반' },
  { no: '06', label: '난이도', value: '비전공자 기준 · 실습 중심 운영' },
]

export const days = [
  {
    day: 'Day 1', date: '6.24 WED', accent: '#1E3A5F', headBg: '#F4F6F9', chipBg: '#E3EAF2',
    title: 'Claude 기반 연구 업무 활용',
    subtitle: '기초부터 논문 리뷰·글쓰기·데이터·제안서, 개인 연구용 Project 구축까지',
    sessions: [
      { time: '10:00–10:50', title: '오리엔테이션 & Claude 기초', desc: '계정·환경 설정, 프롬프트 기본기, 안전한 활용 원칙' },
      { time: '11:00–11:50', title: '논문 PDF 기반 연구 리뷰 매트릭스', desc: 'PDF 업로드 → 핵심 추출 → 비교 매트릭스 자동 작성' },
      { time: '13:00–13:50', title: '학술 글쓰기 & 영문 초록·교정', afterLunch: true, desc: '초록 다듬기, 영문 교정, 문체·논리 점검' },
      { time: '14:00–14:50', title: '데이터 분석 리포트 작성', desc: '데이터 요약·시각화 해설·인사이트 도출 리포트 만들기' },
      { time: '15:00–15:50', title: '연구 공고문 기반 제안서 초안', desc: '공고문 분석 → 요건 매핑 → 제안서 구조 초안 생성' },
      { time: '16:00–16:50', title: '문헌·자료 탐색과 인용 정리', desc: '검색 전략 수립, 자료 요약, 참고문헌·인용 정리' },
      { time: '17:00–17:50', title: '개인 연구 업무용 Claude Project 구축', desc: '본인 연구 맥락을 담은 전용 Project 세팅·실습' },
    ],
  },
  {
    day: 'Day 2', date: '6.25 THU', accent: '#C2603D', headBg: '#FBF3EC', chipBg: '#F3E1D5',
    title: 'AX 브릿지 교과목 설계',
    subtitle: '강의 재설계·콘텐츠 생성·PBL부터 과목 에이전트와 튜터 지침까지',
    sessions: [
      { time: '10:00–10:50', title: '교과목 AI 접목 아이디어 도출', desc: '담당 과목 진단 → AI 활용 지점 발굴 워크숍' },
      { time: '11:00–11:50', title: '강의자료·강의계획서 재구성', desc: '학습목표 정렬, 강의안·슬라이드 초안 생성' },
      { time: '13:00–13:50', title: '강의용 콘텐츠 생성', afterLunch: true, desc: '퀴즈·예제·난이도별 설명자료 제작' },
      { time: '14:00–14:50', title: 'AI 활용 PBL 과제 설계', desc: '문제기반학습 시나리오와 평가 루브릭 설계서 작성' },
      { time: '15:00–15:50', title: '과목·연구 에이전트 구축', desc: 'Claude Project 기반 과목 전용 에이전트 만들기' },
      { time: '16:00–16:50', title: '튜터 지침 작성 실습', desc: '학생 응대 규칙·범위·말투를 담은 튜터 지침서 작성' },
      { time: '17:00–17:50', title: '공유 & 마무리', desc: '산출물 발표, 현업 적용 계획, Q&A' },
    ],
  },
]

export const labs = [
  { no: '01', tag: 'RESEARCH', title: '연구 리뷰 매트릭스', desc: '여러 논문 PDF를 한 번에 비교하는 구조화 표를 생성합니다.', output: '비교 매트릭스 시트', tint: '#E8EEF5', ink: '#1E3A5F' },
  { no: '02', tag: 'RESEARCH', title: '데이터 분석 리포트', desc: '데이터셋 요약과 해석을 담은 분석 리포트를 작성합니다.', output: '분석 리포트 문서', tint: '#E8EEF5', ink: '#1E3A5F' },
  { no: '03', tag: 'RESEARCH', title: '연구 제안서 초안', desc: '공고문 요건에 맞춘 제안서 골격과 초안을 만듭니다.', output: '제안서 초안', tint: '#E8EEF5', ink: '#1E3A5F' },
  { no: '04', tag: 'RESEARCH', title: '개인 연구 Project', desc: '본인 연구 맥락이 반영된 전용 Claude Project를 구축합니다.', output: '전용 Project', tint: '#E8EEF5', ink: '#1E3A5F' },
  { no: '05', tag: 'TEACHING', title: '교과목 AI 접목 설계', desc: '담당 과목에 AI를 접목할 구체적 아이디어를 도출합니다.', output: '접목 아이디어 보드', tint: '#F4E5DA', ink: '#A8521F' },
  { no: '06', tag: 'TEACHING', title: 'PBL 과제 설계서', desc: 'AI 활용 문제기반학습 과제와 루브릭을 설계합니다.', output: 'PBL 설계서', tint: '#F4E5DA', ink: '#A8521F' },
  { no: '07', tag: 'TEACHING', title: '과목·연구 에이전트', desc: 'Project 기반 과목 전용 에이전트를 구축합니다.', output: '과목 에이전트', tint: '#F4E5DA', ink: '#A8521F' },
  { no: '08', tag: 'TEACHING', title: '튜터 지침 작성', desc: '학생 응대 범위와 규칙을 담은 튜터 지침서를 작성합니다.', output: '튜터 지침서', tint: '#F4E5DA', ink: '#A8521F' },
]

export const prep = [
  { no: '1', title: '노트북 지참', desc: '웹 브라우저(Chrome 권장)가 설치된 개인 노트북' },
  { no: '2', title: 'Claude 계정', desc: '사전 안내된 방법으로 계정 준비 (현장 발급 지원)' },
  { no: '3', title: '담당 교과목 자료', desc: '강의계획서 등 Day 2 실습에 활용할 본인 과목 자료' },
  { no: '4', title: '연구 자료 1–2건', desc: '논문 PDF·데이터 등 Day 1 실습용 본인 연구 자료' },
]

export const infoCards = [
  { kicker: 'Faculty', rows: [
    { k: '주강사', v: '메인 강의 리딩 · 전체 진행' },
    { k: '보조강사', v: '1명 · 실습 밀착 지도' },
    { k: '지도 방식', v: '참여자 밀착 · 1:2 운영' },
  ] },
  { kicker: 'Logistics', rows: [
    { k: '장소', v: '조선대학교 (오프라인)' },
    { k: '정원', v: '전임 교원 약 45명' },
    { k: '구성', v: '강의 + 단계별 실습' },
  ] },
  { kicker: 'Schedule', rows: [
    { k: '기간', v: '2026. 6. 24 – 6. 25' },
    { k: '시간', v: '매일 10:00 – 18:00' },
    { k: '총 시간', v: '2일 · 14시간' },
  ] },
]
