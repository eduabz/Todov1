import type { Meta, StoryObj } from "@storybook/react-native";
import { Text, View } from "react-native";
import { AuthCard } from "./AuthCard";
import { FormInput } from "./FormInput";
import { PrimaryButton } from "./PrimaryButton";
import { Divider } from "./Divider";

const meta: Meta<typeof AuthCard> = {
  title: "Auth/AuthCard",
  component: AuthCard,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  render: () => (
    <AuthCard>
      <Text style={{ fontSize: 16, color: "#374151" }}>
        Contenido dentro de la tarjeta
      </Text>
    </AuthCard>
  ),
};

export const FormularioLogin: Story = {
  render: () => (
    <AuthCard>
      <Text style={{ fontSize: 22, fontWeight: "700", color: "#111827", marginBottom: 4 }}>
        Iniciar sesión
      </Text>
      <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 20 }}>
        Accede a tu cuenta
      </Text>
      <FormInput label="Correo" placeholder="correo@ejemplo.com" />
      <FormInput label="Contraseña" placeholder="••••••••" secureTextEntry />
      <View style={{ marginTop: 8 }}>
        <PrimaryButton label="Entrar" onPress={() => {}} />
      </View>
      <Divider label="o" />
      <PrimaryButton label="Registrarse" onPress={() => {}} variant="ghost" />
    </AuthCard>
  ),
};

export const ConError: Story = {
  render: () => (
    <AuthCard>
      <Text style={{ fontSize: 22, fontWeight: "700", color: "#111827", marginBottom: 20 }}>
        Iniciar sesión
      </Text>
      <FormInput label="Correo" value="mal@" error="Correo inválido" />
      <FormInput label="Contraseña" value="123" error="Mínimo 8 caracteres" secureTextEntry />
      <View style={{ marginTop: 8 }}>
        <PrimaryButton label="Entrar" onPress={() => {}} disabled />
      </View>
    </AuthCard>
  ),
};
