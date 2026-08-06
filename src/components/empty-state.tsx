import { icons } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Card, CardContent } from "@/components/ui/card";
import { LinkButton, type LinkButtonProps } from "@/components/link-button";

type Props = {
  title: string;
  description: string;
  actionProps: LinkButtonProps;
  icon: keyof typeof icons;
};

export function EmptyState({ title, description, actionProps, icon }: Props) {
  const Icon = icons[icon];

  return (
    <Card>
      <CardContent>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Icon />
            </EmptyMedia>
            <EmptyTitle>{title}</EmptyTitle>
            <EmptyDescription>{description}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="flex-row justify-center gap-2">
            <LinkButton {...actionProps} />
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  );
}
