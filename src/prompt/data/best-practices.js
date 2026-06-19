const bestPractices = {
  id: 'best-practices',
  title: '베스트 프랙티스',
  titleEn: 'Best Practices',
  icon: 'fa-star',
  sections: [
    {
      title: '프롬프트 최적화 원칙',
      titleEn: 'Prompt Optimization Principles',
      content: `### 1. 명확하고 직접적으로 지시하기

Claude는 명확한 지시를 선호합니다. 불필요한 예의 표현이나 우회적 표현 대신 직접적으로 요청하세요.

**비효율적:**
\`\`\`
혹시 가능하시다면, 이 코드를 살펴봐 주시겠어요?
어쩌면 몇 가지 개선점이 있을 수도 있을 것 같은데요.
\`\`\`

**효율적:**
\`\`\`
이 코드를 리뷰하고 다음 관점에서 개선점을 제시하세요:
1. 성능
2. 가독성
3. 에러 처리
\`\`\`

### 2. 충분한 컨텍스트 제공하기

Claude는 더 많은 관련 정보가 있을수록 더 정확한 응답을 생성합니다:

\`\`\`
<context>
프로젝트: React 기반 e-commerce 플랫폼
기술 스택: React 18, TypeScript, Redux Toolkit, RTK Query
대상 사용자: 모바일 위주의 20-30대 사용자
</context>

<task>
장바구니 페이지의 성능을 최적화하는 방안을 제안하세요.
</task>
\`\`\`

### 3. 원하지 않는 것 대신 원하는 것을 말하기

**비효율적:**
\`\`\`
너무 기술적으로 쓰지 마세요. 전문 용어를 사용하지 마세요.
\`\`\`

**효율적:**
\`\`\`
비기술직 독자도 이해할 수 있도록 일상적인 언어로 설명하세요.
전문 용어가 필요한 경우 간단한 정의를 괄호 안에 포함하세요.
\`\`\``,
      contentEn: `### 1. Give Clear, Direct Instructions

Claude prefers clear instructions. Instead of unnecessary politeness or roundabout expressions, make direct requests.

**Inefficient:**
\`\`\`
If it's not too much trouble, could you maybe take a look at this code?
There might perhaps be a few improvements that could possibly be made.
\`\`\`

**Efficient:**
\`\`\`
Review this code and suggest improvements in the following areas:
1. Performance
2. Readability
3. Error handling
\`\`\`

### 2. Provide Sufficient Context

Claude generates more accurate responses with more relevant information:

\`\`\`
<context>
Project: React-based e-commerce platform
Tech stack: React 18, TypeScript, Redux Toolkit, RTK Query
Target users: Mobile-first users in their 20s-30s
</context>

<task>
Suggest ways to optimize the shopping cart page performance.
</task>
\`\`\`

### 3. Say What You Want, Not What You Don't Want

**Inefficient:**
\`\`\`
Don't be too technical. Don't use jargon.
\`\`\`

**Efficient:**
\`\`\`
Explain in everyday language that non-technical readers can understand.
If technical terms are necessary, include brief definitions in parentheses.
\`\`\``
    },
    {
      title: '고급 프롬프트 테크닉',
      titleEn: 'Advanced Prompt Techniques',
      content: `### 프롬프트 체이닝

복잡한 작업을 여러 단계의 프롬프트로 나누어 순차적으로 수행합니다:

**1단계: 데이터 추출**
\`\`\`
다음 이메일에서 핵심 정보를 추출하세요: 발신자, 주제, 요청 사항, 마감일
\`\`\`

**2단계: 분류**
\`\`\`
추출된 정보를 기반으로 우선순위를 분류하세요: 긴급, 중요, 일반
\`\`\`

**3단계: 액션 생성**
\`\`\`
분류 결과를 기반으로 각 항목에 대한 구체적 액션 아이템을 생성하세요
\`\`\`

### 메타 프롬프팅

Claude에게 프롬프트를 생성하게 합니다:

\`\`\`
다음 작업을 수행하는 최적의 프롬프트를 작성해주세요:
- 목표: 고객 리뷰에서 감성 분석 수행
- 출력: 구조화된 JSON
- 요구사항: 긍정/부정/중립 분류, 핵심 키워드 추출, 신뢰도 점수
\`\`\`

### 자기 검증 패턴

Claude에게 자신의 답변을 검증하도록 요청합니다:

\`\`\`
<task>
다음 질문에 답변하고, 답변의 정확성을 스스로 검증하세요.

질문: [질문 내용]
</task>

<verification>
답변을 완료한 후 다음을 확인하세요:
1. 사실적 오류는 없는가?
2. 논리적 비약은 없는가?
3. 불확실한 정보에 대해 명시했는가?
4. 질문의 모든 부분에 답했는가?
</verification>
\`\`\`

### 일반적인 실수와 해결법

| 실수 | 해결법 |
|------|--------|
| 너무 모호한 지시 | 구체적인 요구사항과 예시 추가 |
| 과도한 정보 제공 | 관련 정보만 선별하여 제공 |
| 형식 미지정 | 출력 형식을 명시적으로 지정 |
| 컨텍스트 부족 | 배경, 대상, 목적을 명시 |
| 단일 프롬프트로 모든 것 | 복잡한 작업은 단계별로 분리 |`,
      contentEn: `### Prompt Chaining

Break complex tasks into multiple prompt steps executed sequentially:

**Step 1: Data Extraction**
\`\`\`
Extract key information from the following email: sender, subject, requests, deadline
\`\`\`

**Step 2: Classification**
\`\`\`
Based on the extracted information, classify priority: urgent, important, normal
\`\`\`

**Step 3: Action Generation**
\`\`\`
Based on the classification results, generate specific action items for each entry
\`\`\`

### Meta-Prompting

Have Claude generate prompts for you:

\`\`\`
Write an optimal prompt for the following task:
- Goal: Perform sentiment analysis on customer reviews
- Output: Structured JSON
- Requirements: Positive/negative/neutral classification, key keyword extraction, confidence score
\`\`\`

### Self-Verification Pattern

Ask Claude to verify its own answer:

\`\`\`
<task>
Answer the following question and verify your answer's accuracy.

Question: [Question content]
</task>

<verification>
After completing your answer, verify the following:
1. Are there any factual errors?
2. Are there any logical leaps?
3. Did you flag uncertain information?
4. Did you answer all parts of the question?
</verification>
\`\`\`

### Common Mistakes and Solutions

| Mistake | Solution |
|---------|----------|
| Too vague instructions | Add specific requirements and examples |
| Too much information | Provide only relevant information |
| Unspecified format | Explicitly specify output format |
| Lack of context | State background, audience, and purpose |
| Everything in one prompt | Break complex tasks into stages |`
    }
  ]
};

export default bestPractices;
