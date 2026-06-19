const chainOfThought = {
  id: 'chain-of-thought',
  title: '사고의 연쇄',
  titleEn: 'Chain of Thought',
  icon: 'fa-link',
  sections: [
    {
      title: 'Chain of Thought(CoT) 기법',
      titleEn: 'Chain of Thought (CoT) Technique',
      content: `Chain of Thought(CoT)는 Claude에게 최종 답변에 도달하기 전에 단계별 추론 과정을 거치도록 유도하는 프롬프트 기법입니다. 이는 적응형 사고(Adaptive Thinking)와 달리 프롬프트 수준에서 적용할 수 있습니다.

### CoT의 원리

1. 문제를 작은 하위 문제로 분해합니다
2. 각 단계를 순차적으로 풀어갑니다
3. 이전 단계의 결과를 다음 단계의 입력으로 사용합니다
4. 최종 결과를 도출합니다

### 기본 CoT 프롬프트

\`\`\`
다음 문제를 단계별로 생각하며 풀어주세요.
각 단계에서 어떤 추론을 하는지 명시하세요.

문제: 한 가게에서 사과 3개를 1,500원에, 바나나 5개를 2,000원에
판매합니다. 사과 12개와 바나나 20개를 구매하면 총 얼마인가요?
\`\`\`

### Zero-shot CoT

단순히 "단계별로 생각해보세요"를 추가하는 것만으로 추론 성능이 향상됩니다:

\`\`\`
이 논리 퍼즐을 풀어주세요. 단계별로 생각해보세요.

A는 B보다 키가 크고, C는 A보다 키가 작지만 D보다 큽니다.
B는 D보다 키가 큽니다. 키가 큰 순서대로 나열하세요.
\`\`\``,
      contentEn: `Chain of Thought (CoT) is a prompting technique that guides Claude through step-by-step reasoning before arriving at a final answer. Unlike Adaptive Thinking, this can be applied at the prompt level.

### CoT Principles

1. Decompose the problem into smaller sub-problems
2. Solve each step sequentially
3. Use the results of previous steps as input for the next step
4. Derive the final result

### Basic CoT Prompt

\`\`\`
Please solve the following problem by thinking step by step.
State what reasoning you are doing at each step.

Problem: A store sells 3 apples for $1.50 and 5 bananas for $2.00.
How much would it cost to buy 12 apples and 20 bananas?
\`\`\`

### Zero-shot CoT

Simply adding "think step by step" improves reasoning performance:

\`\`\`
Solve this logic puzzle. Think step by step.

A is taller than B, C is shorter than A but taller than D.
B is taller than D. List them in order from tallest to shortest.
\`\`\``
    },
    {
      title: '고급 CoT 기법',
      titleEn: 'Advanced CoT Techniques',
      content: `### Self-Consistency

동일한 문제에 대해 여러 추론 경로를 생성하고 가장 일관된 답변을 선택합니다:

\`\`\`
다음 문제를 세 가지 다른 접근 방법으로 풀어주세요.
각 방법의 결과를 비교하고 가장 신뢰할 수 있는 답변을 선택하세요.

문제: [복잡한 문제]

방법 1: [첫 번째 접근]
방법 2: [두 번째 접근]
방법 3: [세 번째 접근]

최종 답변: [가장 일관된 결과]
\`\`\`

### Tree of Thought

여러 추론 경로를 탐색하고 각 경로를 평가합니다:

\`\`\`
다음 문제를 해결하기 위해 가능한 접근 방법들을 나열하세요.
각 접근 방법의 장단점을 평가하고 최적의 방법을 선택하세요.

<problem>
[문제 설명]
</problem>

<approach_evaluation>
접근법 A: [설명] → 장점: [...] / 단점: [...]
접근법 B: [설명] → 장점: [...] / 단점: [...]
접근법 C: [설명] → 장점: [...] / 단점: [...]
</approach_evaluation>

선택된 접근법으로 문제를 해결하세요.
\`\`\`

### 역추론(Backward Chaining)

목표에서 시작하여 역방향으로 추론합니다:

\`\`\`
목표 상태: 사용자가 성공적으로 결제를 완료한 상태

이 목표를 달성하기 위해 필요한 단계를 역순으로 나열하세요:
1. 마지막 단계: [결제 완료]
2. 그 전 단계: [결제 정보 확인]
3. 그 전 단계: [...]
...
첫 번째 단계: [...]
\`\`\`

### CoT와 적응형 사고(Adaptive Thinking)의 차이

| 특성 | Chain of Thought | 적응형 사고(Adaptive Thinking) |
|------|-----------------|-------------------|
| **적용 방식** | 프롬프트에서 지시 | API 파라미터로 활성화(thinking=adaptive) |
| **가시성** | 응답에 추론 과정 포함 | 별도 thinking 블록으로 반환(요약 표시 가능) |
| **제어** | 프롬프트로 세밀한 제어 | Effort 파라미터(low~max)로 제어 |
| **비용** | 출력 토큰에 포함 | 별도 thinking 토큰 사용 |
| **적합한 경우** | 추론 과정을 보여줘야 할 때 | 정확도가 최우선일 때 |`,
      contentEn: `### Self-Consistency

Generate multiple reasoning paths for the same problem and select the most consistent answer:

\`\`\`
Solve the following problem using three different approaches.
Compare the results of each method and select the most reliable answer.

Problem: [Complex problem]

Method 1: [First approach]
Method 2: [Second approach]
Method 3: [Third approach]

Final answer: [Most consistent result]
\`\`\`

### Tree of Thought

Explore multiple reasoning paths and evaluate each:

\`\`\`
List possible approaches to solve the following problem.
Evaluate the pros and cons of each approach and select the optimal one.

<problem>
[Problem description]
</problem>

<approach_evaluation>
Approach A: [Description] → Pros: [...] / Cons: [...]
Approach B: [Description] → Pros: [...] / Cons: [...]
Approach C: [Description] → Pros: [...] / Cons: [...]
</approach_evaluation>

Solve the problem using the selected approach.
\`\`\`

### Backward Chaining

Reason backwards from the goal:

\`\`\`
Goal state: User has successfully completed payment

List the steps needed to achieve this goal in reverse order:
1. Last step: [Payment complete]
2. Previous step: [Payment info confirmation]
3. Previous step: [...]
...
First step: [...]
\`\`\`

### CoT vs Adaptive Thinking

| Aspect | Chain of Thought | Adaptive Thinking |
|--------|-----------------|-------------------|
| **Application** | Instructed in prompt | Activated via API parameter (thinking=adaptive) |
| **Visibility** | Reasoning included in response | Returned in separate thinking block (summary available) |
| **Control** | Fine-grained control via prompt | Controlled via the Effort parameter (low–max) |
| **Cost** | Included in output tokens | Uses separate thinking tokens |
| **Best for** | When reasoning process should be shown | When accuracy is top priority |`
    }
  ]
};

export default chainOfThought;
