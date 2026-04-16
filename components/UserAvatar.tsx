import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";

type Size = "sm" | "md" | "lg";

type Props = {
  name: string;
  size?: Size;
  onPress?: () => void;
};

const SIZES: Record<Size, { container: number; font: number }> = {
  sm: { container: 32, font: 13 },
  md: { container: 40, font: 16 },
  lg: { container: 56, font: 22 },
};

const COLORS = [
  "#2563EB", "#7C3AED", "#059669", "#DC2626",
  "#D97706", "#0891B2", "#BE185D", "#4F46E5",
];

function colorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

export function UserAvatar({ name, size = "md", onPress }: Props) {
  const initial = name.trim().charAt(0).toUpperCase();
  const { container, font } = SIZES[size];
  const bg = colorFromName(name);

  const circle = (
    <View
      style={{
        width: container,
        height: container,
        borderRadius: container / 2,
        backgroundColor: bg,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "white", fontSize: font, fontWeight: "700" }}>{initial}</Text>
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress} hitSlop={8}>{circle}</Pressable>;
  }
  return circle;
}
