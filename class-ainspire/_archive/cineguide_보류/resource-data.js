/**
 * AInspire 4기 수강생 자료실 데이터셋
 * 
 * [자료 추가 방법]
 * 새로운 자료를 추가하려면 아래 resourceData 배열에 객체 형태 {} 로 데이터를 추가해 주세요.
 * 
 * {
 *     id: "unique-id",          // 중복되지 않는 고유 ID (영문/숫자/하이픈 조합)
 *     category: "concept",      // 카테고리 종류: 'concept'(기본 개념), 'guide'(입문 가이드), 'reference'(레퍼런스)
 *     categoryKo: "기본 개념",   // 화면에 표시될 한글 카테고리명
 *     title: "자료 제목",         // 카드 및 모달에 표시될 제목
 *     summary: "요약 설명...",   // 카드 목록에 보일 간략한 요약 텍스트 (2줄 이내)
 *     readTime: "읽기 약 5분",   // 예상 읽기 시간
 *     date: "2026.05",          // 작성일자 (연.월)
 *     icon: "book-open",        // Lucide 아이콘 명칭 (예: sparkles, book-open, link-2, film, play 등)
 *     content: `
 *         <div class="viewer-content">
 *             <h3>1. 대제목</h3>
 *             <p>본문 내용...</p>
 *             <div class="highlight-box">
 *                 <h5>강조 박스 제목</h5>
 *                 <p>강조 내용...</p>
 *             </div>
 *         </div>
 *     `
 * }
 */

