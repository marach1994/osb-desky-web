interface HeurekaWidgetProps {
  position: 'top' | 'middle' | 'bottom'
  iframeCode?: string
}

export default function HeurekaWidget({ position, iframeCode }: HeurekaWidgetProps) {
  if (!iframeCode) {
    return (
      <div className="my-8 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
        <p className="text-center text-gray-500 text-sm">
          Heureka widget ({position}) - vlozte iframe kod z Heureka.cz
        </p>
      </div>
    )
  }

  return (
    <div
      className="my-8"
      dangerouslySetInnerHTML={{ __html: iframeCode }}
    />
  )
}
