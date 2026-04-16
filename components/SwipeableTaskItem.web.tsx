// Web fallback — no gesture handler, just a plain TaskItem wrapper
import { TaskItem } from "@/components/TaskItem";
import { Task } from "@/type/Task";

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (task: Task) => void;
};

export function SwipeableTaskItem({ task, onToggle, onDelete, onEdit }: Props) {
  return <TaskItem task={task} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />;
}
