import type { PdfFileItem } from '../types'

interface PdfFileListProps {
  files: PdfFileItem[]
  onRemove: (id: string) => void
}

/** Scrollable list of queued PDF files — grows without pushing actions down */
export function PdfFileList({ files, onRemove }: PdfFileListProps) {
  if (files.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center rounded-xl border border-dashed border-slate-800/80 px-4 py-6">
        <p className="text-center text-xs text-slate-600">No PDFs yet</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-950/40">
      <div className="flex shrink-0 items-center justify-between border-b border-slate-800 px-3 py-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Queue
        </h3>
        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-sky-400">
          {files.length}
        </span>
      </div>

      <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2 scrollbar-thin">
        {files.map((item, index) => (
          <li
            key={item.id}
            className="group flex items-center gap-2 rounded-lg bg-slate-800/50 px-2.5 py-2 text-xs transition-colors hover:bg-slate-800"
          >
            <span
              className={[
                'flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold',
                index === 0
                  ? 'bg-sky-500/20 text-sky-400'
                  : 'bg-slate-700/80 text-slate-500',
              ].join(' ')}
              title={index === 0 ? 'Used for preview' : undefined}
            >
              {index + 1}
            </span>
            <span className="min-w-0 flex-1 truncate text-slate-300" title={item.name}>
              {item.name}
            </span>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="shrink-0 rounded p-1 text-slate-600 opacity-0 transition-all hover:bg-red-500/20 hover:text-red-400 group-hover:opacity-100"
              aria-label={`Remove ${item.name}`}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
