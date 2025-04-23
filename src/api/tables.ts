import { createMiddleware, createServerFn } from '@tanstack/react-start'
import { z } from 'vinxi'
import {
  queryOptions,
  useMutation,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { db } from '~/db'
import { tables } from '~/db/schema'
import { getAuth } from '@clerk/tanstack-react-start/server'
import { getWebRequest } from '@tanstack/react-start/server'
import { eq } from 'drizzle-orm'
import { parseCSVToTableStructure } from '~/utils/table'

const authMiddleware = createMiddleware().server(async ({ next }) => {
  const { userId } = await getAuth(getWebRequest()!)
  if (!userId) throw new Error('Not authenticated')
  return next({ context: { userId } })
})

const createTable = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(
    z.object({
      csvContent: z.string(),
      tableName: z.string(),
    }),
  )
  .handler(({ data: { csvContent, tableName }, context: { userId } }) => {
    return db
      .insert(tables)
      .values({ csvContent, slug: tableName, userId })
      .returning()
  })

const getTables = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { userId } = context
    return db.select().from(tables).where(eq(tables.userId, userId))
  })

export const getTable = createServerFn({ method: 'GET' })
  .validator(z.object({ tableId: z.string() }))
  .handler(async ({ data: { tableId } }) => {
    const result = await db.select().from(tables).where(eq(tables.id, tableId))
    if (!result.length) throw new Error('Table not found')
    const [table] = result
    const structuredTable = parseCSVToTableStructure(table.csvContent)

    return {
      ...table,
      structuredTable,
    }
  })

export const useTablesQuery = () => {
  return useSuspenseQuery(tableOptions.tables)
}

export const useCreateTableMutation = () => {
  return useMutation({
    mutationFn: (params: Parameters<typeof createTable>[0]['data']) =>
      createTable({ data: params }),
  })
}

export const tableOptions = {
  tables: queryOptions({ queryKey: ['tables'], queryFn: getTables }),
} as const
