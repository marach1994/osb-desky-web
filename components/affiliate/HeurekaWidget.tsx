'use client'

import { useEffect, useRef } from 'react'

interface HeurekaWidgetProps {
  position: 'top' | 'middle' | 'bottom'
  iframeCode?: string
}

export default function HeurekaWidget({ position, iframeCode }: HeurekaWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!iframeCode) return

    // Load trixam script if not already loaded
    const scriptId = 'heureka-trixam-script'
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://serve.affiliate.heureka.cz/js/trixam.min.js'
      script.async = true
      document.body.appendChild(script)
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
