import type { JSONContent } from "@tiptap/react";
import type { TodoDraft } from "../data/store";
import type { TodoItem } from "../types";

type TaskNode = {
  type: string;
  attrs?: {
    checked?: boolean;
  };
  content?: TaskNode[];
  text?: string;
};

function collectTaskItems(node: TaskNode, out: TaskNode[]): void {
  if (node.type === "taskItem") {
    out.push(node);
  }

  if (!node.content) {
    return;
  }

  for (const child of node.content) {
    collectTaskItems(child, out);
  }
}

function extractText(node: TaskNode): string {
  if (typeof node.text === "string") {
    return node.text;
  }

  if (!node.content || node.content.length === 0) {
    return "";
  }

  return node.content.map((child) => extractText(child)).join("");
}

export function todosToTaskDoc(todos: TodoItem[]): JSONContent {
  const items = todos.length > 0 ? todos : [];

  return {
    type: "doc",
    content: [
      {
        type: "taskList",
        content:
          items.length > 0
            ? items.map((todo) => ({
                type: "taskItem",
                attrs: { checked: todo.checked },
                content: [
                  {
                    type: "paragraph",
                    content: todo.text
                      ? [
                          {
                            type: "text",
                            text: todo.text,
                          },
                        ]
                      : [],
                  },
                ],
              }))
            : [
                {
                  type: "taskItem",
                  attrs: { checked: false },
                  content: [
                    {
                      type: "paragraph",
                    },
                  ],
                },
              ],
      },
    ],
  };
}

export function taskDocToTodos(doc: JSONContent): TodoDraft[] {
  const root = doc as TaskNode;
  const taskNodes: TaskNode[] = [];
  collectTaskItems(root, taskNodes);

  return taskNodes.map((node, index) => ({
    text: extractText(node).trim(),
    checked: Boolean(node.attrs?.checked),
    order: index + 1,
  }));
}
