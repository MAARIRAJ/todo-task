
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./axios";

export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: string) => {
      const res = await api.post("/todo-lists", { task }); 
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] }); 
    },
  });
};
