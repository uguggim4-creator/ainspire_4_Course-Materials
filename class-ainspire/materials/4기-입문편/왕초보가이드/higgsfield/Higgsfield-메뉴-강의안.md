# Higgsfield 메뉴 완전 정리 — 강의안

> 출처: https://higgsfield.ai/ (2026-05-28 기준 화면 캡쳐 + 페이지 텍스트 추출)
> 캡쳐 이미지: `screenshots/` 폴더 (파일명은 각 메뉴 끝에 표기)
> 참고: 일부 스튜디오(Canvas 작업창 등)는 **로그인 후에만** 내부 화면이 보입니다. 로그인 없이 보이는 도구는 실제 작업 UI를, 로그인이 필요한 것은 소개(intro) 페이지를 캡쳐했습니다.

---

## 0. Higgsfield 한눈에 보기

**Higgsfield = AI 이미지·영상 생성 올인원 플랫폼** (가입자 2,500만+).
"한 줄 프롬프트 → 광고·영화·인플루언서 영상"까지 만드는 것을 목표로, 최신 모델(Seedance·Kling·Veo·Sora·Nano Banana·Soul 등)을 한 곳에 모아둔 통합 스튜디오입니다.

### 화면 기본 구조
- **상단 좌측 모드 탭**: `Image` · `Video` · `Audio` — 무엇을 만들지 먼저 고름
- **상단 메뉴바**: Supercomputer · MCP & CLI · Plugins · Collab · Marketing Studio · Cinema Studio · AI Influencer · Canvas · Apps · Pricing
- **작업 영역**: 가운데 미리보기, 아래 프롬프트 입력창, 우측/하단에 모델·해상도·길이·프리셋 옵션
- **History / Community**: 내 생성 이력과 커뮤니티 갤러리

### 강의용 큰 그림 (메뉴를 6갈래로 묶어 가르치면 쉬움)

| 분류 | 메뉴 | 핵심 한 줄 |
|---|---|---|
| **① 생성 코어** | Image / Video / Audio / Edit / Soul / Characters | 텍스트·사진으로 이미지·영상·소리를 만들고 편집 |
| **② 영상·모션 특화** | Lipsync Studio / Animate / Upscale | 말하게 하고, 움직이게 하고, 화질을 올림 |
| **③ 워크플로 스튜디오** | Canvas / Cinema Studio / Storyboard(Popcorn) | 여러 장면을 일관되게 기획·연결·제작 |
| **④ 비즈니스 스튜디오** | Marketing Studio / AI Influencer / Fashion Factory / Photodump | 광고·인플루언서·화보를 자동 제작 |
| **⑤ 자동화·확장** | Supercomputer / MCP & CLI / Plugins | 에이전트·외부 툴(Claude, Adobe)과 연동 |
| **⑥ 부가** | Apps / Chat(Copilot) / Community / Pricing | 미니 도구 모음·창작 보조·갤러리·요금 |

---

# ① 생성 코어 (Generation Core)

## 1. Image — AI 이미지 생성
`screenshots/01-ai-image.png` · 경로 `/ai/image`

**정의**: 텍스트(프롬프트)나 참고 사진으로 이미지를 만드는 기본 도구.

**할 수 있는 것**
- 텍스트 → 이미지, 사진 + 텍스트 → 이미지(이미지 레퍼런스)
- 모델 선택: **Nano Banana Pro / Nano Banana 2**(텍스트·고해상도 강점), **Soul / Soul Cinema**(초실사 인물), **Seedream**, **Flux Kontext**, **GPT Image**, **Wan 2.2** 등
- 비율(예: 3:4, 16:9, 1:1), 해상도(1K/2K/4K), 한 번에 생성할 장수(예: "Generate 2")
- History에서 이전 결과 다시 보기, Community에서 다른 사람 작업 참고

**강의 포인트**: "여기가 모든 이미지의 출발점. 모델만 바꿔도 결과 느낌이 완전히 달라진다 — 사실적 인물은 Soul, 글자·정교함은 Nano Banana Pro"라고 모델 선택 감각을 잡아주면 좋음.

---

## 2. Video — AI 영상 생성
`screenshots/02-ai-video.png` · 경로 `/ai/video`

