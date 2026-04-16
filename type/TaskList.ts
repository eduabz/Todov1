import { Task } from "./Task";

// Agrupación visual de tasks — solo existe en el frontend por ahora.
// El backend no tiene este concepto todavía.
export type TaskList = {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
  idColor: string;
  idIcon: string;
  createdAt: string; // ISO 8601
  tasks: Task[];
};

// Porcentaje calculado, no almacenado
export function getTaskListProgress(list: TaskList): number {
  if (list.tasks.length === 0) return 0;
  const completed = list.tasks.filter((t) => t.completed).length;
  return Math.round((completed / list.tasks.length) * 100);
}
