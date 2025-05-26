import { useQuery } from '@tanstack/react-query';
import { api } from './axios';

export const useTodos = () => {
  return useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const res = await api.get('/todo-lists');
      return res.data; 
    },
  });
};
