# VS Code에서 Claude Code가 더 느리고 덜 똑똑하게 느껴지는 원인 분석 보고서

## 1. 요약 결론

VS Code에서 Claude Code가 Claude Code Desktop 또는 CLI보다 **느리게 느껴지는 것은 착각만은 아닐 가능성이 높다.** 공식 문서와 GitHub 이슈를 종합하면, VS Code 환경에서는 모델 응답 시간 외에도 **IDE 확장 UI, 통합 터미널, 파일 검색, `@` mention 자동완성, diff 표시, conversation history, plan review 등 추가 레이어**가 붙는다.

또한 실제 GitHub 이슈에는 **VS Code 확장이 CLI보다 2~4배 느리다**, **Windows의 VS Code 통합 터미널에서 첫 응답이 느리고 터미널이 멈춘다**, **`@file` 자동완성이 5~8초 걸린다**는 사례가 보고되어 있다.

따라서 사용자가 느끼는 현상은 크게 두 가지로 나눠볼 수 있다.

```text
1. 작업 속도 저하
→ VS Code 확장/통합 터미널/파일 검색/워크스페이스 인덱싱 오버헤드 가능성

2. 지능 저하처럼 보이는 현상
→ Claude가 받는 컨텍스트, CLAUDE.md 로딩 여부, 작업 지시 방식, 현재 열린 폴더 범위 차이 가능성
```

---

## 2. Claude Code의 기본 구조: 원래는 “터미널 기반 에이전트”에 가까움

Anthropic 공식 Overview 문서는 Claude Code를 **터미널에서 동작하는 agentic coding tool**로 설명한다. Claude Code는 코드베이스를 이해하고, 파일을 수정하고, 명령을 실행하며, 루틴 작업을 처리하는 도구로 소개된다.

즉 Claude Code의 기본 철학은 단순한 “채팅창”이라기보다 다음 흐름에 가깝다.

```text
프로젝트 읽기
→ 계획 세우기
→ 파일 수정
→ 명령 실행
→ 결과 확인
→ 다시 수정
```

반면 VS Code 확장은 이 Claude Code를 IDE 안에서 쓰기 위한 그래픽 인터페이스다. 공식 문서에 따르면 VS Code 확장은 Claude Code 패널, inline diff, `@` mention, plan review, conversation history, 여러 탭/창 대화 기능을 제공한다.

이 말은 곧, VS Code에서는 Claude 모델 자체 외에도 **IDE 확장 기능이 중간에 끼어든다**는 뜻이다.

<!-- 출처:
[1] Anthropic Docs - Claude Code overview
https://docs.anthropic.com/en/docs/claude-code/overview

[2] Anthropic Docs - IDE integrations
https://docs.anthropic.com/en/docs/claude-code/ide-integrations
-->

---

## 3. 실제 속도 저하 사례: “VS Code 확장이 CLI보다 느리다”

가장 직접적인 근거는 Anthropic의 `claude-code` GitHub 이슈다.

한 사용자는 Claude Code VS Code extension이 code-server 환경에서 로컬 VS Code 또는 CLI보다 **2~4배 느리다**고 보고했다. 같은 머신, 같은 작업 조건에서 VS Code extension은 약 2분, CLI는 약 25초가 걸렸다고 적혀 있다. 또 다른 재현 테스트에서는 VS Code extension in code-server가 약 1분 50초, 같은 머신의 CLI가 약 30초였다고 보고했다.

물론 이 사례는 일반 로컬 VS Code가 아니라 **code-server, 즉 브라우저 기반 VS Code** 조건이다. 그래서 모든 로컬 VS Code 환경에 100% 그대로 적용할 수는 없다. 하지만 중요한 점은 “같은 Claude Code라도 인터페이스에 따라 체감 속도가 달라질 수 있다”는 실제 사례가 존재한다는 것이다.

<!-- 출처:
[3] GitHub Issue - VSCode extension extremely slow compared to CLI / local VS Code
https://github.com/anthropics/claude-code/issues/15172
-->

---

## 4. Windows + VS Code 통합 터미널에서 첫 응답 지연 사례

다른 GitHub 이슈에서는 Windows 환경에서 Claude Code VS Code 확장이 새 대화 첫 메시지에 대해 **응답 회복까지 약 27초가 걸리고, VS Code 터미널이 약 15초 동안 멈춘다**고 보고했다. 해당 이슈에는 Windows, VS Code integrated terminal 환경이 명시되어 있다.

Windows에서 VS Code를 쓰고 있다면 이 케이스와 체감이 꽤 비슷할 수 있다.

핵심은 다음을 구분하는 것이다.

```text
Claude 모델 자체가 느린 것인지
VS Code 확장/통합 터미널이 느린 것인지
Windows 환경에서 입력/터미널 처리 문제가 있는 것인지
```

