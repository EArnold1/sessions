import Dexie, { type Table } from "dexie";
import type { Session, TodoItem } from "@/types";

class TodoSessionsDb extends Dexie {
  sessions!: Table<Session, string>;
  todos!: Table<TodoItem, string>;

  constructor() {
    super("todoSessionsDb");
    this.version(1).stores({
      sessions: "id, title, createdAt, updatedAt, archived",
      todos:
        "id, sessionId, order, checked, createdAt, updatedAt, [sessionId+order]",
    });
  }
}

export const db = new TodoSessionsDb();
