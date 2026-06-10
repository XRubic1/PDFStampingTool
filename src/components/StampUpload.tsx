interface StampUploadProps {
  stampUrl: string | null
  onStampSelect: (file: File | null) => void
}

/** Upload control for the stamp image (PNG or JPG) */
export function StampUpload({ stampUrl, onStampSelect }: StampUploadProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2.5 transition-colors hover:border-slate-700 hover:bg-slate-900/60">
      <input
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null
          onStampSelect(file)
          e.target.value = ''
        }}
      />
      {stampUrl ? (
        <img
          src={stampUrl}
          alt="Stamp preview"
          className="h-10 w-10 shrink-0 rounded-lg border border-slate-700 object-contain bg-white/5"
        />
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-500">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Stamp
        </p>
        <p className="truncate text-sm text-slate-200">
          {stampUrl ? 'Change image' : 'Upload PNG or JPG'}
        </p>
      </div>
    </label>
  )
}
