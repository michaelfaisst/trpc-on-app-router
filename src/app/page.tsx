import Image from "next/image";

import TodoList from "@/app/_components/todo-list";
import { serverClient } from "./_trpc/server-client";

export default async function Home() {
    const todos = await serverClient.getTodos();

    return (
        <main className="mx-auto mt-5 max-w-3xl">
            <TodoList initialTodos={todos} />
        </main>
    );
}
