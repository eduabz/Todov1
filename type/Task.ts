export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  completedAt: string | null;
  userId: string;
  priority: Priority;
  dueDate: string | null;   // ISO date "YYYY-MM-DD"
  listId: string | null;
  tags: string | null;      // comma-separated: "trabajo,personal"
};

export type CreateTaskRequest = {
  title: string;
  description: string;
  priority?: Priority;
  dueDate?: string | null;
  listId?: string | null;
  tags?: string | null;
};

export type UpdateTaskRequest = {
  title: string;
  description: string;
  priority?: Priority;
  dueDate?: string | null;
  listId?: string | null;
  tags?: string | null;
};

export type TaskList = {
  id: string;
  title: string;
  color: string;
  icon: string;
  userId: string;
  createdAt: string;
};

export type CreateTaskListRequest = {
  title: string;
  color?: string;
  icon?: string;
};

export type Subtask = {
  id: string;
  title: string;
  completed: boolean;
  todoId: string;
  createdAt: string;
};
