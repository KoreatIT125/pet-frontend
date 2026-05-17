import { Stethoscope } from 'lucide-react'

export function ActionPlanCard({ text }: { text: string }) {
  return (
    <div className="rounded-2xl bg-blue-50 p-5 ring-1 ring-blue-200">
      <div className="mb-2 flex items-center gap-2 text-sm font-bold text-blue-900">
        <Stethoscope className="h-4 w-4" />
        진단 가이드 (수의사 권고)
      </div>
      {text ? (
        <p className="whitespace-pre-line text-sm leading-7 text-slate-800">{text}</p>
      ) : (
        <p className="text-sm text-slate-500">진단 후 권고 문구가 여기에 표시됩니다.</p>
      )}
    </div>
  )
}
