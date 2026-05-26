// Static color matrix for Tailwind JIT safety.
// All classes used here must survive tree-shaking.
export const TELEMETRY_THEME = {
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    bar: 'bg-emerald-400',
  },
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
    bar: 'bg-blue-400',
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    text: 'text-purple-400',
    bar: 'bg-purple-400',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-400',
    bar: 'bg-amber-400',
  },
  rose: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    text: 'text-rose-400',
    bar: 'bg-rose-400',
  },
  gray: {
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/20',
    text: 'text-gray-400',
    bar: 'bg-gray-400',
  },
}

export function getTheme(colorKey) {
  return TELEMETRY_THEME[colorKey] || TELEMETRY_THEME.gray
}

export function successRateTheme(rate) {
  if (rate >= 80) return TELEMETRY_THEME.emerald
  if (rate >= 60) return TELEMETRY_THEME.blue
  if (rate >= 40) return TELEMETRY_THEME.amber
  return TELEMETRY_THEME.rose
}

export function varianceLabel(gap) {
  if (gap <= 0.05) return { label: 'Stable', theme: TELEMETRY_THEME.emerald }
  if (gap <= 0.15) return { label: 'Nominal', theme: TELEMETRY_THEME.blue }
  if (gap <= 0.30) return { label: 'Noisy', theme: TELEMETRY_THEME.amber }
  return { label: 'Volatile', theme: TELEMETRY_THEME.rose }
}
