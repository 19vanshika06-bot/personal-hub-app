import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // === Tasks ===
  app.get(api.tasks.list.path, async (req, res) => {
    const tasks = await storage.getTasks();
    res.json(tasks);
  });

  app.post(api.tasks.create.path, async (req, res) => {
    const input = api.tasks.create.input.parse(req.body);
    const task = await storage.createTask(input);
    res.status(201).json(task);
  });

  app.put(api.tasks.update.path, async (req, res) => {
    const input = api.tasks.update.input.parse(req.body);
    const task = await storage.updateTask(Number(req.params.id), input);
    res.json(task);
  });

  app.delete(api.tasks.delete.path, async (req, res) => {
    await storage.deleteTask(Number(req.params.id));
    res.status(204).send();
  });

  // === Journal ===
  app.get(api.journal.list.path, async (req, res) => {
    const entries = await storage.getJournalEntries();
    res.json(entries);
  });

  app.post(api.journal.create.path, async (req, res) => {
    const input = api.journal.create.input.parse(req.body);
    const entry = await storage.createJournalEntry(input);
    res.status(201).json(entry);
  });

  // === Notes ===
  app.get(api.notes.list.path, async (req, res) => {
    const notes = await storage.getNotes();
    res.json(notes);
  });

  app.post(api.notes.create.path, async (req, res) => {
    const input = api.notes.create.input.parse(req.body);
    const note = await storage.createNote(input);
    res.status(201).json(note);
  });

  // === Progress ===
  app.get(api.progress.list.path, async (req, res) => {
    const progress = await storage.getProgress();
    res.json(progress);
  });

  app.put(api.progress.update.path, async (req, res) => {
    const { value } = api.progress.update.input.parse(req.body);
    const progress = await storage.updateProgress(req.params.category, value);
    res.json(progress);
  });

  // === Calendar ===
  app.get(api.calendar.list.path, async (req, res) => {
    const days = await storage.getCalendarDays();
    res.json(days);
  });

  app.post(api.calendar.update.path, async (req, res) => {
    const input = api.calendar.update.input.parse(req.body);
    const day = await storage.updateCalendarDay(input);
    res.json(day);
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingTasks = await storage.getTasks();
  if (existingTasks.length === 0) {
    await storage.createTask({ title: "Tutorial Watched", isCompleted: true, category: "Chapter 1" });
    await storage.createTask({ title: "Notes Made", isCompleted: true, category: "Chapter 1" });
    await storage.createTask({ title: "Practice Questions", isCompleted: false, category: "Chapter 1" });
    await storage.createTask({ title: "PYQs Completed", isCompleted: false, category: "Chapter 1" });
    await storage.createTask({ title: "Revision Done", isCompleted: false, category: "Chapter 1" });
  }

  const existingNotes = await storage.getNotes();
  if (existingNotes.length === 0) {
    await storage.createNote({ title: "Math Note", content: "Formula for integration...", type: "math" });
    await storage.createNote({ title: "History Note", content: "Dates of the war...", type: "history" });
    await storage.createNote({ title: "Task Note", content: "Buy new pens.", type: "task" });
  }

  const existingProgress = await storage.getProgress();
  if (existingProgress.length === 0) {
    await storage.updateProgress("Chapter 1 Progress", 45);
  }
}
