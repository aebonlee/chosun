const basics = {
  id: 'basics',
  title: '프롬프트 기본 원칙',
  titleEn: 'Prompt Fundamentals',
  icon: 'fa-lightbulb',
  sections: [
    {
      title: '프롬프트 엔지니어링이란?',
      titleEn: 'What is Prompt Engineering?',
      content: `프롬프트 엔지니어링은 AI 모델에게 원하는 결과를 얻기 위해 입력(프롬프트)을 체계적으로 설계하는 기술입니다. 잘 작성된 프롬프트는 Claude의 능력을 최대한 활용할 수 있게 합니다.

### 프롬프트의 핵심 요소

1. **명확성(Clarity)**: 모호함 없이 구체적으로 지시합니다
2. **컨텍스트(Context)**: 충분한 배경 정보를 제공합니다
3. **구조(Structure)**: 논리적인 순서로 정보를 구성합니다
4. **예시(Examples)**: 기대하는 출력의 예시를 포함합니다
5. **제약 조건(Constraints)**: 출력의 형식, 길이, 스타일 등을 지정합니다

### 좋은 프롬프트 vs 나쁜 프롬프트

**나쁜 프롬프트:**
\`\`\`
코드 써줘
\`\`\`

**좋은 프롬프트:**
\`\`\`
Python으로 CSV 파일을 읽어서 날짜별 매출 합계를 계산하는 함수를 작성해줘.
- pandas 라이브러리 사용
- 입력: 파일 경로 (str)
- 출력: DataFrame (날짜, 매출합계 컬럼)
- 에러 처리 포함
- 독스트링 포함
\`\`\``,
      contentEn: `Prompt engineering is the systematic technique of designing inputs (prompts) to obtain desired results from AI models. Well-crafted prompts enable you to maximize Claude's capabilities.

### Key Elements of a Prompt

1. **Clarity**: Give specific instructions without ambiguity
2. **Context**: Provide sufficient background information
3. **Structure**: Organize information in a logical order
4. **Examples**: Include examples of expected output
5. **Constraints**: Specify output format, length, style, etc.

### Good Prompts vs Bad Prompts

**Bad Prompt:**
\`\`\`
Write some code
\`\`\`

**Good Prompt:**
\`\`\`
Write a Python function that reads a CSV file and calculates total sales by date.
- Use the pandas library
- Input: file path (str)
- Output: DataFrame (date, total_sales columns)
- Include error handling
- Include docstring
\`\`\``
    },
    {
      title: '기본 프롬프트 패턴',
      titleEn: 'Basic Prompt Patterns',
      content: `### 역할 지정 패턴

Claude에게 특정 역할을 부여하면 해당 분야의 전문성을 발휘합니다:

\`\`\`
당신은 10년 경력의 시니어 백엔드 개발자입니다.
다음 코드를 리뷰하고 개선점을 제안해주세요.
\`\`\`

### 단계적 지시 패턴

복잡한 작업을 단계로 나누어 지시합니다:

\`\`\`
다음 단계에 따라 분석해주세요:
1. 먼저 데이터의 전체 구조를 파악하세요
2. 이상치를 식별하세요
3. 주요 패턴을 설명하세요
4. 개선 방안을 제안하세요
\`\`\`

### 출력 형식 지정 패턴

원하는 출력 형식을 명시합니다:

\`\`\`
다음 텍스트를 분석하고 결과를 JSON 형식으로 출력해주세요:
{
  "sentiment": "positive/negative/neutral",
  "confidence": 0.0-1.0,
  "key_topics": ["topic1", "topic2"],
  "summary": "한 문장 요약"
}
\`\`\`

### Few-shot 패턴

원하는 출력의 예시를 먼저 보여줍니다:

\`\`\`
다음 형식으로 제품 설명을 작성해줘:

예시 1:
제품: 무선 이어폰
설명: 끊김 없는 블루투스 5.3 연결로 몰입감 있는 음악 감상을 제공하는 프리미엄 무선 이어폰

예시 2:
제품: 스마트 워치
설명: 건강 모니터링과 알림 기능을 갖춘 세련된 디자인의 스마트 워치

이제 작성해줘:
제품: 노이즈 캔슬링 헤드폰
\`\`\``,
      contentEn: `### Role Assignment Pattern

Assigning a specific role to Claude draws out domain expertise:

\`\`\`
You are a senior backend developer with 10 years of experience.
Please review the following code and suggest improvements.
\`\`\`

### Step-by-Step Instruction Pattern

Break down complex tasks into steps:

\`\`\`
Please analyze following these steps:
1. First, understand the overall structure of the data
2. Identify outliers
3. Explain key patterns
4. Suggest improvement strategies
\`\`\`

### Output Format Specification Pattern

Specify the desired output format explicitly:

\`\`\`
Analyze the following text and output the results in JSON format:
{
  "sentiment": "positive/negative/neutral",
  "confidence": 0.0-1.0,
  "key_topics": ["topic1", "topic2"],
  "summary": "One sentence summary"
}
\`\`\`

### Few-shot Pattern

Show examples of desired output first:

\`\`\`
Write product descriptions in the following format:

Example 1:
Product: Wireless Earbuds
Description: Premium wireless earbuds delivering immersive music with seamless Bluetooth 5.3 connectivity

Example 2:
Product: Smart Watch
Description: Elegantly designed smart watch with health monitoring and notification features

Now write:
Product: Noise Cancelling Headphones
\`\`\``
    }
  ]
};

export default basics;
