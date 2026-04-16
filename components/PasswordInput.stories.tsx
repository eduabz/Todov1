import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { PasswordInput } from "./PasswordInput";

function PasswordInputControlled(props: React.ComponentProps<typeof PasswordInput>) {
  const [value, setValue] = useState(props.value ?? "");
  return <PasswordInput {...props} value={value} onChangeText={setValue} />;
}

const meta: Meta<typeof PasswordInputControlled> = {
  title: "Formularios/PasswordInput",
  component: PasswordInputControlled,
  args: {
    label: "Contraseña",
    placeholder: "••••••••",
    value: "",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Vacio: Story = {};

export const ConValor: Story = {
  args: { value: "MiPass123!" },
};

export const ConError: Story = {
  args: {
    value: "123",
    error: "La contraseña debe tener al menos 8 caracteres",
  },
};

export const ConfirmContrasena: Story = {
  args: {
    label: "Confirmar contraseña",
    placeholder: "Repite tu contraseña",
    value: "",
  },
};
