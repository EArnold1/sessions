import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listSessions } from "@/data/store";
import type { SessionWithMeta } from "@/types";
import { RotateCcwClockIcon } from "lucide-react";
import { HistoryList } from "@/pages/history/components/list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";

export function HistoryPage() {
  const [sessions, setSessions] = useState<SessionWithMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = async () => {
    setSessions(await listSessions());
  };

  useEffect(() => {
    let alive = true;

    const run = async () => {
      setIsLoading(true);
      const data = await listSessions();
      if (alive) {
        setSessions(data);
        setIsLoading(false);
      }
    };

    void run();
    return () => {
      alive = false;
    };
  }, []);

  if (isLoading) {
    return (
      <section className="panel">
        <p>Loading history...</p>
      </section>
    );
  }

  if (!sessions.length) {
    return (
      <EmptyState
        title="No sessions yet."
        description="Add a session to con"
        icon="SquareX"
        actionBtn={{
          size: "sm",
          render: <Link to="/">Start your first session</Link>,
        }}
      />
    );
  }

  return (
    <Card className="w-full w-max-sm py-0 h-fit max-h-150 overflow-scroll gap-y-1">
      <CardHeader className="bg-foreground text-background p-4">
        <CardTitle>
          <h1 className="flex gap-x-2 items-center">
            <RotateCcwClockIcon />
            <span className="font-medium text-xl">Session History</span>
          </h1>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-4 px-1 pb-2">
        <HistoryList sessions={sessions} refresh={refresh} />
      </CardContent>
    </Card>
  );
}
