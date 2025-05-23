"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { TodoItem } from "@/components/todo-item"
import { TodoForm } from "@/components/todo-form"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { fetchTodos } from "@/lib/api"
import type { Todo } from "@/lib/types"

export function TodoList() {
  const [isAddingTodo, setIsAddingTodo] = useState(false)

  const {
    data: todos,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  })

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error instanceof Error ? error.message : "Failed to load todos"}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <TodoForm onSuccess={() => setIsAddingTodo(false)} isOpen={isAddingTodo} onOpenChange={setIsAddingTodo} />

      <div className="space-y-4">
        {todos && todos.length > 0 ? (
          todos.map((todo: Todo) => <TodoItem key={todo.id} todo={todo} />)
        ) : (
          <div className="text-center py-10 text-muted-foreground">No todos found. Create your first todo!</div>
        )}
      </div>
    </div>
  )
}
