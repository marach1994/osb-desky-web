// Heureka affiliate widget codes per article slug
// Keys: "{category}/{slug}", values: { top?, middle?, bottom? }

export const widgetCodes: Record<string, { top?: string; middle?: string; bottom?: string }> = {
  'osb-desky/15mm': {
    top: '<div class="heureka-affiliate-category" data-trixam-positionid="260314" data-trixam-categoryid="6038" data-trixam-categoryfilters="" data-trixam-codetype="iframe" data-trixam-linktarget="top"></div>',
  },
}

export function getWidgetCode(category: string, slug: string, position: 'top' | 'middle' | 'bottom'): string | undefined {
  const key = `${category}/${slug}`
  return widgetCodes[key]?.[position]
}
