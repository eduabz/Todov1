import { View, Text, Pressable } from "react-native";
import { useTheme } from "@/hooks/useTheme";

type Props = {
  message: string;
  onRetry?: () => void;
};

export function ErrorBanner({ message, onRetry }: Props) {
  const t = useTheme();

  return (
    <View
      style={{
        backgroundColor: t.dangerLight,
        borderWidth: 1,
        borderColor: t.danger + "44",
        borderRadius: 12,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
      }}
    >
      <Text style={{ fontSize: 20 }}>⚠️</Text>
      <Text style={{ color: t.danger, fontSize: 14, flex: 1 }}>{message}</Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          style={{
            backgroundColor: t.danger + "22",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: t.danger, fontSize: 13, fontWeight: "600" }}>Reintentar</Text>
        </Pressable>
      )}
    </View>
  );
}
