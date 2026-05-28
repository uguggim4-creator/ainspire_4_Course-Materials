/**
 * AInspire 교안 자료집 데이터셋
 *
 * 카테고리 종류:
 * - 'week1': 4기 입문편
 * - 'week4': 4기 자료 (예정)
 * - 'week2': 2기 자료
 * - 'week3': 3기 자료 (예정)
 * - 'cineguide': CineGuide
 *
 * 파일 타입(fileType):
 * - 'pdf'  : Google Drive 미리보기 + 다운로드
 * - 'excel': Google Drive 미리보기 + 다운로드
 * - 'link' : HTML 슬라이드/서브 서비스 (모달 임베드)
 */

const materialData = [
    // === 4기 입문편 ===
    {
        id: "media-tools",
        category: "week1",
        categoryKo: "4기 입문편",
        title: "AI로 활용할 수 있는 미디어 도구 모음",
        summary: "쇼츠 한 편을 AI로 만드는 법을 따라가며 yt-dlp·FFmpeg·Whisper·Remotion이 각 단계에서 어떻게 쓰이는지 실제 실행·결과 영상과 함께 보여주고, Higgsfield MCP·Premiere Pro MCP로 생성·편집까지 자동화하는 인터랙티브 슬라이드.",
        fileType: "link",
        filePath: "materials/4기-입문편/미디어도구/media-tools-deck.html",
        readTime: "슬라이드 · 12장",
        date: "미디어 도구",
        icon: "clapperboard"
    },
    {
        id: "vibe-journey",
        category: "week1",
        categoryKo: "4기 입문편",
        title: "바이브코딩 여정 — AI 영상 웹앱 만들기",
        summary: "API·MCP를 연결해 AI 영상 웹앱을 만드는 과정을 따라가며, 아이디어 구상부터 Vercel 배포까지 각 단계에서 \"지금 이 상황이라 이 용어를 이렇게 쓴다\"를 흐름으로 익히는 시나리오형 슬라이드.",
        fileType: "link",
        filePath: "materials/4기-입문편/바이브코딩용어/vibe-journey-deck.html",
        readTime: "슬라이드 · 19장",
        date: "실전 시나리오",
        icon: "route"
    },
    {
        id: "vibe-glossary",
        category: "week1",
        categoryKo: "4기 입문편",
        title: "바이브코딩 핵심 용어 사전",
        summary: "아이디어 구상부터 배포까지 흐름에 맞춰 정리한 바이브코딩 용어 90개. 용어를 클릭해 소개·활용 방식·예시를 펼쳐보고, 검색으로 바로 찾을 수 있는 아코디언 사전.",
        fileType: "link",
        filePath: "materials/4기-입문편/바이브코딩용어/vibe-glossary.html",
        readTime: "사전 · 90개",
        date: "용어 사전",
        icon: "book-open"
    },

    {
        id: "week0-lecture",
        category: "week1",
        categoryKo: "4기 입문편",
        title: "0주차 강의안 — AI 코딩 툴 비교 Claude · Codex · Antigravity · VSCode",
        summary: "Claude 데스크탑(Chat·Cowork·Code 3모드), OpenAI Codex, Google Antigravity 2.0, VSCode Copilot의 철학·기능·설치법·차이점을 비교하는 0주차 강의 슬라이드. 2026년 5월 공식 문서 기준.",
        fileType: "link",
        filePath: "materials/4기-입문편/0주차-강의안/0주차-강의안-deck.html",
        readTime: "슬라이드 · 12장",
        date: "0주차 강의안",
        icon: "code-2"
    },

    {
        id: "beginner-guide",
        category: "week1",
        categoryKo: "4기 입문편",
        title: "왕초보 가이드 — AI 영상 제작 첫 걸음",
        summary: "아무것도 몰라도 OK. 레퍼런스 수집부터 AI 이미지·영상 생성까지 전체 흐름을 순서대로 따라가는 입문 슬라이드. 핵심 도구 4가지, 프롬프트 공식, 자주 하는 실수 TOP 5까지 담았습니다.",
        fileType: "link",
        filePath: "materials/4기-입문편/왕초보가이드/왕초보가이드.html",
        readTime: "슬라이드 · 10장",
        date: "왕초보 가이드",
        icon: "map"
    },
    {
        id: "week1-lecture",
        category: "week1",
        categoryKo: "4기 입문편",
        title: "1주차 강의안 — AI 이미지 생성의 모든 것",
        summary: "프롬프트 4요소 구조, 스타일 키워드 완전 정복, 레퍼런스 분석 → 프롬프트 변환 실습, 이미지→영상 워크플로우, 일관성 유지 3가지 기법까지. 도구 비교표와 이번 주 과제 포함.",
        fileType: "link",
        filePath: "materials/4기-입문편/1주차-강의안/1주차-강의안-deck.html",
        readTime: "슬라이드 · 10장",
        date: "1주차 강의안",
        icon: "book-open"
    },

    // === 3기 자료 ===
    {
        id: "week3-benefit",
        category: "week3",
        categoryKo: "3기 자료",
        title: "3기 수강 혜택 자료",
        summary: "2026 이미지 생성 툴 소개, 영상 제작 툴 소개, 제미나이 활용법, AI 플랫폼 구독 전략, AI 영상 제작 초보자 완벽 가이드까지 3기 수강생 전용 혜택 자료 모음.",
        fileType: "notion",
        notionUrl: "https://www.notion.so/3-2713970bb5e180b0af97e8e11558663d",
        readTime: "Notion 페이지",
        date: "3기 혜택",
        icon: "gift"
    },
    {
        id: "week3-week2",
        category: "week3",
        categoryKo: "3기 자료",
        title: "2주차 기획편 강의 자료",
        summary: "기술의 복제 시대와 기획의 본질, 렌즈의 언어와 시선의 권력, 빛과 색채의 심리학, 미장센과 공간의 권력까지 기획편 Part 1~4 강의 자료.",
        fileType: "notion",
        notionUrl: "https://www.notion.so/2-2cf3970bb5e1800aa968e123c2d1e69f",
        readTime: "Notion 페이지",
        date: "2주차 기획편",
        icon: "book-open"
    },
    {
        id: "week3-week3",
        category: "week3",
        categoryKo: "3기 자료",
        title: "3주차 기획 심화편 강의 자료",
        summary: "움직임의 미학, 소리와 침묵의 미학, 몽타주와 편집의 6원칙, 시뮬라크르와 작가주의까지 기획 심화편 Part 5~8 강의 자료.",
        fileType: "notion",
        notionUrl: "https://www.notion.so/3-2da3970bb5e180d5963ff9f87e69b793",
        readTime: "Notion 페이지",
        date: "3주차 기획 심화편",
        icon: "layers"
    },
    {
        id: "week3-folder",
        category: "week3",
        categoryKo: "3기 자료",
        title: "3기 자료 모음 (Google Drive)",
        summary: "3기 강의 관련 파일을 모아 둔 구글 드라이브 폴더입니다.",
        fileType: "folder",
        driveId: "17giTNOwNXNkwL5WFY8O3ZWW7mWj2pDiw",
        readTime: "Drive 폴더",
        date: "3기 자료 모음",
        icon: "folder"
    },

    // === 2기 자료 (Drive 폴더 모음) ===
    {
        id: "week2-folder",
        category: "week2",
        categoryKo: "2기 자료",
        title: "2기 자료 모음 (Google Drive)",
        summary: "레퍼런스 수집 사이트 정리, AI 영상 플랫폼 가이드, 미드저니 프롬프트 자료, 기획본질 Part 1~11까지 2기 강의 자료 전체를 모아 둔 구글 드라이브 폴더입니다.",
        fileType: "folder",
        driveId: "14OqhlmSCvP3ccTSdQaFE3EWOdOiDUH8y",
        readTime: "Drive 폴더",
        date: "2기 자료 모음",
        icon: "folder"
    },

    // === CineGuide 연동 ===
    {
        id: "cineguide-main",
        category: "cineguide",
        categoryKo: "CineGuide",
        title: "CineGuide 촬영 & 연출 가이드 v1",
        summary: "23가지 샷 프레이밍, 카메라 무브먼트, 구도 원칙까지 영상 촬영·연출의 핵심을 인터랙티브 가이드로 정리한 레퍼런스.",
        fileType: "link",
        filePath: "cineguide/cinematography_guide.html",
        readTime: "바로가기",
        date: "서브 서비스",
        icon: "film"
    },
    {
        id: "cineguide-v2",
        category: "cineguide",
        categoryKo: "CineGuide",
        title: "CineGuide 촬영 & 연출 가이드 v2",
        summary: "v1 전체 + 카메라 무브먼트 16가지(돌리/아크/드론/롤/돌리줌 등) AI 프롬프트 복사 기능, 180도 법칙 인터랙티브 시뮬레이터, 23개 샷 카드 AI 프롬프트 탭 추가.",
        fileType: "link",
        filePath: "cineguide/cinematography_guide_v2.html",
        readTime: "바로가기",
        date: "서브 서비스",
        icon: "film"
    }

    // === CineGuide 보류 ===
    // {
    //     id: "cineguide-old-main",
    //     filePath: "cineguide_보류/index.html",
    // },
    // {
    //     id: "cineguide-old-glossary",
    //     filePath: "cineguide_보류/glossary.html",
    // },
    // {
    //     id: "cineguide-old-resources",
    //     filePath: "cineguide_보류/resources.html",
    // }
];
