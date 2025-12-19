import { db } from "./db";
import {
  tasks, journalEntries, notes, workProgress, calendarDays,
  type Task, type InsertTask,
  type JournalEntry, type InsertJournalEntry,
  type Note, type InsertNote,
  type WorkProgress, type InsertWorkProgress,
  type CalendarDay, type InsertCalendarDay
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Tasks
  getTasks(): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, updates: Partial<InsertTask>): Promise<Task>;
  deleteTask(id: number): Promise<void>;

  // Journal
  getJournalEntries(): Promise<JournalEntry[]>;
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;

  // Notes
  getNotes(): Promise<Note[]>;
  createNote(note: InsertNote): Promise<Note>;

  // Progress
  getProgress(): Promise<WorkProgress[]>;
  updateProgress(category: string, value: number): Promise<WorkProgress>;

  // Calendar
  getCalendarDays(): Promise<CalendarDay[]>;
  updateCalendarDay(day: InsertCalendarDay): Promise<CalendarDay>;
}

export class DatabaseStorage implements IStorage {
  // Tasks
  async getTasks(): Promise<Task[]> {
    return await db.select().from(tasks).orderBy(tasks.id);
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }

  async updateTask(id: number, updates: Partial<InsertTask>): Promise<Task> {
    const [updated] = await db.update(tasks)
      .set(updates)
      .where(eq(tasks.id, id))
      .returning();
    return updated;
  }

  async deleteTask(id: number): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  // Journal
  async getJournalEntries(): Promise<JournalEntry[]> {
    return await db.select().from(journalEntries).orderBy(journalEntries.createdAt);
  }

  async createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry> {
    const [newEntry] = await db.insert(journalEntries).values(entry).returning();
    return newEntry;
  }

  // Notes
  async getNotes(): Promise<Note[]> {
    return await db.select().from(notes);
  }

  async createNote(note: InsertNote): Promise<Note> {
    const [newNote] = await db.insert(notes).values(note).returning();
    return newNote;
  }

  // Progress
  async getProgress(): Promise<WorkProgress[]> {
    return await db.select().from(workProgress);
  }

  async updateProgress(category: string, value: number): Promise<WorkProgress> {
    // Upsert
    const [existing] = await db.select().from(workProgress).where(eq(workProgress.category, category));
    
    if (existing) {
      const [updated] = await db.update(workProgress)
        .set({ value })
        .where(eq(workProgress.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(workProgress)
        .values({ category, value })
        .returning();
      return created;
    }
  }

  // Calendar
  async getCalendarDays(): Promise<CalendarDay[]> {
    return await db.select().from(calendarDays);
  }

  async updateCalendarDay(day: InsertCalendarDay): Promise<CalendarDay> {
    const [existing] = await db.select().from(calendarDays).where(eq(calendarDays.date, day.date));

    if (existing) {
      const [updated] = await db.update(calendarDays)
        .set({ isProductive: day.isProductive })
        .where(eq(calendarDays.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(calendarDays)
        .values(day)
        .returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
