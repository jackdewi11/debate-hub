import { describe, it, expect } from 'vitest'

type Student = {
  id: string
  fullName: string
}

function findMatchingStudent(nameEnteredByJudge: string, students: Student[]) {
  return students.find(
    (student) =>
      student.fullName.trim().toLowerCase() ===
      nameEnteredByJudge.trim().toLowerCase()
  ) || null
}

describe('student name matching', () => {
  const students: Student[] = [
    { id: '1', fullName: 'Jack DeWitt' },
    { id: '2', fullName: 'Emma Smith' }
  ]

  it('matches a registered student when the judge enters the same name', () => {
    const result = findMatchingStudent('Jack DeWitt', students)
    expect(result).not.toBeNull()
    expect(result?.id).toBe('1')
  })

  it('matches regardless of capitalization or extra spaces', () => {
    const result = findMatchingStudent('  jack dewitt  ', students)
    expect(result).not.toBeNull()
    expect(result?.id).toBe('1')
  })

  it('returns null if no registered student matches', () => {
    const result = findMatchingStudent('Michael Brown', students)
    expect(result).toBeNull()
  })
})