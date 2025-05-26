import { useState } from "react";
import { useTodos } from "./api/useTodos";
import { useCreateTodo } from "./api/useCreateTodo";
import { useDeleteTodo } from "./api/useDeleteTodo";
import { useUpdateTodo } from "./api/useUpdateTodo";

import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Checkbox } from "./components/ui/checkbox";

function App() {
  const [newTask, setNewTask] = useState("");
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const { data, isLoading, isError } = useTodos();
  const createTodo = useCreateTodo();
  const deleteTodo = useDeleteTodo();
  const updateTodo = useUpdateTodo();

  const handleAdd = () => {
    if (newTask.trim() === "") return;
    createTodo.mutate(newTask, {
      onSuccess: () => setNewTask(""),
    });
  };

  const handleDelete = (id: string) => {
    deleteTodo.mutate(id);
  };

  const handleUpdate = (id: string) => {
    if (editText.trim() === "") return;
    updateTodo.mutate({ id, updates: { task: editText } });
    setEditTaskId(null);
    setEditText("");
  };

  if (isLoading) return <p className="text-center">Loading tasks...</p>;
  if (isError)
    return <p className="text-center text-red-500">❌ Failed to load tasks.</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        📝 Todo Task Manager
      </h2>

      <div className="flex gap-3 mb-6">
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter new task"
        />
        <Button onClick={handleAdd}>Add</Button>
      </div>

      <div className="space-y-4">
        {data?.map((task: any) => (
          <Card key={task.id}>
            <CardContent className="flex items-center justify-between py-3 gap-3">
              <div className="flex items-center gap-3 flex-1">
                <Checkbox id={`check-${task.id}`} />
                {editTaskId === task.id ? (
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1"
                  />
                ) : (
                  <label htmlFor={`check-${task.id}`} className="text-sm">
                    {task.task}
                  </label>
                )}
              </div>

              <div className="flex gap-2">
                {editTaskId === task.id ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleUpdate(task.id)}
                    >
                      💾
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => setEditTaskId(null)}
                    >
                      ❌
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setEditTaskId(task.id);
                        setEditText(task.task);
                      }}
                    >
                      ✏️
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(task.id)}
                    >
                      🗑️
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default App;
