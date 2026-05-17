import { Code2, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import type { DiagnosisResult } from '../../types/diagnose'

export function JsonResultPanel({ result }: { result: DiagnosisResult | null }) {
  const [copied, setCopied] = useState(false)

  const payload = result
    ? {
        prediction: result.prediction,
        confidence: result.confidence,
        action_plan: result.actionPlan,
        timestamp: result.timestamp,
      }
    : null

  const text = payload ? JSON.stringify(payload, null, 2) : '{}'

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // 클립보드 실패는 조용히 무시
    }
  }

  return (
    <details className="group rounded-2xl bg-primary/10 p-4 text-slate-900">
      <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm font-semibold">
        <span className="flex items-center gap-2">
          <Code2 className="h-4 w-4" />
          구조화 결과 (JSON)
        </span>
        <span className="text-xs text-muted">prediction · confidence · action_plan · timestamp</span>
      </summary>
      <div className="relative mt-3">
        <button
          type="button"
          onClick={onCopy}
          className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md bg-primary/20 px-2 py-1 text-xs font-semibold text-slate-900 hover:bg-primary/30"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? '복사됨' : '복사'}
        </button>
        <pre className="max-h-72 overflow-auto rounded-xl bg-slate-950 p-4 font-mono text-xs leading-6 text-slate-100">
{text}
        </pre>
      </div>
    </details>
  )
}
