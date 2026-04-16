import type { Meta, StoryObj } from "@storybook/react-native";
import { SwipeableTaskItem } from "./SwipeableTaskItem";

const TASK_PENDING = {
  id: "1",
  title: "Leer documentación de Storybook",
  description: "Revisar la guía de React Native",
  completed: false,
  userId: "user-1",
};

const TASK_COMPLETED = {
  id: "2",
  title: "Configurar Firebase",
  description: "Auth y Firestore configurados",
  completed: true,
  userId: "user-1",
};

const meta: Meta<typeof SwipeableTaskItem> = {
  title: "Tareas/SwipeableTaskItem",
  component: SwipeableTaskItem,
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