같은 프롬프트를 **외부 Windows Terminal / PowerShell의 Claude CLI**에서 실행했을 때 빠르고, **VS Code 안에서만 느리면** Claude 모델 문제가 아니라 VS Code 통합 레이어 문제일 가능성이 커진다.

<!-- 출처:
[4] GitHub Issue - VS Code integrated terminal / Windows first message freeze or delay
https://github.com/anthropics/claude-code/issues/14282
-->

---

## 5. `@file` mention 자동완성 지연 사례

VS Code에서 Claude를 쓸 때 특히 자주 쓰는 기능이 `@파일명`으로 파일을 참조하는 방식이다. 그런데 GitHub 이슈에는 VS Code extension v2.1.29에서 `@`로 파일을 mention하려고 할 때 파일 목록이 뜨는 데 **5~8초가 걸린다**는 보고가 있다. 로그에는 `Ripgrep search failed, falling back to VSCode findFiles`라는 내용도 포함되어 있다.

이건 매우 중요한 포인트다.

즉 사용자가 느끼는 “Claude가 느리다”는 현상이 실제로는 다음이 아닐 수 있다.

```text
Claude 응답이 느림
```

실제로는 다음일 수 있다.

```text
Claude에게 파일을 전달하기 전,
VS Code 확장이 파일 목록을 찾고 자동완성을 띄우는 단계가 느림
```

특히 프로젝트에 아래 폴더가 많으면 파일 검색 부담이 커질 수 있다.

```text
node_modules
.next
dist
build
.vercel
coverage
public 안의 대용량 이미지/영상
.cache
```

<!-- 출처:
[5] GitHub Issue - @file mention autocomplete slow, ripgrep fallback to VSCode findFiles
https://github.com/anthropics/claude-code/issues/22568
-->

---

## 6. 공식 문서도 성능 문제를 별도 항목으로 다룸

Anthropic 공식 Troubleshooting 문서는 Claude Code의 성능/안정성 문제로 **High CPU or memory usage, slow responses, hangs, search not finding files** 등을 명시한다. 공식 권장 조치는 다음과 같다.

```text
1. /compact를 정기적으로 사용해 컨텍스트 크기 줄이기
2. 큰 작업 사이에는 Claude Code를 닫고 재시작하기
3. 큰 빌드 디렉터리를 .gitignore에 추가하기
```

또한 자동 compaction이 실패하거나 context가 큰 파일/도구 출력으로 다시 가득 차는 경우, Claude가 불필요한 API 호출 반복을 피하기 위해 멈출 수 있다고 설명한다. 이때는 큰 파일을 작은 범위로 읽게 하거나, `/compact keep only the plan and the diff`처럼 초점을 좁혀 compact하거나, 필요 없으면 `/clear`를 쓰라고 안내한다.

이 문서만 봐도 Claude Code는 큰 코드베이스, 긴 세션, 큰 파일, 빌드 결과물, 검색 문제에 의해 실제로 느려질 수 있다.

<!-- 출처:
[6] Anthropic Docs - Claude Code troubleshooting
https://code.claude.com/docs/en/troubleshooting
-->

---

## 7. VS Code 통합 터미널 자체의 한계

Anthropic 공식 Terminal Config 문서는 VS Code integrated terminal에 대해 중요한 주의사항을 적고 있다. 10,000자 이상의 긴 입력을 붙여넣을 때 Claude Code는 입력창을 유지하기 위해 `[Pasted text]` 형태로 접지만, **VS Code 통합 터미널은 매우 큰 붙여넣기에서 문자가 Claude Code에 도달하기 전에 누락될 수 있으므로 파일 기반 워크플로우를 쓰라**고 안내한다.

이건 속도 문제와 직접적으로 동일하지는 않지만, VS Code integrated terminal이 Claude Code를 실행하는 데 있어 완전히 투명한 환경은 아니라는 근거다.

즉 긴 로그, 큰 코드, 긴 에러 메시지를 VS Code 터미널에 그대로 붙여넣으면 다음 문제로 이어질 수 있다.

```text
입력 누락
터미널 처리 지연
Claude 컨텍스트 오염
느린 응답
엉뚱한 분석
```

<!-- 출처:
[7] Anthropic Docs - Terminal configuration
https://docs.anthropic.com/en/docs/claude-code/terminal-config
-->

---

## 8. “멍청해지는 느낌”의 핵심: 컨텍스트와 메모리 문제

속도와 별개로, VS Code에서 Claude가 덜 똑똑해 보이는 이유는 대부분 **Claude가 보는 정보가 달라지기 때문**이다.

Anthropic 공식 Memory 문서는 Claude Code의 각 세션이 fresh context window로 시작하며, 지식을 이어가기 위한 메커니즘으로 `CLAUDE.md`와 auto memory를 사용한다고 설명한다. `CLAUDE.md`는 프로젝트, 개인 workflow, 조직 단위의 persistent instructions 역할을 한다.

