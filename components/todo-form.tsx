"use client"

import type React from "react"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlusCircle } from "lucide-react"
import { createTodo, updateTodo } from "@/lib/api"
import type { Todo } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

const todoSchema = z.object({
  task: z.string().min(1, "Task is required"),
})

interface TodoFormProps {
  todo?: Todo
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
}

export function TodoForm({ todo, isOpen, onOpenChange, onSuccess }: TodoFormProps) {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const isEditing = !!todo

  const [task, setTask] = useState(todo?.task || "")
  const [error, setError] = useState<string | null>(null)

  const createMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
      setTask("")
      onSuccess?.()
      toast({
        title: "Todo created",
        description: "Your todo has been created successfully.",
      })
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create todo",
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
      setTask("")
      onSuccess?.()
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate the form
    try {
      todoSchema.parse({ task })
      setError(null)

      if (isEditing && todo) {
        updateMutation.mutate({
          id: todo.id,
          data: { task },
        })
      } else {
        createMutation.mutate({ task })
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0]?.message || "Invalid input")
      }
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Update Todo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Todo" : "Add Todo"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="task" className="text-sm font-medium">
              Task
            </label>
            <Input
              id="task"
              name="task"
              value={task}
              onChange={(e) => {
                setTask(e.target.value)
                if (error) {
                  // Clear error when user starts typing
                  setError(null)
                }
              }}
              placeholder="Enter your task"
              required
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !task.trim()}>
              {isPending ? (isEditing ? "Updating..." : "Creating...") : isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
