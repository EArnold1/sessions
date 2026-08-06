import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listSessions } from "../../data/store";
import type { SessionWithMeta } from "../../types";
import { FaHistory } from "react-icons/fa";
import { HistoryList } from "./list";

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
    <section className="flex flex-col gap-y-4 shadow-xl bg-white rounded-md">
      <div className="flex md:flex-row flex-col justify-between bg-black px-4 py-6 text-white md:items-center rounded-t-md">
        <h1 className="flex gap-x-2 items-center">
          <FaHistory />
          <span className="font-medium text-xl">Session History</span>
        </h1>
      </div>

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
    </section>
  );
}
