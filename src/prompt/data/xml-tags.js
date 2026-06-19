const xmlTags = {
  id: 'xml-tags',
  title: 'XML 태그 활용',
  titleEn: 'XML Tag Usage',
  icon: 'fa-code',
  sections: [
    {
      title: 'XML 태그란?',
      titleEn: 'What are XML Tags?',
      content: `XML 태그는 Claude 프롬프트에서 서로 다른 유형의 정보를 구분하고 구조화하는 데 사용되는 강력한 기법입니다. Claude는 XML 태그를 인식하고 구조화된 입력을 더 잘 처리합니다.

### XML 태그를 사용하는 이유

- **명확한 구분**: 지시사항, 컨텍스트, 입력 데이터를 명확히 분리
- **일관된 파싱**: Claude가 각 섹션의 역할을 정확히 이해
- **재사용성**: 동일한 구조의 프롬프트를 다양한 입력에 재사용
- **가독성**: 복잡한 프롬프트도 읽기 쉽게 구성

### 기본 문법

\`\`\`xml
<instructions>
여기에 Claude에게 전달할 지시사항을 작성합니다.
</instructions>

<context>
여기에 배경 정보나 참고 자료를 넣습니다.
</context>

<input>
여기에 처리할 실제 데이터를 넣습니다.
</input>
\`\`\``,
      contentEn: `XML tags are a powerful technique used in Claude prompts to separate and structure different types of information. Claude recognizes XML tags and processes structured input more effectively.

### Why Use XML Tags

- **Clear Separation**: Clearly separate instructions, context, and input data
- **Consistent Parsing**: Claude accurately understands the role of each section
- **Reusability**: Reuse the same prompt structure with different inputs
- **Readability**: Even complex prompts become easy to read

### Basic Syntax

\`\`\`xml
<instructions>
Write instructions for Claude here.
</instructions>

<context>
Place background information or references here.
</context>

<input>
Place the actual data to process here.
</input>
\`\`\``
    },
    {
      title: '일반적인 XML 태그 패턴',
      titleEn: 'Common XML Tag Patterns',
      content: `### 문서 분석 패턴

\`\`\`xml
<document>
{{DOCUMENT_CONTENT}}
</document>

<instructions>
위 문서를 분석하고 다음을 수행하세요:
1. 핵심 주제 3가지를 식별하세요
2. 각 주제에 대한 요약을 작성하세요
3. 문서의 전체 톤을 평가하세요
</instructions>

<output_format>
## 핵심 주제
1. [주제] - [요약]
2. [주제] - [요약]
3. [주제] - [요약]

## 톤 평가
[평가 내용]
</output_format>
\`\`\`

### 코드 변환 패턴

\`\`\`xml
<source_code language="python">
def calculate_total(items):
    total = 0
    for item in items:
        total += item['price'] * item['quantity']
    return total
</source_code>

<instructions>
위 코드를 TypeScript로 변환해주세요.
타입 안전성을 보장하고 인터페이스를 정의하세요.
</instructions>
\`\`\`

### 다중 예시 패턴

\`\`\`xml
<examples>
  <example>
    <input>서울의 날씨는 어떻습니까?</input>
    <output>{"intent": "weather_query", "location": "서울"}</output>
  </example>
  <example>
    <input>내일 부산으로 항공편 예약해줘</input>
    <output>{"intent": "flight_booking", "destination": "부산", "date": "tomorrow"}</output>
  </example>
</examples>

<instructions>
위 예시를 참고하여 다음 입력을 분류하세요.
</instructions>

<input>
다음 주 제주도 호텔 추천해줘
</input>
\`\`\`

### 조건부 지시 패턴

\`\`\`xml
<instructions>
사용자 질문을 분석하고 적절히 응답하세요.

<if_technical>
기술적 질문인 경우 코드 예시를 포함하고 단계별로 설명하세요.
</if_technical>

<if_general>
일반 질문인 경우 간결하고 친근하게 답변하세요.
</if_general>
</instructions>
\`\`\``,
      contentEn: `### Document Analysis Pattern

\`\`\`xml
<document>
{{DOCUMENT_CONTENT}}
</document>

<instructions>
Analyze the above document and do the following:
1. Identify 3 key topics
2. Write a summary for each topic
3. Evaluate the overall tone of the document
</instructions>

<output_format>
## Key Topics
1. [Topic] - [Summary]
2. [Topic] - [Summary]
3. [Topic] - [Summary]

## Tone Evaluation
[Evaluation content]
</output_format>
\`\`\`

### Code Conversion Pattern

\`\`\`xml
<source_code language="python">
def calculate_total(items):
    total = 0
    for item in items:
        total += item['price'] * item['quantity']
    return total
</source_code>

<instructions>
Convert the above code to TypeScript.
Ensure type safety and define interfaces.
</instructions>
\`\`\`

### Multiple Examples Pattern

\`\`\`xml
<examples>
  <example>
    <input>What's the weather like in Seoul?</input>
    <output>{"intent": "weather_query", "location": "Seoul"}</output>
  </example>
  <example>
    <input>Book a flight to Busan tomorrow</input>
    <output>{"intent": "flight_booking", "destination": "Busan", "date": "tomorrow"}</output>
  </example>
</examples>

<instructions>
Classify the following input based on the examples above.
</instructions>

<input>
Recommend a hotel in Jeju next week
</input>
\`\`\`

### Conditional Instruction Pattern

\`\`\`xml
<instructions>
Analyze the user question and respond appropriately.

<if_technical>
For technical questions, include code examples and explain step by step.
</if_technical>

<if_general>
For general questions, respond concisely and in a friendly manner.
</if_general>
</instructions>
\`\`\``
    }
  ]
};

export default xmlTags;
