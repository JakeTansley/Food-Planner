import type { Day } from '@/types/meal'

export const DAYS: Day[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

export const DAY_LABELS: Record<Day, string> = {
  monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu',
  friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
}

function getLondonNow(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/London' }))
}

export function getCurrentWeekStart(): string {
  const now = getLondonNow()
  const dayOfWeek = now.getDay()
  const hours = now.getHours()
  const date = new Date(now)

  // Sunday after 12pm = start showing next week for planning
  if (dayOfWeek === 0 && hours >= 12) {
    date.setDate(date.getDate() + 1)
  } else {
    const daysBack = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    date.setDate(date.getDate() - daysBack)
  }

  date.setHours(0, 0, 0, 0)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function formatWeekRange(weekStartStr: string): string {
  const [year, month, day] = weekStartStr.split('-').map(Number)
  const start = new Date(year, month - 1, day)
  const end = new Date(year, month - 1, day + 6)
  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  return `${fmt(start)} – ${fmt(end)}`
}

export function getNextDay(day: Day): Day | null {
  const idx = DAYS.indexOf(day)
  return idx < DAYS.length - 1 ? DAYS[idx + 1] : null
}