공식 문서에 따르면 `CLAUDE.md`에는 코딩 표준, 워크플로우, 프로젝트 아키텍처, 빌드 명령, 디버깅 인사이트, 선호사항 등을 적어두는 것이 적합하다.

그리고 Claude가 `CLAUDE.md`를 따르지 않을 때는 `/memory`를 실행해 해당 파일이 실제로 로딩됐는지 확인하라고 안내한다. 파일이 목록에 없다면 Claude는 그 지침을 볼 수 없다. 또한 지시가 너무 크거나 모호하면 adherence가 떨어질 수 있다고 설명한다.

즉 VS Code에서 다음 상태로 작업하고 있다면 Claude가 덜 똑똑해질 수 있다.

```text
프로젝트 루트가 아니라 하위 폴더만 열어둠
CLAUDE.md가 없거나 로딩되지 않음
기획 의도/개발 규칙/폴더 구조 설명이 없음
현재 열린 파일만 보고 판단함
긴 세션에서 맥락이 압축되며 세부 지시가 흐려짐
```

<!-- 출처:
[8] Anthropic Docs - Claude Code memory
https://docs.anthropic.com/en/docs/claude-code/memory
-->

---

## 9. 큰 코드베이스에서는 “먼저 계획”과 “컨텍스트 관리”가 중요함

Anthropic 공식 Common Workflows 문서는 Claude Code로 코드베이스를 이해하고, 버그를 고치고, 리팩토링하고, 테스트하는 여러 작업 패턴을 제시한다. 이 문서는 “프로젝트 루트로 이동 → Claude Code 실행 → 코드베이스 개요 요청” 같은 흐름을 안내한다.

또한 이 문서에는 “Plan before editing”, “Delegate research to subagents to keep your main context clean” 같은 항목도 있다.

즉 Claude Code는 단순히 다음처럼 던지는 것보다,

```text
이거 고쳐줘
```

다음처럼 지시하는 쪽이 더 안정적이다.

```text
먼저 구조를 파악하고
수정 계획을 제안하고
어떤 파일을 볼지 정리한 뒤
변경해줘
```

VS Code에서는 사용자가 현재 파일 옆에서 바로 명령을 던지는 경우가 많기 때문에, Claude가 전체 맥락 없이 좁은 수정만 시도할 수 있다. 이게 “멍청해졌다”는 느낌으로 이어질 수 있다.

<!-- 출처:
[9] Anthropic Docs - Claude Code common workflows
https://docs.anthropic.com/en/docs/claude-code/common-workflows
-->

---

## 10. 의심할 만한 환경 조건

다음 조합일 때 VS Code Claude가 느리거나 둔하게 느껴질 가능성이 높다.

```text
Windows
VS Code
Next.js / Vercel 프로젝트
node_modules, .next, dist, build 폴더 존재
이미지/영상/asset 파일 많음
Copilot, ESLint, Prettier, GitLens 등 여러 확장 동시 실행
VS Code integrated terminal 사용
Claude Code VS Code extension 사용
긴 로그를 터미널에 붙여넣음
프로젝트 루트가 아닌 하위 폴더를 열고 작업
CLAUDE.md 없음 또는 로딩 확인 안 함
```

이 경우 병목은 Claude 모델 하나가 아니라 아래 전체일 수 있다.

```text
Claude 모델 응답 시간
+ Claude Code 세션 컨텍스트
+ VS Code extension host
+ 파일 검색 / ripgrep / findFiles
+ TypeScript server
+ ESLint / Prettier
+ Git extension
+ diff 렌더링
+ integrated terminal
+ Windows 경로/파일 시스템 처리
```

---

## 11. 실전 검증 방법

실제로 확인하려면 같은 작업을 네 환경에서 비교하면 된다.

```text
A. Claude Code Desktop
B. 외부 Windows Terminal / PowerShell에서 claude CLI
C. VS Code integrated terminal에서 claude CLI
D. VS Code Claude Code extension 패널
```

### 테스트 1: 순수 응답 속도

각 환경에서 같은 프롬프트를 넣는다.

```text
ack 라고만 답해줘
```

VS Code extension만 느리면 확장 UI 또는 IDE 레이어 문제 가능성이 높다.

### 테스트 2: 파일 검색 속도

VS Code extension에서 `@`를 입력하고 파일 검색창이 뜨는 시간을 본다.

```text
@page.tsx
```

5초 이상 걸리면 GitHub 이슈의 `@file` autocomplete 지연 사례와 유사하다.

### 테스트 3: 같은 프로젝트, 같은 모델, 같은 프롬프트 비교

외부 CLI와 VS Code extension에 똑같이 입력한다.

