import { formatDateTime } from "@/helpers/date";
import type { Session } from "@/types";

type SessionHeaderProps = {
  session: Session;
  titleDraft: string;
  setTitleDraft: React.Dispatch<React.SetStateAction<string>>;
  persistTitle: () => Promise<void>;
};

export function SessionHeader({
  titleDraft,
  setTitleDraft,
  session,
  persistTitle,
}: SessionHeaderProps) {
  return (
    <div className="flex md:flex-row flex-col justify-between">
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
      <div className="text-xs">
        <p>Created: {formatDateTime(session.createdAt)}</p>
      </div>
    </div>
  );
}
