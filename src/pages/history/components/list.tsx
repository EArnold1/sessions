import type { SessionWithMeta } from "@/types";
import { HistoryListItem } from "@/pages/history/components/list-item";

type HistoryListProps = {
  sessions: SessionWithMeta[];

  refresh: () => Promise<void>;
};

export function HistoryList({ sessions, refresh }: HistoryListProps) {
  return (
    <div className="m-4 flex flex-col gap-y-8">
      {sessions.map((session) => (
        <HistoryListItem key={session.id} session={session} refresh={refresh} />
      ))}
    </div>
  );
}
