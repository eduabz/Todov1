import type { Meta, StoryObj } from "@storybook/react-native";
import { TaskCounter } from "./TaskCounter";

const meta: Meta<typeof TaskCounter> = {
  title: "Tareas/TaskCounter",
  component: TaskCounter,
  args: {
    completed: 0,
    total: 5,
  },
  argTypes: {
    completed: { control: { type: "range", min: 0, max: 10 } },
    total: { control: { type: "range", min: 0, max: 10 } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SinProgreso: Story = {
  args: { completed: 0, total: 5 },
};

export const EnProgreso: Story = {
  args: { completed: 3, total: 7 },
};

export const Completado: Story = {
  args: { completed: 5, total: 5 },
};

export const UnaTarea: Story = {
  args: { completed: 0, total: 1 },
};
