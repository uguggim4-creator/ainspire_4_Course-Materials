# AI 코딩 에이전트 비교 자료집
## Claude Code · OpenAI Codex · Google Antigravity

이 자료집은 현재 가장 많이 쓰이는 세 가지 AI 코딩 에이전트를 비교한 자료입니다.  
세 도구 모두 "AI에게 코딩 작업을 맡긴다"는 공통점이 있지만, 철학과 사용 방식이 다릅니다.  
어떤 도구를 언제 쓰면 좋은지 이해하는 데 목적이 있습니다.

---

## 1. 한눈에 보는 차이점

| 항목 | Claude Code | OpenAI Codex | Google Antigravity |
|---|---|---|---|
| 만든 곳 | Anthropic | OpenAI | Google |
| 주요 모델 | Claude Sonnet / Opus | o3, o4-mini, codex-mini | Gemini 3.1 Pro / Flash |
| 실행 환경 | 터미널(CLI) | 터미널(CLI) | IDE (VS Code 기반) + CLI |
| 핵심 철학 | 터미널 중심, 깊은 추론 | 클라우드 샌드박스, 병렬 작업 | IDE 통합, 멀티 에이전트 |
| 오픈소스 | 아니오 | 예 (CLI 코드) | 아니오 |
| 가격 (2026년 기준) | Claude Pro $20/월 포함 | ChatGPT Plus 번들 포함 | 무료 티어 + Pro $20/월 |
| 출시 시기 | 2025년 2월 | 2025년 4월 | 2025년 11월 |

---

## 2. Claude Code

### 도구 소개

Anthropic이 만든 터미널 기반 AI 코딩 에이전트입니다.  
터미널에서 자연어로 지시하면 파일을 읽고, 코드를 수정하고, 테스트를 실행하고, git 커밋까지 자동으로 처리합니다.  
2025년 2월 리서치 프리뷰로 시작해 2025년 한 해에만 176개 업데이트를 출시했습니다.

### 핵심 특징

**터미널 퍼스트**  
IDE 없이 터미널만으로 전체 개발 작업이 가능합니다. 기존에 쓰던 에디터(VS Code, JetBrains 등)와 나란히 쓸 수 있습니다.

**깊은 추론**  
버그를 찾거나 아키텍처를 설계할 때 "왜 이 문제가 생겼는지" 단계별로 생각하는 과정을 보여줍니다.  
복잡한 멀티파일 리팩토링이나 대규모 코드베이스 분석에서 강점을 보입니다.

**MCP 프로토콜**  
300개 이상의 외부 서비스(Notion, GitHub, Figma 등)와 연결할 수 있는 MCP 프로토콜을 지원합니다.

**훅(Hooks) 시스템**  
특정 이벤트(파일 저장, 커밋 전 등)에 자동으로 실행될 동작을 설정할 수 있습니다.

**SWE-bench 성능**  
실제 소프트웨어 엔지니어링 과제를 자동으로 해결하는 SWE-bench 벤치마크에서 52.9%의 해결률을 기록했습니다. (2026년 기준 최고 수준)

### 설치 및 사용법

```bash
# 설치 (Node.js 18+ 필요)
npm install -g @anthropic-ai/claude-code

# 프로젝트 폴더에서 실행
cd 내프로젝트폴더
claude

# 단일 작업 실행 (대화 없이)
claude -p "로그인 버그를 찾아서 고쳐줘"
```

**기본 대화 예시**

```
> 이 프로젝트의 인증 로직이 어디 있어?
> 비밀번호 재설정 기능을 추가해줘. 이메일로 링크를 보내는 방식으로.
> 방금 추가한 코드에 테스트를 작성하고, 커밋까지 해줘.
```

### 이런 작업에 적합합니다

- 복잡한 버그 원인 분석
- 대규모 코드 리팩토링
- 여러 파일에 걸친 기능 구현
- git 워크플로 자동화 (커밋, PR 작성)
- 코드 리뷰 및 보안 취약점 점검

### 공식 자료

- 공식 문서: https://code.claude.com/docs
- GitHub: https://github.com/anthropics/claude-code
- 발표 블로그: https://www.anthropic.com/news/claude-3-7-sonnet

---

## 3. OpenAI Codex

