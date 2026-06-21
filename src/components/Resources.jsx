import '../styles/resources.css';
import { useState, useMemo, useCallback } from 'react';

/* ============================================
   메뉴 구조 (사이드바 네비게이션)
   ============================================ */
const MENU = [
  {
    id: 'objectives', icon: 'fa-bullseye',
    labelKo: '학습목표·평가', labelEn: 'Objectives & Assessment', color: 'green',
    descKo: '학습 목표 설정과 평가 체계에 관한 이론',
    descEn: 'Theories on learning objectives and assessment systems',
    children: [
      { id: 'blooms', icon: 'fa-layer-group', labelKo: "Bloom's Taxonomy", labelEn: "Bloom's Taxonomy" },
      { id: 'constructive-alignment', icon: 'fa-link', labelKo: '구성적 정렬', labelEn: 'Constructive Alignment' },
      { id: 'backward-design', icon: 'fa-backward-step', labelKo: '백워드 설계', labelEn: 'Backward Design' },
      { id: 'kirkpatrick', icon: 'fa-chart-simple', labelKo: '커크패트릭 4단계', labelEn: 'Kirkpatrick 4-Level' },
    ],
  },
  {
    id: 'design', icon: 'fa-sitemap',
    labelKo: '교수설계 모델', labelEn: 'Instructional Design', color: 'blue',
    descKo: '교수 프로그램 개발을 위한 체계적 설계 모델',
    descEn: 'Systematic design models for instructional program development',
    children: [
      { id: 'addie', icon: 'fa-diagram-project', labelKo: 'ADDIE 모델', labelEn: 'ADDIE Model' },
      { id: 'gagne', icon: 'fa-list-ol', labelKo: "Gagné 9가지 교수사건", labelEn: "Gagné's 9 Events" },
      { id: 'sam', icon: 'fa-bolt', labelKo: 'SAM 모델', labelEn: 'SAM Model' },
    ],
  },
  {
    id: 'methods', icon: 'fa-chalkboard',
    labelKo: '교수법', labelEn: 'Teaching Methods', color: 'purple',
    descKo: '효과적인 교수-학습 전략과 기법',
    descEn: 'Effective teaching-learning strategies and techniques',
    children: [
      { id: 'active-learning', icon: 'fa-hand', labelKo: '액티브 러닝', labelEn: 'Active Learning' },
      { id: 'pbl', icon: 'fa-puzzle-piece', labelKo: '문제중심학습 (PBL)', labelEn: 'Problem-Based Learning' },
      { id: 'flipped', icon: 'fa-arrows-rotate', labelKo: '플립러닝', labelEn: 'Flipped Learning' },
    ],
  },
  {
    id: 'theory', icon: 'fa-brain',
    labelKo: '학습이론·에듀테크', labelEn: 'Learning Theory & EdTech', color: 'orange',
    descKo: '학습의 원리와 기술 통합에 관한 이론',
    descEn: 'Theories on learning principles and technology integration',
    children: [
      { id: 'scaffolding', icon: 'fa-stairs', labelKo: '스캐폴딩/ZPD', labelEn: 'Scaffolding/ZPD' },
      { id: 'constructivism', icon: 'fa-cubes', labelKo: '구성주의', labelEn: 'Constructivism' },
      { id: 'tpack', icon: 'fa-laptop-code', labelKo: 'TPACK', labelEn: 'TPACK' },
    ],
  },
  {
    id: 'quick', icon: 'fa-bookmark',
    labelKo: '빠른 참고 자료', labelEn: 'Quick References', color: 'blue',
    descKo: '교육 관련 참고 자료 모음',
    descEn: 'Collection of educational reference materials',
    children: [],
  },
];

const ALL_SECTIONS = MENU.flatMap(g =>
  g.children.length > 0 ? [g.id, ...g.children.map(c => c.id)] : [g.id]
);

/* ============================================
   교육공학 이론 데이터
   ============================================ */
