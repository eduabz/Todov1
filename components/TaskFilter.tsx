import { Pressable, View, Text } from "react-native";
import { useTheme } from "@/hooks/useTheme";

export type FilterValue = "all" | "today" | "pending" | "completed";

type Option = {
  value: FilterValue;
  label: string;
  emoji: string;
  activeColor: string;
};

const OPTIONS: Option[] = [
  { value: "all",       label: "Todas",      emoji: "📋", activeColor: "#6366F1" },
  { value: "today",     label: "Hoy",        emoji: "🔥", activeColor: "#F97316" },
  { value: "pending",   label: "Pendientes", emoji: "⏳", activeColor: "#3B82F6" },
  { value: "completed", label: "Completadas",emoji: "✅", activeColor: "#10B981" },
];

type Props = {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  counts?: { all: number; today: number; pending: number; completed: number };
};

export function TaskFilter({ value, onChange, counts }: Props) {
  const t = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: t.card,
        borderRadius: 14,
        padding: 4,
        marginBottom: 16,
        shadowColor: t.text,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
        borderWidth: 1,
        borderColor: t.cardBorder,
        gap: 3,
      }}
    >
      {OPTIONS.map((opt) => {
        const active = opt.value === value;
        const count = counts?.[opt.value];
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={{
              flex: 1,
              paddingVertical: 7,
              paddingHorizontal: 2,
              borderRadius: 10,
              alignItems: "center",
              backgroundColor: active ? opt.activeColor : "transparent",
              gap: 2,
            }}
          >
            <Text style={{ fontSize: 13 }}>{opt.emoji}</Text>
            <Text style={{ fontSize: 10, fontWeight: "700", color: active ? "white" : t.textMuted }}>
              {opt.label}
            </Text>
            {count !== undefined && (
              <View
                style={{
                  backgroundColor: active ? "rgba(255,255,255,0.25)" : t.accentLight,
                  borderRadius: 10,
                  paddingHorizontal: 5,
                  paddingVertical: 1,
                  minWidth: 18,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 9, fontWeight: "700", color: active ? "white" : t.textSecondary }}>
                  {count}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
