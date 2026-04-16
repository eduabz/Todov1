import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { Toast } from "./Toast";

// Wrapper estático para Storybook (sin animación de hide)
function ToastPreview({ type, message }: { type: "success" | "error" | "info"; message: string }) {
  return (
    <View style={{ position: "relative", height: 80 }}>
      <Toast visible message={message} type={type} onHide={() => {}} duration={99999} />
    </View>
  );
}

const meta: Meta<typeof ToastPreview> = {
  title: "Feedback/Toast",
  component: ToastPreview,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Exito: Story = {
  args: {
    type: "success",
    message: "Tarea creada correctamente",
  },
};

export const Error: Story = {
  args: {
    type: "error",
    message: "No se pudo eliminar la tarea",
  },
};

export const Informacion: Story = {
  args: {
    type: "info",
    message: "Recuerda completar tus tareas del día",
  },
};