const THEORIES = [
  {
    id: 'blooms',
    icon: '🎯',
    titleKo: "Bloom's Taxonomy (블룸의 교육목표분류학)",
    titleEn: "Bloom's Taxonomy",
    tags: ['학습목표', '인지적 영역', '교수설계'],
    summaryKo: '학습 목표를 인지적 복잡성에 따라 6단계로 분류한 체계. 교육과정 설계와 평가의 기초.',
    summaryEn: 'A framework classifying learning objectives into 6 levels of cognitive complexity. Foundation of curriculum design and assessment.',
    contentKo: `## 개요
Bloom의 교육목표분류학(1956)은 교육 목표를 인지적 복잡성에 따라 위계적으로 분류한 체계입니다. 2001년 Anderson과 Krathwohl이 개정하여 명사형(지식 차원)과 동사형(인지 과정 차원)의 2차원 분류체계로 발전시켰습니다.

> **출처**: Anderson, L. W., & Krathwohl, D. R. (Eds.) (2001). *A Taxonomy for Learning, Teaching, and Assessing: A Revision of Bloom's Taxonomy of Educational Objectives*. Longman.

[BLOOMS_PYRAMID]

## 6단계 인지 과정 (개정판)

| 단계 | 설명 | 핵심 동사 | 평가 예시 |
|------|------|-----------|-----------|
| **1. 기억 (Remember)** | 사실, 용어, 개념을 회상 | 정의하다, 나열하다, 인식하다 | 객관식, 빈칸 채우기 |
| **2. 이해 (Understand)** | 의미를 파악하고 설명 | 설명하다, 요약하다, 비교하다 | 요약 작성, 개념도 |
| **3. 적용 (Apply)** | 지식을 새로운 상황에 사용 | 적용하다, 실행하다, 사용하다 | 사례 분석, 실습 |
| **4. 분석 (Analyze)** | 구성요소를 분해하고 관계 파악 | 분석하다, 구별하다, 조직하다 | 비교 분석 에세이 |
| **5. 평가 (Evaluate)** | 기준에 따라 판단 | 판단하다, 비평하다, 정당화하다 | 비평문, 동료평가 |
| **6. 창조 (Create)** | 요소를 결합하여 새로운 것 생성 | 설계하다, 구성하다, 개발하다 | 프로젝트, 연구 제안서 |

## 지식 차원 (Knowledge Dimension)

개정판에서 추가된 2차원 분류입니다. 인지 과정과 교차하여 학습 목표를 더 정밀하게 설정할 수 있습니다.

| 지식 유형 | 설명 | 예시 |
|-----------|------|------|
| **사실적 지식** | 용어, 세부사항 | 프로그래밍 언어 문법 |
| **개념적 지식** | 분류, 원리, 이론 | 객체지향 프로그래밍 원리 |
| **절차적 지식** | 방법, 기법, 알고리즘 | 정렬 알고리즘 구현 절차 |
| **메타인지 지식** | 자기 인지에 대한 지식 | 자신의 학습 전략 인식 |

> **출처**: Krathwohl, D. R. (2002). A revision of Bloom's taxonomy: An overview. *Theory into Practice*, 41(4), 212-218.

## 교육 현장 적용

### CLO(Course Learning Outcomes) 작성 공식
\`\`\`
[Bloom 동사] + [지식 내용] + [맥락/조건]
예: "주어진 데이터를 분석하여(Analyze) 통계적 패턴을 식별할 수 있다"
\`\`\`

- **강의계획서 작성**: 각 주차별 학습 목표를 Bloom의 단계에 맞춰 점진적으로 설정
- **평가 설계**: 저차원(기억/이해)부터 고차원(평가/창조)까지 균형 있는 평가 배치
- **수업 활동**: 학기 초반 저차원 → 후반 고차원으로 점진적 심화 (단, 반드시 순차적일 필요는 없음)
- **루브릭 개발**: 각 수준별 기대 성취도를 Bloom 단계의 동사로 명시

### 주차별 Bloom 수준 배치 예시 (15주 과정)
| 주차 | Bloom 수준 | 주요 활동 |
|------|-----------|----------|
| 1-3주 | 기억, 이해 | 개념 학습, 사례 분석 |
| 4-7주 | 이해, 적용 | 실습, 문제 해결 |
| 8주 | 적용, 분석 | 중간 프로젝트 |
| 9-12주 | 분석, 평가 | 비판적 분석, 동료 평가 |
| 13-15주 | 평가, 창조 | 최종 프로젝트, 발표 |

## 비판적 고찰
- Bloom의 위계가 항상 선형적이지 않다는 비판 존재 (Marzano & Kendall, 2007)
- 정서적 영역(Affective Domain)과 심동적 영역(Psychomotor Domain)도 함께 고려 필요
- 디지털 시대에 맞춘 Digital Bloom's Taxonomy (Churches, 2008)도 참고`,
    contentEn: `## Overview
Bloom's Taxonomy (1956) classifies educational objectives by cognitive complexity. Anderson & Krathwohl revised it in 2001 into a two-dimensional framework: the Knowledge Dimension (nouns) and the Cognitive Process Dimension (verbs).

> **Source**: Anderson, L. W., & Krathwohl, D. R. (Eds.) (2001). *A Taxonomy for Learning, Teaching, and Assessing*. Longman.

[BLOOMS_PYRAMID]

## 6 Cognitive Process Levels (Revised)

| Level | Description | Key Verbs | Assessment Examples |
|-------|-------------|-----------|-------------------|
| **1. Remember** | Recall facts, terms, concepts | Define, list, recognize | Multiple choice, fill-in |
| **2. Understand** | Grasp meaning, explain | Explain, summarize, compare | Summaries, concept maps |
| **3. Apply** | Use knowledge in new situations | Apply, execute, implement | Case studies, labs |
| **4. Analyze** | Break down, identify relationships | Analyze, differentiate, organize | Comparative essays |
| **5. Evaluate** | Judge based on criteria | Judge, critique, justify | Critiques, peer reviews |
| **6. Create** | Combine elements to form new things | Design, construct, develop | Projects, proposals |

## Knowledge Dimension

Added in the revised taxonomy. Cross-referenced with cognitive processes for precise objective-setting.

| Knowledge Type | Description | Example |
|----------------|-------------|---------|
| **Factual** | Terminology, details | Programming language syntax |
| **Conceptual** | Categories, principles, theories | OOP principles |
| **Procedural** | Methods, techniques, algorithms | Sorting algorithm implementation |
| **Metacognitive** | Knowledge about cognition | Awareness of own learning strategies |

> **Source**: Krathwohl, D. R. (2002). A revision of Bloom's taxonomy: An overview. *Theory into Practice*, 41(4), 212-218.

## Teaching Application

### CLO Writing Formula
\`\`\`
[Bloom Verb] + [Knowledge Content] + [Context/Condition]
Example: "Analyze given data to identify statistical patterns"
\`\`\`

- **Syllabus Design**: Progressively set weekly objectives along Bloom's levels
- **Assessment Design**: Balance lower-order (Remember/Understand) to higher-order (Evaluate/Create)
- **Class Activities**: Progress from lower to higher through the semester
- **Rubric Development**: Specify expected achievement using Bloom's action verbs

### Weekly Bloom Level Distribution (15-Week Course)
| Weeks | Bloom Level | Key Activities |
|-------|------------|---------------|
| 1-3 | Remember, Understand | Concept learning, case review |
| 4-7 | Understand, Apply | Labs, problem-solving |
| 8 | Apply, Analyze | Midterm project |
| 9-12 | Analyze, Evaluate | Critical analysis, peer review |
| 13-15 | Evaluate, Create | Final project, presentation |

## Critical Considerations
- Bloom's hierarchy is not always strictly linear (Marzano & Kendall, 2007)
- Affective and Psychomotor domains should also be considered
- Digital Bloom's Taxonomy (Churches, 2008) for the digital age`,
  },
  {
    id: 'addie',
    icon: '🔄',
    titleKo: 'ADDIE 모델 (체계적 교수설계)',
    titleEn: 'ADDIE Model (Systematic Instructional Design)',
    tags: ['교수설계', '체계적 설계', '교육과정'],
    summaryKo: '분석-설계-개발-실행-평가의 5단계로 구성된 가장 널리 사용되는 교수설계 모델.',
    summaryEn: 'The most widely used instructional design model with 5 phases: Analyze-Design-Develop-Implement-Evaluate.',
    contentKo: `## 개요
ADDIE는 교수설계의 기본 프레임워크로, 체계적으로 교육 프로그램을 개발하는 5단계 모델입니다. 1975년 플로리다 주립대학교에서 미 육군을 위해 개발되었으며, 이후 교육 분야 전반에서 가장 널리 사용되는 설계 모델이 되었습니다.

> **출처**: Branch, R. M. (2009). *Instructional Design: The ADDIE Approach*. Springer. / Molenda, M. (2003). In search of the elusive ADDIE model. *Performance Improvement*, 42(5), 34-37.

[ADDIE_CYCLE]

## 5단계

### 1. 분석 (Analysis)
- **학습자 분석**: 사전 지식, 학습 스타일, 동기
- **요구 분석**: 현재 수준과 목표 수준의 격차 파악
- **환경 분석**: 학습 환경, 가용 자원, 제약 조건
- **과제 분석**: 학습 내용의 구조와 위계 분석

### 2. 설계 (Design)
- 학습 목표 명세화 (Bloom's Taxonomy 활용)
- 평가 도구 설계 (루브릭, 시험 등)
- 교수 전략 선정 (강의, 토론, PBL 등)
- 교육과정 구조 설계 (주차별 계획)
- 매체 및 자료 선정

### 3. 개발 (Development)
- 교수 자료 제작 (슬라이드, 유인물, 영상)
- 학습 활동 개발
- 평가 도구 개발
- 파일럿 테스트

### 4. 실행 (Implementation)
- 교수자 준비 및 교육
- 실제 교육 실시
- 학습 지원 및 촉진
- 형성적 데이터 수집

### 5. 평가 (Evaluation)
- **형성평가**: 각 단계에서 지속적 피드백
- **총괄평가**: 최종 효과성 판단
- 학습 성과 측정
- 개선점 도출 → 다음 사이클에 반영

## 실무 팁
- 반드시 순차적일 필요 없음 (반복적/동시적 가능)
- 소규모 파일럿 → 피드백 반영 → 본 실행 권장
- AI 도구를 활용하면 분석/개발/평가 단계를 효율화 가능`,
    contentEn: `## Overview
ADDIE is the foundational framework for instructional design — a 5-phase model for systematically developing educational programs. Originally developed at Florida State University in 1975 for the U.S. Army, it became the most widely used design model across education.

> **Source**: Branch, R. M. (2009). *Instructional Design: The ADDIE Approach*. Springer. / Molenda, M. (2003). In search of the elusive ADDIE model. *Performance Improvement*, 42(5), 34-37.

[ADDIE_CYCLE]

## 5 Phases

### 1. Analysis
- **Learner Analysis**: Prior knowledge, learning styles, motivation
- **Needs Analysis**: Identify gaps between current and target performance
- **Environment Analysis**: Learning environment, available resources, constraints
- **Task Analysis**: Structure and hierarchy of learning content

### 2. Design
- Specify learning objectives (using Bloom's Taxonomy)
- Design assessment tools (rubrics, exams)
- Select instructional strategies (lectures, discussions, PBL)
- Structure curriculum (weekly plans)
- Select media and materials

### 3. Development
- Create instructional materials (slides, handouts, videos)
- Develop learning activities
- Develop assessment tools
- Pilot testing

### 4. Implementation
- Instructor preparation and training
- Deliver instruction
- Facilitate and support learning
- Collect formative data

### 5. Evaluation
- **Formative**: Continuous feedback at each phase
- **Summative**: Final effectiveness judgment
- Measure learning outcomes
- Identify improvements → Apply to next cycle

## Practical Tips
- Not necessarily sequential (can be iterative/concurrent)
- Small pilot → feedback → full implementation recommended
- AI tools can streamline Analysis/Development/Evaluation phases`,
  },
  {
    id: 'gagne',
    icon: '📋',
    titleKo: "Gagné의 9가지 교수사건 (Nine Events of Instruction)",
    titleEn: "Gagné's Nine Events of Instruction",
    tags: ['교수설계', '수업설계', '학습심리'],
    summaryKo: '효과적인 수업을 위한 9단계 교수 절차. 주의 획득부터 파지와 전이 촉진까지.',
    summaryEn: "Nine sequential steps for effective instruction, from gaining attention to enhancing retention and transfer.",
    contentKo: `## 개요
Robert Gagné(1985)가 제안한 9가지 교수사건은 인지심리학의 정보처리 이론에 기반하여, 학습이 효과적으로 일어나기 위한 외적 조건을 제시합니다.

> **출처**: Gagné, R. M., Wager, W. W., Golas, K. C., & Keller, J. M. (2005). *Principles of Instructional Design* (5th ed.). Thomson/Wadsworth.

## 9가지 교수사건

| # | 교수사건 | 학습 과정 | 수업 적용 예시 |
|---|----------|-----------|---------------|
| 1 | **주의 획득** | 수용 | 놀라운 통계, 질문, 영상 클립 |
| 2 | **학습 목표 제시** | 기대 | "이 수업 후 ~할 수 있습니다" |
| 3 | **선수학습 회상 자극** | 인출 | 이전 수업 복습, 사전 퀴즈 |
| 4 | **학습 자료 제시** | 선택적 지각 | 강의, 읽기 자료, 시연 |
| 5 | **학습 안내 제공** | 의미 부호화 | 예시, 비유, 그래픽 조직자 |
| 6 | **수행 유도** | 반응 | 연습 문제, 실습, 토론 |
| 7 | **피드백 제공** | 강화 | 즉시 피드백, 교정적 피드백 |
| 8 | **수행 평가** | 인출 | 퀴즈, 과제, 프로젝트 |
| 9 | **파지와 전이 촉진** | 일반화 | 실생활 적용, 심화 과제 |

## 수업 설계 적용

### 50분 수업 예시
- **도입 (10분)**: 사건 1-3 (주의 획득 → 목표 제시 → 선수학습 회상)
- **전개 (30분)**: 사건 4-7 (자료 제시 → 학습 안내 → 수행 유도 → 피드백)
- **정리 (10분)**: 사건 8-9 (수행 평가 → 파지/전이 촉진)

## AI 도구 활용
- 사건 1: AI로 흥미로운 도입 사례 생성
- 사건 5: AI로 다양한 예시와 비유 생성
- 사건 7: AI로 개인화된 피드백 제공
- 사건 9: AI로 심화/응용 과제 생성`,
    contentEn: `## Overview
Robert Gagné's (1985) Nine Events of Instruction are based on cognitive information processing theory, presenting external conditions necessary for effective learning.

## Nine Events

| # | Event | Learning Process | Example |
|---|-------|-----------------|---------|
| 1 | **Gain Attention** | Reception | Surprising statistics, questions, video clips |
| 2 | **State Objectives** | Expectancy | "After this class, you will be able to..." |
| 3 | **Stimulate Prior Knowledge** | Retrieval | Review previous lesson, pre-quiz |
| 4 | **Present Content** | Selective Perception | Lectures, readings, demonstrations |
| 5 | **Provide Guidance** | Semantic Encoding | Examples, analogies, graphic organizers |
| 6 | **Elicit Performance** | Responding | Practice problems, exercises, discussions |
| 7 | **Provide Feedback** | Reinforcement | Immediate feedback, corrective feedback |
| 8 | **Assess Performance** | Retrieval | Quizzes, assignments, projects |
| 9 | **Enhance Retention & Transfer** | Generalization | Real-world applications, advanced tasks |

## Lesson Design Application

### 50-minute Class Example
- **Introduction (10 min)**: Events 1-3 (Gain attention → State objectives → Stimulate prior learning)
- **Development (30 min)**: Events 4-7 (Present content → Provide guidance → Elicit performance → Feedback)
- **Conclusion (10 min)**: Events 8-9 (Assess performance → Enhance retention/transfer)

## AI Tool Integration
- Event 1: Generate engaging introductory cases with AI
- Event 5: Generate diverse examples and analogies with AI
- Event 7: Provide personalized feedback with AI
- Event 9: Generate advanced/application tasks with AI`,
  },
  {
    id: 'constructive-alignment',
    icon: '🔗',
    titleKo: '구성적 정렬 (Constructive Alignment)',
    titleEn: 'Constructive Alignment',
    tags: ['교육과정', '학습성과', '평가'],
    summaryKo: '학습성과(ILO), 교수-학습활동(TLA), 평가과제(AT)를 일관되게 정렬하는 교육과정 설계 원리.',
    summaryEn: 'Curriculum design principle aligning Intended Learning Outcomes, Teaching-Learning Activities, and Assessment Tasks.',
    contentKo: `## 개요
John Biggs(1996)가 제안한 구성적 정렬은 교육과정의 세 핵심 요소가 일관성 있게 연결되어야 한다는 원리입니다.

> **출처**: Biggs, J. (1996). Enhancing teaching through constructive alignment. *Higher Education*, 32(3), 347-364. / Biggs, J., & Tang, C. (2011). *Teaching for Quality Learning at University* (4th ed.). Open University Press.

## 세 가지 핵심 요소

### 1. 의도된 학습성과 (Intended Learning Outcomes, ILO)
- 학생이 수업 후 무엇을 **할 수 있는지** 명시
- Bloom's Taxonomy의 행위 동사 사용
- 예: "수집한 데이터를 **분석**하여 연구 보고서를 **작성**할 수 있다"

### 2. 교수-학습 활동 (Teaching-Learning Activities, TLA)
- ILO 달성을 위한 학습 경험 설계
- 학생이 ILO에 명시된 행위를 직접 수행하는 활동
- 예: 데이터 분석 실습, 보고서 작성 워크숍

### 3. 평가 과제 (Assessment Tasks, AT)
- 학생이 ILO를 달성했는지 확인하는 과제
- ILO와 동일한 수준의 인지적 과정 요구
- 예: 실제 데이터 분석 및 보고서 제출

## 정렬의 원리

\`\`\`
ILO: "분석할 수 있다"
  ↕ 정렬
TLA: 분석 실습 활동
  ↕ 정렬
AT:  분석 과제 평가
\`\`\`

**비정렬 예시 (문제)**:
- ILO: "비판적으로 분석할 수 있다" → 평가: 객관식 시험 (기억 수준)
- ILO: "설계할 수 있다" → 수업: 강의만 진행 (수동적)

## AI 도구 활용
- 강의계획서 생성 시 ILO-TLA-AT 정렬 자동 검증
- 루브릭 생성 시 ILO 기반 평가 기준 생성
- 과제 생성 시 ILO 수준에 맞는 과제 유형 추천`,
    contentEn: `## Overview
Constructive Alignment (John Biggs, 1996) is the principle that three core elements of curriculum must be consistently connected.

## Three Core Elements

### 1. Intended Learning Outcomes (ILO)
- Specify what students can **do** after instruction
- Use action verbs from Bloom's Taxonomy
- Example: "Students can **analyze** collected data and **write** a research report"

### 2. Teaching-Learning Activities (TLA)
- Design learning experiences to achieve ILOs
- Activities where students perform the actions specified in ILOs
- Example: Data analysis practice, report writing workshop

### 3. Assessment Tasks (AT)
- Tasks to verify students achieved ILOs
- Require the same cognitive level as ILOs
- Example: Actual data analysis and report submission

## Alignment Principle

\`\`\`
ILO: "Can analyze"
  ↕ Aligned
TLA: Analysis practice activities
  ↕ Aligned
AT:  Analysis task assessment
\`\`\`

**Misalignment Examples (Problems)**:
- ILO: "Critically analyze" → Assessment: Multiple choice (recall level)
- ILO: "Design" → Teaching: Lecture only (passive)

## AI Tool Integration
- Auto-verify ILO-TLA-AT alignment in syllabus generation
- Generate ILO-based assessment criteria in rubric building
- Recommend task types matching ILO levels in assignment generation`,
  },
  {
    id: 'backward-design',
    icon: '🔙',
    titleKo: '백워드 설계 (Backward Design / UbD)',
    titleEn: 'Backward Design (Understanding by Design)',
    tags: ['교육과정', '이해중심', '설계'],
    summaryKo: '기대 결과 → 평가 증거 → 학습 경험 순으로 역방향으로 설계하는 교육과정 개발 모델.',
    summaryEn: 'Curriculum development model designing backward: desired results → assessment evidence → learning experiences.',
    contentKo: `## 개요
Wiggins & McTighe(1998)의 백워드 설계(Understanding by Design, UbD)는 "목표에서 출발하여 역방향으로 설계"하는 접근법입니다.

> **출처**: Wiggins, G., & McTighe, J. (2005). *Understanding by Design* (2nd ed.). ASCD.

## 3단계 설계

### 1단계: 바라는 결과 확인 (Identify Desired Results)
- **핵심 질문 (Essential Questions)**: 탐구를 유발하는 개방형 질문
- **영속적 이해 (Enduring Understandings)**: 수업 후에도 오래 남는 핵심 이해
- **핵심 지식과 기능**: 학생이 알아야 할 것, 할 수 있어야 할 것

### 2단계: 수용 가능한 증거 결정 (Determine Acceptable Evidence)
- **수행 과제 (Performance Tasks)**: 실제적 맥락에서의 평가
- **기타 증거**: 퀴즈, 시험, 관찰, 자기평가
- GRASPS 프레임워크: Goal, Role, Audience, Situation, Product, Standards

### 3단계: 학습 경험과 수업 계획 (Plan Learning Experiences)
- WHERE TO 프레임워크:
  - **W**: Where and Why (방향과 이유)
  - **H**: Hook and Hold (흥미 유발)
  - **E**: Equip, Experience, Explore (탐구)
  - **R**: Reflect, Rethink, Revise (성찰)
  - **E**: Evaluate (자기평가)
  - **T**: Tailor (개별화)
  - **O**: Organize (조직화)

## 전통적 설계 vs 백워드 설계

| 전통적 (Forward Design) | 백워드 설계 (Backward Design) |
|------------------------|------------------------------|
| 내용 → 활동 → 시험 | 목표 → 평가 → 활동 |
| 활동 중심 | 결과 중심 |
| "무엇을 가르칠까?" | "무엇을 이해해야 하는가?" |

## 핵심 질문 예시
- "역사를 배우는 것이 오늘날 왜 중요한가?"
- "좋은 글쓰기란 무엇인가?"
- "데이터는 어떻게 의사결정에 영향을 미치는가?"`,
    contentEn: `## Overview
Backward Design (Understanding by Design, UbD) by Wiggins & McTighe (1998) starts from goals and designs backward.

## 3-Stage Design

### Stage 1: Identify Desired Results
- **Essential Questions**: Open-ended questions that provoke inquiry
- **Enduring Understandings**: Core understandings that persist long after instruction
- **Key Knowledge and Skills**: What students should know and be able to do

### Stage 2: Determine Acceptable Evidence
- **Performance Tasks**: Assessment in authentic contexts
- **Other Evidence**: Quizzes, tests, observations, self-assessments
- GRASPS Framework: Goal, Role, Audience, Situation, Product, Standards

### Stage 3: Plan Learning Experiences
- WHERE TO Framework:
  - **W**: Where and Why (direction and purpose)
  - **H**: Hook and Hold (engage interest)
  - **E**: Equip, Experience, Explore (investigation)
  - **R**: Reflect, Rethink, Revise (reflection)
  - **E**: Evaluate (self-assessment)
  - **T**: Tailor (differentiate)
  - **O**: Organize (sequence)

## Traditional vs Backward Design

| Traditional (Forward Design) | Backward Design |
|-----------------------------|-----------------|
| Content → Activities → Test | Goals → Assessment → Activities |
| Activity-focused | Results-focused |
| "What shall I teach?" | "What must they understand?" |

## Essential Question Examples
- "Why does learning history matter today?"
- "What makes good writing?"
- "How does data influence decision-making?"`,
  },
  {
    id: 'scaffolding',
    icon: '🏗️',
    titleKo: '스캐폴딩 (Scaffolding)과 근접발달영역 (ZPD)',
    titleEn: 'Scaffolding and Zone of Proximal Development',
    tags: ['학습이론', '비고츠키', '교수전략'],
    summaryKo: '학습자의 현재 수준과 잠재적 발달 수준 사이에서 적절한 지원을 제공하는 교수 전략.',
    summaryEn: 'Teaching strategy providing appropriate support between current and potential developmental levels.',
    contentKo: `## 개요
Vygotsky(1978)의 근접발달영역(ZPD) 이론과 Wood, Bruner & Ross(1976)의 스캐폴딩 개념을 결합한 교수 전략입니다.

> **출처**: Vygotsky, L. S. (1978). *Mind in Society: The Development of Higher Psychological Processes*. Harvard University Press. / Wood, D., Bruner, J. S., & Ross, G. (1976). The role of tutoring in problem solving. *Journal of Child Psychology and Psychiatry*, 17(2), 89-100.

## 근접발달영역 (Zone of Proximal Development)

[ZPD_DIAGRAM]

## 스캐폴딩 전략

### 1. 모델링 (Modeling)
- 교수자가 사고 과정을 시연
- "이 문제를 볼 때 먼저 ~을 확인합니다..."

### 2. 단서 제공 (Cueing)
- 힌트나 질문으로 사고 유도
- "이전에 배운 ~원리를 적용해 볼까요?"

### 3. 과제 분할 (Task Decomposition)
- 복잡한 과제를 작은 단계로 분해
- 각 단계에서 성공 경험 축적

### 4. 템플릿/프레임워크 제공
- 보고서 양식, 체크리스트, 루브릭 제공
- 점차적으로 구조를 제거 (fading)

### 5. 동료 학습 (Peer Learning)
- 약간 앞서 있는 동료와 협력
- 피어 튜터링, 소그룹 토론

## 스캐폴딩의 핵심: 점진적 철회 (Fading)

| 단계 | 지원 수준 | 교수자 역할 | 학습자 역할 |
|------|----------|------------|------------|
| 초기 | 높은 지원 | 시범, 안내 | 관찰, 모방 |
| 중기 | 중간 지원 | 힌트, 피드백 | 연습, 질문 |
| 후기 | 낮은 지원 | 모니터링 | 독립 수행 |

## AI 도구 활용
- AI가 단계적 힌트 제공 (전체 답이 아닌 가이드)
- 학습자 수준에 맞는 과제 난이도 자동 조절
- 피드백 생성 시 스캐폴딩 원리 적용`,
    contentEn: `## Overview
A teaching strategy combining Vygotsky's (1978) Zone of Proximal Development (ZPD) theory with Wood, Bruner & Ross's (1976) scaffolding concept.

## Zone of Proximal Development (ZPD)

[ZPD_DIAGRAM]

## Scaffolding Strategies

### 1. Modeling
- Instructor demonstrates thinking process
- "When I see this problem, I first check..."

### 2. Cueing
- Guide thinking with hints or questions
- "Can we apply the ~principle we learned earlier?"

### 3. Task Decomposition
- Break complex tasks into smaller steps
- Build success experiences at each step

### 4. Templates/Frameworks
- Provide report formats, checklists, rubrics
- Gradually remove structure (fading)

### 5. Peer Learning
- Collaborate with slightly more advanced peers
- Peer tutoring, small group discussions

## Key Principle: Fading

| Phase | Support Level | Instructor Role | Learner Role |
|-------|--------------|-----------------|--------------|
| Early | High support | Model, guide | Observe, imitate |
| Mid | Medium support | Hint, feedback | Practice, question |
| Late | Low support | Monitor | Independent performance |

## AI Tool Integration
- AI provides step-by-step hints (guides, not full answers)
- Auto-adjust task difficulty to learner level
- Apply scaffolding principles in feedback generation`,
  },
  {
    id: 'active-learning',
    icon: '🙋',
    titleKo: '액티브 러닝 (Active Learning)',
    titleEn: 'Active Learning',
    tags: ['교수법', '학생 참여', '협력학습'],
    summaryKo: '학생이 수동적 청취를 넘어 능동적으로 학습 과정에 참여하는 교수-학습 전략의 총칭.',
    summaryEn: 'Teaching-learning strategies where students actively participate in the learning process beyond passive listening.',
    contentKo: `## 개요
Active Learning은 학생이 단순히 듣는 것을 넘어, 읽기/쓰기/토론/문제해결 등에 적극 참여하는 모든 교수법을 포괄합니다(Bonwell & Eison, 1991).

> **출처**: Bonwell, C. C., & Eison, J. A. (1991). *Active Learning: Creating Excitement in the Classroom*. ASHE-ERIC. / Freeman, S., et al. (2014). Active learning increases student performance in science, engineering, and mathematics. *PNAS*, 111(23), 8410-8415.

## 주요 Active Learning 기법

### 1. Think-Pair-Share (생각-짝-공유)
1. 개인 사고 시간 (1-2분)
2. 짝과 토론 (2-3분)
3. 전체 공유 (5분)
- **적용**: 개념 이해 확인, 의견 교환

### 2. Jigsaw (직소)
1. 각 팀원이 다른 부분을 전문가로 학습
2. 전문가 그룹에서 심화 학습
3. 원래 팀으로 돌아가 가르침
- **적용**: 대량의 콘텐츠를 분담하여 학습

### 3. Case-Based Learning (사례기반학습)
- 실제 또는 시뮬레이션 사례 분석
- 이론의 실제 적용 경험
- **적용**: 의학, 경영학, 법학 등 전문 분야

### 4. Peer Instruction (동료교수법)
1. 개념 설명 (짧게)
2. ConcepTest 질문
3. 개인 응답 → 동료 토론 → 재응답
4. 교수자 해설
- **적용**: 오개념 교정, 대형 강의

### 5. Minute Paper (1분 페이퍼)
- 수업 마지막 1분에 "가장 중요한 것"과 "가장 혼란스러운 것" 작성
- **적용**: 즉각적 형성평가, 다음 수업 조정

### 6. Gallery Walk (갤러리 워크)
- 팀별 결과물을 전시하고 돌아다니며 피드백
- **적용**: 프로젝트 결과 공유, 아이디어 발산

## 효과성 근거
- Freeman et al.(2014) 메타분석: Active Learning이 전통 강의보다 시험 성적 6% 향상
- 강의만 하는 수업에서 낙제율 1.5배 높음

## 온라인 환경에서의 적용
- 브레이크아웃 룸 활용 (Zoom/Teams)
- 온라인 화이트보드 (Miro, Padlet)
- 실시간 퀴즈 (Kahoot, Mentimeter)
- 비동기 토론 게시판`,
    contentEn: `## Overview
Active Learning encompasses all teaching methods where students actively participate through reading, writing, discussion, and problem-solving beyond passive listening (Bonwell & Eison, 1991).

## Key Active Learning Techniques

### 1. Think-Pair-Share
1. Individual thinking time (1-2 min)
2. Pair discussion (2-3 min)
3. Whole-class sharing (5 min)
- **Application**: Check understanding, exchange opinions

### 2. Jigsaw
1. Each team member becomes expert on different section
2. Expert groups for deeper learning
3. Return to home team and teach
- **Application**: Divide large content among learners

### 3. Case-Based Learning
- Analyze real or simulated cases
- Experience practical application of theory
- **Application**: Medicine, business, law, etc.

### 4. Peer Instruction
1. Brief concept explanation
2. ConcepTest question
3. Individual response → Peer discussion → Re-response
4. Instructor explanation
- **Application**: Misconception correction, large lectures

### 5. Minute Paper
- Last minute of class: write "most important thing" and "most confusing thing"
- **Application**: Immediate formative assessment, next class adjustment

### 6. Gallery Walk
- Display team outputs and provide feedback while walking around
- **Application**: Project sharing, idea generation

## Evidence of Effectiveness
- Freeman et al. (2014) meta-analysis: Active Learning improved exam scores by 6% over traditional lectures
- Failure rates 1.5x higher in lecture-only classes

## Online Environment Application
- Breakout rooms (Zoom/Teams)
- Online whiteboards (Miro, Padlet)
- Live quizzes (Kahoot, Mentimeter)
- Asynchronous discussion boards`,
  },
  {
    id: 'pbl',
    icon: '❓',
    titleKo: '문제중심학습 (Problem-Based Learning, PBL)',
    titleEn: 'Problem-Based Learning (PBL)',
    tags: ['교수법', '문제해결', '자기주도'],
    summaryKo: '실제적이고 비구조화된 문제를 중심으로 학습자가 주도적으로 학습하는 교수법.',
    summaryEn: 'Student-centered pedagogy where learners drive their learning through authentic, ill-structured problems.',
    contentKo: `## 개요
PBL은 McMaster University 의과대학(1969)에서 시작된 교수법으로, 실제적인 문제를 중심으로 학생이 자기주도적으로 학습합니다.

> **출처**: Barrows, H. S. (1996). Problem-based learning in medicine and beyond. *New Directions for Teaching and Learning*, 68, 3-12. / Hmelo-Silver, C. E. (2004). Problem-based learning: What and how do students learn? *Educational Psychology Review*, 16(3), 235-266.

## PBL 프로세스

### 1. 문제 제시
- 실제적이고 비구조화된(ill-structured) 문제
- 하나의 정답이 없는 복잡한 상황
- 예: "지역 하천의 수질이 악화되고 있습니다. 원인을 분석하고 해결책을 제안하세요."

### 2. 문제 분석
- 알고 있는 것 (Facts)
- 알아야 할 것 (Learning Issues)
- 가설 설정 (Hypotheses)
- 역할 분담 (Action Plan)

### 3. 자기주도 학습
- 개인별 학습 이슈 탐구
- 자료 수집 및 분석
- 전문가 자문, 현장 조사

### 4. 재논의 및 종합
- 학습 결과 공유
- 가설 검증 및 수정
- 해결책 도출

### 5. 성찰 및 평가
- 학습 과정 성찰
- 동료 평가 + 자기 평가
- 학습 성과 정리

## PBL의 교수자 역할: 촉진자 (Facilitator)

| 전통적 교수 | PBL 촉진자 |
|------------|-----------|
| 지식 전달자 | 학습 안내자 |
| 답을 제공 | 질문을 제기 |
| 강의 중심 | 토론 촉진 |
| 일방향 소통 | 쌍방향 소통 |

## PBL 문제 설계 원칙
1. **실제성**: 현실 세계의 진짜 문제
2. **복잡성**: 단순 답이 없는 다면적 문제
3. **학습자 수준**: ZPD 내 적절한 도전
4. **교육과정 연계**: 핵심 학습 목표 포함
5. **흥미**: 학습자의 관심과 동기 유발

## AI 도구 활용
- PBL 시나리오 자동 생성 (과목별, 수준별)
- 학습 이슈 도출 지원
- 자기주도 학습 과정에서 AI 튜터 역할`,
    contentEn: `## Overview
PBL originated at McMaster University Medical School (1969), centering learning on authentic problems where students take charge of their own learning.

## PBL Process

### 1. Problem Presentation
- Authentic, ill-structured problems
- Complex situations without single correct answers
- Example: "Local river water quality is deteriorating. Analyze the causes and propose solutions."

### 2. Problem Analysis
- What we know (Facts)
- What we need to learn (Learning Issues)
- Hypotheses
- Action Plan (role assignment)

### 3. Self-Directed Learning
- Individual exploration of learning issues
- Data collection and analysis
- Expert consultation, field investigation

### 4. Re-discussion and Synthesis
- Share learning results
- Verify and revise hypotheses
- Develop solutions

### 5. Reflection and Assessment
- Reflect on learning process
- Peer assessment + self-assessment
- Summarize learning outcomes

## Instructor Role: Facilitator

| Traditional Teaching | PBL Facilitator |
|---------------------|----------------|
| Knowledge transmitter | Learning guide |
| Provides answers | Poses questions |
| Lecture-centered | Facilitates discussion |
| One-way communication | Two-way communication |

## PBL Problem Design Principles
1. **Authenticity**: Real-world problems
2. **Complexity**: Multi-faceted without simple answers
3. **Learner Level**: Appropriate challenge within ZPD
4. **Curriculum Alignment**: Include core learning objectives
5. **Interest**: Motivate and engage learners

## AI Tool Integration
- Auto-generate PBL scenarios (by subject and level)
- Support learning issue identification
- AI tutor role during self-directed learning`,
  },
  {
    id: 'flipped',
    icon: '🔄',
    titleKo: '플립러닝 (Flipped Learning)',
    titleEn: 'Flipped Learning',
    tags: ['교수법', '혼합학습', 'ICT'],
    summaryKo: '기존 강의는 사전 학습으로, 교실 수업은 활동과 토론 중심으로 전환하는 교수 모델.',
    summaryEn: 'Teaching model that flips lectures to pre-class and uses classroom time for activities and discussions.',
    contentKo: `## 개요
Bergmann & Sams(2012)가 대중화한 플립러닝은 전통적 수업 구조를 "뒤집어" 교실 시간을 더 능동적인 학습에 활용합니다.

> **출처**: Bergmann, J., & Sams, A. (2012). *Flip Your Classroom: Reach Every Student in Every Class Every Day*. ISTE/ASCD. / O'Flaherty, J., & Phillips, C. (2015). The use of flipped classrooms in higher education: A scoping review. *Internet and Higher Education*, 25, 85-95.

## 전통 수업 vs 플립러닝

| | 전통 수업 | 플립러닝 |
|---|----------|---------|
| **교실** | 강의 (수동적) | 활동/토론 (능동적) |
| **집** | 숙제 (혼자) | 강의 영상 시청 (자기 속도) |
| **교수 역할** | 정보 전달 | 활동 촉진 |
| **Bloom 수준** | 교실: 낮은 수준 / 집: 높은 수준 | 집: 낮은 수준 / 교실: 높은 수준 |

## 구현 단계

### 사전 학습 (Pre-class)
- 강의 영상 (10-15분 이내)
- 읽기 자료, 팟캐스트
- 사전 퀴즈 (이해도 확인)
- 학습 질문 작성

### 교실 수업 (In-class)
- 사전 학습 확인 및 Q&A (10분)
- 심화 활동: 토론, 문제풀이, 프로젝트 (30분)
- 성찰 및 정리 (10분)

### 사후 학습 (Post-class)
- 심화 과제
- 성찰 저널
- 동료 피드백

## 성공 요인

### Must (필수)
- 사전 학습 자료의 품질과 적정 분량
- 사전 학습 참여를 유도하는 메커니즘 (퀴즈, 질문)
- 교실 활동이 사전 학습과 연결

### Should (권장)
- LMS(학습관리시스템) 활용
- 학생 피드백 반영한 지속적 개선
- 다양한 멀티미디어 활용

## 주의사항
- 학생의 사전 학습 부담 관리
- 디지털 접근성 확인
- 사전 학습 미참여자에 대한 전략 필요`,
    contentEn: `## Overview
Flipped Learning, popularized by Bergmann & Sams (2012), "flips" the traditional class structure to use classroom time for more active learning.

## Traditional vs Flipped

| | Traditional | Flipped |
|---|-----------|---------|
| **Classroom** | Lecture (passive) | Activities/discussion (active) |
| **Home** | Homework (alone) | Watch lecture videos (own pace) |
| **Instructor** | Information delivery | Activity facilitation |
| **Bloom Level** | Class: lower / Home: higher | Home: lower / Class: higher |

## Implementation

### Pre-class
- Lecture videos (under 10-15 min)
- Reading materials, podcasts
- Pre-quiz (comprehension check)
- Write learning questions

### In-class
- Check pre-learning & Q&A (10 min)
- Advanced activities: discussion, problem-solving, projects (30 min)
- Reflection and wrap-up (10 min)

### Post-class
- Advanced assignments
- Reflection journals
- Peer feedback

## Success Factors

### Must Have
- Quality and appropriate length of pre-class materials
- Mechanisms to ensure pre-learning (quizzes, questions)
- Classroom activities connected to pre-learning

### Should Have
- LMS integration
- Continuous improvement based on student feedback
- Diverse multimedia utilization

## Cautions
- Manage pre-class learning burden
- Verify digital accessibility
- Strategy needed for non-participating students`,
  },
  {
    id: 'kirkpatrick',
    icon: '📊',
    titleKo: '커크패트릭 4단계 평가 모델',
    titleEn: "Kirkpatrick's Four-Level Evaluation Model",
    tags: ['교육평가', '프로그램 평가', '효과성'],
    summaryKo: '교육 프로그램의 효과성을 반응, 학습, 행동, 결과의 4단계로 평가하는 모델.',
    summaryEn: 'Model evaluating educational program effectiveness at 4 levels: Reaction, Learning, Behavior, Results.',
    contentKo: `## 개요
Kirkpatrick(1959, 2016 개정)의 4단계 평가 모델은 교육/훈련 프로그램의 효과성을 체계적으로 평가하는 프레임워크입니다.

> **출처**: Kirkpatrick, J. D., & Kirkpatrick, W. K. (2016). *Kirkpatrick's Four Levels of Training Evaluation*. ATD Press.

## 4단계 평가

### Level 1: 반응 (Reaction)
- **질문**: "학습자가 교육에 만족했는가?"
- **측정**: 만족도 조사, 강의 평가
- **도구**: 설문지, 피드백 양식
- **시기**: 교육 직후
- **난이도**: ★☆☆☆ (가장 쉬움)

### Level 2: 학습 (Learning)
- **질문**: "학습자가 의도한 지식/기술/태도를 습득했는가?"
- **측정**: 사전-사후 시험, 실기 평가
- **도구**: 시험, 루브릭, 포트폴리오
- **시기**: 교육 중/직후
- **난이도**: ★★☆☆

### Level 3: 행동 (Behavior)
- **질문**: "학습한 것을 현업에 적용하고 있는가?"
- **측정**: 현장 관찰, 상사 평가, 자기 보고
- **도구**: 행동 체크리스트, 인터뷰
- **시기**: 교육 후 3-6개월
- **난이도**: ★★★☆

### Level 4: 결과 (Results)
- **질문**: "교육이 조직 성과에 기여했는가?"
- **측정**: 업무 성과, 비용 절감, 이직률 감소
- **도구**: 성과 지표, ROI 분석
- **시기**: 교육 후 6-12개월
- **난이도**: ★★★★ (가장 어려움)

## New World Kirkpatrick Model (2016)

Kirkpatrick & Kirkpatrick(2016)은 역순으로 시작하는 접근을 제안:

\`\`\`
Level 4 (결과) → Level 3 (행동) → Level 2 (학습) → Level 1 (반응)
"원하는 결과에서 출발하여 역방향으로 설계"
\`\`\`

## 직업훈련에서의 활용
- **NCS 직업능력개발훈련 평가**에 직접 적용 가능
- Level 1-2: 훈련 과정 내 평가
- Level 3: 취업 후 현장 적용도 추적
- Level 4: 고용 유지율, 임금 상승 등`,
    contentEn: `## Overview
Kirkpatrick's (1959, revised 2016) Four-Level Evaluation Model is a framework for systematically evaluating educational/training program effectiveness.

## 4 Levels

### Level 1: Reaction
- **Question**: "Were learners satisfied with the training?"
- **Measurement**: Satisfaction surveys, course evaluations
- **Tools**: Questionnaires, feedback forms
- **Timing**: Immediately after training
- **Difficulty**: ★☆☆☆ (Easiest)

### Level 2: Learning
- **Question**: "Did learners acquire intended knowledge/skills/attitudes?"
- **Measurement**: Pre-post tests, practical assessments
- **Tools**: Exams, rubrics, portfolios
- **Timing**: During/after training
- **Difficulty**: ★★☆☆

### Level 3: Behavior
- **Question**: "Are learners applying what they learned on the job?"
- **Measurement**: On-site observation, supervisor evaluation, self-report
- **Tools**: Behavior checklists, interviews
- **Timing**: 3-6 months after training
- **Difficulty**: ★★★☆

### Level 4: Results
- **Question**: "Did training contribute to organizational outcomes?"
- **Measurement**: Job performance, cost savings, reduced turnover
- **Tools**: Performance metrics, ROI analysis
- **Timing**: 6-12 months after training
- **Difficulty**: ★★★★ (Hardest)

## New World Kirkpatrick Model (2016)

Kirkpatrick & Kirkpatrick (2016) suggest starting in reverse:

\`\`\`
Level 4 (Results) → Level 3 (Behavior) → Level 2 (Learning) → Level 1 (Reaction)
"Start from desired results and design backward"
\`\`\`

## Application in Vocational Training
- Directly applicable to NCS vocational training evaluation
- Level 1-2: Within-course assessment
- Level 3: Post-employment application tracking
- Level 4: Employment retention, wage increase, etc.`,
  },
  {
    id: 'tpack',
    icon: '💻',
    titleKo: 'TPACK (기술교과내용지식)',
    titleEn: 'TPACK (Technological Pedagogical Content Knowledge)',
    tags: ['에듀테크', '교사역량', '기술통합'],
    summaryKo: '기술(TK), 교수법(PK), 내용(CK) 지식의 교차점에서 효과적인 기술 통합 교육이 이루어짐.',
    summaryEn: 'Effective technology integration occurs at the intersection of Technological, Pedagogical, and Content Knowledge.',
    contentKo: `## 개요
Mishra & Koehler(2006)의 TPACK 프레임워크는 교사가 기술을 효과적으로 교육에 통합하기 위해 필요한 지식 체계를 설명합니다.

## 7가지 지식 영역

### 핵심 3영역
1. **CK (Content Knowledge)**: 교과 내용 지식
   - 과목의 핵심 개념, 이론, 사실
2. **PK (Pedagogical Knowledge)**: 교수법 지식
   - 교수-학습 전략, 평가 방법, 학습자 이해
3. **TK (Technological Knowledge)**: 기술 지식
   - 디지털 도구, 소프트웨어, 하드웨어 활용 능력

### 교차 4영역
4. **PCK (Pedagogical Content Knowledge)**: 교과교육학 지식
   - 특정 내용을 효과적으로 가르치는 방법
5. **TCK (Technological Content Knowledge)**: 기술-내용 지식
   - 기술이 특정 내용 표현/이해를 어떻게 변화시키는지
6. **TPK (Technological Pedagogical Knowledge)**: 기술-교수법 지식
   - 기술이 교수-학습 방법을 어떻게 변화시키는지
7. **TPACK**: 세 영역의 교차점
   - 특정 내용을, 특정 기술로, 효과적으로 가르치는 통합 지식

## TPACK과 AI 통합 교육

| 지식 영역 | AI 시대 적용 예시 |
|----------|-----------------|
| TK | ChatGPT, Gemini 등 AI 도구 활용 능력 |
| TPK | AI를 활용한 개인화 학습, 자동 피드백 설계 |
| TCK | AI가 교과 내용 표현을 어떻게 변화시키는지 이해 |
| TPACK | 특정 교과에서 AI를 활용한 최적의 교수-학습 설계 |

## 교사 역량 개발 방향
1. **기술 친숙도 향상**: AI 도구 직접 사용 경험
2. **교과 맥락 통합**: AI를 교과 특성에 맞게 활용
3. **교수법적 판단**: AI 활용의 적절한 시점과 방법 판단
4. **비판적 성찰**: AI 활용의 효과와 한계 평가

## Teaching AI 사이트와의 연결
- 본 사이트의 AI 도구들은 교사의 TPACK 역량 강화를 지원
- 강의계획서/루브릭/과제/피드백 생성 시 TPK와 TPACK 실현
- AI를 교수법적 판단 하에 활용하는 실습 기회 제공`,
    contentEn: `## Overview
Mishra & Koehler's (2006) TPACK framework describes the knowledge system teachers need to effectively integrate technology in education.

## 7 Knowledge Domains

### Core 3 Domains
1. **CK (Content Knowledge)**: Subject matter knowledge
   - Core concepts, theories, facts of the subject
2. **PK (Pedagogical Knowledge)**: Teaching methods
   - Teaching-learning strategies, assessment methods, learner understanding
3. **TK (Technological Knowledge)**: Technology skills
   - Digital tools, software, hardware proficiency

### Intersecting 4 Domains
4. **PCK**: How to effectively teach specific content
5. **TCK**: How technology changes content representation/understanding
6. **TPK**: How technology changes teaching-learning methods
7. **TPACK**: Intersection of all three — integrated knowledge for teaching specific content with specific technology effectively

## TPACK and AI Integration

| Domain | AI Era Application |
|--------|-------------------|
| TK | ChatGPT, Gemini tool proficiency |
| TPK | AI-powered personalized learning, automated feedback design |
| TCK | Understanding how AI changes subject content representation |
| TPACK | Optimal instructional design using AI in specific subjects |

## Teacher Competency Development
1. **Technology Familiarity**: Hands-on experience with AI tools
2. **Subject Integration**: Use AI according to subject characteristics
3. **Pedagogical Judgment**: Determine when and how to use AI
4. **Critical Reflection**: Evaluate effectiveness and limitations of AI use

## Connection to Teaching AI Site
- This site's AI tools support strengthening teachers' TPACK competency
- Realize TPK and TPACK when generating syllabi/rubrics/assignments/feedback
- Provide practical opportunities to use AI with pedagogical judgment`,
  },
  {
    id: 'constructivism',
    icon: '🧱',
    titleKo: '구성주의 (Constructivism)',
    titleEn: 'Constructivism',
    tags: ['학습이론', '지식구성', '경험학습'],
    summaryKo: '학습자가 경험과 상호작용을 통해 능동적으로 지식을 구성한다는 학습 이론.',
    summaryEn: 'Learning theory where learners actively construct knowledge through experience and interaction.',
    contentKo: `## 개요
구성주의는 학습자가 수동적으로 지식을 받아들이는 것이 아니라, 경험과 상호작용을 통해 능동적으로 지식을 구성한다는 인식론적 관점입니다.

## 두 가지 주요 흐름

### 인지적 구성주의 (Piaget)
- 학습자 개인의 인지 구조 변화에 초점
- **동화 (Assimilation)**: 새 정보를 기존 스키마에 통합
- **조절 (Accommodation)**: 기존 스키마를 새 정보에 맞게 변형
- **평형화 (Equilibration)**: 인지적 갈등 해소를 통한 발달

### 사회적 구성주의 (Vygotsky)
- 사회적 상호작용과 문화적 맥락에서의 학습에 초점
- **근접발달영역 (ZPD)**: 도움으로 달성 가능한 수준
- **매개 (Mediation)**: 언어, 도구, 문화적 산물을 통한 학습
- **내면화 (Internalization)**: 사회적 활동이 내적 사고로 전환

## 구성주의 교수 원리

| 원리 | 설명 | 교실 적용 |
|------|------|----------|
| **능동적 학습** | 학습자가 직접 참여 | 실험, 프로젝트, 토론 |
| **맥락적 학습** | 실제 맥락에서 학습 | 사례 연구, 현장 학습 |
| **사회적 학습** | 타인과의 상호작용 | 그룹 활동, 동료 교수 |
| **성찰적 학습** | 자신의 학습 과정 성찰 | 학습 일지, 포트폴리오 |
| **다중 관점** | 다양한 시각 제공 | 토론, 역할극 |

## 구성주의 vs 객관주의

| 객관주의 (전통적) | 구성주의 |
|-----------------|---------|
| 지식은 객관적으로 존재 | 지식은 학습자가 구성 |
| 교수자 → 학습자 전달 | 학습자가 능동적 구성 |
| 표준화된 평가 | 수행 기반 평가 |
| 교수자 중심 | 학습자 중심 |

## 구성주의 기반 교수법
- 문제중심학습 (PBL)
- 프로젝트 기반 학습
- 탐구 학습 (Inquiry-Based Learning)
- 협력 학습 (Collaborative Learning)
- 앵커드 수업 (Anchored Instruction)`,
    contentEn: `## Overview
Constructivism is an epistemological perspective that learners actively construct knowledge through experience and interaction rather than passively receiving it.

## Two Major Strands

### Cognitive Constructivism (Piaget)
- Focus on individual's cognitive structure changes
- **Assimilation**: Integrating new info into existing schemas
- **Accommodation**: Modifying schemas for new information
- **Equilibration**: Development through resolving cognitive conflict

### Social Constructivism (Vygotsky)
- Focus on learning through social interaction and cultural context
- **ZPD**: Level achievable with assistance
- **Mediation**: Learning through language, tools, cultural artifacts
- **Internalization**: Social activities become internal thought

## Constructivist Teaching Principles

| Principle | Description | Classroom Application |
|-----------|-------------|----------------------|
| **Active** | Learner participation | Experiments, projects, discussions |
| **Contextual** | Real-world contexts | Case studies, field learning |
| **Social** | Interaction with others | Group activities, peer teaching |
| **Reflective** | Learning process reflection | Learning journals, portfolios |
| **Multiple Perspectives** | Diverse viewpoints | Debates, role-playing |

## Constructivism vs Objectivism

| Objectivism (Traditional) | Constructivism |
|--------------------------|----------------|
| Knowledge exists objectively | Knowledge is constructed by learners |
| Teacher → Student transfer | Learner actively constructs |
| Standardized assessment | Performance-based assessment |
| Teacher-centered | Learner-centered |

## Constructivism-Based Pedagogies
- Problem-Based Learning (PBL)
- Project-Based Learning
- Inquiry-Based Learning
- Collaborative Learning
- Anchored Instruction`,
  },
  {
    id: 'sam',
    icon: '⚡',
    titleKo: 'SAM (Successive Approximation Model)',
    titleEn: 'SAM (Successive Approximation Model)',
    tags: ['교수설계', '애자일', '반복설계'],
    summaryKo: 'ADDIE의 한계를 보완한 애자일 기반 반복적 교수설계 모델.',
    summaryEn: 'Agile-based iterative instructional design model addressing ADDIE limitations.',
    contentKo: `## 개요
Allen(2012)이 제안한 SAM은 ADDIE의 선형적 한계를 극복하고, 빠른 프로토타이핑과 반복적 개선을 강조하는 교수설계 모델입니다.

## ADDIE vs SAM

| ADDIE | SAM |
|-------|-----|
| 선형적/순차적 | 반복적/순환적 |
| 완벽한 설계 후 개발 | 빠른 프로토타입 + 반복 개선 |
| 변경 비용 높음 | 변경 용이 |
| 긴 개발 기간 | 짧은 사이클 반복 |

## SAM1 (소규모 프로젝트)

\`\`\`
평가 ←→ 설계 ←→ 개발
  ↑               ↓
  └───── 반복 ─────┘
\`\`\`

3가지 핵심 활동의 빠른 순환:
1. **평가 (Evaluate)**: 현재 결과물 검토
2. **설계 (Design)**: 개선안 도출
3. **개발 (Develop)**: 프로토타입 수정

## SAM2 (대규모 프로젝트)

### 준비 단계 (Preparation Phase)
- **Savvy Start**: 핵심 이해관계자 워크숍
  - 배경 정보 수집
  - 프로토타입 브레인스토밍
  - 초기 프로토타입 스케치

### 반복 설계 단계 (Iterative Design Phase)
- 설계 → 프로토타입 → 리뷰의 반복 (3회 이상)
- 각 반복마다 디자인 증명(Design Proof) 생성
- 이해관계자 검토 및 승인

### 반복 개발 단계 (Iterative Development Phase)
- 개발 → 구현 → 평가의 반복 (3회 이상)
- Alpha → Beta → Gold 단계적 완성
- 지속적 품질 검증

## SAM의 핵심 원칙
1. **반복 (Iteration)**: 완벽보다 빠른 시작
2. **협력 (Collaboration)**: 이해관계자 참여
3. **효율 (Efficiency)**: 낭비 최소화
4. **실용 (Pragmatism)**: 실제 활용 가능한 결과물 중심`,
    contentEn: `## Overview
SAM by Allen (2012) overcomes ADDIE's linear limitations, emphasizing rapid prototyping and iterative improvement.

## ADDIE vs SAM

| ADDIE | SAM |
|-------|-----|
| Linear/sequential | Iterative/cyclical |
| Perfect design then develop | Quick prototype + iterate |
| High cost of change | Easy to change |
| Long development cycle | Short repeated cycles |

## SAM1 (Small Projects)

\`\`\`
Evaluate ←→ Design ←→ Develop
    ↑                    ↓
    └───── Iterate ──────┘
\`\`\`

Rapid cycling of 3 core activities:
1. **Evaluate**: Review current deliverables
2. **Design**: Develop improvements
3. **Develop**: Modify prototypes

## SAM2 (Large Projects)

### Preparation Phase
- **Savvy Start**: Key stakeholder workshop
  - Gather background information
  - Brainstorm prototypes
  - Sketch initial prototypes

### Iterative Design Phase
- Design → Prototype → Review cycles (3+ iterations)
- Generate Design Proof at each iteration
- Stakeholder review and approval

### Iterative Development Phase
- Develop → Implement → Evaluate cycles (3+ iterations)
- Alpha → Beta → Gold progressive completion
- Continuous quality verification

## SAM Core Principles
1. **Iteration**: Start fast rather than perfectly
2. **Collaboration**: Stakeholder participation
3. **Efficiency**: Minimize waste
4. **Pragmatism**: Focus on usable deliverables`,
  },
];

