import { useCallback, useState } from 'react'
import { fetchReportPdfBlob, triggerBrowserDownload } from '../lib/reportsApi'

export interface UsePdfDownloadResult {
  downloading: boolean
  error: string | null
  download: (filename?: string) => Promise<void>
}

export function usePdfDownload(): UsePdfDownloadResult {
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const download = useCallback(async (filename = 'pet-health-report.pdf') => {
    setDownloading(true)
    setError(null)
    try {
      const blob = await fetchReportPdfBlob()
      const isPdf = blob.type.includes('pdf')
      triggerBrowserDownload(blob, isPdf ? filename : filename.replace(/\.pdf$/i, '.txt'))
    } catch (e) {
      setError(e instanceof Error ? e.message : '다운로드에 실패했습니다.')
    } finally {
      setDownloading(false)
    }
  }, [])

  return { downloading, error, download }
}
