"use client";

import { redirect } from "next/navigation";
import { TodoList } from "@/components/todo-list";
import { getAuthToken } from "@/lib/auth";

export default function Home() {
  // Check if user is authenticated
  const token = getAuthToken();

  if (!token) {
    redirect("/login");
  }

  return (
    <main className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Todo List</h1>
      <TodoList />
    </main>
  );
}
