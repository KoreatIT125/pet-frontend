import type { RegionId } from '../../types/diagnose'

interface Sample {
  src: string
  label: string
  region: RegionId
}

const SAMPLES: Sample[] = [
  { src: '/samples/eye_placeholder.png', label: '안구 샘플', region: 'eye' },
  { src: '/samples/skin_placeholder.png', label: '피부 샘플', region: 'skin' },
]

export function SampleGallery({
  onPick,
  disabled,
}: {
  onPick: (src: string, region: RegionId) => void
  disabled?: boolean
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-bold text-slate-900">샘플로 빠르게 테스트</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {SAMPLES.map((s) => (
          <button
            key={s.src}
            type="button"
            disabled={disabled}
            onClick={() => onPick(s.src, s.region)}
            className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-blue-300 hover:bg-blue-50 disabled:opacity-60"
          >
            <img src={s.src} alt={s.label} className="h-14 w-20 flex-shrink-0 rounded-lg object-cover ring-1 ring-slate-200" />
            <div>
              <div className="text-sm font-bold text-slate-900">{s.label}</div>
              <div className="text-xs text-slate-500">클릭하면 자동 선택</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