```text
package.json만 읽고 이 프로젝트의 프레임워크와 실행 명령을 요약해줘. 다른 파일은 읽지 마.
```

외부 CLI가 빠르고 VS Code extension만 느리면 VS Code 레이어 병목이다.

### 테스트 4: CLAUDE.md 로딩 확인

Claude Code에서 다음을 실행한다.

```text
/memory
```

공식 문서도 Claude가 `CLAUDE.md`를 따르지 않을 때 `/memory`로 로딩 여부를 확인하라고 안내한다.

<!-- 출처:
[5] GitHub Issue - @file mention autocomplete slow, ripgrep fallback to VSCode findFiles
https://github.com/anthropics/claude-code/issues/22568

[8] Anthropic Docs - Claude Code memory
https://docs.anthropic.com/en/docs/claude-code/memory
-->

---

## 12. 권장 운영 방식

현실적으로는 아래처럼 나눠 쓰는 방식이 가장 안정적이다.

```text
전체 프로젝트 분석 / 큰 수정 / 빌드 디버깅
→ Claude Code Desktop 또는 외부 터미널 CLI

코드 위치를 보면서 부분 수정
→ VS Code Claude extension

긴 로그 분석
→ 붙여넣지 말고 log 파일로 저장 후 Claude에게 읽게 하기

큰 작업 후 새 작업
→ /compact 또는 새 세션

프로젝트별 규칙
→ 루트에 CLAUDE.md 작성

대용량 폴더
→ .gitignore 또는 Claude 접근 제한에 추가
```

공식 Troubleshooting 문서도 큰 코드베이스에서 성능 문제가 있으면 `/compact`, 재시작, 큰 빌드 디렉터리 `.gitignore` 추가를 권장한다.

<!-- 출처:
[6] Anthropic Docs - Claude Code troubleshooting
https://code.claude.com/docs/en/troubleshooting
-->

---

## 13. 최종 판단

**VS Code에서 Claude Code가 느리고 덜 똑똑하게 느껴지는 것은 충분히 실제 현상일 수 있다.**

근거는 다음과 같다.

1. Anthropic 공식 문서상 VS Code extension은 CLI보다 더 많은 IDE 기능 레이어를 제공한다.
2. GitHub 이슈에 VS Code extension이 CLI보다 2~4배 느리다는 실제 보고가 있다.
3. Windows + VS Code integrated terminal에서 첫 응답 지연 및 터미널 freeze 사례가 보고되어 있다.
4. `@file` mention 자동완성이 5~8초 걸리는 사례가 보고되어 있으며, ripgrep 실패 후 VS Code findFiles로 fallback되는 로그가 있다.
5. 공식 Troubleshooting 문서도 high CPU/memory, slow responses, hangs, search 문제를 따로 다루며 `/compact`, 재시작, `.gitignore` 정리를 권장한다.
6. Claude가 덜 똑똑해 보이는 현상은 `CLAUDE.md`, auto memory, 현재 작업 디렉터리, context loading 문제와 연결될 수 있다.

따라서 한 줄로 정리하면 다음과 같다.

> **Claude 모델이 VS Code에서 갑자기 멍청해진다기보다, VS Code 통합 환경이 더 무겁고, Claude에게 전달되는 컨텍스트가 달라지며, 파일 검색/터미널/확장 레이어가 병목이 될 수 있다.**

작업 방식은 다음과 같이 나누는 것이 좋다.

```text
Claude Code Desktop / 외부 CLI
→ 전체 프로젝트 분석, 큰 수정, 빌드 디버깅, 구조 파악

VS Code Claude extension
→ 현재 파일을 보면서 하는 부분 수정, diff 확인, 빠른 코드 리뷰
```

---

## 참고 출처 목록

<!--
[1] Anthropic Docs - Claude Code overview
https://docs.anthropic.com/en/docs/claude-code/overview

[2] Anthropic Docs - IDE integrations
https://docs.anthropic.com/en/docs/claude-code/ide-integrations

[3] GitHub Issue - VSCode extension extremely slow compared to CLI / local VS Code
https://github.com/anthropics/claude-code/issues/15172

[4] GitHub Issue - VS Code integrated terminal / Windows first message freeze or delay
https://github.com/anthropics/claude-code/issues/14282

[5] GitHub Issue - @file mention autocomplete slow, ripgrep fallback to VSCode findFiles
https://github.com/anthropics/claude-code/issues/22568

[6] Anthropic Docs - Claude Code troubleshooting
https://code.claude.com/docs/en/troubleshooting

[7] Anthropic Docs - Terminal configuration
https://docs.anthropic.com/en/docs/claude-code/terminal-config

[8] Anthropic Docs - Claude Code memory
https://docs.anthropic.com/en/docs/claude-code/memory

[9] Anthropic Docs - Claude Code common workflows
https://docs.anthropic.com/en/docs/claude-code/common-workflows
-->
