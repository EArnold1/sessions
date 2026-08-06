import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteSession,
  listSessions,
  setSessionArchived,
  updateSessionTitle,
} from "../data/store";
import { formatDate, formatDateTime } from "../lib/time";
import type { SessionWithMeta } from "../types";

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

  const handleRename = async (id: string, currentTitle: string) => {
    const nextTitle = window.prompt("Rename session", currentTitle);
    if (nextTitle === null) {
      return;
    }

    await updateSessionTitle(id, nextTitle);
    await refresh();
  };

  const handleArchive = async (id: string, archived: boolean) => {
    await setSessionArchived(id, !archived);
    await refresh();
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this session and all todos?");
    if (!confirmed) {
      return;
    }

    await deleteSession(id);
    await refresh();
  };

  if (isLoading) {
    return (
      <section className="panel">
        <p>Loading history...</p>
      </section>
    );
  }

  return (
    <section className="panel stack-gap">
      <h1 className="panel-title">Session History</h1>

      {sessions.length === 0 ? (
        <div className="empty-state stack-gap">
          <p>No sessions yet.</p>
          <Link to="/" className="btn btn-primary">
            Start your first session
          </Link>
        </div>
      ) : (
        <ul className="history-list">
          {sessions.map((session) => (
            <li key={session.id} className="history-item">
              <div>
                <p className="history-title">
                  {session.title}
                  {session.archived ? (
                    <span className="pill">Archived</span>
                  ) : null}
                </p>
                <p className="history-meta">
                  Created {formatDate(session.createdAt)}
                </p>
                <p className="history-meta">
                  Last edited {formatDateTime(session.updatedAt)}
                </p>
                <p className="history-meta">
                  {session.completedCount}/{session.itemCount} complete
                </p>
              </div>

              <div className="history-actions">
                <Link className="btn btn-ghost" to={`/sessions/${session.id}`}>
                  Open
                </Link>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    void handleRename(session.id, session.title);
                  }}
                >
                  Rename
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    void handleArchive(session.id, Boolean(session.archived));
                  }}
                >
                  {session.archived ? "Unarchive" : "Archive"}
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    void handleDelete(session.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
