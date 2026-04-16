import type { Meta, StoryObj } from "@storybook/react-native";
import { Divider } from "./Divider";

const meta: Meta<typeof Divider> = {
  title: "Layout/Divider",
  component: Divider,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SinEtiqueta: Story = {};

export const ConEtiqueta: Story = {
  args: { label: "o continúa con" },
};

export const OtrasOpciones: Story = {
  args: { label: "otras opciones" },
};
