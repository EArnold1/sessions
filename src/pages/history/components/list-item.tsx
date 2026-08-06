import { Link } from "react-router-dom";
import { formatDate, formatDateTime } from "@/helpers/date";
import type { SessionWithMeta } from "@/types";
import {
  deleteSession,
  setSessionArchived,
  updateSessionTitle,
} from "@/data/store";
import { FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SessionProgressLabel } from "@/components/session-progress";
import { icons } from "lucide-react";

const Info = ({ icon, value }: { icon: keyof typeof icons; value: string }) => {
  const Comp = icons[icon];
  return (
    <p className="flex items-center gap-x-1 text-xs font-medium text-muted-foreground">
      <Comp className="size-4" />
      {value}
    </p>
  );
};

type HistoryListItemProps = {
  session: SessionWithMeta;
  refresh: () => Promise<void>;
};

export function HistoryListItem({ session, refresh }: HistoryListItemProps) {
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

  return (
    <div className="flex justify-between items-center">
      <div className="flex min-w-0 flex-1 items-start gap-x-4">
        <span className="shrink-0 rounded-md bg-blue-100 p-2">
          <FileIcon className="size-8 text-blue-500" />
        </span>

        <div className="w-full max-w-sm flex-1 space-y-1">
          <p className="text-xl font-bold leading-tight truncate">
            {session.title}
          </p>

          <Info
            icon="Calendar"
            value={`Created ${formatDate(session.createdAt)}`}
          />
          <Info
            icon="Clock"
            value={`Last edited ${formatDateTime(session.updatedAt)}`}
          />

          <div className="mt-4">
            <SessionProgressLabel
              todosLength={session.itemCount}
              checkedItems={session.completedCount}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-x-2 w-full sm:w-auto sm:shrink-0">
        <Link to={`/?sessionId=${session.id}`}>
          <Button variant="link">Open</Button>
        </Link>
        <Button
          variant="ghost"
          onClick={() => {
            void handleRename(session.id, session.title);
          }}
        >
          Rename
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            void handleArchive(session.id, Boolean(session.archived));
          }}
        >
          {session.archived ? "Unarchive" : "Archive"}
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            void handleDelete(session.id);
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
