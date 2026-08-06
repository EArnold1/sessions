import { Button, type ButtonProps } from "@/components/ui/button";
import { icons } from "lucide-react";

export type IconButtonProps = Omit<ButtonProps, "render"> & {
  icon: keyof typeof icons;
  iconClass?: string;
};

export const IconButton = ({
  icon,
  children,
  ...btnProps
}: IconButtonProps) => {
  const Icon = icons[icon];
  return (
    <Button {...btnProps} className="flex gap-x-2">
      <Icon name={icon} />
      {children}
    </Button>
  );
};
