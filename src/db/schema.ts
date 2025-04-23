import { pgTable, text, uuid } from 'drizzle-orm/pg-core'

export const tables = pgTable('tables', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  csvContent: text('csv_content').notNull(),
  userId: text('user_id').notNull(),
})
