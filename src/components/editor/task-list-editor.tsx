import "../../editor-style.css";
import { useEffect, useMemo, useRef } from "react";
import type { TodoItem } from "@/types";
import { replaceTodosForSession } from "@/data/store";
import Document from "@tiptap/extension-document";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import { UndoRedo } from "@tiptap/extensions";
import { taskDocToTodos, todosToTaskDoc } from "@/helpers/tiptapTasks";
import { debounce } from "@/helpers/debounce";

const CustomDocument = Document.extend({
  content: "taskList",
});

const SingleParagraphTaskItem = TaskItem.extend({
  content: "paragraph",
  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitListItem(this.name),
      "Shift-Enter": () => this.editor.commands.splitListItem(this.name),
    };
  },
});

type TaskListEditorProps = {
  sessionId: string;
  todos: TodoItem[];
  setTodos: (todos: TodoItem[]) => void;
  handleSetSession: (updatedAt: number) => void;
  setIsSaving: (value: boolean) => void;
};

export const TaskListEditor = ({
  sessionId,
  todos,
  setTodos,
  handleSetSession,
  setIsSaving,
}: TaskListEditorProps) => {
  const isHydratingRef = useRef(false);
  const skipNextHydrationRef = useRef(false);

  const debouncedPersist = useMemo(
    () =>
      debounce((drafts: ReturnType<typeof taskDocToTodos>) => {
        void (async () => {
          const updatedAt = await replaceTodosForSession(sessionId, drafts);
          handleSetSession(updatedAt);
          setIsSaving(false);
        })();
      }, 400),
    [handleSetSession, sessionId, setIsSaving],
  );

  const editor = useEditor({
    extensions: [
      CustomDocument,
      Paragraph,
      Text,
      TaskList,
      SingleParagraphTaskItem,
      UndoRedo,
    ],
    content: todosToTaskDoc(todos),
    onUpdate: ({ editor: currentEditor }) => {
      if (!sessionId || isHydratingRef.current) {
        return;
      }

      const drafts = taskDocToTodos(currentEditor.getJSON());
      const now = Date.now();
      const nextTodos: TodoItem[] = drafts
        .filter((draft) => draft.text.length > 0)
        .map((draft) => ({
          id: crypto.randomUUID(),
          sessionId,
          text: draft.text,
          checked: draft.checked,
          order: draft.order,
          createdAt: now,
          updatedAt: now,
        }));

      skipNextHydrationRef.current = true;
      setTodos(nextTodos);
      setIsSaving(true);

      debouncedPersist(drafts);
    },
  });

  useEffect(() => {
    return () => {
      debouncedPersist.cancel();
    };
  }, [debouncedPersist]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    if (skipNextHydrationRef.current) {
      skipNextHydrationRef.current = false;
      return;
    }

    isHydratingRef.current = true;
    editor.commands.setContent(todosToTaskDoc(todos), {
      emitUpdate: false,
    });
    isHydratingRef.current = false;
  }, [editor, todos]);

  return <EditorContent editor={editor} />;
};
