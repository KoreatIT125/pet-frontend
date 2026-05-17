import type { RegionId } from '../../types/diagnose'
import { REGIONS } from '../../lib/diagnoseLogic'

export function RegionRadio({
  value,
  onChange,
  disabled,
}: {
  value: RegionId
  onChange: (v: RegionId) => void
  disabled?: boolean
}) {
  const ids: RegionId[] = ['eye', 'skin']
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-bold text-slate-900">진단 부위</legend>
      <p className="text-xs text-slate-500">해당 부위를 고르면 분류 정확도가 올라갑니다.</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {ids.map((id) => {
          const meta = REGIONS[id]
          const active = value === id
          return (
            <label
              key={id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 transition ${
                active
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <input
                type="radio"
                name="region"
                value={id}
                checked={active}
                disabled={disabled}
                onChange={() => onChange(id)}
                className="h-4 w-4 accent-blue-600"
              />
              <span className="font-bold">{meta.label}</span>
              <span className="text-xs text-slate-500">
                {meta.classes.join(' · ')}
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
