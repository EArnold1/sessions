import { Link, type LinkProps } from "react-router-dom";
import { Button, type ButtonProps } from "@/components/ui/button";

export type LinkButtonProps = LinkProps & {
  btnProps: Omit<ButtonProps, "render">;
};

export const LinkButton = ({ btnProps, ...linkProps }: LinkButtonProps) => (
  <Button {...btnProps} nativeButton={false} render={<Link {...linkProps} />} />
);
