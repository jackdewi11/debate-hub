export function isValidCongressScore(score: number | null) {
  return Number.isInteger(score) && score >= 1 && score <= 6;
}