const resourceData = [
    {
        id: "concept-summary",
        category: "concept",
        categoryKo: "기본 개념",
        title: "영상 제작에 꼭 필요한 개념 정리",
        summary: "영상 촬영의 시각적 언어 규칙과 샷 구도의 기초부터 내레이션 템플릿 작성 노하우까지 포함한 기본 개념집.",
        readTime: "읽기 약 10분",
        date: "2026.05",
        icon: "sparkles",
        content: `
            <div class="viewer-content">
                <blockquote>
                    "영상은 움직임의 언어이며, 카메라는 그 언어를 기록하는 도구다." - 연출가들의 격언
                </blockquote>
                <p>성공적인 AI 영상 제작 및 기획을 위해 꼭 알아야 하는 기본 촬영 기법과 시각 문법을 명확하게 요약 정리했습니다. 복잡한 용어와 촬영 기술을 3가지 핵심 축으로 단순화하여 학습합니다.</p>
                
                <h3>1. 영상 구성의 3가지 계층 구조</h3>
                <p>영상을 편집하고 논리 구조를 짤 때 다음 3가지 단위를 명확하게 이해하는 것이 제작 효율의 시작입니다.</p>
                <ul>
                    <li><strong>컷(Cut):</strong> 카메라 셔터를 눌러 녹화를 시작한 뒤 중지할 때까지의 한 조각. 편집의 물리적 최소 단위입니다.</li>
                    <li><strong>씬(Scene):</strong> 동일한 시간과 장소에서 하나의 사건이 완료되는 장면들의 묶음. 공간과 시간의 동질성을 가집니다.</li>
                    <li><strong>시퀀스(Sequence):</strong> 여러 개의 씬이 하나의 완성된 내러티브 흐름을 만드는 단락. 광고 기획안이나 영화의 장(Chapter)에 해당합니다.</li>
                </ul>

                <h3>2. 샷 구도의 핵심: 180도 법칙 (액션 라인)</h3>
                <div class="highlight-box">
                    <h5>⚠️ 연출의 철칙: Line of Action</h5>
                    <p>두 명의 인물이 대화를 나눌 때, 두 사람의 머리를 잇는 가상의 180도 선(액션 라인)을 넘어서 카메라를 배치해선 안 됩니다. 이 선을 넘으면 화면에서 인물들의 왼쪽/오른쪽 시선 방향이 바뀌어 관객이 공간 감각의 혼란을 겪게 됩니다.</p>
                </div>

                <h3>3. 샷 사이즈(Shot Size)와 연출 심리</h3>
                <table>
                    <thead>
                        <tr>
                            <th>샷 종류</th>
                            <th>정의 및 범위</th>
                            <th>연출적 효과</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>익스트림 와이드 샷 (EWS)</strong></td>
                            <td>인물이 아주 작게 보이며 주변 환경을 거대하게 강조</td>
                            <td>장엄함, 고독함, 오프닝 씬에서 정보 제공</td>
                        </tr>
                        <tr>
                            <td><strong>풀 샷 (Full Shot)</strong></td>
                            <td>인물의 머리끝부터 발끝까지 전신을 담는 구도</td>
                            <td>액션의 동선 설명, 캐릭터의 태도 파악</td>
                        </tr>
                        <tr>
                            <td><strong>바스트 샷 (Bust Shot)</strong></td>
                            <td>인물의 가슴 윗부분부터 머리까지 프레이밍</td>
                            <td>대화 씬의 표준 프레임, 인물의 표정과 대사 전달</td>
                        </tr>
                        <tr>
                            <td><strong>클로즈업 (Close-Up)</strong></td>
                            <td>인물의 얼굴이나 사물의 디테일을 가득 채움</td>
                            <td>극적 감정선 극대화, 중요한 단서 강조</td>
                        </tr>
                    </tbody>
                </table>

                <h3>4. 씬 연출 실전 체크리스트</h3>
                <p>AI 영상 생성을 진행할 때도 다음과 같은 실제 카메라 워크 기법을 텍스트 프롬프트에 활용하면 훨씬 프로페셔널한 비주얼을 만들 수 있습니다.</p>
                <ol>
                    <li><strong>팬 (Pan) / 틸트 (Tilt):</strong> 카메라가 제자리에서 좌우(Pan) 혹은 상하(Tilt)로 회전하며 정보나 스케일을 보여주는 형태.</li>
                    <li><strong>달리 (Dolly) / 줌 (Zoom):</strong> 카메라 장비 자체가 피사체에 가까워지거나(Dolly In) 멀어지는(Dolly Out) 방식. 화각을 조절하는 Zoom과는 깊이감 표현이 근본적으로 다릅니다.</li>
                    <li><strong>아웃포커싱 (Shallow Focus):</strong> 피사체는 또렷하고 배경은 흐리게 처리해 관객의 시선을 오직 주제에만 몰입시키는 기본 연출법입니다.</li>
                </ol>
            </div>
        `
    },
    {
        id: "step-by-step-guide",
        category: "guide",
        categoryKo: "입문 가이드",
        title: "입문편: 영상 제작의 첫걸음",
        summary: "초보 영상 제작자와 크리에이터가 마주하는 필수 장비 설정, 초기 프로젝트 세팅, 그리고 컷 편집 파이프라인 가이드.",
        readTime: "읽기 약 8분",
        date: "2026.05",
        icon: "book-open",
        content: `
            <div class="viewer-content">
                <blockquote>
                    "완벽한 장비는 존재하지 않는다. 가장 좋은 장비는 당신이 지금 바로 다룰 수 있는 장비다."
                </blockquote>
                <p>영상 기획서 작성을 끝내고 실제 제작 프로세스에 들어설 때 거쳐야 하는 기본 입문 단계들을 요약 설명합니다. 시행착오를 절반으로 줄여줄 가이드라인입니다.</p>
                
                <h3>1. 프로젝트 시작 전 기초 세팅</h3>
                <p>영상을 제작하거나 AI 생성 툴을 다룰 때 규격을 미리 정하지 않으면 렌더링 시 심각한 해상도 손실이 생깁니다.</p>
                <ul>
                    <li><strong>해상도 설정 (Resolution):</strong> 웹 및 유튜브의 표준 규격은 1920x1080 (FHD) 혹은 3840x2160 (4K UHD)입니다. 숏폼 제작 시에는 1080x1920 (9:16) 세로 포맷을 반드시 준수하세요.</li>
                    <li><strong>프레임 레이트 (FPS):</strong> 초당 재생되는 정지 화면 장수입니다. 영화 같은 감성적인 연출은 24fps, 일반 방송 및 부드러운 일상 영상은 30fps 혹은 60fps를 사용합니다.</li>
                </ul>

                <h3>2. 촬영 및 제작 5단계 표준 흐름</h3>
                <ol>
                    <li><strong>기획 및 대본 작성 (Pre-Production):</strong> 누구에게 어떤 메시지를 던질지 정하고 대본과 러프 시안을 작성합니다.</li>
                    <li><strong>에셋 준비 및 촬영 (Production):</strong> 카메라 촬영을 하거나 AI 생성 도구를 써서 프레임 소스들을 빌드합니다.</li>
                    <li><strong>컷 편집 (Post-Production - Rough Cut):</strong> 소리 싱크를 맞추고 불필요한 테이크(NG)를 빠르게 잘라내 뼈대를 만듭니다.</li>
                    <li><strong>종합 편집 (Post-Production - Polish):</strong> BGM 삽입, 톤 보정(Color Grading), 자막(Typography) 연출을 얹습니다.</li>
                    <li><strong>내보내기 및 배포 (Export & Delivery):</strong> 플랫폼 규격에 최적화된 파일포맷(대개 H.264 mp4 추천)으로 최종 출력합니다.</li>
                </ol>

                <div class="highlight-box">
                    <h5>💡 입문자를 위한 실무 꿀팁</h5>
                    <p>첫 작업에서 가장 흔히 하는 실수는 '처음부터 지나치게 거대한 연출 효과나 3D 전환을 시도하는 것'입니다. 화려한 기법보다는 관객이 내용을 오해 없이 직관적으로 받아들일 수 있는 <strong>안정적인 컷 매칭과 대사 가독성</strong>에 80% 이상의 노력을 집중하세요.</p>
                </div>
            </div>
        `
    },
    {
        id: "ref-sites-collection",
        category: "reference",
        categoryKo: "레퍼런스",
        title: "레퍼런스 수집 사이트 정리",
        summary: "콘셉트 기획 단계의 효율을 비약적으로 높여줄 영상 연출, 스토리보드, 비주얼 무드 보드 구축에 특화된 추천 사이트 링크와 활용 팁.",
        readTime: "읽기 약 5분",
        date: "2026.05",
        icon: "link-2",
        content: `
            <div class="viewer-content">
                <blockquote>
                    "좋은 레퍼런스를 수집하고 분석하는 능력은 창작의 절반 이상을 차지한다."
                </blockquote>
                <p>영상을 구상할 때 머릿속에만 있는 이미지를 스태프나 클라이언트(또는 AI 생성기)에게 구체적으로 설명하기 위해 꼭 들러야 할 대표적인 레퍼런스 수집 채널 리스트와 효과적인 수집 노하우입니다.</p>
                
                <h3>1. 장르별 핵심 추천 플랫폼</h3>
                <table>
                    <thead>
                        <tr>
                            <th>사이트 이름</th>
                            <th>주요 카테고리</th>
                            <th>추천 이유 및 특징</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Vimeo</strong></td>
                            <td>시네마틱 영상, 아트 필름</td>
                            <td>유튜브에 비해 상업·예술 광고 크리에이터들의 고품질 포트폴리오 비중이 압도적으로 높음.</td>
                        </tr>
                        <tr>
                            <td><strong>Pinterest</strong></td>
                            <td>레이아웃, 이미지 톤, 무드 보드</td>
                            <td>'핀' 기능을 통해 비주얼 콘셉트 보드를 팀원들과 링크로 손쉽게 공동 제작하고 동기화할 수 있음.</td>
                        </tr>
                        <tr>
                            <td><strong>Behance</strong></td>
                            <td>디자인 전반, 모션 그래픽</td>
                            <td>어도비에서 운영하는 디자인 포털. 완성본뿐 아니라 '제작 프로세스(Behind the scenes)' 과정도 함께 학습 가능.</td>
                        </tr>
                        <tr>
                            <td><strong>ShotDeck</strong></td>
                            <td>영화 스틸컷, 조명·앵글 분석</td>
                            <td>실제 개봉 영화의 수백만 컷을 조명 색상, 렌즈 화각, 구도, 키워드 단위로 고화질 서칭 가능. (연출가들의 필수 도구)</td>
                        </tr>
                    </tbody>
                </table>

                <h3>2. 레퍼런스 무드 보드(Mood Board) 구축 꿀팁</h3>
                <ul>
                    <li><strong>색상 테마 추출:</strong> 마음에 드는 비주얼의 스틸컷에서 지배적인 3가지 톤(주색, 보조색, 강조색)을 미리 추출하여 정리합니다.</li>
                    <li><strong>텍스트 태그화:</strong> '따뜻함', '사이버펑크', '글루미', '테크니컬' 등 영상의 전체 무드를 상징하는 형용사 태그를 설정해 두면 촬영 및 AI 프롬프트 생성 시 극도로 명확한 지시가 가능합니다.</li>
                </ul>
            </div>
        `
    }
];
