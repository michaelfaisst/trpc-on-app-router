import Database from "better-sqlite3";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { nanoid } from "nanoid";
import { z } from "zod";

import { todos } from "@/db/schema";
import { publicProcedure, router } from "./trpc";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite);

migrate(db, { migrationsFolder: "drizzle" });

export const appRouter = router({
    getTodos: publicProcedure.query(async () => {
        return await db.select().from(todos);
    }),
    addTodo: publicProcedure.input(z.string()).mutation(async (opts) => {
        await db
            .insert(todos)
            .values({ id: nanoid(), content: opts.input, done: false });

        return true;
    }),
    setDone: publicProcedure
        .input(z.object({ id: z.string(), done: z.boolean() }))
        .mutation(async (opts) => {
            const { id, done } = opts.input;
            await db.update(todos).set({ done }).where(eq(todos.id, id));

            return true;
        })
});

export type AppRouter = typeof appRouter;