**정의**: "원클릭으로 영상 만들기(MAKE VIDEOS IN ONE CLICK)" — 텍스트/이미지로 짧은 영상을 생성.

**3단계 흐름** (화면에 그대로 표시됨)
1. **ADD IMAGE** — 시작 프레임 이미지 추가(선택)
2. **CHOOSE PRESET** — 효과·연출 프리셋 선택
3. **GET VIDEO** — 생성

**핵심 옵션**
- 모델: **Seedance 2.0**(기본·추천), Seedance Pro, **Kling**(2.1 Master / 2.5 Turbo / o1·3.0), **Veo 3**, **MiniMax Hailuo 02**, **Sora 2**, **Wan 2.5** 등
- 길이(예: 8s), 해상도(예: 1080p), 비율(Auto/16:9/9:16)
- `Mix`, `Elements`, `Change` 등으로 레퍼런스·요소 조합
- "How it works" 가이드 제공

**강의 포인트**: 이미지(첫 프레임)를 먼저 만들고 → 그 이미지를 Video에 넣어 움직이게 하는 **"이미지 먼저, 영상 나중"** 워크플로가 품질·일관성에 유리하다는 점을 강조.

---

## 3. Audio — 오디오 생성
상단 `Audio` 탭 (별도 캡쳐 없음 · Video/Lipsync 옵션 안에 통합)

**정의**: 영상에 들어갈 음성·사운드를 생성. 단독 탭이자 영상 생성 옵션의 일부.

**할 수 있는 것**
- TTS(텍스트→음성), 효과음·배경음 생성
- Lipsync Studio에서 "Audio text → Generate Audio"로 대사 음성을 만들어 입모양과 맞춤

**강의 포인트**: Audio는 단독으로 쓰기보다 **Video·Lipsync와 묶어** "대사 만들고 → 입모양 싱크" 흐름으로 설명.

---

## 4. Edit (Content Editor) — 이미지 편집·인페인트
`screenshots/03-edit.png` · 경로 `/edit`

**정의**: 이미 있는 이미지를 부분 수정·합성하는 편집기.

**할 수 있는 것**
- 미디어 업로드(Upload media) 후 특정 영역만 다시 그리기(**인페인트**, 예: Nano Banana Pro Inpaint 모델)
- "Draw to Edit" — 영역을 칠해서 수정 지시
- 배경 교체, 객체 추가/제거, 부분 리터치

**강의 포인트**: "처음부터 다시 만들지 말고, 잘 나온 컷에서 **거슬리는 부분만 고치는** 도구"라고 위치를 잡아주면 이해가 쉬움.

---

## 5. Soul — 초실사 인물 이미지 모델
`screenshots/05-soul.png` · 경로 `/soul`

**정의**: Higgsfield의 간판 모델. "Hyper-Realistic, Fashion-Grade(패션 화보급 초실사)" 인물 이미지 특화.

**할 수 있는 것**
- 실제 사람 같은 인물 사진 생성 (피부·조명·질감 디테일 강함)
- Soul 2.0 / Soul Cinema(영화 톤) / Soul Location(배경 특화) 등 변형
- 프리셋(Soul Presets)으로 룩·분위기 빠르게 적용

**강의 포인트**: "AI 인플루언서·화보·광고 인물 이미지의 엔진. 뒤에 나올 AI Influencer·Fashion Factory·Photodump가 전부 Soul 위에서 돈다"고 연결해 설명.

---

## 6. Characters (Multi Reference) — 캐릭터 일관성
`screenshots/04-character.png` · 경로 `/character`

**정의**: 같은 인물/캐릭터를 여러 장면에서 **똑같은 얼굴로** 반복 등장시키는 기능.

**할 수 있는 것**
- "Create Character" — 캐릭터 생성·등록
- 여러 레퍼런스 이미지를 묶어 일관된 정체성 유지
- 등록한 캐릭터를 Image/Video 생성 시 불러와 재사용

**강의 포인트**: 시리즈물·웹툰·브랜드 마스코트처럼 **"같은 인물이 계속 나와야 하는"** 작업의 핵심. 한 번 만들면 모든 컷에 재활용.

