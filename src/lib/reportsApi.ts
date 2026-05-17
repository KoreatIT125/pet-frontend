import { getApiBaseUrl } from './apiBase'

export async function fetchReportPdfBlob(): Promise<Blob> {
  const base = getApiBaseUrl()
  if (!base) {
    await new Promise((r) => setTimeout(r, 800))
    const text =
      'Pet Health Admin — sample PDF\n\nAPI 베이스 URL이 없어 데모용 텍스트 파일이 내려갑니다.\nVITE_API_BASE_URL을 설정하면 실제 /reports/pdf 응답을 받습니다.'
    return new Blob([text], { type: 'text/plain;charset=utf-8' })
  }

  const res = await fetch(`${base}/reports/pdf`, {
    method: 'GET',
    headers: { Accept: 'application/pdf' },
  })

  if (!res.ok) {
    throw new Error(`리포트를 받지 못했습니다. (${res.status})`)
  }

  return res.blob()
}

export function triggerBrowserDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
