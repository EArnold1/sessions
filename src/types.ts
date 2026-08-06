export type Session = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  archived?: boolean;
};

export type TodoItem = {
  id: string;
  sessionId: string;
  text: string;
  checked: boolean;
  order: number;
  createdAt: number;
  updatedAt: number;
};

export type SessionWithMeta = Session & {
  itemCount: number;
  completedCount: number;
};
