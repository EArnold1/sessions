import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  addTodo,
  deleteTodo,
  getSession,
  listTodosBySession,
  toggleTodo,
  updateSessionTitle,
} from "../data/store";
import { formatDateTime } from "../lib/time";
import type { Session, TodoItem } from "../types";

export function SessionPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState<Session | null>(null);
  const [titleDraft, setTitleDraft] = useState("Untitled");
  const [newTodoText, setNewTodoText] = useState("");
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingTitle, setIsSavingTitle] = useState(false);

  const checkedCount = useMemo(
    () => todos.filter((todo) => todo.checked).length,
    [todos],
  );

  const loadSessionData = async (id: string) => {
    const [loadedSession, loadedTodos] = await Promise.all([
      getSession(id),
      listTodosBySession(id),
    ]);

    if (!loadedSession) {
      setSession(null);
      setTodos([]);
      return;
    }

    setSession(loadedSession);
    setTitleDraft(loadedSession.title);
    setTodos(loadedTodos);
  };

  useEffect(() => {
    if (!sessionId) {
      navigate("/", { replace: true });
      return;
    }

    let alive = true;
    const bootstrap = async () => {
      setIsLoading(true);
      await loadSessionData(sessionId);
      if (alive) {
        setIsLoading(false);
      }
    };

    void bootstrap();
    return () => {
      alive = false;
    };
  }, [navigate, sessionId]);

  const handleAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!sessionId) {
      return;
    }

    const created = await addTodo(sessionId, newTodoText);
    if (created) {
      setNewTodoText("");
      await loadSessionData(sessionId);
    }
  };

  const handleToggle = async (todoId: string, checked: boolean) => {
    if (!sessionId) {
      return;
    }
    await toggleTodo(todoId, checked);
    await loadSessionData(sessionId);
  };

  const handleDeleteTodo = async (todoId: string) => {
    if (!sessionId) {
      return;
    }
    await deleteTodo(todoId);
    await loadSessionData(sessionId);
  };

  const persistTitle = async () => {
    if (!sessionId || !session) {
      return;
    }

    if (titleDraft.trim() === session.title) {
      return;
    }

    setIsSavingTitle(true);
    try {
      await updateSessionTitle(sessionId, titleDraft);
      await loadSessionData(sessionId);
    } finally {
      setIsSavingTitle(false);
    }
  };

  if (isLoading) {
    return (
      <section className="panel">
        <p>Loading session...</p>
      </section>
    );
  }

  if (!session) {
    return (
      <section className="panel stack-gap">
        <h1 className="panel-title">Session not found</h1>
        <p>The requested session does not exist anymore.</p>
        <Link to="/history" className="btn btn-ghost">
          Go to History
        </Link>
      </section>
    );
  }

  return (
    <section className="panel stack-gap">
      <div className="session-header">
        <input
          aria-label="Session title"
          className="session-title-input"
          value={titleDraft}
          onChange={(event) => setTitleDraft(event.target.value)}
          onBlur={() => {
            void persistTitle();
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.currentTarget.blur();
            }
          }}
        />
        <div className="session-meta">
          <p>Created: {formatDateTime(session.createdAt)}</p>
          <p>Last edited: {formatDateTime(session.updatedAt)}</p>
          <p>{isSavingTitle ? "Saving..." : "Saved locally"}</p>
        </div>
      </div>

      <form className="todo-form" onSubmit={handleAddTodo}>
        <input
          className="todo-input"
          placeholder="Add a TODO and press Enter"
          value={newTodoText}
          onChange={(event) => setNewTodoText(event.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Add
        </button>
      </form>

      <div className="list-meta">
        <span>
          {checkedCount}/{todos.length} complete
        </span>
      </div>

      <ul className="todo-list" aria-label="Todo items">
        {todos.length === 0 ? (
          <li className="todo-empty">No TODOs yet. Add one above to start.</li>
        ) : null}

        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <label className="todo-check-wrap">
              <input
                type="checkbox"
                checked={todo.checked}
                onChange={(event) => {
                  void handleToggle(todo.id, event.target.checked);
                }}
              />
              <span
                className={todo.checked ? "todo-text checked" : "todo-text"}
              >
                {todo.text}
              </span>
            </label>

            <button
              type="button"
              className="icon-btn"
              onClick={() => {
                void handleDeleteTodo(todo.id);
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
