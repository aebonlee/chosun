// OG 이미지 생성 (1200x630) — sharp 로 SVG를 PNG로 렌더
// 사용: npm run og   (결과: public/og-image.png)
// sharp 가 없으면: npm i -D sharp 후 실행
import sharp from 'sharp'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const out = join(__dirname, '..', 'public', 'og-image.png')

const W = 1200
const H = 630

// 디자인 팔레트와 동일 (배경 크림, 네이비/테라코타 액센트)
const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#F6F2EA"/>
      <stop offset="1" stop-color="#EFE7D7"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- 우상단 장식 원 -->
  <circle cx="1060" cy="120" r="220" fill="#1E3A5F" opacity="0.06"/>
  <circle cx="1120" cy="540" r="160" fill="#C2603D" opacity="0.07"/>

  <!-- 좌측 컬러 바 -->
  <rect x="0" y="0" width="14" height="${H}" fill="#1E3A5F"/>

  <!-- 브랜드 -->
  <g transform="translate(96, 92)">
    <rect width="46" height="46" rx="11" fill="#1E3A5F"/>
    <text x="23" y="34" font-family="Georgia, serif" font-style="italic" font-size="28" fill="#ffffff" text-anchor="middle">C</text>
    <text x="64" y="31" font-family="'Noto Serif KR', serif" font-size="25" font-weight="600" fill="#1B1916">조선대학교 교원 교육</text>
  </g>

  <!-- 배지 -->
  <g transform="translate(96, 184)">
    <rect width="430" height="44" rx="22" fill="#ffffff" stroke="#E2D9C9"/>
    <circle cx="28" cy="22" r="5" fill="#C2603D"/>
    <text x="46" y="29" font-family="'IBM Plex Sans KR', sans-serif" font-size="17" font-weight="600" fill="#7A4A33">전임 교원 대상 · 오프라인 실습 과정</text>
  </g>

  <!-- 메인 타이틀 -->
  <text x="96" y="320" font-family="'Noto Serif KR', serif" font-size="60" font-weight="700" fill="#1B1916">Claude 기반 <tspan fill="#C2603D">연구 업무 활용</tspan></text>
  <text x="96" y="396" font-family="'Noto Serif KR', serif" font-size="60" font-weight="700" fill="#1B1916">&amp; AX 브릿지 교과목 설계</text>

  <!-- 서브 -->
  <text x="96" y="464" font-family="'IBM Plex Sans KR', sans-serif" font-size="24" fill="#5A5246">논문 리뷰 · 제안서 작성 · 교과목 AI 접목 · 과목 에이전트 구축</text>

  <!-- 하단 정보 -->
  <g transform="translate(96, 528)">
    <text x="0" y="24" font-family="Georgia, serif" font-size="30" fill="#1E3A5F">2일 · 14시간</text>
    <rect x="200" y="2" width="2" height="28" fill="#D8CEBE"/>
    <text x="226" y="24" font-family="'IBM Plex Sans KR', sans-serif" font-size="22" font-weight="500" fill="#5A5246">2026. 6. 24 – 25</text>
    <rect x="430" y="2" width="2" height="28" fill="#D8CEBE"/>
    <text x="456" y="24" font-family="'IBM Plex Sans KR', sans-serif" font-size="22" font-weight="500" fill="#5A5246">전임 교원 45명</text>
  </g>

  <text x="${W - 96}" y="572" font-family="'IBM Plex Sans KR', sans-serif" font-size="18" fill="#9A8F7D" text-anchor="end">chosun.dreamitbiz.com</text>
</svg>`

const png = await sharp(Buffer.from(svg)).png().toBuffer()
writeFileSync(out, png)
console.log('✓ OG image written:', out, `(${png.length} bytes)`)