---

# ② 영상·모션 특화

## 7. Lipsync Studio — 립싱크 / 말하는 아바타
`screenshots/07-lipsync-studio.png` · 경로 `/lipsync-studio`

**정의**: "원클릭 립싱크" — 인물 이미지/영상의 입을 대사 음성에 맞춰 움직이게 함.

**할 수 있는 것**
- 대사 입력(Audio text) → 음성 생성(Generate Audio) → 입모양 싱크
- 모델: **Wan 2.5 Fast**, **Kling Avatars 2.0** 등
- 길이(예: 5s), 해상도(예: 720p) 설정

**강의 포인트**: 가상 인물이 **말하게** 만드는 도구. AI Influencer·UGC 광고에서 "사람이 직접 말하는" 느낌을 줄 때 필수.

---

## 8. Animate — 이미지를 움직이는 장면으로 (Wan 2.2)
`screenshots/08-animate.png` · 경로 `/animate`

**정의**: "FROM IMAGE TO ANIMATED SCENE" — 정지 이미지를 애니메이션/모션 영상으로.

**할 수 있는 것**
- 이미지 → 움직이는 장면 변환 (Wan 2.2 기반)
- "Replace" 등으로 요소 교체, 제품 배치(Product Placement)와도 연결
- 해상도 설정(예: 480p)

**강의 포인트**: Video 생성이 "새로 만든다"면, Animate는 **"내가 가진 이미지에 생명을 불어넣는다"**는 차이로 구분.

---

## 9. Upscale — 화질 향상·디플리커 (Topaz)
`screenshots/06-upscale.png` · 경로 `/upscale`

**정의**: 영상·이미지의 해상도를 올리고(업스케일) 떨림(flicker)을 제거하는 후처리 도구.

**할 수 있는 것**
- 미디어 업로드(Upload Media) → 고해상도로 향상
- 특히 "Sora 2 영상 디플리커 & 업스케일"에 최적화
- Topaz 기술 기반

**강의 포인트**: 모든 작업의 **마지막 단계**. "생성 → (편집) → 업스케일 → 납품" 파이프라인의 끝이라고 위치를 잡아줌.

---

# ③ 워크플로 스튜디오

## 10. Canvas — 노드 기반 워크플로 (로그인 필요)
`screenshots/10-canvas-intro.png` · 경로 `/canvas` (소개: `/canvas-intro`)

**정의**: "ONE CANVAS. EVERY WORKFLOW." — 무드보드·생성·연결을 한 화면에서 하는 **노드형 작업 공간**.

**할 수 있는 것**
- **DROP A NODE**: 노드(이미지·영상·모델 블록)를 캔버스에 배치
- **CHAIN YOUR FLOW**: 노드를 선으로 연결해 워크플로 구성 (한 그래프 안에 여러 모델 혼합)
- **CREATE TOGETHER**: 팀이 같은 캔버스에서 협업
- 무드보드, 장면·환경 컨트롤, 스타일 정리

**강의 포인트**: 단발 생성이 아니라 **"기획→생성→수정"을 시각적으로 엮는" 고급 작업대**. 팀 작업·복잡한 프로젝트용. (실제 작업창은 로그인 후 진입)

---

## 11. Cinema Studio — AI 영화 제작 스위트 (로그인 필요)
`screenshots/12-cinema-studio.png` · 경로 `/cinema-studio` (소개: `/cinematic-video-generator`)

**정의**: "THE COMPLETE AI PRODUCTION STUDIO" — 캐스팅부터 연출까지 하는 **영화 제작용 통합 도구**(Cinema Studio 3.5).

**할 수 있는 것**
- **CAST CHARACTERS / SET THE MOOD**: 캐릭터 캐스팅, 무드 설정
- **BUILD THE SCENE, OBJECT BY OBJECT**: 장면을 객체 단위로 구성
- **CO-DIRECT IN REAL TIME**: 실시간 공동 연출 (AI 디렉터 "Mr. Higgs")
- **SHAPE EVERY SCENE WITH PRECISION**: 장면별 정밀 연출·룩 통일

