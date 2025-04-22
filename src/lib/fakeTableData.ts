// Define the structure for a single cell in the table
export type TableCell =
  | {
      content?: never;
      isEditable: true;
      expectedKeywords?: string[];
    }
  | {
      content: string;
      isEditable: false;
      expectedKeywords?: string[];
    };

export interface TableData {
  id: number;
  rows: TableCell[][];
}

const fakeDataStore = [
  {
    id: 1,
    rows: [
      [
        { isEditable: false, content: '' },
        { isEditable: false, content: 'Vertebrates' },
        { isEditable: false, content: 'Invertebrates' },
      ],
      [
        { isEditable: false, content: 'Mammals' },
        { isEditable: true, expectedKeywords: ['dog', 'cat', 'whale'] },
        { isEditable: true, expectedKeywords: ['snail', 'ant'] },
      ],
      [
        { isEditable: false, content: 'Birds' },
        { isEditable: true, expectedKeywords: ['eagle', 'sparrow'] },
        { isEditable: false, content: 'N/A' },
      ],
      [
        { isEditable: false, content: 'Insects' },
        { isEditable: false, content: 'N/A' },
        { isEditable: true, expectedKeywords: ['bee', 'butterfly'] },
      ],
    ],
  },
  {
    id: 2,
    rows: [
      [
        { isEditable: false, content: 'Country' },
        { isEditable: false, content: 'Capital' },
      ],
      [
        { isEditable: false, content: 'France' },
        { isEditable: true, expectedKeywords: ['paris'] },
      ],
      [
        { isEditable: false, content: 'Germany' },
        { isEditable: true, expectedKeywords: ['berlin'] },
      ],
      [
        { isEditable: false, content: 'Spain' },
        { isEditable: true, expectedKeywords: ['madrid'] },
      ],
    ],
  },
] as const satisfies TableData[];

export function getFakeTableData(tableId: string): TableData | undefined {
  return fakeDataStore.find((table) => table.id.toString() === tableId);
}
