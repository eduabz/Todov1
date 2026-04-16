import type { Meta, StoryObj } from "@storybook/react-native";
import { FormInput } from "./FormInput";

const meta: Meta<typeof FormInput> = {
  title: "Formularios/FormInput",
  component: FormInput,
  args: {
    label: "Correo electrónico",
    placeholder: "correo@ejemplo.com",
  },
  argTypes: {
    onChangeText: { action: "onChangeText" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ConValor: Story = {
  args: {
    value: "usuario@itc.mx",
  },
};

export const ConError: Story = {
  args: {
    label: "Correo electrónico",
    value: "correo-invalido",
    error: "Ingresa un correo válido",
  },
};

export const Contrasena: Story = {
  args: {
    label: "Contraseña",
    placeholder: "Mínimo 8 caracteres",
    secureTextEntry: true,
  },
};

export const Deshabilitado: Story = {
  args: {
    label: "Usuario",
    value: "eduardo@itc.mx",
    editable: false,
  },
};
