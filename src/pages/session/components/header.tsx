import { formatDateTime } from "../../../lib/time";
import type { Session } from "../../../types";

type Props = {
  session: Session;
  titleDraft: string;
  setTitleDraft: React.Dispatch<React.SetStateAction<string>>;
  persistTitle: () => Promise<void>;
};

export const Header = ({
  titleDraft,
  setTitleDraft,
  session,
  persistTitle,
}: Props) => {
  return (
    <div className="flex md:flex-row flex-col justify-between bg-black p-4 text-white md:items-center rounded-t-md">
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
};
