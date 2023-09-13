"use client";

import { useState } from "react";

import { trpc } from "../_trpc/client";
import { serverClient } from "../_trpc/server-client";

interface Props {
    initialTodos: Awaited<ReturnType<(typeof serverClient)["getTodos"]>>;
}

const TodoList = ({ initialTodos }: Props) => {
    const getTodos = trpc.getTodos.useQuery(undefined, {
        initialData: initialTodos,
        refetchOnMount: false,
        refetchOnReconnect: false
    });

    const addTodo = trpc.addTodo.useMutation({
        onSettled: () => {
            getTodos.refetch();
        }
    });

    const setDone = trpc.setDone.useMutation({
        onSettled: () => {
            getTodos.refetch();
        }
    });

    const [content, setContent] = useState("");

    return (
        <div>
            <div className="my-5 text-3xl">
                {getTodos.data?.map((todo) => (
                    <div key={todo.id} className="flex items-center gap-3">
                        <input
                            id={`check-${todo.id}`}
                            type="checkbox"
                            checked={!!todo.done}
                            style={{ zoom: 1.5 }}
                            onChange={async () => {
                                setDone.mutate({
                                    id: todo.id,
                                    done: !todo.done
                                });
                            }}
                        />
                        <label htmlFor={`check-${todo.id}`}>
                            {todo.content}
                        </label>
                    </div>
                ))}
            </div>
            <div>
                <label htmlFor="content" className="block">
                    Content
                </label>
                <input
                    id="content"
                    value={content}
                    placeholder="What needs to be done?"
                    onChange={(e) => setContent(e.target.value)}
                    className="block flex-grow rounded-md border-gray-300 bg-white px-4 py-2 text-black shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <button
                    onClick={async () => {
                        if (content.length) {
                            addTodo.mutate(content);
                            setContent("");
                        }
                    }}
                    className="mt-4 rounded-full bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                >
                    Add Todo
                </button>
            </div>
        </div>
    );
};

export default TodoList;
