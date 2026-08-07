import { formatDateTime } from "@/helpers/date";
import type { Session } from "@/types";
import { SessionProgressLabel } from "@/components/session-progress";

type SessionHeaderProps = {
  session: Session;
  titleDraft: string;
  todosLength: number;
  checkedCount: number;
  setTitleDraft: React.Dispatch<React.SetStateAction<string>>;
  persistTitle: () => Promise<void>;
};

export function SessionHeader({
  titleDraft,
  setTitleDraft,
  session,
  todosLength,
  checkedCount,
  persistTitle,
}: SessionHeaderProps) {
  return (
    <div className="flex flex-col items-center justify-between md:flex-row">
      <div>
        <input
          aria-label="Session title"
          className="w-full rounded-sm bg-transparent p-0 text-3xl font-medium focus:outline-0"
          value={titleDraft}
          onChange={(event) => setTitleDraft(event.target.value)}
          onBlur={() => {
            void persistTitle();
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.currentTarget.blur();
            }
          }}
        />
        <p className="text-xs">Created: {formatDateTime(session.createdAt)}</p>
      </div>

      <SessionProgressLabel
        todosLength={todosLength}
        checkedItems={checkedCount}
      />
    </div>
  );
}
