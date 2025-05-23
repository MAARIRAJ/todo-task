import { z } from "zod"

// Zod schema for Todo
export const todoSchema = z.object({
  id: z.string(),
  task: z.string(),
  isDone: z.boolean().default(false),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

// Zod schema for Todo input
export const todoInputSchema = z.object({
  task: z.string().min(1, "Task is required"),
  isDone: z.boolean().optional(),
})

// TypeScript types derived from Zod schemas
export type Todo = z.infer<typeof todoSchema>
export type TodoInput = z.infer<typeof todoInputSchema>
