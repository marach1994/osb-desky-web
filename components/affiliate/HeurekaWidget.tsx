'use client'

import { useEffect, useRef } from 'react'

interface HeurekaWidgetProps {
  position: 'top' | 'middle' | 'bottom'
  iframeCode?: string
}

declare global {
  interface Window {
    Trixam?: {
      init?: () => void
      refresh?: () => void
    }
  }
}

export default function HeurekaWidget({ position, iframeCode }: HeurekaWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!iframeCode) return

    // Load trixam script if not already loaded
    const scriptId = 'heureka-trixam-script'
    const existingScript = document.getElementById(scriptId)

    if (!existingScript) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://serve.affiliate.heureka.cz/js/trixam.min.js'
      script.async = true
      script.onload = () => {
        // Initialize widgets after script loads
        if (window.Trixam?.init) {
          window.Trixam.init()
        }
      }
      document.body.appendChild(script)
    } else {
      // Script already loaded, try to refresh widgets
      setTimeout(() => {
        if (window.Trixam?.init) {
          window.Trixam.init()
        } else if (window.Trixam?.refresh) {
          window.Trixam.refresh()
        }
      }, 100)
    }
  }, [iframeCode])

  if (!iframeCode) {
    return null
  }

  return (
    <div
      ref={containerRef}
      className="my-8"
      dangerouslySetInnerHTML={{ __html: iframeCode }}
    />
  )
}
