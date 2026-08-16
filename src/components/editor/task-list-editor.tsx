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
  addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        default: null,
      },
    };
  },
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
  onSaveError: (error: Error) => void;
};

export const TaskListEditor = ({
  sessionId,
  todos,
  setTodos,
  handleSetSession,
  setIsSaving,
  onSaveError,
}: TaskListEditorProps) => {
  const isHydratingRef = useRef(false);
  const skipNextHydrationRef = useRef(false);

  const debouncedPersist = useMemo(
    () =>
      debounce((drafts: ReturnType<typeof taskDocToTodos>) => {
        void replaceTodosForSession(sessionId, drafts)
          .then((updatedAt) => {
            handleSetSession(updatedAt);
            setIsSaving(false);
          })
          .catch((error: unknown) => {
            onSaveError(
              error instanceof Error
                ? error
                : new Error("Unable to save tasks"),
            );
            setIsSaving(false);
          });
      }, 400),
    [handleSetSession, onSaveError, sessionId, setIsSaving],
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
      const nextTodos: TodoItem[] = drafts
        .filter((draft) => draft.text.length > 0)
        .map((draft) => ({
          ...draft,
          sessionId,
          createdAt:
            todos.find((todo) => todo.id === draft.id)?.createdAt ?? Date.now(),
          updatedAt:
            todos.find((todo) => todo.id === draft.id)?.updatedAt ?? Date.now(),
        }));

      skipNextHydrationRef.current = true;
      setTodos(nextTodos);
      setIsSaving(true);

      debouncedPersist(drafts);
    },
  });

  useEffect(() => {
    return () => {
      debouncedPersist.flush();
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
