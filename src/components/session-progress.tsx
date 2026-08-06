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
  return (
    <Progress
      value={(checkedItems / todosLength) * 100}
      className="w-full max-w-xs"
    >
      <ProgressLabel>{`${checkedItems}/${todosLength} complete`}</ProgressLabel>
      <ProgressValue />
    </Progress>
  );
}
