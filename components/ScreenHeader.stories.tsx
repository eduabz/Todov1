import type { Meta, StoryObj } from "@storybook/react-native";
import { ScreenHeader } from "./ScreenHeader";

const meta: Meta<typeof ScreenHeader> = {
  title: "Layout/ScreenHeader",
  component: ScreenHeader,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SoloTitulo: Story = {
  args: { title: "Mis Tareas" },
};

export const ConAcciones: Story = {
  args: {
    title: "Nueva Tarea",
    leftAction: { label: "Cancelar", onPress: () => {} },
    rightAction: { label: "Guardar", onPress: () => {} },
  },
};

export const ConAccionIzquierda: Story = {
  args: {
    title: "Detalle",
    leftAction: { label: "← Atrás", onPress: () => {} },
  },
};

export const AccionPeligro: Story = {
  args: {
    title: "Perfil",
    rightAction: { label: "Salir", onPress: () => {}, color: "#EF4444" },
  },
};
