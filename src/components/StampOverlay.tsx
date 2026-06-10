import { useCallback, useEffect, useRef, useState } from 'react'
import type { StampPlacement } from '../types'

interface StampOverlayProps {
  stampUrl: string
  placement: StampPlacement
  onPlacementChange: (placement: StampPlacement) => void
  containerWidth: number
  containerHeight: number
}

type DragMode = 'move' | 'resize-se' | null

/** Draggable and resizable stamp overlay on the PDF preview */
export function StampOverlay({
  stampUrl,
  placement,
  onPlacementChange,
  containerWidth,
  containerHeight,
}: StampOverlayProps) {
  const dragRef = useRef<{
    mode: DragMode
    startX: number
    startY: number
    startPlacement: StampPlacement
  } | null>(null)

  const [isActive, setIsActive] = useState(false)

  const clampPlacement = useCallback(
    (p: StampPlacement): StampPlacement => {
      const minSize = 24
      const width = Math.max(minSize, Math.min(p.width, containerWidth))
      const height = Math.max(minSize, Math.min(p.height, containerHeight))
      const x = Math.max(0, Math.min(p.x, containerWidth - width))
      const y = Math.max(0, Math.min(p.y, containerHeight - height))
      return { x, y, width, height }
    },
    [containerWidth, containerHeight],
  )

  const onPointerDown = useCallback(
    (e: React.PointerEvent, mode: DragMode) => {
      e.preventDefault()
      e.stopPropagation()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      setIsActive(true)
      dragRef.current = {
        mode,
        startX: e.clientX,
        startY: e.clientY,
        startPlacement: { ...placement },
      }
    },
    [placement],
  )

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const drag = dragRef.current
      if (!drag) return

      const dx = e.clientX - drag.startX
      const dy = e.clientY - drag.startY
      const start = drag.startPlacement

      if (drag.mode === 'move') {
        onPlacementChange(
          clampPlacement({
            ...start,
            x: start.x + dx,
            y: start.y + dy,
          }),
        )
      } else if (drag.mode === 'resize-se') {
        onPlacementChange(
          clampPlacement({
            ...start,
            width: start.width + dx,
            height: start.height + dy,
          }),
        )
      }
    }

    const onPointerUp = () => {
      dragRef.current = null
      setIsActive(false)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [clampPlacement, onPlacementChange])

  return (
    <div
      className="absolute inset-0"
      style={{ width: containerWidth, height: containerHeight }}
    >
      <div
        className={[
          'absolute cursor-move touch-none select-none rounded border-2 transition-shadow',
          isActive ? 'border-sky-400 shadow-lg shadow-sky-500/30' : 'border-sky-500/70',
        ].join(' ')}
        style={{
          left: placement.x,
          top: placement.y,
          width: placement.width,
          height: placement.height,
        }}
        onPointerDown={(e) => onPointerDown(e, 'move')}
      >
        <img
          src={stampUrl}
          alt="Stamp"
          className="pointer-events-none h-full w-full object-contain"
          draggable={false}
        />
        <div
          className="absolute -bottom-1.5 -right-1.5 h-4 w-4 cursor-se-resize rounded-full border-2 border-sky-400 bg-slate-900"
          onPointerDown={(e) => onPointerDown(e, 'resize-se')}
          aria-label="Resize stamp"
        />
      </div>
    </div>
  )
}
