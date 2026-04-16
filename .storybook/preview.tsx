import type { Preview } from "@storybook/react-native";
import { View } from "react-native";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "gray",
      values: [
        { name: "gray", value: "#F9FAFB" },
        { name: "white", value: "#FFFFFF" },
        { name: "dark", value: "#1F2937" },
      ],
    },
  },
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 16 }}>
        <Story />
      </View>
    ),
  ],
};

export default preview;
