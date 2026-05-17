import type { ClassProb } from '../../types/diagnose'

export function PredictionResult({ items }: { items: ClassProb[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
        진단 후 Top-3 후보가 여기에 표시됩니다.
      </div>
    )
  }
  return (
    <div className="space-y-3">
      {items.map((it, idx) => {
        const pct = Math.round(it.probability * 1000) / 10
        const isTop = idx === 0
        return (
          <div key={it.label} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
            <div className="mb-2 flex items-center justify-between">
              <span className={`font-bold ${isTop ? 'text-blue-700' : 'text-slate-700'}`}>
                {idx + 1}. {it.label}
              </span>
              <span className={`text-sm font-semibold ${isTop ? 'text-blue-700' : 'text-slate-500'}`}>
                {pct.toFixed(1)}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-2 rounded-full transition-all ${isTop ? 'bg-blue-500' : 'bg-slate-400'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
