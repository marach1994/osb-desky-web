'use client'

import { useEffect } from 'react'

interface Props {
  positionId: string
  categoryId: string
  categoryFilters?: string
}

export default function HeurekaAffiliateCategoryBanner({ positionId, categoryId, categoryFilters = '' }: Props) {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = '//serve.affiliate.heureka.cz/js/trixam.min.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  return (
    <div
      className="heureka-affiliate-category"
      data-trixam-positionid={positionId}
      data-trixam-categoryid={categoryId}
      data-trixam-categoryfilters={categoryFilters}
      data-trixam-codetype="iframe"
      data-trixam-linktarget="top"
    />
  )
}
