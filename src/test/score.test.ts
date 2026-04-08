import { describe, it, expect } from 'vitest'
import { isValidCongressScore } from './score'

describe('Congress score validation', () => {
  it('accepts valid scores', () => {
    expect(isValidCongressScore(1)).toBe(true)
    expect(isValidCongressScore(4)).toBe(true)
    expect(isValidCongressScore(6)).toBe(true)
  })

  it('rejects invalid scores', () => {
    expect(isValidCongressScore(0)).toBe(false)
    expect(isValidCongressScore(7)).toBe(false)
    expect(isValidCongressScore(null)).toBe(false)
  })
})