import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listSessions } from "../../data/store";
import type { SessionWithMeta } from "../../types";
import { FaHistory } from "react-icons/fa";
import { HistoryList } from "./list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  return (
    <Card className="w-full w-max-sm py-0">
      <CardHeader className="bg-foreground text-background p-4">
        <CardTitle>
          <h1 className="flex gap-x-2 items-center">
            <FaHistory />
            <span className="font-medium text-xl">Session History</span>
          </h1>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-4 px-1 py-2">
        {sessions.length === 0 ? (
          <div className="empty-state stack-gap">
            <p>No sessions yet.</p>
            <Link to="/" className="btn btn-primary">
              Start your first session
            </Link>
          </div>
        ) : (
          <HistoryList sessions={sessions} refresh={refresh} />
        )}
      </CardContent>
    </Card>
  );
}
