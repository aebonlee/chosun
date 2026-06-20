// 학습 이해를 돕는 SVG 도식 컴포넌트 모음
// spec.type 에 따라 적절한 도식을 렌더 (flow / converge / grid / container / quadrant / triangle / timeline)
const NAVY = '#1E3A5F'
const TERRA = '#C2603D'
const BORDER = '#E2D9C9'
const INK = '#1B1916'
const BLUET = '#EEF3F8'
const SANDT = '#FBF3EC'
const CREAMHEAD = '#F1ECE1'
const MUTE = '#7A7163'
const FF = "'IBM Plex Sans KR', sans-serif"

const svgWrap = { width: '100%', height: 'auto', display: 'block' }

// 긴 라벨을 공백 기준 2줄 tspan 으로
function Label({ text, x, y, fill = INK, size = 14, weight = 600 }) {
  const parts = String(text).split('\n')
  return (
    <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontFamily={FF} fontSize={size} fontWeight={weight} fill={fill}>
      {parts.length === 1
        ? text
        : parts.map((p, i) => <tspan key={i} x={x} dy={i === 0 ? -(parts.length - 1) * 8 : 16}>{p}</tspan>)}
    </text>
  )
}

function Flow({ steps }) {
  const n = steps.length, W = 760, padX = 10, gap = 26, bh = 66, y = 24
  const bw = (W - padX * 2 - gap * (n - 1)) / n
  return (
    <svg viewBox={`0 0 ${W} 116`} style={svgWrap} role="img">
      {steps.map((s, i) => {
        const x = padX + i * (bw + gap)
        const fill = i % 2 ? SANDT : BLUET
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={bh} rx={13} fill={fill} stroke={NAVY} strokeWidth="1.5" />
            <Label text={s} x={x + bw / 2} y={y + bh / 2} size={15} />
            {i < n - 1 && (
              <path d={`M${x + bw + 5} ${y + bh / 2} l${gap - 10} 0 m-9 -6 l9 6 l-9 6`} fill="none" stroke={TERRA} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </g>
        )
      })}
    </svg>
  )
}

function Converge({ inputs, result }) {
  const W = 760, H = 240, n = inputs.length
  const chipW = 220, chipH = 38, left = 16
  const slot = (H - 32) / n
  const rx = 500, rw = 244, rh = 96, ry = (H - rh) / 2
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={svgWrap} role="img">
      {inputs.map((t, i) => {
        const cy = 16 + i * slot + slot / 2
        return (
          <g key={i}>
            <path d={`M${left + chipW} ${cy} C${left + chipW + 120} ${cy}, ${rx - 120} ${H / 2}, ${rx} ${H / 2}`} fill="none" stroke={TERRA} strokeWidth="1.6" opacity="0.45" />
            <rect x={left} y={cy - chipH / 2} width={chipW} height={chipH} rx={10} fill={BLUET} stroke={NAVY} strokeWidth="1.3" />
            <Label text={t} x={left + chipW / 2} y={cy} size={14} />
          </g>
        )
      })}
      <rect x={rx} y={ry} width={rw} height={rh} rx={14} fill={NAVY} />
      <Label text={result} x={rx + rw / 2} y={H / 2} size={17} weight={700} fill="#fff" />
    </svg>
  )
}

function Grid({ cols, rows }) {
  const labelW = 116, colW = 128, headH = 42, rowH = 46
  const W = labelW + cols.length * colW, H = headH + rows.length * rowH
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={svgWrap} role="img">
      <rect x="0" y="0" width={labelW} height={headH} fill={CREAMHEAD} />
      <Label text="문헌＼항목" x={labelW / 2} y={headH / 2} size={12.5} fill={MUTE} weight={600} />
      {cols.map((c, j) => (
        <g key={j}>
          <rect x={labelW + j * colW} y="0" width={colW} height={headH} fill={NAVY} stroke="#fff" strokeWidth="1" />
          <Label text={c} x={labelW + j * colW + colW / 2} y={headH / 2} size={13.5} fill="#fff" weight={700} />
        </g>
      ))}
      {rows.map((r, i) => (
        <g key={i}>
          <rect x="0" y={headH + i * rowH} width={labelW} height={rowH} fill={BLUET} stroke={BORDER} strokeWidth="1" />
          <Label text={r} x={labelW / 2} y={headH + i * rowH + rowH / 2} size={13.5} fill={NAVY} weight={700} />
          {cols.map((_, j) => (
            <g key={j}>
              <rect x={labelW + j * colW} y={headH + i * rowH} width={colW} height={rowH} fill="#fff" stroke={BORDER} strokeWidth="1" />
              <circle cx={labelW + j * colW + colW / 2} cy={headH + i * rowH + rowH / 2} r="4.5" fill={TERRA} opacity="0.55" />
            </g>
          ))}
        </g>
      ))}
    </svg>
  )
}

