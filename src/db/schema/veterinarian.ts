import { int, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core'

export const veterinarians = mysqlTable('veterinarians', {
  id: int('id').autoincrement().primaryKey().notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password_hash: varchar('password_hash', { length: 255 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
})

export type Veterinary = typeof veterinarians.$inferSelect
export type NewVeterinary = typeof veterinarians.$inferInsert
