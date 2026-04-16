import type { Meta, StoryObj } from "@storybook/react-native";
import { TaskItemSkeleton, TaskListSkeleton } from "./TaskItemSkeleton";

const meta: Meta<typeof TaskItemSkeleton> = {
  title: "Tareas/TaskItemSkeleton",
  component: TaskItemSkeleton,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Individual: Story = {};

export const Lista: StoryObj<typeof TaskListSkeleton> = {
  render: () => <TaskListSkeleton count={4} />,
};

export const ListaCorta: StoryObj<typeof TaskListSkeleton> = {
  render: () => <TaskListSkeleton count={2} />,
};
