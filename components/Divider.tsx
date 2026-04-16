import { View } from "react-native";
import { Text } from "@/components/ui/text";

type Props = {
  label?: string;
};

export function Divider({ label }: Props) {
  if (!label) {
    return <View style={{ height: 1, backgroundColor: "#E5E7EB", marginVertical: 16 }} />;
  }

  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 16 }}>
      <View style={{ flex: 1, height: 1, backgroundColor: "#E5E7EB" }} />
      <Text className="text-gray-400 text-sm mx-3">{label}</Text>
      <View style={{ flex: 1, height: 1, backgroundColor: "#E5E7EB" }} />
    </View>
  );
}
