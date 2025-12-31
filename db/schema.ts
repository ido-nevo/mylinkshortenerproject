import { pgTable, integer, text, varchar, timestamp, index } from 'drizzle-orm/pg-core';

export const linksTable = pgTable(
  'links',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: text('user_id').notNull(),
    url: text('url').notNull(),
    shortCode: varchar('short_code', { length: 20 }).notNull().unique(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .notNull()
      .defaultNow(),
  },
  (table) => [index('user_id_idx').on(table.userId)]
);

// TypeScript types
export type InsertLink = typeof linksTable.$inferInsert;
export type SelectLink = typeof linksTable.$inferSelect;
