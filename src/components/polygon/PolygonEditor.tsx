import { useMemo, useState } from 'react'
import type { PolygonPoint } from '../../types/polygon'

interface PolygonEditorProps {
  imageSrc: string
  points: PolygonPoint[]
  onAddPoint: (p: PolygonPoint) => void
}

export function PolygonEditor({ imageSrc, points, onAddPoint }: PolygonEditorProps) {
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null)

  const polygonPoints = useMemo(() => points.map((p) => `${p.x},${p.y}`).join(' '), [points])

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const ctm = svg.getScreenCTM()
    if (!ctm) return
    const ip = pt.matrixTransform(ctm.inverse())
    onAddPoint({ x: ip.x, y: ip.y })
  }

  return (
    <div className="rounded-xl bg-surface p-4 shadow-sm ring-1 ring-slate-200/70">
      <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-xl ring-1 ring-slate-200">
        <img
          src={imageSrc}
          alt="폴리곤 기준 이미지"
          className="block h-auto w-full select-none"
          draggable={false}
          onLoad={(ev) => {
            const img = ev.currentTarget
            setDims({ w: img.naturalWidth, h: img.naturalHeight })
          }}
        />

        {dims && (
          <svg
            role="img"
            aria-label="위험구역 폴리곤 편집 영역"
            className="absolute inset-0 h-full w-full cursor-crosshair"
            viewBox={`0 0 ${dims.w} ${dims.h}`}
            preserveAspectRatio="xMidYMid meet"
            onClick={handleSvgClick}
          >
            <defs>
              <pattern id="petPolyGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(59,130,246,0.12)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width={dims.w} height={dims.h} fill="url(#petPolyGrid)" />

            {points.length > 1 && (
              <polyline
                points={polygonPoints}
                fill="none"
                stroke="#3b82f6"
                strokeWidth={Math.max(2, Math.round(dims.w / 500))}
                strokeLinejoin="round"
                strokeLinecap="round"
                pointerEvents="none"
              />
            )}
            {points.length > 2 && (
              <polygon
                points={polygonPoints}
                fill="rgba(59,130,246,0.18)"
                stroke="#3b82f6"
                strokeWidth={Math.max(2, Math.round(dims.w / 500))}
                strokeLinejoin="round"
                pointerEvents="none"
              />
            )}

            {points.map((p, idx) => {
              const r = Math.max(4, Math.round(dims.w / 220))
              return (
                <g key={`${p.x}-${p.y}-${idx}`} pointerEvents="none">
                  <circle cx={p.x} cy={p.y} r={r + 2} fill="rgba(255,255,255,0.85)" />
                  <circle cx={p.x} cy={p.y} r={r} fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                  <text
                    x={p.x}
                    y={p.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#ffffff"
                    fontSize={Math.max(10, Math.round(r * 1.1))}
                    fontWeight="800"
                  >
                    {idx + 1}
                  </text>
                </g>
              )
            })}
          </svg>
        )}
      </div>

      <p className="mt-3 text-xs text-slate-600">
        이미지 위를 클릭해 점을 추가합니다. 점이 3개 이상이면 면이 채워집니다. (SVG 좌표계 기준)
      </p>
    </div>
  )
}
