import type { Meta, StoryObj } from "@storybook/react-native";
import { TaskItem } from "./TaskItem";

const TASK_PENDING = {
  id: "1",
  title: "Estudiar para el examen",
  description: "Repasar capítulos 3 y 4",
  completed: false,
  userId: "user-1",
};

const TASK_COMPLETED = {
  id: "2",
  title: "Entregar proyecto final",
  description: "Subir al portal antes de las 11pm",
  completed: true,
  userId: "user-1",
};

const TASK_LONG = {
  id: "3",
  title: "Revisar todos los pull requests pendientes del equipo de desarrollo",
  description: "Incluye los PRs de autenticación, base de datos y frontend",
  completed: false,
  userId: "user-1",
};

const meta: Meta<typeof TaskItem> = {
  title: "Tareas/TaskItem",
  component: TaskItem,
  args: {
    onToggle: () => {},
    onDelete: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Pendiente: Story = {
  args: { task: TASK_PENDING },
};

export const Completada: Story = {
  args: { task: TASK_COMPLETED },
};

export const TituloLargo: Story = {
  args: { task: TASK_LONG },
};

export const SinDescripcion: Story = {
  args: {
    task: { ...TASK_PENDING, description: "" },
  },
};
