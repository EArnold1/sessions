import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getSession,
  listTodosBySession,
  updateSessionTitle,
} from "@/data/store";
import type { Session, TodoItem } from "@/types";
import { TaskListEditor } from "@/components/editor/task-list-editor";
import { SessionHeader } from "./session-header";
import { SessionProgressLabel } from "@/components/session-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";

type SessionViewProps = {
  sessionId: string;
};

export function SessionView({ sessionId }: SessionViewProps) {
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

  const loadSessionData = useCallback(async () => {
    const [loadedSession, loadedTodos] = await Promise.all([
      getSession(sessionId),
      listTodosBySession(sessionId),
    ]);

    if (!loadedSession) {
      setSession(null);
      setTodos([]);
      return;
    }

    setSession(loadedSession);
    setTitleDraft(loadedSession.title);
    setTodos(loadedTodos);
  }, [sessionId]);

  useEffect(() => {
    let alive = true;

    const bootstrap = async () => {
      setIsLoading(true);
      await loadSessionData();
      if (alive) {
        setIsLoading(false);
      }
    };

    void bootstrap();
    return () => {
      alive = false;
    };
  }, [loadSessionData]);

  const persistTitle = async () => {
    if (!session) {
      return;
    }

    if (titleDraft.trim() === session.title) {
      return;
    }

    await updateSessionTitle(sessionId, titleDraft);
    await loadSessionData();
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
      <EmptyState
        title="Session not found"
        description="The requested session does not exist anymore."
        icon="SquareX"
        actionBtn={{
          size: "sm",
          render: <Link to="/history">Go to History</Link>,
        }}
      />
    );
  }

  return (
    <Card className="w-full w-max-sm py-0">
      <CardHeader className="bg-foreground text-background p-4">
        <CardTitle>
          <SessionHeader
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
          {saveStatus === "saving" ? "Saving changes..." : "All changes saved"}
        </p>

        <SessionProgressLabel
          todosLength={todos.length}
          checkedItems={checkedCount}
        />
      </CardContent>
    </Card>
  );
}
