import type { Meta, StoryObj } from "@storybook/react-native";
import { PrimaryButton } from "./PrimaryButton";

const meta: Meta<typeof PrimaryButton> = {
  title: "Formularios/PrimaryButton",
  component: PrimaryButton,
  args: {
    label: "Iniciar sesión",
    onPress: () => {},
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "danger", "ghost"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: "primary", label: "Iniciar sesión" },
};

export const Danger: Story = {
  args: { variant: "danger", label: "Eliminar cuenta" },
};

export const Ghost: Story = {
  args: { variant: "ghost", label: "Cancelar" },
};

export const Cargando: Story = {
  args: { variant: "primary", label: "Iniciando sesión...", loading: true },
};

export const Deshabilitado: Story = {
  args: { variant: "primary", label: "Continuar", disabled: true },
};