**강의 포인트**: 단편 영화·시네마틱 콘텐츠를 **장면 연결·일관성 있게** 만드는 최상위 도구. Video가 "한 컷"이면 Cinema Studio는 "한 편".

---

## 12. Storyboard (Higgsfield Popcorn) — 스토리보드·일관성 시리즈
`screenshots/17-storyboard-popcorn.png` · 경로 `/storyboard-generator`

**정의**: "차세대 스토리보드 생성기" — 프롬프트로 **일관된 장면 묶음**을 한 번에 생성.

**할 수 있는 것**
- 레퍼런스 업로드 → 장면 묘사 → **일관된 컷들** 한 흐름에 생성
- 다각도 샷(Multi-Angle), 깊은 스토리 일관성(같은 인물/세계관 유지)
- 템플릿: Movie Story, Animated Movie, Motivational, Product Promo / 편집: Lighting Change, Style Swap, Clothes Change, Face Swap
- **Sora 2로 원클릭 영상화**(One-Click Export to Sora 2)

**강의 포인트**: "영상으로 가기 전, **그림 콘티를 일관되게 뽑는** 단계." 스토리보딩 → 영상화 → 제품 배치까지 한 흐름.

---

# ④ 비즈니스 스튜디오

## 13. Marketing Studio — 제품을 광고로 자동 변환
`screenshots/11-marketing-studio.png` · 경로 `/marketing-studio`

**정의**: "TURN ANY PRODUCT INTO A VIDEO AD" — 제품 URL/이미지 하나로 광고 영상을 자동 생성.

**할 수 있는 것**
- **Url to Ad**: 제품 페이지 URL → 광고 소재 자동 제작
- **Ad Reference**: 참고 광고를 넣어 비슷한 톤으로 재현(Recreate)
- 유형 선택: **Product / App / UGC / Hook / Setting**
- 프로젝트·전체 생성물 관리(Projects, All generations)

**강의 포인트**: 마케터·셀러용 핵심. "촬영·모델·편집 없이 **URL → 완성 광고**"가 임팩트. UGC(실사용 후기형) 광고도 자동 생성 가능.

---

## 14. AI Influencer — 가상 인플루언서 만들기
`screenshots/13-ai-influencer.png` · 경로 `/ai-influencer-studio` (소개: `/ai-influencer`)

**정의**: 나만의 가상 인플루언서(버추얼 캐릭터)를 만들어 콘텐츠를 찍게 함.

**3단계** (화면 표시)
1. **CREATE YOUR STAR** — 캐릭터(스타) 생성
2. **MAKE IT MOVE** — 움직이게(영상화)
3. **GENERATE & DOMINATE** — 대량 콘텐츠 생성·확산

**핵심 기능**
- **COMPLETE CHARACTER CONTROL**: 외모·디테일 세밀 제어
- **MIMIC ANY MOVEMENT**: 원하는 동작 따라 하게
- **MONETIZE YOUR CONTENT**: 수익화 연계

**강의 포인트**: Soul(인물) + Characters(일관성) + Lipsync(말하기) + Video(움직임)의 **종합판**. "실제 모델 없이 SNS 인플루언서 운영"이 핵심 메시지.

---

## 15. Fashion Factory — AI 화보 / 스튜디오 촬영
`screenshots/15-fashion-factory.png` · 경로 `/fashion-factory`

**정의**: "AI Photoshoot Generator" — 스튜디오 촬영급 패션 화보 이미지를 생성.

**할 수 있는 것**
- Soul 기반 고품질 인물·의상 이미지 (2K, 비율 3:4 등)
- 템플릿 선택(Select template)으로 화보 컨셉 빠르게 적용
- 한 번에 여러 컷(예: 4/4)

**강의 포인트**: 의류·패션 셀러용. "모델 섭외·스튜디오 대여 없이 **룩북·상세페이지 이미지**" 제작.

---

## 16. Photodump Studio — 한 인물, 다양한 장면
`screenshots/16-photodump-studio.png` · 경로 `/photodump-studio`

**정의**: "Different Scenes. Same Star." — **같은 인물**을 여러 상황·장소·콘셉트로 쏟아내는 도구(Soul 2.0 기반).

