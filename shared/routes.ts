import { z } from 'zod';
import { 
  insertTaskSchema, tasks, 
  insertJournalSchema, journalEntries, 
  insertNoteSchema, notes, 
  insertProgressSchema, workProgress,
  insertCalendarDaySchema, calendarDays
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  tasks: {
    list: {
      method: 'GET' as const,
      path: '/api/tasks',
      responses: {
        200: z.array(z.custom<typeof tasks.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/tasks',
      input: insertTaskSchema,
      responses: {
        201: z.custom<typeof tasks.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/tasks/:id',
      input: insertTaskSchema.partial(),
      responses: {
        200: z.custom<typeof tasks.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/tasks/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  journal: {
    list: {
      method: 'GET' as const,
      path: '/api/journal',
      responses: {
        200: z.array(z.custom<typeof journalEntries.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/journal',
      input: insertJournalSchema,
      responses: {
        201: z.custom<typeof journalEntries.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  notes: {
    list: {
      method: 'GET' as const,
      path: '/api/notes',
      responses: {
        200: z.array(z.custom<typeof notes.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/notes',
      input: insertNoteSchema,
      responses: {
        201: z.custom<typeof notes.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  progress: {
    list: {
      method: 'GET' as const,
      path: '/api/progress',
      responses: {
        200: z.array(z.custom<typeof workProgress.$inferSelect>()),
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/progress/:category',
      input: z.object({ value: z.number() }),
      responses: {
        200: z.custom<typeof workProgress.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  calendar: {
    list: {
      method: 'GET' as const,
      path: '/api/calendar',
      responses: {
        200: z.array(z.custom<typeof calendarDays.$inferSelect>()),
      },
    },
    update: {
      method: 'POST' as const,
      path: '/api/calendar',
      input: insertCalendarDaySchema,
      responses: {
        200: z.custom<typeof calendarDays.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
