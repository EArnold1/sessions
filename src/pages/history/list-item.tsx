import { Link } from "react-router-dom";
import { formatDate, formatDateTime } from "../../lib/time";
import type { SessionWithMeta } from "../../types";
import {
  deleteSession,
  setSessionArchived,
  updateSessionTitle,
} from "../../data/store";
import { HiOutlineDocument } from "react-icons/hi2";
import { CiCalendar, CiClock2 } from "react-icons/ci";
import type { IconType } from "react-icons";
import { Button } from "../../components/button";

const Info = ({ icon: Icon, value }: { icon: IconType; value: string }) => {
  return (
    <p className="text-xs flex gap-x-1 items-end font-medium">
      <Icon className="size-4" />
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
      <div className="flex gap-x-4 items-start">
        <span className="p-2 rounded-md bg-blue-100">
          <HiOutlineDocument className="size-8 text-blue-500" />
        </span>

        <div className="flex flex-col gap-y-1">
          <p className="font-bold text-xl">
            {session.title}
            {session.archived ? <span className="pill">Archived</span> : null}
          </p>

          <Info
            icon={CiCalendar}
            value={`Created ${formatDate(session.createdAt)}`}
          />
          <Info
            icon={CiClock2}
            value={`Last edited ${formatDateTime(session.updatedAt)}`}
          />
        </div>

        {/* progress bar */}
      </div>

      <div className="history-actions">
        <Link to={`/sessions/${session.id}`}>
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
          variant="ghost"
          onClick={() => {
            void handleArchive(session.id, Boolean(session.archived));
          }}
        >
          {session.archived ? "Unarchive" : "Archive"}
        </Button>
        <Button
          variant="danger"
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
