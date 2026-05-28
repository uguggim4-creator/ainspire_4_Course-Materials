# class-ainspire

AInspire 기수별 모집 랜딩페이지 호스팅 repo.

- **도메인**: https://class.ainspire.co.kr
- **현재 메인 기수**: 4기 (`/4/`)
- **GitHub**: https://github.com/uguggim4-creator/iframe-test
- **호스팅**: Vercel (`iframe-test` 프로젝트)
- **DNS**: 가비아 — CNAME `class.ainspire.co.kr` → `e015c75382b1a660.vercel-dns-016.com.`

---

## 폴더 구조

```
class-ainspire/
├─ index.html       ← 루트 진입 시 현재 기수로 리다이렉트 (지금은 /4/)
├─ 4/
│  └─ index.html    ← AInspire 4기 LP (class.ainspire.co.kr/4/)
└─ README.md
```

매 기수마다 **`{기수번호}/index.html`** 한 파일만 추가하면 됨.
DNS·Vercel 추가 작업은 없음. `git push`만 하면 자동 배포.

---

## 새 기수 추가 절차 (예: 5기)

### 1. 새 기수 폴더 생성 + LP 파일 복사

```powershell
cd E:\class-ainspire
mkdir 5
copy "C:\Users\Slit\OneDrive\바탕 화면\AInspire_5기_상세페이지.html" 5\index.html
```

(파일명은 무조건 `index.html`로 — 브라우저가 폴더 진입 시 기본으로 찾는 파일)

### 2. 루트 리다이렉트를 새 기수로 변경

`index.html` 5번 줄 수정:

```html
<!-- 변경 전 -->
<meta http-equiv="refresh" content="0; url=/4/">

<!-- 변경 후 -->
<meta http-equiv="refresh" content="0; url=/5/">
```

같은 파일 10번 줄의 링크 텍스트(`/4/` → `/5/`)도 함께 변경.

### 3. 푸시

```powershell
git add -A
git commit -m "Add 5기 LP, redirect root to /5/"
git push origin main
```

푸시 후 1~2분 내 Vercel 자동 재배포 완료.

### 4. 아임웹 iframe URL 교체

```html
<iframe src="https://class.ainspire.co.kr/5/" ...></iframe>
```

⚠️ 과거 기수 페이지(`/4/`, `/3/` 등)는 **삭제하지 말 것**. 후기·실적 reference로 계속 활용 가능. 단 외부에서 더 이상 광고 트래픽을 보내지는 않으면 됨.

---

## 기수별 LP 업데이트 (오타·가격 수정 등)

```powershell
cd E:\class-ainspire
copy "C:\Users\Slit\OneDrive\바탕 화면\AInspire_4기_상세페이지.html" 4\index.html
git add 4/index.html
git commit -m "Update 4기 LP"
git push origin main
```

수정 후 브라우저 캐시 무시 새로고침: `Ctrl + F5`

---

## 아임웹 상품 상세 iframe 코드

```html
<iframe
  src="https://class.ainspire.co.kr/4/"
  width="100%"
  height="8000"
  style="border:0;display:block;margin:0;padding:0;"
  loading="lazy"
  scrolling="no">
</iframe>
```

- `height`는 실제 페이지 길이에 맞춰 조정 (8000은 추정치)
- 모바일 자동 높이 조절은 iframe-resizer 라이브러리가 필요하지만 아임웹 에디터에서는 까다로움 → 일단 고정 높이 권장

---

## 인프라 요약

| 구성 | 위치 | 비고 |
|---|---|---|
| 도메인 등록 | 가비아 — `ainspire.co.kr` | |
| DNS | 가비아 DNS 관리툴 | `class` CNAME → Vercel |
| Git remote | GitHub `uguggim4-creator/iframe-test` | Public repo |
| 호스팅·배포 | Vercel 프로젝트 `iframe-test` | GitHub 연동 자동 배포 |
| SSL | Vercel 자동 발급 (Let's Encrypt) | |

---

## 주의사항

- **CNAME 파일 만들지 말 것** — GitHub Pages용이며, Vercel에서는 도메인 라우팅을 망가뜨림 (이미 제거됨)
- **`vercel.json` 만들 때 주의** — 잘못된 설정은 라우팅 전체를 망가뜨릴 수 있음. 추가 전 백업
- **repo는 Public 유지** — Vercel Hobby에서 Private repo도 지원하지만 현재 구성은 Public
- 아임웹에 직접 HTML 붙여넣지 말 것 — `<head>`·`<style>` 제거 및 CSS 변수 깨짐. 반드시 iframe으로 임베드

---

## 문제 해결

**도메인 접속이 안 됨**
1. https://vercel.com/dashboard → `iframe-test` 프로젝트 → Settings → Domains에서 `class.ainspire.co.kr` 상태 확인
2. ⚠️ Invalid Configuration이면 가비아 DNS 레코드 재확인
3. ✅ Valid이지만 안 열리면 5~10분 대기 (DNS 캐시)

**수정한 내용이 반영 안 됨**
1. https://vercel.com/dashboard → 프로젝트 → Deployments에서 최신 배포 상태 확인
2. 빌드 성공인데 옛 화면이면 브라우저 캐시: `Ctrl + F5`
3. 그래도 안 되면 Vercel 프로젝트에서 "Redeploy" 클릭