function Container({ label, items }) {
  const W = 760, titleH = 50, itemH = 50, gap = 12, pad = 18
  const H = titleH + pad * 2 + items.length * itemH + (items.length - 1) * gap
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={svgWrap} role="img">
      <rect x="1" y="1" width={W - 2} height={H - 2} rx={16} fill="#fff" stroke={NAVY} strokeWidth="1.6" />
      <path d={`M1 17 a16 16 0 0 1 16 -16 h${W - 34} a16 16 0 0 1 16 16 v33 h-${W - 2} z`} fill={NAVY} />
      <Label text={label} x={W / 2} y={titleH / 2 + 2} size={17} weight={700} fill="#fff" />
      {items.map((t, i) => {
        const y = titleH + pad + i * (itemH + gap)
        return (
          <g key={i}>
            <rect x={pad} y={y} width={W - pad * 2} height={itemH} rx={11} fill={i % 2 ? SANDT : BLUET} stroke={BORDER} strokeWidth="1" />
            <text x={pad + 18} y={y + itemH / 2} dominantBaseline="middle" fontFamily={FF} fontSize={14.5} fontWeight={600} fill={INK}>{t}</text>
          </g>
        )
      })}
    </svg>
  )
}

function Quadrant() {
  const W = 580, H = 360, x0 = 90, x1 = 520, y0 = 40, y1 = 300
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={svgWrap} role="img">
      {/* 1순위 사분면 (효과↑·난이도↓) = 좌상 */}
      <rect x={x0} y={y0} width={mx - x0} height={my - y0} fill={SANDT} />
      <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill="none" stroke={BORDER} strokeWidth="1.3" />
      <line x1={mx} y1={y0} x2={mx} y2={y1} stroke={BORDER} strokeWidth="1.3" />
      <line x1={x0} y1={my} x2={x1} y2={my} stroke={BORDER} strokeWidth="1.3" />
      {/* 축 화살표 */}
      <path d={`M${x0} ${y1} l0 -${y1 - y0 + 6} m-5 9 l5 -9 l5 9`} fill="none" stroke={NAVY} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M${x0} ${y1} l${x1 - x0 + 6} 0 m-9 -5 l9 5 l-9 5`} fill="none" stroke={NAVY} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <Label text="교육 효과 ↑" x={x0 - 6} y={(y0 + my) / 2} size={12.5} fill={NAVY} weight={700} />
      <text x={x1} y={y1 + 26} textAnchor="end" fontFamily={FF} fontSize={12.5} fontWeight={700} fill={NAVY}>실행 난이도 →</text>
      <circle cx={(x0 + mx) / 2} cy={(y0 + my) / 2} r="8" fill={TERRA} />
      <Label text={'1순위\n효과↑ · 난이도↓'} x={(x0 + mx) / 2} y={(y0 + my) / 2 + 34} size={13} fill={TERRA} weight={700} />
      <Label text="나중에" x={(mx + x1) / 2} y={(my + y1) / 2} size={12.5} fill={MUTE} weight={600} />
    </svg>
  )
}

function Triangle({ nodes }) {
  const W = 580, H = 320
  const pts = [[290, 56], [120, 264], [460, 264]]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={svgWrap} role="img">
      {[[0, 1], [1, 2], [0, 2]].map(([a, b], i) => (
        <line key={i} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} stroke={TERRA} strokeWidth="2" opacity="0.6" />
      ))}
      <Label text="구성적 정렬" x={290} y={186} size={13.5} fill={MUTE} weight={600} />
      {nodes.map((t, i) => (
        <g key={i}>
          <rect x={pts[i][0] - 78} y={pts[i][1] - 28} width={156} height={56} rx={13} fill={i === 0 ? NAVY : BLUET} stroke={NAVY} strokeWidth="1.5" />
          <Label text={t} x={pts[i][0]} y={pts[i][1]} size={15} weight={700} fill={i === 0 ? '#fff' : NAVY} />
        </g>
      ))}
    </svg>
  )
}

function Timeline({ phases }) {
  const W = 760, H = 168, y = 64, x0 = 70, x1 = 690
  const n = phases.length
  const step = (x1 - x0) / (n - 1)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={svgWrap} role="img">
      <line x1={x0} y1={y} x2={x1} y2={y} stroke={BORDER} strokeWidth="3" />
      {phases.map(([t, d], i) => {
        const cx = x0 + i * step
        return (
          <g key={i}>
            <line x1={x0} y1={y} x2={cx} y2={y} stroke={TERRA} strokeWidth="3" />
            <circle cx={cx} cy={y} r="11" fill={NAVY} />
            <circle cx={cx} cy={y} r="4" fill="#fff" />
            <Label text={t} x={cx} y={y - 28} size={16} weight={700} fill={NAVY} />
            <rect x={cx - 92} y={y + 18} width={184} height={46} rx={11} fill={BLUET} stroke={BORDER} strokeWidth="1" />
            <Label text={d} x={cx} y={y + 41} size={13.5} weight={600} />
          </g>
        )
      })}
    </svg>
  )
}

export default function Diagram({ spec }) {
  if (!spec) return null
  switch (spec.type) {
    case 'flow': return <Flow steps={spec.steps} />
    case 'converge': return <Converge inputs={spec.inputs} result={spec.result} />
    case 'grid': return <Grid cols={spec.cols} rows={spec.rows} />
    case 'container': return <Container label={spec.label} items={spec.items} />
    case 'quadrant': return <Quadrant />
    case 'triangle': return <Triangle nodes={spec.nodes} />
    case 'timeline': return <Timeline phases={spec.phases} />
    default: return null
  }
}
