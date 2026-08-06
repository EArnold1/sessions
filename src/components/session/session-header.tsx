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
    <div className="flex md:flex-row flex-col justify-between items-center">
      <div>
        <input
          aria-label="Session title"
          className="text-3xl font-medium bg-transparent focus:outline-none p-0"
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
