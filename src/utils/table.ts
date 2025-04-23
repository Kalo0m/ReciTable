import { TableCell, TableRow, TableStructure } from '~/lib/fakeTableData'

export function normalizeString(str: string): string {
  if (!str) return ''
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

export function parseCSVToTableStructure(csv: string): TableStructure {
  const lines = csv
    .trim()
    .split('\n')
    .map((line) => line.split(';').map((cell) => cell.trim()))

  const headers = lines[0].slice(1) // Skip first column (row labels)
  const rows: TableRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i]
    const label = row[0]
    const cells: TableCell[] = []

    // Tirer un index aléatoire (dans les colonnes sauf la première)
    const editableCellIndex = Math.floor(Math.random() * (row.length - 1)) + 1

    for (let j = 1; j < row.length; j++) {
      const rawValue = row[j]
      const keywords = Array.from(rawValue.matchAll(/\*\*(.*?)\*\*/g)).map(
        (m) => m[1],
      )
      const cleanValue = rawValue.replace(/\*\*(.*?)\*\*/g, '$1')

      if (j === editableCellIndex) {
        cells.push({
          value: cleanValue,
          editable: true,
          keywords,
        })
      } else {
        cells.push({
          value: cleanValue,
          editable: false,
        })
      }
    }

    rows.push({ label, cells })
  }

  return {
    headers,
    rows,
  }
}

export function levenshteinDistance(s1: string, s2: string): number {
  const track = Array(s2.length + 1)
    .fill(null)
    .map(() => Array(s1.length + 1).fill(null))

  for (let i = 0; i <= s1.length; i += 1) {
    track[0][i] = i
  }
  for (let j = 0; j <= s2.length; j += 1) {
    track[j][0] = j
  }

  for (let j = 1; j <= s2.length; j += 1) {
    for (let i = 1; i <= s1.length; i += 1) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator,
      )
    }
  }
  if (s2.length === 0) return s1.length
  if (s1.length === 0) return s2.length
  return track[s2.length][s1.length]
}

export type ValidationResult = 'exact' | 'typo' | 'incorrect'

export function checkAnswer(
  userInput: string,
  keywords: string[],
  threshold: number = 1,
): ValidationResult {
  if (!keywords || keywords.length === 0) return 'incorrect'
  const normalizedInput = normalizeString(userInput)
  if (!normalizedInput) return 'incorrect'
  const inputWords = normalizedInput
    .split(/\s+/)
    .filter((word) => word.length > 0)
  if (inputWords.length === 0) return 'incorrect'
  const normalizedKeywords = keywords
    .map(normalizeString)
    .filter((k) => k.length > 0)
  if (normalizedKeywords.length === 0) return 'incorrect'

  let bestMatchStatus: ValidationResult = 'incorrect'

  for (const inputWord of inputWords) {
    for (const keyword of normalizedKeywords) {
      const distance = levenshteinDistance(inputWord, keyword)
      if (distance === 0) {
        return 'exact'
      } else if (distance <= threshold) {
        bestMatchStatus = 'typo'
      }
    }
  }
  return bestMatchStatus
}
