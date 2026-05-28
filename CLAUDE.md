# AInspire 4기 강의 — 프로젝트 지침

## 폴더 구조

```
f:\ainspire 4기 강의\
├── class-ainspire/      ← 메인 포털 (서버 루트)
│   ├── index.html       ← 수강생 전용 교안 자료집 (메인)
│   ├── viewer.html      ← index.html에서 참조, 함께 유지
│   ├── data-materials.js ← 자료 목록 데이터 (filePath 경로 관리)
│   ├── cineguide/       ← CineGuide v1, v2
│   ├── materials/
│   │   ├── 4기-입문편/  ← 미디어도구, 바이브코딩용어 (HTML 슬라이드)
│   │   └── 공용/        ← 1강, 2강 PDF + xlsx
│   ├── docs/            ← README, 교안제작-매뉴얼, 작업-인계-노트
│   └── _archive/        ← 보류 자료 (cineguide_보류 등)
└── _archive/            ← HTML 미참조 전부 (삭제 아님, 격리)
```

## 폴더 정리 원칙

1. **기준은 항상 `data-materials.js`의 `filePath`** — 참조된 경로만 유지, 나머지는 `_archive/`로 격리
2. **폴더 이동 후 filePath 동기화** — `data-materials.js`의 경로도 반드시 함께 업데이트
3. **폴더명은 HTML 카테고리 표시 이름 기준** — `week1` 같은 내부 코드명 쓰지 않음
4. **삭제 전 `_archive/` 먼저** — 완전 삭제는 명시적으로 요청받을 때만

## 참조 확인 방법

```bash
grep filePath class-ainspire/data-materials.js
grep -n "src=\|href=" class-ainspire/index.html
```

## 카테고리 구조 (data-materials.js 기준)

| category | categoryKo | 로컬 경로 |
|---|---|---|
| week1 | 4기 입문편 | materials/4기-입문편/ |
| week2 | 2기 자료 | Drive 폴더 (로컬 없음) |
| week3 | 3기 자료 | Notion 링크 (로컬 없음) |
| cineguide | CineGuide | cineguide/ |
