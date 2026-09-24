export function toDateKey(date) {
  const d = date instanceof Date ? date : new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function todayKey() {
  return toDateKey(new Date())
}

export function addDays(dateKey, delta) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  d.setDate(d.getDate() + delta)
  return toDateKey(d)
}

export function formatDisplayDate(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  const today = todayKey()
  if (dateKey === today) return 'Today'
  if (dateKey === addDays(today, -1)) return 'Yesterday'
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}

export function lastNDayKeys(n, endDateKey = todayKey()) {
  const keys = []
  for (let i = n - 1; i >= 0; i--) {
    keys.push(addDays(endDateKey, -i))
  }
  return keys
}
