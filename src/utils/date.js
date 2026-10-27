// Date-only helpers for the booking calendar.
//
// Every date the backend exchanges is a plain YYYY-MM-DD day. new Date("YYYY-MM-DD")
// parses that as UTC midnight, so in a browser west of India it reads back as the
// PREVIOUS day and every weekday, minimum-date and price-tier decision shifts by one.
// toISOString() then re-serialises in UTC and the shift becomes visible to the guest.
// These helpers construct local midights instead and never call toISOString.

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function pad(n) {
  return String(n).padStart(2, '0')
}

// parseDay reads "YYYY-MM-DD" (or a full timestamp) as a local date at midnight.
export function parseDay(value) {
  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate())
  }
  const match = String(value ?? '').slice(0, 10).split('-').map(Number)
  if (match.length !== 3 || match.some((n) => !Number.isFinite(n))) {
    return null
  }
  const [year, month, day] = match
  return new Date(year, month - 1, day)
}

export function formatDay(date) {
  if (!date) return ''
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function addDays(date, days) {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  next.setDate(next.getDate() + days)
  return next
}

// addMonths always lands on the 1st of the target month. Calling setMonth on a date
// whose day-of-month does not exist in the target month (31 January + 1 month) makes
// JavaScript roll into March and the calendar silently skips a month.
export function addMonths(year, month, delta) {
  return new Date(year, month + delta, 1)
}

export function startOfToday() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

export function daysBetween(from, to) {
  const a = parseDay(from)
  const b = parseDay(to)
  if (!a || !b) return 0
  return Math.round((b - a) / 86400000)
}

// Weekends are Saturday and Sunday. This must stay in step with PriceBooking on the
// server, or the nightly quotes disagree with the amount charged.
export function isWeekendDay(date) {
  const day = date.getDay()
  return day === 0 || day === 6
}

export function eachDay(from, to) {
  const days = []
  let cursor = parseDay(from)
  const end = parseDay(to)
  if (!cursor || !end) return days
  while (cursor < end) {
    days.push(cursor)
    cursor = addDays(cursor, 1)
  }
  return days
}

export function formatDateLabel(value) {
  const date = parseDay(value)
  if (!date) return ''
  return `${pad(date.getDate())} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`
}
