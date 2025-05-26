import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./axios";

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: { task?: string; isDone?: boolean };
    }) => {
      const response = await api.patch(`/todo-lists/${id}`, updates);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};
