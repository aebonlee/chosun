const toolUse = {
  id: 'tool-use',
  title: '도구 사용 프롬프트',
  titleEn: 'Tool Use in Prompts',
  icon: 'fa-wrench',
  sections: [
    {
      title: 'Tool Use 개념',
      titleEn: 'Tool Use Concepts',
      content: `Tool Use(함수 호출)는 Claude가 외부 도구나 API를 호출하여 실시간 정보를 가져오거나 작업을 수행할 수 있게 하는 기능입니다. 프롬프트 설계 시 도구의 정의와 사용 지침을 잘 작성하는 것이 중요합니다.

### Tool Use 워크플로우

1. **도구 정의**: 사용 가능한 도구의 이름, 설명, 파라미터를 정의합니다
2. **사용자 질문**: 사용자가 도구가 필요한 질문을 합니다
3. **도구 선택**: Claude가 적절한 도구를 선택하고 파라미터를 결정합니다
4. **도구 실행**: 애플리케이션이 도구를 실행하고 결과를 반환합니다
5. **응답 생성**: Claude가 도구 결과를 기반으로 최종 응답을 생성합니다

### 도구 정의 예시

\`\`\`json
{
  "name": "get_weather",
  "description": "지정된 도시의 현재 날씨 정보를 가져옵니다. 사용자가 날씨, 기온, 강수 확률 등을 물어볼 때 사용하세요.",
  "input_schema": {
    "type": "object",
    "properties": {
      "city": {
        "type": "string",
        "description": "날씨를 조회할 도시 이름 (예: 서울, Tokyo, New York)"
      },
      "unit": {
        "type": "string",
        "enum": ["celsius", "fahrenheit"],
        "description": "온도 단위. 기본값은 celsius"
      }
    },
    "required": ["city"]
  }
}
\`\`\``,
      contentEn: `Tool Use (function calling) is a feature that enables Claude to call external tools or APIs to fetch real-time information or perform actions. When designing prompts, it is crucial to write clear tool definitions and usage guidelines.

### Tool Use Workflow

1. **Tool Definition**: Define available tools with names, descriptions, and parameters
2. **User Query**: User asks a question that requires a tool
3. **Tool Selection**: Claude selects the appropriate tool and determines parameters
4. **Tool Execution**: Application executes the tool and returns results
5. **Response Generation**: Claude generates a final response based on tool results

### Tool Definition Example

\`\`\`json
{
  "name": "get_weather",
  "description": "Retrieves current weather information for a specified city. Use when the user asks about weather, temperature, precipitation chances, etc.",
  "input_schema": {
    "type": "object",
    "properties": {
      "city": {
        "type": "string",
        "description": "City name to check weather for (e.g., Seoul, Tokyo, New York)"
      },
      "unit": {
        "type": "string",
        "enum": ["celsius", "fahrenheit"],
        "description": "Temperature unit. Default is celsius"
      }
    },
    "required": ["city"]
  }
}
\`\`\``
    },
    {
      title: '효과적인 도구 정의 작성법',
      titleEn: 'Writing Effective Tool Definitions',
      content: `### 도구 설명 작성 가이드라인

**좋은 설명:**
\`\`\`
"description": "사용자의 주문 ID를 기반으로 주문 상태를 조회합니다.
배송 상태, 예상 도착일, 추적 번호를 포함합니다.
주문 ID가 'ORD-'로 시작하지 않으면 유효하지 않은 주문입니다."
\`\`\`

**나쁜 설명:**
\`\`\`
"description": "주문을 조회합니다"
\`\`\`

### 파라미터 설명 팁

- **구체적인 예시 포함**: 파라미터에 예시 값을 포함하세요
- **유효한 범위 명시**: 값의 범위나 형식을 명확히 합니다
- **기본값 설명**: 선택적 파라미터의 기본 동작을 설명합니다

### 다중 도구 활용 패턴

여러 도구를 조합하여 복잡한 작업을 수행하도록 합니다:

\`\`\`python
tools = [
    {
        "name": "search_products",
        "description": "키워드로 제품을 검색합니다. 검색 결과에는 제품 ID, 이름, 가격이 포함됩니다.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "검색 키워드"},
                "category": {"type": "string", "description": "제품 카테고리 필터"},
                "max_results": {"type": "integer", "description": "최대 결과 수 (기본: 10)"}
            },
            "required": ["query"]
        }
    },
    {
        "name": "get_product_details",
        "description": "제품 ID로 상세 정보를 조회합니다. 사양, 리뷰, 재고 상태를 포함합니다.",
        "input_schema": {
            "type": "object",
            "properties": {
                "product_id": {"type": "string", "description": "제품 고유 ID"}
            },
            "required": ["product_id"]
        }
    },
    {
        "name": "add_to_cart",
        "description": "제품을 장바구니에 추가합니다.",
        "input_schema": {
            "type": "object",
            "properties": {
                "product_id": {"type": "string", "description": "제품 고유 ID"},
                "quantity": {"type": "integer", "description": "수량 (기본: 1)"}
            },
            "required": ["product_id"]
        }
    }
]
\`\`\`

> **팁**: 도구 설명이 상세할수록 Claude가 적절한 시점에 올바른 도구를 선택할 확률이 높아집니다.`,
      contentEn: `### Tool Description Writing Guidelines

**Good Description:**
\`\`\`
"description": "Retrieves order status based on the user's order ID.
Includes shipping status, estimated arrival date, and tracking number.
If the order ID does not start with 'ORD-', the order is invalid."
\`\`\`

**Bad Description:**
\`\`\`
"description": "Looks up an order"
\`\`\`

### Parameter Description Tips

- **Include specific examples**: Include example values for parameters
- **Specify valid ranges**: Clarify the range or format of values
- **Describe defaults**: Explain default behavior of optional parameters

### Multi-Tool Usage Pattern

Combine multiple tools to perform complex tasks:

\`\`\`python
tools = [
    {
        "name": "search_products",
        "description": "Search for products by keyword. Results include product ID, name, and price.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Search keyword"},
                "category": {"type": "string", "description": "Product category filter"},
                "max_results": {"type": "integer", "description": "Maximum results (default: 10)"}
            },
            "required": ["query"]
        }
    },
    {
        "name": "get_product_details",
        "description": "Retrieve detailed information by product ID. Includes specs, reviews, and stock status.",
        "input_schema": {
            "type": "object",
            "properties": {
                "product_id": {"type": "string", "description": "Unique product ID"}
            },
            "required": ["product_id"]
        }
    },
    {
        "name": "add_to_cart",
        "description": "Add a product to the shopping cart.",
        "input_schema": {
            "type": "object",
            "properties": {
                "product_id": {"type": "string", "description": "Unique product ID"},
                "quantity": {"type": "integer", "description": "Quantity (default: 1)"}
            },
            "required": ["product_id"]
        }
    }
]
\`\`\`

> **Tip**: The more detailed the tool description, the higher the chance Claude selects the right tool at the right time.`
    }
  ]
};

export default toolUse;
