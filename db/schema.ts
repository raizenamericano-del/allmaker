import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  // bigint,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const operations = mysqlTable("operations", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 255 }),
  tool: varchar("tool", { length: 100 }).notNull(),
  fileName: varchar("fileName", { length: 500 }),
  fileSize: varchar("fileSize", { length: 50 }),
  operationType: varchar("operationType", { length: 100 }).notNull(),
  status: mysqlEnum("status", ["success", "error", "processing"]).default("processing").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Operation = typeof operations.$inferSelect;
export type InsertOperation = typeof operations.$inferInsert;

export const fileHistory = mysqlTable("file_history", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 255 }),
  originalName: varchar("originalName", { length: 500 }).notNull(),
  toolUsed: varchar("toolUsed", { length: 100 }).notNull(),
  fileSize: varchar("fileSize", { length: 50 }),
  mimeType: varchar("mimeType", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FileHistory = typeof fileHistory.$inferSelect;
export type InsertFileHistory = typeof fileHistory.$inferInsert;

export const analytics = mysqlTable("analytics", {
  id: serial("id").primaryKey(),
  tool: varchar("tool", { length: 100 }).notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  count: serial("count"),
  date: timestamp("date").defaultNow().notNull(),
});

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = typeof analytics.$inferInsert;
//
// Example:
// export const posts = mysqlTable("posts", {
//   id: serial("id").primaryKey(),
//   title: varchar("title", { length: 255 }).notNull(),
//   content: text("content"),
//   createdAt: timestamp("created_at").notNull().defaultNow(),
// });
//
// Note: FK columns referencing a serial() PK must use:
//   bigint("columnName", { mode: "number", unsigned: true }).notNull()
