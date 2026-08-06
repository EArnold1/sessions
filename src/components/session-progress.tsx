import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress.tsx";

export function SessionProgressLabel({
  todosLength,
  checkedItems,
}: {
  todosLength: number;
  checkedItems: number;
}) {
  const progress = todosLength === 0 ? 0 : (checkedItems / todosLength) * 100;

  return (
    <Progress value={progress} className="w-full max-w-xs">
      <ProgressLabel>{`${checkedItems}/${todosLength} complete`}</ProgressLabel>
      <ProgressValue className="text-background" />
    </Progress>
  );
}
