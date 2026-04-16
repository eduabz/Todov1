import { Pressable, Text, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";

type Props = {
  onPress: () => void;
  bottom?: number;
};

export function FAB({ onPress, bottom = 32 }: Props) {
  const t = useTheme();

  return (
    <View
      style={{
        position: "absolute", right: 20, bottom,
        shadowColor: t.accent,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4, shadowRadius: 16, elevation: 10,
      }}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          width: 60, height: 60, borderRadius: 30,
          backgroundColor: pressed ? t.accentDark : t.accent,
          alignItems: "center", justifyContent: "center",
          transform: [{ scale: pressed ? 0.94 : 1 }],
        })}
      >
        <Text style={{ color: "white", fontSize: 30, lineHeight: 34, fontWeight: "300" }}>+</Text>
      </Pressable>
    </View>
  );
}
