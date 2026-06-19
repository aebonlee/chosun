const extendedThinking = {
  id: 'extended-thinking',
  title: '적응형 사고 & Effort',
  titleEn: 'Adaptive Thinking & Effort',
  icon: 'fa-brain',
  sections: [
    {
      title: '적응형 사고(Adaptive Thinking)란?',
      titleEn: 'What is Adaptive Thinking?',
      content: `적응형 사고(Adaptive Thinking)는 Claude가 응답하기 전에 **언제, 얼마나 깊이 사고할지 스스로 결정**하도록 하는 최신 방식입니다. 복잡한 추론, 수학 문제, 다단계 분석에서 더 정확한 결과를 제공합니다.

> **변경 안내:** 과거의 "확장적 사고(extended thinking)"는 \`budget_tokens\`로 사고량을 직접 지정했습니다. 이 방식은 폐기되었으며, Opus 4.7 / Opus 4.8 / Fable 5에서 \`budget_tokens\`를 보내면 **400 오류**가 발생합니다. 현재는 \`thinking={"type": "adaptive"}\` + **Effort 파라미터**를 사용합니다.

### 작동 원리

1. Claude가 질문을 받으면 필요할 때 **사고 블록(thinking block)** 에서 내부 추론을 수행합니다
2. 문제 난도에 맞춰 사고 깊이를 **자동 조절**합니다(고정 토큰 예산 불필요)
3. 도구 호출 사이에도 자동으로 사고를 끼워 넣습니다(interleaved thinking)
4. 최종 답변을 구성하여 응답합니다

### 적응형 사고가 효과적인 경우

- **복잡한 수학/논리 문제**: 다단계 계산이나 증명이 필요한 문제
- **코드 분석**: 복잡한 버그 추적이나 아키텍처 설계
- **전략적 의사결정**: 여러 요소를 고려해야 하는 의사결정
- **긴 문서 분석**: 대규모 텍스트의 종합적 분석
- **에이전트 작업**: 도구를 연쇄 호출하는 장기 작업

### API에서의 사용

\`\`\`python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=16000,
    thinking={"type": "adaptive"},          # 적응형 사고 활성화
    output_config={"effort": "high"},       # low | medium | high | xhigh | max
    messages=[{
        "role": "user",
        "content": "이 알고리즘의 시간 복잡도를 분석하고 최적화 방안을 제시해주세요."
    }]
)

# 사고 과정과 응답 확인
for block in response.content:
    if block.type == "thinking":
        print("사고 과정:", block.thinking)
    elif block.type == "text":
        print("응답:", block.text)
\`\`\`

> 사고 요약을 화면에 보여주려면 \`thinking={"type": "adaptive", "display": "summarized"}\`로 설정하세요. 기본값은 \`"omitted"\`(요약 텍스트가 비어 있음)입니다.`,
      contentEn: `Adaptive Thinking is the current approach that lets Claude **decide on its own when and how deeply to think** before responding. It delivers more accurate results for complex reasoning, math problems, and multi-step analysis.

> **What changed:** The older "extended thinking" set the amount of thinking directly with \`budget_tokens\`. That approach is deprecated, and sending \`budget_tokens\` on Opus 4.7 / Opus 4.8 / Fable 5 returns a **400 error**. Today you use \`thinking={"type": "adaptive"}\` plus the **Effort parameter**.

### How It Works

1. When Claude receives a question, it performs internal reasoning in a **thinking block** when useful
2. It **automatically adjusts** thinking depth to the difficulty of the task (no fixed token budget)
3. It also interleaves thinking between tool calls automatically
4. It composes and delivers the final answer

### When Adaptive Thinking is Effective

- **Complex Math/Logic Problems**: Problems requiring multi-step calculations or proofs
- **Code Analysis**: Complex bug tracking or architecture design
- **Strategic Decision Making**: Decisions requiring consideration of multiple factors
- **Long Document Analysis**: Comprehensive analysis of large texts
- **Agentic Work**: Long-horizon tasks that chain multiple tool calls

### Usage in API

\`\`\`python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=16000,
    thinking={"type": "adaptive"},          # enable adaptive thinking
    output_config={"effort": "high"},       # low | medium | high | xhigh | max
    messages=[{
        "role": "user",
        "content": "Analyze the time complexity of this algorithm and suggest optimizations."
    }]
)

# Check thinking process and response
for block in response.content:
    if block.type == "thinking":
        print("Thinking:", block.thinking)
    elif block.type == "text":
        print("Response:", block.text)
\`\`\`

> To show a readable summary of the reasoning, set \`thinking={"type": "adaptive", "display": "summarized"}\`. The default is \`"omitted"\` (empty summary text).`
    },
    {
      title: 'Effort 파라미터 & 활용 팁',
      titleEn: 'Effort Parameter & Tips',
      content: `### Effort 파라미터로 사고 깊이 제어

고정 토큰 예산 대신, \`output_config\`의 \`effort\` 값으로 사고 깊이와 전체 토큰 사용량을 조절합니다(기본값 \`high\`):

| Effort | 사용 상황 | 설명 |
|--------|-----------|------|
| \`low\` | 단순/지연 민감 작업 | 빠른 응답, 최소 사고 |
| \`medium\` | 비용 절감이 필요한 일반 작업 | 균형 |
| \`high\` | 대부분의 지능 민감 작업(기본값) | 품질과 비용의 좋은 균형 |
| \`xhigh\` | 코딩·에이전트 작업 | Opus 4.7+에서 코딩/에이전트에 권장 |
| \`max\` | 정확도가 비용보다 중요한 최난도 작업 | 최대 깊이(과도한 사고 주의) |

### 주의사항

- \`budget_tokens\` 방식은 폐기되었습니다. Opus 4.7 / 4.8 / Fable 5에서 \`budget_tokens\`는 **400 오류** → 대신 \`effort\`를 사용하세요.
- \`temperature\`, \`top_p\`, \`top_k\` 샘플링 파라미터도 Opus 4.7 / 4.8 / Fable 5에서 **제거**되었습니다(400). 동작은 프롬프트로 제어합니다.
- 출력이 16K 토큰을 넘을 수 있으면 **스트리밍**을 사용하세요(타임아웃 방지). 스트리밍 시 권장 \`max_tokens\`는 약 64000입니다.
- 사고 블록은 **수정·조작할 수 없습니다**. 같은 모델로 대화를 이어갈 때는 받은 그대로 다시 전달해야 합니다.
- 사고 토큰도 비용에 포함됩니다. 사고 요약을 보여주려면 \`display: "summarized"\`를 명시하세요.

### 스트리밍에서의 사용

\`\`\`python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-opus-4-8",
    max_tokens=64000,
    thinking={"type": "adaptive", "display": "summarized"},
    output_config={"effort": "high"},
    messages=[{
        "role": "user",
        "content": "다음 시스템의 장애 원인을 분석해주세요."
    }]
) as stream:
    for event in stream:
        if event.type == "content_block_start":
            print(f"블록 타입: {event.content_block.type}")
        elif event.type == "content_block_delta":
            if event.delta.type == "thinking_delta":
                print(event.delta.thinking, end="")
            elif event.delta.type == "text_delta":
                print(event.delta.text, end="")

    final = stream.get_final_message()
\`\`\``,
      contentEn: `### Control Thinking Depth with the Effort Parameter

Instead of a fixed token budget, use the \`effort\` value inside \`output_config\` to control thinking depth and overall token spend (default is \`high\`):

| Effort | When to use | Description |
|--------|-------------|-------------|
| \`low\` | Simple / latency-sensitive tasks | Fast responses, minimal thinking |
| \`medium\` | General tasks that need cost savings | Balanced |
| \`high\` | Most intelligence-sensitive work (default) | Good balance of quality and cost |
| \`xhigh\` | Coding & agentic tasks | Recommended for coding/agents on Opus 4.7+ |
| \`max\` | Hardest tasks where accuracy beats cost | Maximum depth (watch for overthinking) |

### Important Notes

- The \`budget_tokens\` approach is deprecated. On Opus 4.7 / 4.8 / Fable 5, \`budget_tokens\` returns a **400 error** — use \`effort\` instead.
- The \`temperature\`, \`top_p\`, and \`top_k\` sampling parameters are also **removed** on Opus 4.7 / 4.8 / Fable 5 (400). Steer behavior through prompting.
- If output may exceed 16K tokens, use **streaming** (to avoid timeouts). When streaming, a \`max_tokens\` of ~64000 is a good default.
- Thinking blocks **cannot be modified or manipulated**. When continuing on the same model, pass them back exactly as received.
- Thinking tokens count toward cost. To surface a reasoning summary, set \`display: "summarized"\` explicitly.

### Usage with Streaming

\`\`\`python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-opus-4-8",
    max_tokens=64000,
    thinking={"type": "adaptive", "display": "summarized"},
    output_config={"effort": "high"},
    messages=[{
        "role": "user",
        "content": "Analyze the root cause of the following system failure."
    }]
) as stream:
    for event in stream:
        if event.type == "content_block_start":
            print(f"Block type: {event.content_block.type}")
        elif event.type == "content_block_delta":
            if event.delta.type == "thinking_delta":
                print(event.delta.thinking, end="")
            elif event.delta.type == "text_delta":
                print(event.delta.text, end="")

    final = stream.get_final_message()
\`\`\``
    }
  ]
};

export default extendedThinking;
