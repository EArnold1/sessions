import { icons } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  title: string;
  description: string;
  actionBtn: ButtonProps;
  icon: keyof typeof icons;
};

export function EmptyState({ title, description, actionBtn, icon }: Props) {
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
            <Button {...actionBtn} />
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  );
}