### 도구 소개

OpenAI가 만든 오픈소스 터미널 코딩 에이전트입니다.  
2025년 4월 공개되었으며, 별도 구독 없이 ChatGPT Plus나 ChatGPT Pro 플랜에 포함되어 있습니다.  
CLI 코드 자체는 오픈소스로 공개되어 있습니다.

### 핵심 특징

**클라우드 샌드박스**  
작업을 실행할 때 실제 로컬 환경이 아닌 클라우드에 격리된 샌드박스 환경을 생성합니다.  
여기서 코드를 수정하고 PR 상태로 완료 알림을 받습니다. 로컬 환경을 건드리지 않아 안전합니다.

**병렬 작업 (Parallel Worktrees)**  
여러 작업을 동시에 큐에 넣을 수 있습니다.  
예: 기능 A 개발, 버그 B 수정, 테스트 C 작성을 동시에 실행하고 각각 완료 알림을 받습니다.

**codex-mini 모델**  
빠른 응답을 위해 코딩에 특화된 경량 모델(codex-mini)을 기본으로 사용합니다.  
간단한 코드 질문과 빠른 수정에 최적화되어 있습니다.

**ChatGPT 계정 연동**  
API 키를 별도로 설정하지 않고 ChatGPT 계정으로 바로 로그인할 수 있습니다.

### 설치 및 사용법

```bash
# 설치 (Node.js 22+ 필요)
npm install -g @openai/codex

# ChatGPT 계정으로 로그인
codex login

# 실행
cd 내프로젝트폴더
codex

# 단일 작업 실행
codex -q "이 함수의 단위 테스트를 작성해줘"
```

**기본 대화 예시**

```
> 사용자 프로필 페이지를 만들어줘. 이름, 이메일, 프로필 사진을 보여줘야 해.
> PR 초안으로 만들어줘.
```

### 이런 작업에 적합합니다

- 빠른 프로토타입 개발
- 로컬 환경을 바꾸고 싶지 않은 안전한 실험
- 여러 기능을 동시에 병렬로 개발
- 간단한 코드 질문과 즉각적인 수정

### 공식 자료

- 공식 발표: https://openai.com/index/introducing-codex/
- GitHub (오픈소스): https://github.com/openai/codex
- 개발자 블로그: https://developers.openai.com/blog/run-long-horizon-tasks-with-codex

---

## 4. Google Antigravity

### 도구 소개

Google이 2025년 11월에 발표한 에이전트 퍼스트 IDE입니다.  
VS Code를 기반으로 크게 수정한 독립 IDE이며, Gemini 3.1 Pro 모델을 기본으로 사용합니다.  
2026년 5월 Google I/O에서 Antigravity 2.0으로 업그레이드되면서 CLI와 SDK도 함께 제공합니다.  
Windows, macOS, Linux에서 무료로 사용할 수 있습니다.

### 핵심 특징

**멀티 에이전트 아키텍처**  
하나의 관리자 에이전트가 작업을 여러 전문 에이전트로 분배합니다.  
코드 작성 에이전트, 터미널 실행 에이전트, 브라우저 테스트 에이전트가 동시에 작업합니다.

**내장 브라우저 (Chromium)**  
IDE 안에 브라우저가 내장되어 있어, AI가 직접 웹 앱을 열고 버튼을 클릭하며 UI를 테스트합니다.  
화면을 녹화해서 결과를 검증하는 것도 가능합니다.

**에디터 + 터미널 + 브라우저 통합**  
세 가지 환경이 하나의 인터페이스 안에 있어 전환 없이 작업이 가능합니다.

**멀티 모델 지원**  
Gemini 외에도 Claude Sonnet 4.6, Claude Opus 4.6, GPT-OSS-120B도 선택해서 사용할 수 있습니다.

**Antigravity CLI (Go 작성)**  
터미널 환경을 선호하는 개발자를 위한 별도 CLI도 제공합니다.

### 설치 및 사용법

**IDE 버전**
1. https://antigravity.google 에서 설치 파일 다운로드
2. 설치 후 Google 계정으로 로그인
3. 프로젝트 폴더 열기 → 우측 패널에서 에이전트에게 작업 지시

