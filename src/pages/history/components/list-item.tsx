import { useState } from "react";
import { formatDate, formatDateTime } from "@/helpers/date";
import type { SessionWithMeta } from "@/types";
import {
  deleteSession,
  setSessionArchived,
  updateSessionTitle,
} from "@/data/store";
import {
  ArchiveIcon,
  CalendarIcon,
  ClockIcon,
  FileIcon,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SessionProgressLabel } from "@/components/session-progress";
import { LinkButton } from "@/components/link-button";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Badge } from "@/components/ui/badge";

const Info = ({ icon: Icon, value }: { icon: LucideIcon; value: string }) => {
  return (
    <p className="text-muted-foreground flex items-center gap-x-1 text-xs font-medium">
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
  const [titleDraft, setTitleDraft] = useState(session.title);
  const [isSaving, setIsSaving] = useState(false);

  const persistTitle = async () => {
    if (titleDraft.trim() === session.title) {
      return;
    }

    setIsSaving(true);
    await updateSessionTitle(session.id, titleDraft);
    await refresh();
    setIsSaving(false);
  };

  const handleArchive = async () => {
    await setSessionArchived(session.id, !session.archived);
    await refresh();
  };

  const handleDelete = async () => {
    await deleteSession(session.id);
    await refresh();
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-1 items-start gap-x-4">
        <span className="shrink-0 rounded-md bg-blue-100 p-2">
          <FileIcon className="size-8 text-blue-500" />
        </span>

        <div className="flex w-full max-w-sm flex-1 flex-col gap-y-1">
          <input
            aria-label={`Session title: ${session.title}`}
            className="w-full rounded-sm bg-transparent text-xl leading-tight font-bold focus:outline-0"
            value={titleDraft}
            disabled={isSaving}
            onChange={(event) => {
              const value = event.target.value;
              if (value.length > 20) return;
              setTitleDraft(value);
            }}
            onBlur={() => void persistTitle()}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.currentTarget.blur();
              }
            }}
          />

          <Info
            icon={CalendarIcon}
            value={`Created ${formatDate(session.createdAt)}`}
          />
          <Info
            icon={ClockIcon}
            value={`Last edited ${formatDateTime(session.updatedAt)}`}
          />

          {session.archived && (
            <Badge>
              <ArchiveIcon data-icon="inline-start" />
              archived
            </Badge>
          )}

          <div className="mt-4">
            <SessionProgressLabel
              todosLength={session.itemCount}
              checkedItems={session.completedCount}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 sm:w-auto sm:shrink-0">
        <LinkButton
          to={`/?sessionId=${session.id}`}
          aria-label={`Open session ${session.title}`}
          btnProps={{
            variant: "link",
            children: "Open",
          }}
        />
        <ConfirmationDialog
          trigger={
            <Button
              variant="outline"
              aria-label={`${session.archived ? "Unarchive" : "Archive"} session ${session.title}`}
            >
              {session.archived ? "Unarchive" : "Archive"}
            </Button>
          }
          title={`${session.archived ? "Unarchive" : "Archive"} session?`}
          description={`Are you sure you want to ${session.archived ? "unarchive" : "archive"} "${session.title}"?`}
          confirmLabel={session.archived ? "Unarchive" : "Archive"}
          onConfirm={handleArchive}
        />
        <ConfirmationDialog
          trigger={
            <Button
              variant="destructive"
              aria-label={`Delete session ${session.title}`}
            >
              Delete
            </Button>
          }
          title="Delete session?"
          description={`Delete "${session.title}" and all of its tasks? This cannot be undone.`}
          confirmLabel="Delete"
          destructive
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
}
