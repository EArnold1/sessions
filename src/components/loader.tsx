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
        "border-border/60 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1 shadow-sm duration-300",
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
        <Spinner className="text-muted-foreground size-5" />
        <div className="space-y-0.5">
          <p className="text-sm leading-tight font-medium">{title}</p>
          {message ? (
            <p className="text-muted-foreground text-sm leading-tight">
              {message}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};