**CLI 버전**
```bash
# 설치
brew install antigravity   # macOS
# Windows: 공식 사이트에서 설치 파일 다운로드

# 실행
cd 내프로젝트폴더
antigravity "로그인 페이지를 만들고 브라우저에서 동작을 확인해줘"
```

**기본 대화 예시**

```
> 쇼핑몰 장바구니 페이지를 만들고, 실제로 브라우저에서 상품을 추가해서 합계 금액이 맞는지 확인해줘.
```
→ 코드 작성 에이전트가 페이지 구현, 브라우저 에이전트가 직접 클릭해서 동작 검증

### 이런 작업에 적합합니다

- 프론트엔드 + 백엔드를 아우르는 풀스택 개발
- UI/UX 변경 후 브라우저에서 즉시 검증이 필요한 작업
- 여러 작업을 병렬로 빠르게 처리해야 하는 경우
- IDE에서 모든 작업을 한곳에서 처리하고 싶을 때

### 공식 자료

- 공식 사이트: https://antigravity.google
- Google 개발자 블로그: https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/

---

## 5. 상황별 추천

| 상황 | 추천 도구 | 이유 |
|---|---|---|
| 복잡한 버그를 깊이 분석하고 싶다 | **Claude Code** | 단계별 추론 과정이 가장 뛰어남 |
| 빠르게 기능을 여러 개 동시에 개발하고 싶다 | **Codex** | 병렬 샌드박스 작업 지원 |
| 프론트엔드 작업 후 브라우저로 바로 확인하고 싶다 | **Antigravity** | 내장 브라우저로 즉시 UI 검증 가능 |
| 로컬 환경을 건드리지 않고 안전하게 실험하고 싶다 | **Codex** | 클라우드 샌드박스에서 격리 실행 |
| 터미널 없이 IDE 하나로 다 해결하고 싶다 | **Antigravity** | IDE + CLI + 브라우저 통합 환경 |
| 대형 프로젝트 전체 리팩토링 | **Claude Code** | SWE-bench 성능 1위, 긴 컨텍스트 강점 |
| 처음 AI 코딩 에이전트를 써보는 경우 | **Antigravity** | 무료, 시각적 IDE라 진입 장벽 낮음 |

---

## 6. 공통점과 차이점 요약

### 세 도구의 공통점

- 자연어로 코딩 작업을 지시할 수 있습니다
- 파일 읽기/쓰기, 터미널 명령 실행, 코드 수정을 자율적으로 수행합니다
- 단순한 코드 자동완성이 아니라 여러 단계의 작업을 연속으로 처리합니다

### 핵심 철학의 차이

**Claude Code** — "터미널에서 깊이 생각하는 개발 파트너"  
작업 과정에서 이유와 판단 근거를 보여주는 것을 중시합니다. 코드 품질과 정확성에 집중합니다.

**Codex** — "백그라운드에서 조용히 처리하는 효율 기계"  
직접 지켜보지 않아도 됩니다. 큐에 넣고 다른 일을 하다가 완료 알림을 받는 방식입니다.

**Antigravity** — "에디터·터미널·브라우저를 하나로 묶은 에이전트 허브"  
여러 에이전트가 동시에 작업하는 모습을 IDE 안에서 직접 볼 수 있습니다.

---

## 참고 자료

- [Claude Code 공식 발표 (Anthropic)](https://www.anthropic.com/news/claude-3-7-sonnet)
- [Codex 공식 발표 (OpenAI)](https://openai.com/index/introducing-codex/)
- [Antigravity 공식 발표 (Google Developers Blog)](https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/)
- [XDA Developers: 한 달 동안 써본 비교 리뷰](https://www.xda-developers.com/used-claude-code-google-antigravity-codex-for-month-have-clear-winner/)
- [DataCamp: Claude Code vs Antigravity 비교](https://www.datacamp.com/blog/claude-code-vs-antigravity)
- [Augment Code: Antigravity vs Claude Code 심층 비교](https://www.augmentcode.com/tools/google-antigravity-vs-claude-code)
- [Lushbinary: 2026년 AI 코딩 에이전트 전체 비교](https://lushbinary.com/blog/ai-coding-agents-comparison-cursor-windsurf-claude-copilot-kiro-2026/)
