import { getAuthToken } from "@/lib/auth"
import type { Todo, TodoInput } from "@/lib/types"

const API_BASE_URL = "https://crudify.dev/api/v1"

// Helper function to handle API requests
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken()

  if (!token) {
    throw new Error("Authentication token is missing")
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `API request failed with status ${response.status}`)
  }

  // For DELETE requests, return empty object as success
  if (response.status === 204) {
    return {} as T
  }

  return response.json()
}

// Fetch all todos
export async function fetchTodos(): Promise<Todo[]> {
  return apiRequest<Todo[]>("/todo-lists")
}

// Fetch a single todo
export async function fetchTodo(id: string): Promise<Todo> {
  return apiRequest<Todo>(`/todo-lists/${id}`)
}

// Create a new todo
export async function createTodo(data: TodoInput): Promise<Todo> {
  return apiRequest<Todo>("/todo-lists", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// Update a todo
export async function updateTodo({
  id,
  data,
}: {
  id: string
  data: Partial<TodoInput>
}): Promise<Todo> {
  return apiRequest<Todo>(`/todo-lists/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

// Delete a todo
export async function deleteTodo(id: string): Promise<void> {
  return apiRequest<void>(`/todo-lists/${id}`, {
    method: "DELETE",
  })
}
