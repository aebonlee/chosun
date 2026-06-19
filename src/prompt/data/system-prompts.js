const systemPrompts = {
  id: 'system-prompts',
  title: '시스템 프롬프트',
  titleEn: 'System Prompts',
  icon: 'fa-gear',
  sections: [
    {
      title: '시스템 프롬프트란?',
      titleEn: 'What are System Prompts?',
      content: `시스템 프롬프트는 Claude에게 대화 전체에 걸쳐 적용되는 행동 지침, 역할, 제약 조건을 설정하는 특별한 프롬프트입니다. API 호출 시 \`system\` 파라미터로 전달됩니다.

### 시스템 프롬프트의 역할

- **페르소나 설정**: Claude의 역할과 전문성을 정의
- **행동 규칙**: 응답 시 따라야 할 규칙 설정
- **출력 형식**: 기본 응답 형식을 지정
- **제약 조건**: 하지 말아야 할 행동이나 범위 제한
- **톤과 스타일**: 응답의 어조와 스타일 설정

### 기본 구조

\`\`\`
당신은 [역할/페르소나]입니다.

## 핵심 지침
- [지침 1]
- [지침 2]

## 응답 규칙
- [규칙 1]
- [규칙 2]

## 제약 조건
- [제약 1]
- [제약 2]
\`\`\``,
      contentEn: `System prompts are special prompts that set behavioral guidelines, roles, and constraints for Claude throughout the entire conversation. They are passed via the \`system\` parameter in API calls.

### Role of System Prompts

- **Persona Setting**: Define Claude's role and expertise
- **Behavioral Rules**: Set rules to follow when responding
- **Output Format**: Specify default response format
- **Constraints**: Limit behaviors or scope
- **Tone and Style**: Set the tone and style of responses

### Basic Structure

\`\`\`
You are a [role/persona].

## Core Instructions
- [Instruction 1]
- [Instruction 2]

## Response Rules
- [Rule 1]
- [Rule 2]

## Constraints
- [Constraint 1]
- [Constraint 2]
\`\`\``
    },
    {
      title: '시스템 프롬프트 예시',
      titleEn: 'System Prompt Examples',
      content: `### 코드 리뷰어

\`\`\`
당신은 시니어 소프트웨어 엔지니어로, 코드 리뷰를 전문으로 합니다.

## 리뷰 기준
- 코드 가독성 및 명명 규칙
- 성능 최적화 가능성
- 보안 취약점
- SOLID 원칙 준수 여부
- 테스트 가능성

## 응답 형식
각 이슈를 다음 형식으로 보고하세요:
- 🔴 심각: 반드시 수정 필요
- 🟡 경고: 수정 권장
- 🟢 제안: 개선 가능

## 규칙
- 항상 구체적인 코드 라인을 참조하세요
- 문제점뿐만 아니라 해결 방안도 제시하세요
- 잘된 부분도 인정하세요
\`\`\`

### 기술 문서 작성자

\`\`\`
당신은 기술 문서 전문 작성자입니다.

## 작성 원칙
- 명확하고 간결한 문장 사용
- 전문 용어는 첫 사용 시 설명 포함
- 실제 코드 예시 필수 포함
- 단계별 가이드 형식 선호

## 문서 구조
1. 개요
2. 사전 요구사항
3. 설치/설정
4. 사용 방법 (단계별)
5. 예시
6. 트러블슈팅
7. 참고 자료
\`\`\`

### API를 통한 시스템 프롬프트 설정

\`\`\`python
import anthropic

client = anthropic.Anthropic()

message = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system="당신은 친절한 한국어 교사입니다. 항상 예시와 함께 설명하세요.",
    messages=[
        {"role": "user", "content": "한국어에서 존댓말은 어떻게 사용하나요?"}
    ]
)
\`\`\``,
      contentEn: `### Code Reviewer

\`\`\`
You are a senior software engineer specializing in code reviews.

## Review Criteria
- Code readability and naming conventions
- Performance optimization opportunities
- Security vulnerabilities
- SOLID principle compliance
- Testability

## Response Format
Report each issue in the following format:
- 🔴 Critical: Must fix
- 🟡 Warning: Recommended fix
- 🟢 Suggestion: Can improve

## Rules
- Always reference specific code lines
- Provide solutions, not just problems
- Acknowledge well-written parts
\`\`\`

### Technical Documentation Writer

\`\`\`
You are a technical documentation specialist.

## Writing Principles
- Use clear, concise sentences
- Include explanations for technical terms on first use
- Always include real code examples
- Prefer step-by-step guide format

## Document Structure
1. Overview
2. Prerequisites
3. Installation/Setup
4. Usage (step-by-step)
5. Examples
6. Troubleshooting
7. References
\`\`\`

### Setting System Prompts via API

\`\`\`python
import anthropic

client = anthropic.Anthropic()

message = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system="You are a friendly English teacher. Always explain with examples.",
    messages=[
        {"role": "user", "content": "How do I use the present perfect tense?"}
    ]
)
\`\`\``
    }
  ]
};

export default systemPrompts;
