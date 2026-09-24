import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { addDays, formatDisplayDate, lastNDayKeys, toDateKey, todayKey } from './date'

describe('toDateKey', () => {
  it('formats a Date as YYYY-MM-DD', () => {
    expect(toDateKey(new Date(2026, 0, 5))).toBe('2026-01-05')
  })

  it('accepts a date-parseable string', () => {
    expect(toDateKey('2026-03-15T12:00:00')).toBe('2026-03-15')
  })
})

describe('addDays', () => {
  it('adds positive days', () => {
    expect(addDays('2026-01-30', 3)).toBe('2026-02-02')
  })

  it('subtracts days when delta is negative', () => {
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
  })
})

describe('todayKey / formatDisplayDate', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 5, 15))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('todayKey returns the current date key', () => {
    expect(todayKey()).toBe('2026-06-15')
  })

  it('formatDisplayDate labels today', () => {
    expect(formatDisplayDate('2026-06-15')).toBe('Today')
  })

  it('formatDisplayDate labels yesterday', () => {
    expect(formatDisplayDate('2026-06-14')).toBe('Yesterday')
  })

  it('formatDisplayDate falls back to a formatted date for other days', () => {
    expect(formatDisplayDate('2026-06-10')).toBe(
      new Date(2026, 5, 10).toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
    )
  })
})

describe('lastNDayKeys', () => {
  it('returns n consecutive keys ending at the given date, oldest first', () => {
    expect(lastNDayKeys(3, '2026-01-05')).toEqual(['2026-01-03', '2026-01-04', '2026-01-05'])
  })

  it('defaults to ending today', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 10))
    expect(lastNDayKeys(2)).toEqual(['2026-01-09', '2026-01-10'])
    vi.useRealTimers()
  })
})
