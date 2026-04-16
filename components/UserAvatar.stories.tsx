import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { UserAvatar } from "./UserAvatar";

const meta: Meta<typeof UserAvatar> = {
  title: "Auth/UserAvatar",
  component: UserAvatar,
  args: {
    name: "Eduardo Abundiz",
    onPress: () => {},
  },
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Mediano: Story = {
  args: { size: "md" },
};

export const Grande: Story = {
  args: { size: "lg" },
};

export const Pequeno: Story = {
  args: { size: "sm" },
};

export const SinOnPress: Story = {
  args: { size: "md", onPress: undefined },
};

export const MultiplesUsuarios: StoryObj = {
  render: () => (
    <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
      <UserAvatar name="Eduardo Abundiz" size="lg" />
      <UserAvatar name="María García" size="lg" />
      <UserAvatar name="Carlos López" size="lg" />
      <UserAvatar name="Ana Martínez" size="lg" />
    </View>
  ),
};