/* ============================================
   기존 빠른 참고 자료
   ============================================ */
const QUICK_RESOURCES = [
  {
    titleKo: 'Anthropic 프롬프트 엔지니어링 가이드',
    descKo: 'Claude 공식 문서의 프롬프트 설계 원칙과 기법(역할·맥락·예시·체이닝)을 정리한 1차 자료입니다.',
    tags: ['Claude', '프롬프트'], icon: 'fa-book',
    url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview',
  },
  {
    titleKo: 'Anthropic 프롬프트 라이브러리',
    descKo: '업무·교육별로 바로 활용 가능한 검증된 프롬프트 예시 모음입니다.',
    tags: ['프롬프트', '예시'], icon: 'fa-layer-group',
    url: 'https://docs.anthropic.com/en/prompt-library/library',
  },
  {
    titleKo: 'Claude (claude.ai)',
    descKo: '대화·프로젝트·파일 업로드 기반으로 연구·강의를 보조하는 작업 환경입니다.',
    tags: ['AI 도구'], icon: 'fa-robot',
    url: 'https://claude.ai',
  },
  {
    titleKo: '한국저작권위원회',
    descKo: '생성형 AI 활용 시 저작권 쟁점·안내와 저작권 교육·상담 자료를 제공합니다.',
    tags: ['저작권', '연구윤리'], icon: 'fa-scale-balanced',
    url: 'https://www.copyright.or.kr',
  },
  {
    titleKo: '한국연구재단 (NRF)',
    descKo: '연구과제 공고·신청, 제안서 양식과 평가 기준을 확인할 수 있습니다.',
    tags: ['연구', '제안서'], icon: 'fa-flask',
    url: 'https://www.nrf.re.kr',
  },
  {
    titleKo: 'RISS 학술연구정보서비스',
    descKo: '국내외 학위논문·학술지·참고문헌을 검색하고 원문을 확보합니다.',
    tags: ['문헌', '검색'], icon: 'fa-magnifying-glass',
    url: 'https://www.riss.kr',
  },
  {
    titleKo: '한국교육학술정보원 (KERIS)',
    descKo: '에듀테크·디지털 교육 자료와 학술정보 서비스를 제공합니다.',
    tags: ['에듀테크', '교육'], icon: 'fa-laptop',
    url: 'https://www.keris.or.kr',
  },
  {
    titleKo: '교육부 디지털 교육',
    descKo: '디지털 기반 교육혁신과 AI 활용 교육 정책·지침 자료를 안내합니다.',
    tags: ['정책', '교육부'], icon: 'fa-building-columns',
    url: 'https://www.moe.go.kr',
  },
];

