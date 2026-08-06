import type { SessionWithMeta } from "../../types";
import { HistoryListItem } from "./list-item";

type HistoryListProps = {
  sessions: SessionWithMeta[];

  refresh: () => Promise<void>;
};

export function HistoryList({ sessions, refresh }: HistoryListProps) {
  return (
    <div className="flex flex-col gap-y-6 m-4">
      {sessions.map((session) => (
        <HistoryListItem key={session.id} session={session} refresh={refresh} />
      ))}
    </div>
  );
}
