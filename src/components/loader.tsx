import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  message?: string;
  variant?: "inline" | "panel";
  className?: string;
};

export const Loader = ({
  title = "Loading",
  message,
  variant = "inline",
  className,
}: Props) => {
  const isPanel = variant === "panel";

  return (
    <Card
      className={cn(
        "border-border/60 shadow-sm motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1 duration-300",
        isPanel && "w-full",
        className,
      )}
    >
      <CardContent
        className={cn(
          "flex items-center gap-3 p-4",
          isPanel && "min-h-32 justify-center p-6",
        )}
        aria-live="polite"
      >
        <Spinner className="size-5 text-muted-foreground" />
        <div className="space-y-0.5">
          <p className="text-sm font-medium leading-tight">{title}</p>
          {message ? (
            <p className="text-sm text-muted-foreground leading-tight">
              {message}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};