/* ============================================
   ADDIE 사이클 다이어그램
   ============================================ */
function AddieCycle({ lang }) {
  const ko = lang === 'ko';
  const phases = ko
    ? ['분석', '설계', '개발', '실행', '평가']
    : ['Analyze', 'Design', 'Develop', 'Implement', 'Evaluate'];
  const subs = ko
    ? ['학습자·환경·과제', '목표·전략·평가도구', '자료·활동·도구', '교육실시·지원', '형성·총괄평가']
    : ['Learner, Context, Task', 'Objectives, Strategies', 'Materials, Activities', 'Deliver, Support', 'Formative, Summative'];
  const cx = 300, cy = 250, r = 190;
  return (
    <div style={{ margin: '28px 0', textAlign: 'center' }}>
      <svg viewBox="0 0 600 520" style={{ maxWidth: 640, width: '100%' }}>
        {phases.map((p, i) => {
          const angle = (-90 + i * 72) * Math.PI / 180;
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          const nextAngle = (-90 + (i + 1) * 72) * Math.PI / 180;
          const mx = cx + (r - 56) * Math.cos((angle + nextAngle) / 2);
          const my = cy + (r - 56) * Math.sin((angle + nextAngle) / 2);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={56} fill={i === 0 ? '#0F2444' : i === 4 ? '#3D6DB5' : '#1B3A6B'} />
              <text x={x} y={y - 4} textAnchor="middle" fill="#fff" fontSize="16" fontWeight="700">{p}</text>
              <text x={x} y={y + 14} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10.5">{subs[i]}</text>
              <text x={mx} y={my + 4} textAnchor="middle" fill="var(--primary-blue)" fontSize="20" opacity="0.3">→</text>
            </g>
          );
        })}
        <text x={cx} y={cy + 6} textAnchor="middle" fill="var(--text-secondary)" fontSize="16" fontWeight="700">ADDIE</text>
      </svg>
      <p style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 8 }}>
        {ko ? 'Branch (2009), ADDIE 순환 모델 기반 다이어그램' : 'Diagram based on Branch (2009), ADDIE Cycle Model'}
      </p>
    </div>
  );
}

