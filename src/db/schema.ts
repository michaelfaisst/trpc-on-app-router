import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable("todos", {
    id: text("id").primaryKey(),
    content: text("content"),
    done: integer("done", { mode: "boolean" })
});
