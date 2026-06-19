# 조선대학교 교원 교육

**Claude 기반 연구 업무 활용 & AX 브릿지 교과목 설계** — 조선대학교 전임 교원 대상 오프라인 실습 과정 안내 사이트.

🔗 https://chosun.dreamitbiz.com · 2026. 6. 24(수) – 25(목) · 2일 14시간 · 전임 교원 약 45명

## 스택

- React 18 + Vite 5
- Supabase (`chosun_applications` — 교육 신청 접수)
- 폰트: Noto Serif KR · IBM Plex Sans KR · Newsreader
- 디자인 출처: `조선대 교원 교육.dc.html` (Claude Design 핸드오프) 픽셀-퍼펙트 포팅
- 배포: GitHub Actions → GitHub Pages (커스텀 도메인)

## 개발

```bash
npm install
npm run dev      # 로컬 개발 서버
npm run build    # 프로덕션 빌드 → dist/
```

## OG 이미지 재생성

OG 미리보기 이미지(`public/og-image.png`, 1200×630)는 `sharp`로 SVG를 렌더해 생성합니다.
sharp는 상시 의존성이 아니므로 필요할 때만 임시 설치합니다.

```bash
npm i -D sharp
npm run og
npm uninstall sharp
```

## Supabase

- 공유 프로젝트(`hcmgdztsgjvzcyxyayaj`) 내 `chosun_` 접두사 테이블 사용
- 스키마: [`supabase/schema.sql`](supabase/schema.sql)
- RLS: 익명(anon) `INSERT`만 허용(신청 제출), 조회는 운영자만(SQL/대시보드)
- 클라이언트 키는 `src/lib/supabase.js`에 fallback 하드코딩(anon 공개 키)

## 구조

```
src/
  App.jsx                   # 전체 랜딩 (NAV·HERO·OVERVIEW·CURRICULUM·LABS·PREP·INFO·FOOTER)
  data.js                   # 커리큘럼/실습/안내 콘텐츠 데이터
  components/ApplyModal.jsx # 교육 신청 모달 (Supabase insert)
  lib/supabase.js           # Supabase 클라이언트
scripts/generate-og.mjs     # OG 이미지 생성
```
