import type { Meta, StoryObj } from "@storybook/react-native";
import { EmptyState } from "./EmptyState";

const meta: Meta<typeof EmptyState> = {
  title: "Feedback/EmptyState",
  component: EmptyState,
  args: {
    onAction: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SinTareas: Story = {
  args: {
    icon: "📋",
    title: "Sin tareas por ahora",
    subtitle: "Crea tu primera tarea presionando el botón +",
    actionLabel: "Crear tarea",
  },
};

export const SinResultados: Story = {
  args: {
    icon: "🔍",
    title: "Sin resultados",
    subtitle: "No hay tareas que coincidan con tu búsqueda",
  },
};

export const TodoAlDia: Story = {
  args: {
    icon: "🎉",
    title: "¡Todo al día!",
    subtitle: "No tienes tareas pendientes",
  },
};

export const SinCompletadas: Story = {
  args: {
    icon: "✅",
    title: "Sin completadas aún",
    subtitle: "Completa alguna tarea para verla aquí",
  },
};
