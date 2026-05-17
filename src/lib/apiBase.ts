export function getApiBaseUrl(): string | undefined {
  const raw = import.meta.env.VITE_API_BASE_URL as string | undefined
  if (!raw || !raw.trim()) return undefined
  return raw.replace(/\/$/, '')
}

export function resolveAssetUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  const base = getApiBaseUrl()
  if (!base) return path
  if (path.startsWith('/')) return `${base}${path}`
  return `${base}/${path}`
}
