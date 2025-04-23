export type TableCell =
  | {
      value: string
      keywords: string[]
      editable: true
    }
  | {
      value: string
      editable: false
    }

export type TableRow = {
  label: string
  cells: TableCell[]
}

export type TableStructure = {
  headers: string[]
  rows: TableRow[]
}
