import "../../editor-style.css";
import type { TodoItem } from "../../types";
import { replaceTodosForSession } from "../../data/store";
import Document from "@tiptap/extension-document";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import { taskDocToTodos } from "../../lib/tiptapTasks";

const CustomDocument = Document.extend({
  content: "taskList",
});

const CustomTaskItem = TaskItem.extend({
  content: "inline*",
});

type TaskListEditorProps = {
  sessionId: string;
  setTodos: (todos: TodoItem[]) => void;
  handleSetSession: (updatedAt: number) => void;
  setSaveStatus: (status: "saving" | "saved") => void;
  ignoreEditorUpdateRef: React.MutableRefObject<boolean>;
  saveTimerRef: React.MutableRefObject<number | null>;
};

export const TaskListEditor = ({
  sessionId,
  setTodos,
  handleSetSession,
  setSaveStatus,
  ignoreEditorUpdateRef,
  saveTimerRef,
}: TaskListEditorProps) => {
  const editor = useEditor({
    extensions: [CustomDocument, Paragraph, Text, TaskList, CustomTaskItem],
    content: `
      <ul data-type="taskList">
        <li data-type="taskItem">just doo it</li>
      </ul>
    `,
    onUpdate: ({ editor: currentEditor }) => {
      if (!sessionId || ignoreEditorUpdateRef.current) {
        return;
      }

      const drafts = taskDocToTodos(currentEditor.getJSON());
      const nextTodos: TodoItem[] = drafts
        .filter((draft) => draft.text.length > 0)
        .map((draft) => ({
          id: crypto.randomUUID(),
          sessionId,
          text: draft.text,
          checked: draft.checked,
          order: draft.order,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }));

      setTodos(nextTodos);

      setSaveStatus("saving");
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }

      saveTimerRef.current = window.setTimeout(() => {
        void (async () => {
          const updatedAt = await replaceTodosForSession(sessionId, drafts);
          handleSetSession(updatedAt);
          setSaveStatus("saved");
        })();
      }, 400);
    },
  });

  return <EditorContent editor={editor} />;
};
