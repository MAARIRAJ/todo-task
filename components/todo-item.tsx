"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Pencil, Trash2 } from "lucide-react"
import { TodoForm } from "@/components/todo-form"
import { deleteTodo, updateTodo } from "@/lib/api"
import type { Todo } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface TodoItemProps {
  todo: Todo
}

export function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const updateMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
      toast({
        title: "Todo updated",
        description: "Your todo has been updated successfully.",
      })
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update todo",
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
      toast({
        title: "Todo deleted",
        description: "Your todo has been deleted successfully.",
      })
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete todo",
      })
    },
  })

  const handleToggleComplete = () => {
    updateMutation.mutate({
      id: todo.id,
      data: { isDone: !todo.isDone },
    })
  }

  const handleDelete = () => {
    deleteMutation.mutate(todo.id)
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Checkbox
              id={`todo-${todo.id}`}
              checked={todo.isDone}
              onCheckedChange={handleToggleComplete}
              disabled={updateMutation.isPending}
            />
            <label
              htmlFor={`todo-${todo.id}`}
              className={`text-sm font-medium ${todo.isDone ? "line-through text-muted-foreground" : ""}`}
            >
              {todo.task}
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              disabled={deleteMutation.isPending || updateMutation.isPending}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete} disabled={deleteMutation.isPending}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <TodoForm todo={todo} isOpen={isEditing} onOpenChange={setIsEditing} onSuccess={() => setIsEditing(false)} />
    </>
  )
}
