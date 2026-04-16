import type { Meta, StoryObj } from "@storybook/react-native";
import { ErrorBanner } from "./ErrorBanner";

const meta: Meta<typeof ErrorBanner> = {
  title: "Feedback/ErrorBanner",
  component: ErrorBanner,
  args: {
    onRetry: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ConReintentar: Story = {
  args: {
    message: "No se pudo cargar las tareas. Verifica tu conexión.",
  },
};

export const SinReintentar: Story = {
  args: {
    message: "Error de autenticación. Inicia sesión nuevamente.",
    onRetry: undefined,
  },
};

export const ErrorDeRed: Story = {
  args: {
    message: "Network request failed. Comprueba que el servidor esté encendido.",
  },
};