**할 수 있는 것**
- 인물 일관성 유지하며 다양한 "사진첩(photo dump)" 스타일 컷 대량 생성
- 프리셋: Office dresscode, Candid Glow, Surreal Self, Alter ego, Cool Girl Dump, Male Archive 등
- Color Transfer(색감 이식) 신기능

**강의 포인트**: SNS 피드용 "일상 사진 모음" 느낌. AI Influencer 계정의 **피드를 채우는** 용도로 설명하면 직관적.

---

# ⑤ 자동화·확장

## 17. Supercomputer — 에이전트형 콘텐츠 자동화 (로그인 필요)
`screenshots/14-supercomputer.png` · 경로 `/supercomputer` (소개: `/supercomputer-intro`)

**정의**: "Agentic AI Content Creation" — **AI 에이전트가 팀처럼** 마케팅·제작·창작을 한 번에 처리.

**할 수 있는 것**
- "The whole team is one agent": 리서치→문서, 리서치→웹사이트, 5~10분 영화, 대량 마케팅 변형(20버전) 등
- **Connectors / Skills / Files / Scheduled Tasks / Models / Import memory & skills**: 외부 연결·스킬·파일·예약작업·모델·메모리 관리
- 한 지시로 여러 산출물을 자동 생산

**강의 포인트**: Higgsfield의 가장 발전된 자동화 레이어. "도구를 하나씩 누르는 게 아니라 **에이전트에게 시키면 알아서**" — 고급/팀 사용자용.

---

## 18. MCP & CLI — 외부 AI 에이전트와 연동
`screenshots/19-mcp-cli.png` · 경로 `/mcp` (또는 `/cli`)

**정의**: Claude·Cursor 등 AI 에이전트 안에서 Higgsfield 생성 기능을 호출(MCP 서버 / CLI).

**할 수 있는 것**
- 연결 대상: **Claude / Perplexity / Cursor / OpenClaw / Hermes** 등
- 설정 3단계: Claude 설정 열기 → 커스텀 커넥터 추가(`https://mcp.higgsfield.ai/mcp`) → 연결·로그인
- 툴셋: Generation, Browse, Marketing Studio, Billing, Workspaces, **Virality Predictor**
- "에이전트 안에서 이미지·영상 생성, 마케팅 소재까지"

**강의 포인트**: 개발자·파워유저용. (이 강의 환경의 `higgsfield-mcp` 스킬이 바로 이것 — Claude에서 키 없이 OAuth로 생성 호출)

---

## 19. Plugins — Adobe Premiere Pro / After Effects 플러그인
`screenshots/20-plugins.png` · 경로 `/adobe-plugin`

**정의**: "HIGGSFIELD IS NOW INSIDE ADOBE" — Premiere Pro·After Effects 안에서 Higgsfield 기능 사용.

**할 수 있는 것**
- 플러그인 기능: GENERATE AI VIDEO / AI IMAGE / REFRAME / REMOVE BACKGROUND / UPSCALE / DRAW TO EDIT
- 설치 3단계: .DMG/설치파일 다운로드 → 설치 → Adobe에서 Higgsfield 패널 열기
- **MacOS / Windows** 모두 지원, 하나의 인스톨러

**강의 포인트**: 기존 편집 워크플로(편집자)를 쓰는 사람용. "편집 중에 컷을 생성·보정" — 웹↔Adobe 왕복 없이.

---

# ⑥ 부가 메뉴

## 20. Chat (Creative Copilot) — 창작 보조
`screenshots/09-chat.png` · 경로 `/chat`

**정의**: "AI Creative Copilot" — 프롬프트·스토리보드 작성을 돕는 채팅형 어시스턴트(예: ChatGPT 5 Mini 연동).

**할 수 있는 것**
- 아이디어 → 프롬프트 다듬기, 장면 구성·스토리보드 제안
- 생성 도구와 연계해 "무엇을 어떻게 만들지" 상담

**강의 포인트**: "프롬프트가 막힐 때 옆에서 도와주는 동료". 초보자가 시작점 잡기에 좋음.

---

## 21. Apps — 전문 미니 도구 모음
`screenshots/18-apps.png` · 경로 `/apps`