/* ============================================
   Bloom's Taxonomy 피라미드 다이어그램
   ============================================ */
function BloomsPyramid({ lang }) {
  const ko = lang === 'ko';
  const levels = ko
    ? [
      { label: '창조', verb: '설계, 구성, 개발', bg: '#0F2444' },
      { label: '평가', verb: '판단, 비평, 정당화', bg: '#1B3A6B' },
      { label: '분석', verb: '분석, 구별, 조직', bg: '#2A5298' },
      { label: '적용', verb: '적용, 실행, 사용', bg: '#3D6DB5' },
      { label: '이해', verb: '설명, 요약, 비교', bg: '#6B93CC' },
      { label: '기억', verb: '정의, 나열, 인식', bg: '#9BB8DE' },
    ]
    : [
      { label: 'Create', verb: 'Design, Construct, Develop', bg: '#0F2444' },
      { label: 'Evaluate', verb: 'Judge, Critique, Justify', bg: '#1B3A6B' },
      { label: 'Analyze', verb: 'Analyze, Differentiate, Organize', bg: '#2A5298' },
      { label: 'Apply', verb: 'Apply, Execute, Implement', bg: '#3D6DB5' },
      { label: 'Understand', verb: 'Explain, Summarize, Compare', bg: '#6B93CC' },
      { label: 'Remember', verb: 'Define, List, Recognize', bg: '#9BB8DE' },
    ];
  return (
    <div style={{ margin: '28px 0', textAlign: 'center' }}>
      <svg viewBox="0 0 650 420" style={{ maxWidth: 620, width: '100%' }}>
        {levels.map((lv, i) => {
          const y = i * 62 + 14;
          const xLeft = 325 - (i + 1) * 49;
          const xRight = 325 + (i + 1) * 49;
          const w = xRight - xLeft;
          return (
            <g key={i}>
              <rect x={xLeft} y={y} width={w} height={52} rx={5} fill={lv.bg} />
              <text x={325} y={y + 23} textAnchor="middle" fill="#fff" fontSize="16" fontWeight="700">{lv.label}</text>
              <text x={325} y={y + 40} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="12">{lv.verb}</text>
            </g>
          );
        })}
        <text x={22} y={210} fontSize="12" fill="#6B93CC" fontWeight="600" transform="rotate(-90 22 210)">
          {ko ? '고차원 사고 ←→ 저차원 사고' : 'Higher-Order ←→ Lower-Order'}
        </text>
      </svg>
      <p style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 8 }}>
        {ko
          ? "Anderson & Krathwohl (2001), Bloom's Revised Taxonomy 기반 다이어그램"
          : "Diagram based on Anderson & Krathwohl (2001), Bloom's Revised Taxonomy"}
      </p>
    </div>
  );
}

