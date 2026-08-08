import { useEffect, useState } from "react";
import { listSessions } from "@/data/store";
import type { SessionWithMeta } from "@/types";
import { RotateCcwClockIcon, SquareXIcon } from "lucide-react";
import { HistoryList } from "@/pages/history/components/list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { Loader } from "@/components/loader";

export function HistoryPage() {
  const [sessions, setSessions] = useState<SessionWithMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = async () => {
    try {
      setError(null);
      setSessions(await listSessions());
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError
          : new Error("Unable to load session history"),
      );
    }
  };

  useEffect(() => {
    let alive = true;

    const run = async () => {
      setIsLoading(true);
      try {
        const data = await listSessions();
        if (alive) {
          setSessions(data);
        }
      } catch (loadError) {
        if (alive) {
          setError(
            loadError instanceof Error
              ? loadError
              : new Error("Unable to load session history"),
          );
        }
      } finally {
        if (alive) {
          setIsLoading(false);
        }
      }
    };

    void run();
    return () => {
      alive = false;
    };
  }, []);

  if (isLoading) {
    return (
      <Loader
        variant="panel"
        title="Preparing history"
        message="Loading your past sessions"
      />
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Unable to load history"
        description={error.message}
        icon={SquareXIcon}
        actionProps={{
          btnProps: { size: "sm", children: "Return home" },
          to: "/",
        }}
      />
    );
  }

  if (!sessions.length) {
    return (
      <EmptyState
        title="No sessions yet."
        description="Add a session to con"
        icon={SquareXIcon}
        actionProps={{
          btnProps: {
            size: "sm",
          },
          to: "/",
          children: "Start a session",
        }}
      />
    );
  }

  return (
    <Card className="h-[calc(100svh-8rem)] w-full gap-y-1 overflow-scroll py-0">
      <CardHeader className="bg-foreground/10 text-foreground p-4">
        <CardTitle>
          <h1 className="flex items-center gap-x-2">
            <RotateCcwClockIcon />
            <span className="text-xl font-medium">Session History</span>
          </h1>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-4 px-1 pb-2">
        <HistoryList sessions={sessions} refresh={refresh} />
      </CardContent>
    </Card>
  );
}
