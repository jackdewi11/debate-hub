import { describe, it, expect } from 'vitest'

type DebateResult = {
  id: string
  studentId: string
  score: number
  rank: number
}

function getResultsForStudent(studentId: string, results: DebateResult[]) {
  return results.filter((result) => result.studentId === studentId)
}

describe('student results visibility', () => {
  const results = [
    { id: 'r1', studentId: '1', score: 5, rank: 2 },
    { id: 'r2', studentId: '2', score: 4, rank: 3 },
    { id: 'r3', studentId: '1', score: 6, rank: 1 }
  ]

  it('shows the logged-in student only their own results', () => {
    const studentResults = getResultsForStudent('1', results)
    expect(studentResults.length).toBe(2)
    expect(studentResults.every((result) => result.studentId === '1')).toBe(true)
  })

  it('does not show another student’s results', () => {
    const studentResults = getResultsForStudent('1', results)
    expect(studentResults.some((result) => result.studentId === '2')).toBe(false)
  })
})