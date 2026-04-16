import type { Meta, StoryObj } from "@storybook/react-native";
import { TaskFilter } from "./TaskFilter";

const meta: Meta<typeof TaskFilter> = {
  title: "Tareas/TaskFilter",
  component: TaskFilter,
  args: {
    onChange: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Todas: Story = {
  args: { value: "all" },
};

export const Pendientes: Story = {
  args: { value: "pending" },
};

export const Completadas: Story = {
  args: { value: "completed" },
};