**정의**: "WELCOME TO HIGGSFIELD APPS" — 한 가지 작업에 특화된 **미니 툴 모음집**.

**주요 앱들** (화면 카테고리)
- **PROFESSIONAL**: Virality Predictor(바이럴 예측), Similarity Score, Expand image(이미지 확장), Angles 2.0(각도 변경), Shots
- **ENHANCE & STYLE**: Skin Enhancer(피부 보정), AI Stylist, Relight(재조명), Outfit Swap(의상 교체), Style Snap
- **FACE & IDENTITY**: Face Swap, Headshot Generator(증명/프로필 사진), Character Swap 2.0, Recast, Video Face Swap
- **VIDEO EDITING**: ClipCut, Urban Cuts, Video Background Remover(배경 제거), Breakdown, Japanese Show

**강의 포인트**: "필요한 작업 딱 하나만 빠르게" 할 때 들어가는 서랍. 특히 **Virality Predictor**(영상 바이럴 가능성 예측)는 광고·숏폼 기획에 유용 — 따로 짚어주면 좋음.

---

## 22. Community — 커뮤니티 갤러리
`screenshots/21-community.png` · 경로 `/community`

**정의**: 전 세계 크리에이터의 생성물을 모아 보는 갤러리("CREATED BY THE COMMUNITY, POWERED BY SOUL").

**할 수 있는 것**
- 다른 사람 작업 구경 → 프롬프트·프리셋 아이디어 참고
- 내 생성물 공유(Share your generations)

**강의 포인트**: "막막할 때 레퍼런스 창고". 잘 된 작업의 프롬프트를 보고 따라 해보는 학습용으로 추천.

---

## 23. Pricing — 요금제
`screenshots/22-pricing.png` · 경로 `/pricing`

**정의**: 크레딧 기반 구독 요금제.

**할 수 있는 것**
- 플랜별 월 크레딧(예: 1,500 / 3,000 / 4,500 / 6,000 / 9,000)으로 생성량 차등
- 특정 모델 무제한 프로모션(예: Nano Banana Pro·Kling 3.0 등 시즌 할인)
- 개인 / Team / Enterprise 구분

**강의 포인트**: "생성은 **크레딧 차감제** — 모델·해상도·길이가 높을수록 더 많이 든다"는 비용 구조를 먼저 이해시키면 수강생이 낭비를 줄임.

---

## 부록 A. 강의 진행 추천 순서 (90분 기준)

1. **개요 + 화면 구조** (10분) — Image/Video/Audio 탭, 메뉴바, 크레딧 개념
2. **이미지부터** (20분) — Image → Soul → Edit (직접 1장 생성 실습)
3. **영상으로** (20분) — Video(이미지→영상), Animate, Lipsync, Upscale
4. **일관성·시리즈** (15분) — Characters → Photodump → Storyboard
5. **비즈니스 활용** (15분) — Marketing Studio, AI Influencer, Fashion Factory
6. **확장·마무리** (10분) — Canvas / Supercomputer / MCP / Plugins 소개 + Apps의 Virality Predictor

## 부록 B. 핵심 워크플로 한 장 요약

```
아이디어 → [Chat으로 프롬프트 다듬기]
        → Image/Soul로 첫 컷 생성
        → (Edit로 보정) → Characters로 인물 고정
        → Video/Animate로 영상화 → Lipsync로 말하기
        → Storyboard/Cinema Studio로 여러 장면 연결
        → Upscale로 화질 마감
        → Marketing Studio/AI Influencer로 비즈니스 산출물
```

## 부록 C. 주의·한계 (강의 시 안내)

- 화면·모델 라인업은 **자주 바뀜**(주 단위 업데이트). 캡쳐는 2026-05-28 기준.
- 모든 생성은 **크레딧 차감**. 고해상도·장시간 영상은 비용이 큼 → 드래프트는 낮은 해상도로.
- Canvas·Cinema Studio·Supercomputer 등 일부는 **로그인 후 내부 작업창**이 따로 있음(본 자료는 소개 페이지 기준).
- 결과물 상업적 사용·저작권 정책은 플랜별로 다름 → Pricing/약관 확인 필요.
