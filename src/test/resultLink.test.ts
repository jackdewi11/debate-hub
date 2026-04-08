import { describe, it, expect } from 'vitest'

type DebateResult = {
  id: string
  studentName: string
  score: number
  rank: number
}

type Student = {
  id: string
  fullName: string
}

function linkResultsToStudent(student: Student, results: DebateResult[]) {
  return results.filter(
    (result) =>
      result.studentName.trim().toLowerCase() ===
      student.fullName.trim().toLowerCase()
  )
}

describe('result linking', () => {
  const student = { id: '1', fullName: 'Jack DeWitt' }

  const results = [
    { id: 'r1', studentName: 'Jack DeWitt', score: 5, rank: 2 },
    { id: 'r2', studentName: 'Emma Smith', score: 4, rank: 3 },
    { id: 'r3', studentName: 'Jack DeWitt', score: 6, rank: 1 }
  ]

  it('links all matching results to the correct student', () => {
    const linkedResults = linkResultsToStudent(student, results)
    expect(linkedResults.length).toBe(2)
    expect(linkedResults[0].studentName).toBe('Jack DeWitt')
    expect(linkedResults[1].studentName).toBe('Jack DeWitt')
  })

  it('does not link results from other students', () => {
    const linkedResults = linkResultsToStudent(student, results)
    expect(linkedResults.some((r) => r.studentName === 'Emma Smith')).toBe(false)
  })
})