/* ============================================
   마크다운 간이 렌더러
   ============================================ */
function ZpdDiagram({ lang }) {
  const ko = lang === 'ko';
  return (
    <div className="zpd-diagram">
      <div className="zpd-rings">
        <div className="zpd-ring zpd-ring--outer">
          <span className="zpd-label">{ko ? '도움 없이는 할 수 없는 영역' : 'Cannot do without help'}</span>
        </div>
        <div className="zpd-ring zpd-ring--mid">
          <span className="zpd-label">
            <span className="zpd-label-title">{ko ? '근접발달영역 (ZPD)' : 'Zone of Proximal Development'}</span>
            <span className="zpd-label-sub">{ko ? '도움으로 할 수 있는 영역' : 'Can do with guidance'}</span>
          </span>
        </div>
        <div className="zpd-ring zpd-ring--inner">
          <span className="zpd-label-title">{ko ? '독립적으로' : 'Can do'}</span>
          <span className="zpd-label-sub">{ko ? '할 수 있는 영역' : 'independently'}</span>
        </div>
        <div className="zpd-arrow-area">
          <span>&larr;</span> {ko ? '스캐폴딩 (지원)' : 'Scaffolding (Support)'} <span>&rarr;</span>
        </div>
      </div>
    </div>
  );
}

