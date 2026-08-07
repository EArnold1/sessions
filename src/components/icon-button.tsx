import { Button, type ButtonProps } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

export type IconButtonProps = Omit<ButtonProps, "render"> & {
  icon: LucideIcon;
  iconClass?: string;
};

export const IconButton = ({
  icon,
  children,
  ...btnProps
}: IconButtonProps) => {
  const Icon = icon;
  return (
    <Button {...btnProps} className="flex gap-x-2">
      <Icon />
      {children}
    </Button>
  );
};
