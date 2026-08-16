import { db } from "../db";
import type { Session, SessionWithMeta, TodoItem } from "../types";

const DEFAULT_SESSION_TITLE = "Untitled";

export async function createSession(): Promise<Session> {
  const now = Date.now();
  const session: Session = {
    id: crypto.randomUUID(),
    title: DEFAULT_SESSION_TITLE,
    createdAt: now,
    updatedAt: now,
    archived: false,
  };

  await db.sessions.add(session);
  return session;
}

export async function getSession(
  sessionId: string,
): Promise<Session | undefined> {
  return db.sessions.get(sessionId);
}

export async function listSessions(): Promise<SessionWithMeta[]> {
  const sessions = await db.sessions.orderBy("updatedAt").reverse().toArray();
  const todos = await db.todos.toArray();
  const counts = new Map<
    string,
    { itemCount: number; completedCount: number }
  >();

  for (const todo of todos) {
    const current = counts.get(todo.sessionId) ?? {
      itemCount: 0,
      completedCount: 0,
    };
    current.itemCount += 1;
    current.completedCount += Number(todo.checked);
    counts.set(todo.sessionId, current);
  }

  return sessions.map((session) => ({
    ...session,
    ...(counts.get(session.id) ?? { itemCount: 0, completedCount: 0 }),
  }));
}

export async function updateSessionTitle(
  sessionId: string,
  title: string,
): Promise<void> {
  const normalized = title.trim() || DEFAULT_SESSION_TITLE;
  await db.sessions.update(sessionId, {
    title: normalized,
    updatedAt: Date.now(),
  });
}

// TODO: rename to archiveSession
export async function setSessionArchived(
  sessionId: string,
  archived: boolean,
): Promise<void> {
  await db.sessions.update(sessionId, {
    archived,
    updatedAt: Date.now(),
  });
}

export async function deleteSession(sessionId: string): Promise<void> {
  await db.transaction("rw", db.sessions, db.todos, async () => {
    await db.sessions.delete(sessionId);
    await db.todos.where("sessionId").equals(sessionId).delete();
  });
}

export async function listTodosBySession(
  sessionId: string,
): Promise<TodoItem[]> {
  return db.todos.where("sessionId").equals(sessionId).sortBy("order");
}

export async function addTodo(
  sessionId: string,
  text: string,
): Promise<TodoItem | undefined> {
  const normalized = text.trim();
  if (!normalized) {
    return undefined;
  }

  const lastTodo = await db.todos.where("sessionId").equals(sessionId).last();
  const now = Date.now();

  const todo: TodoItem = {
    id: crypto.randomUUID(),
    sessionId,
    text: normalized,
    checked: false,
    order: lastTodo ? lastTodo.order + 1 : 1,
    createdAt: now,
    updatedAt: now,
  };

  await db.transaction("rw", db.sessions, db.todos, async () => {
    await db.todos.add(todo);
    await db.sessions.update(sessionId, { updatedAt: now });
  });

  return todo;
}

export async function toggleTodo(
  todoId: string,
  checked: boolean,
): Promise<void> {
  const todo = await db.todos.get(todoId);
  if (!todo) {
    return;
  }

  const now = Date.now();
  await db.transaction("rw", db.sessions, db.todos, async () => {
    await db.todos.update(todoId, { checked, updatedAt: now });
    await db.sessions.update(todo.sessionId, { updatedAt: now });
  });
}

export async function deleteTodo(todoId: string): Promise<void> {
  const todo = await db.todos.get(todoId);
  if (!todo) {
    return;
  }

  const now = Date.now();
  await db.transaction("rw", db.sessions, db.todos, async () => {
    await db.todos.delete(todoId);
    await db.sessions.update(todo.sessionId, { updatedAt: now });
  });
}

export type TodoDraft = {
  id: string;
  text: string;
  checked: boolean;
  order: number;
};

export async function replaceTodosForSession(
  sessionId: string,
  drafts: TodoDraft[],
): Promise<number> {
  const now = Date.now();
  const normalizedDrafts = drafts
    .map((draft, index) => ({
      id: draft.id,
      text: draft.text.trim(),
      checked: draft.checked,
      order: index + 1,
    }))
    .filter((draft) => draft.text.length > 0);

  await db.transaction("rw", db.sessions, db.todos, async () => {
    const existingTodos = await db.todos
      .where("sessionId")
      .equals(sessionId)
      .toArray();
    const existingById = new Map(existingTodos.map((todo) => [todo.id, todo]));
    const todos = normalizedDrafts.map((draft) => {
      const existing = draft.id ? existingById.get(draft.id) : undefined;

      return {
        id: existing?.id ?? draft.id,
        sessionId,
        text: draft.text,
        checked: draft.checked,
        order: draft.order,
        createdAt: existing?.createdAt ?? now,
        updatedAt: existing ? now : now,
      };
    });
    const nextIds = new Set(todos.map((todo) => todo.id));
    const deletedIds = existingTodos
      .filter((todo) => !nextIds.has(todo.id))
      .map((todo) => todo.id);
    const changedTodos = todos.filter((todo) => {
      const existing = existingById.get(todo.id);
      return (
        !existing ||
        existing.text !== todo.text ||
        existing.checked !== todo.checked ||
        existing.order !== todo.order
      );
    });

    if (deletedIds.length > 0) {
      await db.todos.bulkDelete(deletedIds);
    }
    if (changedTodos.length > 0) {
      await db.todos.bulkPut(changedTodos);
    }
    if (deletedIds.length > 0 || changedTodos.length > 0) {
      await db.sessions.update(sessionId, { updatedAt: now });
    }
  });

  return now;
}
