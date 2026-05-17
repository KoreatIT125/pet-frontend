import { useEffect, useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'

export function ImageUpload({
  imageUrl,
  onPick,
  onClear,
  disabled,
}: {
  imageUrl: string | null
  onPick: (file: File | string) => void
  onClear: () => void
  disabled?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  // 외부에서 imageUrl이 바뀌면 input 값을 비워 같은 파일 재업로드 가능
  useEffect(() => {
    if (!imageUrl && inputRef.current) inputRef.current.value = ''
  }, [imageUrl])

  const handleFile = (f: File) => {
    if (!f.type.startsWith('image/')) return
    onPick(f)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    if (disabled) return
    const f = e.dataTransfer.files?.[0]
    if (f) handleFile(f)
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-slate-900">환부 사진 (JPG / PNG)</label>

      {imageUrl ? (
        <div className="relative overflow-hidden rounded-2xl ring-1 ring-slate-200">
          <img src={imageUrl} alt="업로드된 환부 사진" className="h-72 w-full object-cover" />
          {!disabled && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 top-3 rounded-full bg-white/95 p-2 shadow ring-1 ring-slate-200 transition hover:bg-white"
              aria-label="이미지 제거"
            >
              <X className="h-4 w-4 text-slate-700" />
            </button>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            if (!disabled) setDragActive(true)
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          className={`flex h-72 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
          } ${disabled ? 'pointer-events-none opacity-60' : ''}`}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="mb-3 h-10 w-10 text-slate-400" />
          <p className="text-sm font-semibold text-slate-700">클릭하거나 사진을 끌어다 놓으세요</p>
          <p className="mt-1 text-xs text-slate-500">JPG / PNG · 최대 10MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handleFile(f)
        }}
      />
    </div>
  )
}
