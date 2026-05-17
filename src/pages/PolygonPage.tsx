import { useState } from 'react'
import { PolygonEditor } from '../components/polygon/PolygonEditor'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { usePolygonEditor } from '../hooks/usePolygonEditor'
import { savePolygon } from '../lib/polygonApi'

const POLYGON_DEMO_IMAGE =
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&q=80&auto=format&fit=crop'

export function PolygonPage() {
  const { points, addPoint, undoLast, clear } = usePolygonEditor()
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveOk, setSaveOk] = useState<string | null>(null)

  const onSave = async () => {
    setSaving(true)
    setSaveError(null)
    setSaveOk(null)
    try {
      await savePolygon(points)
      setSaveOk('저장 요청이 완료되었습니다.')
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : '저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card
        title="위험구역 폴리곤"
        description="모니터링 기준 이미지 위에서 클릭해 꼭짓점을 만들고, 순서대로 연결됩니다."
        headerRight={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button variant="ghost" onClick={undoLast} disabled={points.length === 0 || saving}>
              실행 취소
            </Button>
            <Button variant="ghost" onClick={clear} disabled={points.length === 0 || saving}>
              초기화
            </Button>
            <Button variant="primary" loading={saving} onClick={() => void onSave()}>
              저장 (API)
            </Button>
          </div>
        }
      >
        <PolygonEditor imageSrc={POLYGON_DEMO_IMAGE} points={points} onAddPoint={addPoint} />

        {(saveError || saveOk) && (
          <div className="mt-4 rounded-xl bg-app-bg p-4 ring-1 ring-slate-200/70">
            {saveError && <p className="text-sm text-red-700">{saveError}</p>}
            {saveOk && <p className="text-sm text-emerald-800">{saveOk}</p>}
          </div>
        )}

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <div className="rounded-xl bg-app-bg p-4 ring-1 ring-slate-200/70">
            <div className="text-xs font-semibold text-slate-500">좌표 배열 (JSON)</div>
            <pre className="mt-2 max-h-44 overflow-auto whitespace-pre-wrap break-all text-xs text-slate-800">
              {JSON.stringify(points, null, 2)}
            </pre>
          </div>
          <div className="rounded-xl bg-app-bg p-4 ring-1 ring-slate-200/70">
            <div className="text-xs font-semibold text-slate-500">안내</div>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>
                예시 데이터 형태:{' '}
                <span className="font-mono text-xs text-slate-600">
                  [{`{ "x": 120, "y": 80 }`}, …]
                </span>
              </li>
              <li>
                <span className="font-semibold">VITE_API_BASE_URL</span>이 설정된 경우{' '}
                <span className="font-mono text-xs">POST /polygon</span>으로 전송됩니다.
              </li>
              <li>미설정(로컬 데모)에서는 네트워크 없이 성공 흐름을 시뮬레이션합니다.</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