function formatInline(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
}

function TheoryContent({ content, language }) {
  const lines = content.split('\n');
  const elements = [];
  let i = 0;
  let tableRows = [];
  let tableHeaders = [];
  let inTable = false;

  function flushTable() {
    if (tableHeaders.length > 0) {
      elements.push(
        <div key={`table-${elements.length}`} className="theory-table-wrap">
          <table className="theory-table">
            <thead>
              <tr>{tableHeaders.map((h, idx) => <th key={idx}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {tableRows.map((row, rIdx) => (
                <tr key={rIdx}>{row.map((cell, cIdx) => <td key={cIdx} dangerouslySetInnerHTML={{ __html: formatInline(cell) }} />)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    tableHeaders = [];
    tableRows = [];
    inTable = false;
  }

  while (i < lines.length) {
    const line = lines[i];

    // Table
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      if (!inTable) {
        tableHeaders = cells;
        inTable = true;
        i++;
        // Skip separator line
        if (i < lines.length && lines[i].trim().match(/^\|[\s-:|]+\|$/)) i++;
        continue;
      } else {
        tableRows.push(cells);
        i++;
        continue;
      }
    } else if (inTable) {
      flushTable();
    }

    // Code block
    if (line.trim().startsWith('```')) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(<pre key={`code-${i}`} className="theory-code">{codeLines.join('\n')}</pre>);
      i++;
      continue;
    }

    // Blockquote (> 로 시작)
    if (line.startsWith('> ')) {
      const quoteLines = [line.slice(2)];
      while (i + 1 < lines.length && lines[i + 1].startsWith('> ')) {
        i++;
        quoteLines.push(lines[i].slice(2));
      }
      elements.push(
        <blockquote key={`bq-${i}`} className="theory-blockquote" dangerouslySetInnerHTML={{ __html: quoteLines.map(l => formatInline(l)).join('<br/>') }} />
      );
      i++;
      continue;
    }

    // Headers
    if (line.startsWith('## ')) {
      elements.push(<h4 key={`h2-${i}`} className="theory-h2">{line.slice(3)}</h4>);
      i++;
      continue;
    }
    if (line.startsWith('### ')) {
      elements.push(<h5 key={`h3-${i}`} className="theory-h3">{line.slice(4)}</h5>);
      i++;
      continue;
    }

    // List items
    if (line.match(/^\s*[-*]\s/)) {
      const listItems = [];
      while (i < lines.length && lines[i].match(/^\s*[-*]\s/)) {
        const indent = lines[i].search(/\S/);
        listItems.push({ text: lines[i].replace(/^\s*[-*]\s/, ''), indent });
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="theory-list">
          {listItems.map((item, idx) => (
            <li key={idx} style={{ marginLeft: Math.max(0, item.indent - 2) * 8 }} dangerouslySetInnerHTML={{ __html: formatInline(item.text) }} />
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (line.match(/^\s*\d+\.\s/)) {
      const listItems = [];
      while (i < lines.length && lines[i].match(/^\s*\d+\.\s/)) {
        listItems.push(lines[i].replace(/^\s*\d+\.\s/, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="theory-list theory-list--ordered">
          {listItems.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
          ))}
        </ol>
      );
      continue;
    }

    // Special markers
    if (line.trim() === '[BLOOMS_PYRAMID]') {
      elements.push(<BloomsPyramid key={`blooms-${i}`} lang={language} />);
      i++;
      continue;
    }
    if (line.trim() === '[ADDIE_CYCLE]') {
      elements.push(<AddieCycle key={`addie-${i}`} lang={language} />);
      i++;
      continue;
    }
    if (line.trim() === '[ZPD_DIAGRAM]') {
      elements.push(<ZpdDiagram key={`zpd-${i}`} lang={language} />);
      i++;
      continue;
    }

    // Paragraph
    if (line.trim()) {
      elements.push(<p key={`p-${i}`} className="theory-p" dangerouslySetInnerHTML={{ __html: formatInline(line) }} />);
    }
    i++;
  }

  if (inTable) flushTable();

  return <>{elements}</>;
}

/* ============================================
   카테고리 오버뷰
   ============================================ */
function CategoryOverview({ group, language, theoryMap, go }) {
  const colorClass = group.color;
  return (
    <div className="ck-content-box">
      <div className={`ck-overview-header ck-oh--${colorClass}`}>
        <div className="ck-oh-icon"><i className={`fa-solid ${group.icon}`} /></div>
        <div>
          <h2>{group.labelKo}</h2>
          <p>{group.descKo}</p>
        </div>
        <span className="ck-oh-badge">{group.children.length}{'개 이론'}</span>
      </div>
      <div className="ck-overview-grid">
        {group.children.map(child => {
          const theory = theoryMap[child.id];
          return (
            <button key={child.id} className={`ck-ov-card ck-ov--${colorClass}`} onClick={() => go(child.id)}>
              <div className="ck-ov-card-icon"><i className={`fa-solid ${child.icon}`} /></div>
              <div className="ck-ov-card-body">
                <h4>{theory?.titleKo || child.labelKo}</h4>
                <p>{theory?.summaryKo}</p>
              </div>
              <i className="fa-solid fa-chevron-right ck-ov-arrow" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================
   빠른 참고 자료 오버뷰
   ============================================ */
function QuickOverview({ language }) {
  return (
    <div className="ck-content-box">
      <div className="ck-overview-header ck-oh--blue">
        <div className="ck-oh-icon"><i className="fa-solid fa-bookmark" /></div>
        <div>
          <h2>{'빠른 참고 자료'}</h2>
          <p>{'교육 관련 참고 자료 모음'}</p>
        </div>
      </div>
      <div className="ck-overview-grid">
        {QUICK_RESOURCES.map((r, i) => (
          <a key={i} href={r.url} target="_blank" rel="noreferrer" className="ck-ov-card ck-ov--blue" style={{ textDecoration: 'none' }}>
            <div className="ck-ov-card-icon"><i className={`fa-solid ${r.icon || 'fa-file-lines'}`} /></div>
            <div className="ck-ov-card-body">
              <h4>{r.titleKo} <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: 10.5, opacity: 0.45, marginLeft: 2 }} /></h4>
              <p>{r.descKo}</p>
              <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {r.tags.map(tag => <span key={tag} className="resource-tag">{tag}</span>)}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ============================================
   개별 이론 패널
   ============================================ */
function TheoryPanel({ theory, language }) {
  const parent = MENU.find(g => g.children.some(c => c.id === theory.id));
  const child = parent?.children.find(c => c.id === theory.id);
  const colorClass = parent?.color || 'blue';

  return (
    <div className="ck-content-box">
      <div className={`ck-content-header ck-ch--${colorClass}`}>
        <i className={`fa-solid ${child?.icon || 'fa-book'}`} />
        <div className="ck-ch-text">
          <h2>{theory.titleKo}</h2>
          <p>{theory.summaryKo}</p>
        </div>
      </div>
      {theory.tags && theory.tags.length > 0 && (
        <div style={{ padding: '12px 28px 0', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {theory.tags.map(tag => <span key={tag} className="resource-tag">{tag}</span>)}
        </div>
      )}
      <div className="ck-content-body">
        <TheoryContent content={theory.contentKo} language={language} />
      </div>
    </div>
  );
}

/* ============================================
   메인 Resources 페이지
   ============================================ */
export default function Resources() {
  const language = 'ko';
  const [activeSection, setActiveSection] = useState('objectives');
  const [openMenus, setOpenMenus] = useState({ objectives: true });
  const [mobileSidebar, setMobileSidebar] = useState(false);

  const theoryMap = useMemo(() => Object.fromEntries(THEORIES.map(th => [th.id, th])), []);

  const activeParent = useMemo(() => {
    for (const m of MENU) {
      if (m.id === activeSection) return m.id;
      if (m.children.some(c => c.id === activeSection)) return m.id;
    }
    return 'objectives';
  }, [activeSection]);

  const getLabel = useCallback((id) => {
    const g = MENU.find(m => m.id === id);
    if (g) return g.labelKo;
    for (const m of MENU) {
      const c = m.children.find(ch => ch.id === id);
      if (c) return c.labelKo;
    }
    return id;
  }, [language]);

  const navigate = useCallback((sectionId) => {
    setActiveSection(sectionId);
    for (const m of MENU) {
      if (m.id === sectionId || m.children.some(c => c.id === sectionId)) {
        setOpenMenus(prev => ({ ...prev, [m.id]: true }));
        break;
      }
    }
    setMobileSidebar(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleParentClick = useCallback((parentId) => {
    const isOpen = openMenus[parentId];
    setOpenMenus(prev => ({ ...prev, [parentId]: !isOpen }));
    if (!isOpen || MENU.find(m => m.id === parentId)?.children.length === 0) {
      setActiveSection(parentId);
      setMobileSidebar(false);
    }
  }, [openMenus]);

  const curIdx = ALL_SECTIONS.indexOf(activeSection);
  const prevSec = curIdx > 0 ? ALL_SECTIONS[curIdx - 1] : null;
  const nextSec = curIdx < ALL_SECTIONS.length - 1 ? ALL_SECTIONS[curIdx + 1] : null;

  const renderContent = () => {
    const parent = MENU.find(g => g.id === activeSection || g.children.some(c => c.id === activeSection));

    // Parent overview pages
    if (parent && parent.id === activeSection) {
      if (parent.id === 'quick') return <QuickOverview language={language} />;
      return <CategoryOverview group={parent} language={language} theoryMap={theoryMap} go={navigate} />;
    }

    // Individual theory page
    const theory = theoryMap[activeSection];
    if (theory) return <TheoryPanel theory={theory} language={language} />;

    return null;
  };

  return (
    <div className="ck-page">
      <button className="ck-mobile-toggle" onClick={() => setMobileSidebar(!mobileSidebar)}>
        <i className={`fa-solid ${mobileSidebar ? 'fa-xmark' : 'fa-bars'}`} />
        <span>{'메뉴'}</span>
      </button>

      {mobileSidebar && <div className="ck-overlay" onClick={() => setMobileSidebar(false)} />}

      <div className="ck-layout">
        {/* Sidebar */}
        <aside className={`ck-sidebar ${mobileSidebar ? 'open' : ''}`}>
          <div className="ck-sb-header">
            <i className="fa-solid fa-book" />
            <span>{'교육공학자료'}</span>
          </div>
          <nav className="ck-sb-nav">
            {MENU.map(group => (
              <div key={group.id} className={`ck-nav-group ${activeParent === group.id ? 'active' : ''}`}>
                <button
                  className={`ck-nav-parent ck-np--${group.color}`}
                  onClick={() => handleParentClick(group.id)}
                >
                  <i className={`fa-solid ${group.icon} ck-np-icon`} />
                  <span>{group.labelKo}</span>
                  {group.children.length > 0 && (
                    <i className={`fa-solid fa-chevron-down ck-nav-arrow ${openMenus[group.id] ? 'open' : ''}`} />
                  )}
                </button>
                {group.children.length > 0 && openMenus[group.id] && (
                  <ul className="ck-nav-children">
                    {group.children.map(child => (
                      <li key={child.id}>
                        <button
                          className={`ck-nav-child ${activeSection === child.id ? 'active' : ''}`}
                          onClick={() => navigate(child.id)}
                        >
                          <i className={`fa-solid ${child.icon} ck-nc-icon`} />
                          <span>{child.labelKo}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="ck-main">
          {/* Breadcrumb */}
          <nav className="ck-breadcrumb">
            <button onClick={() => navigate(MENU[0].id)}>
              <i className="fa-solid fa-house" />
            </button>
            {(() => {
              const parentMenu = MENU.find(m => m.id === activeParent);
              const isChild = activeSection !== activeParent;
              const childMenu = isChild ? parentMenu?.children.find(c => c.id === activeSection) : null;
              return (
                <>
                  {parentMenu && (
                    <>
                      <i className="fa-solid fa-chevron-right ck-bc-sep" />
                      <button className={!isChild ? 'current' : ''} onClick={() => navigate(parentMenu.id)}>
                        {parentMenu.labelKo}
                      </button>
                    </>
                  )}
                  {childMenu && (
                    <>
                      <i className="fa-solid fa-chevron-right ck-bc-sep" />
                      <span className="current">{childMenu.labelKo}</span>
                    </>
                  )}
                </>
              );
            })()}
          </nav>

          {renderContent()}

          {/* Nav buttons */}
          <div className="ck-nav-buttons">
            {prevSec ? (
              <button className="ck-nav-btn" onClick={() => navigate(prevSec)}>
                <i className="fa-solid fa-arrow-left" />
                <div>
                  <span className="ck-nav-label">{'이전'}</span>
                  <span className="ck-nav-title">{getLabel(prevSec)}</span>
                </div>
              </button>
            ) : <div />}
            {nextSec ? (
              <button className="ck-nav-btn ck-nav-next" onClick={() => navigate(nextSec)}>
                <div>
                  <span className="ck-nav-label">{'다음'}</span>
                  <span className="ck-nav-title">{getLabel(nextSec)}</span>
                </div>
                <i className="fa-solid fa-chevron-right" />
              </button>
            ) : <div />}
          </div>
        </main>
      </div>
    </div>
  );
}
