import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { FAB } from "./FAB";

function FABWrapper(props: React.ComponentProps<typeof FAB>) {
  return (
    <View style={{ height: 120, position: "relative" }}>
      <FAB {...props} bottom={16} />
    </View>
  );
}

const meta: Meta<typeof FABWrapper> = {
  title: "Layout/FAB",
  component: FABWrapper,
  args: {
    onPress: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { icon: "+" },
};

export const ColorVerde: Story = {
  args: { icon: "+", color: "#059669" },
};

export const ColorRojo: Story = {
  args: { icon: "🗑", color: "#EF4444" },
};

export const IconoPersonalizado: Story = {
  args: { icon: "✎", color: "#7C3AED" },
};
