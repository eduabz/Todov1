import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Action = {
  label: string;
  onPress: () => void;
  color?: string;
};

type Props = {
  title: string;
  leftAction?: Action;
  rightAction?: Action;
};

export function ScreenHeader({ title, leftAction, rightAction }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: insets.top + 8,
        paddingBottom: 12,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
      }}
    >
      <View style={{ width: 80 }}>
        {leftAction && (
          <Pressable onPress={leftAction.onPress} hitSlop={8}>
            <Text style={{ color: leftAction.color ?? "#2563EB", fontSize: 14, fontWeight: "500" }}>
              {leftAction.label}
            </Text>
          </Pressable>
        )}
      </View>

      <Text className="text-base font-bold text-gray-900">{title}</Text>

      <View style={{ width: 80, alignItems: "flex-end" }}>
        {rightAction && (
          <Pressable onPress={rightAction.onPress} hitSlop={8}>
            <Text style={{ color: rightAction.color ?? "#2563EB", fontSize: 14, fontWeight: "500" }}>
              {rightAction.label}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
