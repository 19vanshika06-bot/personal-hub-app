import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  category: text("category").notNull(), // e.g., "Chapter 1"
});

export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  mood: text("mood").notNull(), // 😔, 😐, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(), // math, history, task
});

export const workProgress = pgTable("work_progress", {
  id: serial("id").primaryKey(),
  category: text("category").notNull().unique(), // e.g., "Chapter 1 Progress"
  value: integer("value").notNull().default(0),
});

export const calendarDays = pgTable("calendar_days", {
  id: serial("id").primaryKey(),
  date: text("date").notNull().unique(), // YYYY-MM-DD
  isProductive: boolean("is_productive").default(false).notNull(),
});

// === BASE SCHEMAS ===
export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true });
export const insertJournalSchema = createInsertSchema(journalEntries).omit({ id: true, createdAt: true });
export const insertNoteSchema = createInsertSchema(notes).omit({ id: true });
export const insertProgressSchema = createInsertSchema(workProgress).omit({ id: true });
export const insertCalendarDaySchema = createInsertSchema(calendarDays).omit({ id: true });

// === EXPLICIT API CONTRACT TYPES ===
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = z.infer<typeof insertJournalSchema>;

export type Note = typeof notes.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;

export type WorkProgress = typeof workProgress.$inferSelect;
export type InsertWorkProgress = z.infer<typeof insertProgressSchema>;

export type CalendarDay = typeof calendarDays.$inferSelect;
export type InsertCalendarDay = z.infer<typeof insertCalendarDaySchema>;
