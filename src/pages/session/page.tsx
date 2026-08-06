import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getSession,
  listTodosBySession,
  updateSessionTitle,
} from "../../data/store";
import type { Session, TodoItem } from "../../types";
import { TaskListEditor } from "../../components/editor/task-list-editor";
import { Header } from "./components/header";
import { SessionProgressLabel } from "@/components/session-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SessionPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState<Session | null>(null);
  const [titleDraft, setTitleDraft] = useState("Untitled");
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [saveStatus, setSaveStatus] = useState<"saving" | "saved">("saved");
  const [isLoading, setIsLoading] = useState(true);

  const checkedCount = useMemo(
    () => todos.filter((todo) => todo.checked).length,
    [todos],
  );

  const handleSetSession = useCallback((updatedAt: number) => {
    setSession((previous) => {
      if (!previous) {
        return previous;
      }
      return { ...previous, updatedAt };
    });
  }, []);

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

  const persistTitle = async () => {
    if (!sessionId || !session) {
      return;
    }

    if (titleDraft.trim() === session.title) {
      return;
    }

    try {
      await updateSessionTitle(sessionId, titleDraft);
      await loadSessionData(sessionId);
    } finally {
      //
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
    <div>
      <Card className="w-full w-max-sm py-0">
        <CardHeader className="bg-foreground text-background p-4">
          <CardTitle>
            <Header
              titleDraft={titleDraft}
              setTitleDraft={setTitleDraft}
              session={session}
              persistTitle={persistTitle}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-4 p-4">
          <TaskListEditor
            sessionId={session.id}
            todos={todos}
            setTodos={setTodos}
            handleSetSession={handleSetSession}
            setSaveStatus={setSaveStatus}
          />

          <p className="text-xs text-muted-foreground" aria-live="polite">
            {saveStatus === "saving"
              ? "Saving changes..."
              : "All changes saved"}
          </p>

          <SessionProgressLabel
            todosLength={todos.length}
            checkedItems={checkedCount}
          />
        </CardContent>
      </Card>
    </div>
  );
}
