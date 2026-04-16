import { View, Text, Pressable } from "react-native";
import { useTheme } from "@/hooks/useTheme";

type Props = {
  icon: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ icon, title, subtitle, actionLabel, onAction }: Props) {
  const t = useTheme();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
      <View
        style={{
          width: 96, height: 96, borderRadius: 48,
          backgroundColor: t.accentLight,
          alignItems: "center", justifyContent: "center",
          marginBottom: 20,
          borderWidth: 2,
          borderColor: t.accentMid,
        }}
      >
        <Text style={{ fontSize: 44 }}>{icon}</Text>
      </View>

      <Text style={{ fontSize: 20, fontWeight: "800", color: t.text, textAlign: "center", marginBottom: 8 }}>
        {title}
      </Text>

      {subtitle && (
        <Text style={{ fontSize: 14, color: t.textMuted, textAlign: "center", lineHeight: 20, marginBottom: 24 }}>
          {subtitle}
        </Text>
      )}

      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          style={{
            backgroundColor: t.accent,
            paddingHorizontal: 28, paddingVertical: 14,
            borderRadius: 14,
            shadowColor: t.accent,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
          }}
        >
          <Text style={{ color: "white", fontWeight: "700", fontSize: 15 }}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}
