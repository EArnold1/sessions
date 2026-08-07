import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getSession,
  listTodosBySession,
  updateSessionTitle,
} from "@/data/store";
import type { Session, TodoItem } from "@/types";
import { TaskListEditor } from "@/components/editor/task-list-editor";
import { SessionHeader } from "./session-header";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { CloudCheck, CloudSync } from "lucide-react";
import { Loader } from "@/components/loader";

type SessionViewProps = {
  sessionId: string;
};

export function SessionView({ sessionId }: SessionViewProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [titleDraft, setTitleDraft] = useState("Untitled");
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
    let active = true;

    const bootstrap = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [loadedSession, loadedTodos] = await Promise.all([
          getSession(sessionId),
          listTodosBySession(sessionId),
        ]);
        if (!active) {
          return;
        }
        setSession(loadedSession ?? null);
        setTitleDraft(loadedSession?.title ?? "Untitled");
        setTodos(loadedTodos);
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError
              : new Error("Unable to load this session"),
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void bootstrap();
    return () => {
      active = false;
    };
  }, [loadSessionData, sessionId]);

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
      <Loader
        variant="panel"
        title="Preparing session"
        message="Loading your checklist and progress"
      />
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Unable to load session"
        description={error.message}
        icon={CloudSync}
        actionProps={{
          to: "/history",
          children: "Return to History",
          btnProps: { size: "sm" },
        }}
      />
    );
  }

  if (!session) {
    return (
      <EmptyState
        title="Session not found"
        description="The requested session does not exist anymore."
        icon={CloudSync}
        actionProps={{
          to: "/history",
          children: "Go to History",
          btnProps: {
            size: "sm",
          },
        }}
      />
    );
  }

  return (
    <Card className="max-h-140 w-full overflow-scroll pt-0 pb-2">
      <CardHeader className="bg-foreground/10 text-foreground p-4">
        <CardTitle>
          <SessionHeader
            titleDraft={titleDraft}
            setTitleDraft={setTitleDraft}
            session={session}
            persistTitle={persistTitle}
            todosLength={todos.length}
            checkedCount={checkedCount}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-135 overflow-scroll p-4">
        <TaskListEditor
          sessionId={session.id}
          todos={todos}
          setTodos={setTodos}
          handleSetSession={handleSetSession}
          setIsSaving={setIsSaving}
          onSaveError={setError}
        />
      </CardContent>
      <CardFooter className="text-muted-foreground w-full items-center gap-x-1 px-4 text-xs">
        {isSaving ? (
          <>
            <CloudSync />
            <p>Saving...</p>
          </>
        ) : (
          <CloudCheck />
        )}
      </CardFooter>
    </Card>
  );
}
