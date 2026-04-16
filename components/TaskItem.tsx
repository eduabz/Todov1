import { useEffect, useRef } from "react";
import { Animated, Pressable, View, Text } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Task, Priority } from "@/type/Task";

const PRIORITY_CONFIG: Record<Priority, { color: string; bg: string; darkBg: string; label: string }> = {
  LOW:    { color: "#94A3B8", bg: "#F1F5F9", darkBg: "#1E293B", label: "Baja" },
  MEDIUM: { color: "#3B82F6", bg: "#DBEAFE", darkBg: "#1E3A5F", label: "Media" },
  HIGH:   { color: "#F97316", bg: "#FFF7ED", darkBg: "#431407", label: "Alta" },
  URGENT: { color: "#EF4444", bg: "#FEF2F2", darkBg: "#450A0A", label: "Urgente" },
};

function getDueDateInfo(dueDate: string | null): { text: string; color: string } | null {
  if (!dueDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + "T00:00:00");
  const diff = Math.round((due.getTime() - today.getTime()) / 86400000);

  if (diff < 0)  return { text: `Vencida hace ${Math.abs(diff)} día${Math.abs(diff) !== 1 ? "s" : ""}`, color: "#EF4444" };
  if (diff === 0) return { text: "Vence hoy", color: "#F97316" };
  if (diff === 1) return { text: "Vence mañana", color: "#F59E0B" };
  return {
    text: `Vence el ${due.toLocaleDateString("es-MX", { day: "numeric", month: "short" })}`,
    color: "#94A3B8",
  };
}

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (task: Task) => void;
};

export function TaskItem({ task, onToggle, onDelete, onEdit }: Props) {
  const t = useTheme();
  const priority = task.priority ?? "MEDIUM";
  const pConfig = PRIORITY_CONFIG[priority as Priority] ?? PRIORITY_CONFIG.MEDIUM;
  const dueDateInfo = getDueDateInfo(task.dueDate);
  const tags = task.tags ? task.tags.split(",").map((s) => s.trim()).filter(Boolean) : [];

  // 2.2 Completion animation: bounce scale when task is marked complete
  const scale = useRef(new Animated.Value(1)).current;
  const checkScale = useRef(new Animated.Value(1)).current;
  const prevCompleted = useRef(task.completed);

  useEffect(() => {
    if (task.completed !== prevCompleted.current) {
      prevCompleted.current = task.completed;
      if (task.completed) {
        // Card bounce
        Animated.sequence([
          Animated.spring(scale, { toValue: 1.025, useNativeDriver: true, tension: 300, friction: 6 }),
          Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 300, friction: 6 }),
        ]).start();
        // Checkbox bounce
        Animated.sequence([
          Animated.spring(checkScale, { toValue: 1.4, useNativeDriver: true, tension: 300, friction: 5 }),
          Animated.spring(checkScale, { toValue: 1, useNativeDriver: true, tension: 300, friction: 8 }),
        ]).start();
      }
    }
  }, [task.completed]);

  const isDark = t.bg === "#0F172A";
  const priorityBg = isDark ? pConfig.darkBg : pConfig.bg;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onLongPress={() => onEdit?.(task)}
        delayLongPress={400}
        style={{
          backgroundColor: task.completed ? t.cardHighlight : t.card,
          borderRadius: 16,
          marginBottom: 10,
          padding: 16,
          shadowColor: t.accent,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: task.completed ? 0 : 0.06,
          shadowRadius: 8,
          elevation: task.completed ? 0 : 2,
          borderWidth: 1,
          borderColor: task.completed ? t.cardBorder : t.cardBorder,
          borderLeftWidth: 4,
          borderLeftColor: task.completed ? t.textMuted : pConfig.color,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          {/* Checkbox */}
          <Animated.View style={{ transform: [{ scale: checkScale }], marginRight: 14, marginTop: 1, flexShrink: 0 }}>
            <Pressable
              onPress={() => onToggle(task.id)}
              hitSlop={8}
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: task.completed ? t.success : t.accentMid,
                backgroundColor: task.completed ? t.success : "transparent",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {task.completed && (
                <Text style={{ color: "white", fontSize: 12, fontWeight: "700", lineHeight: 14 }}>✓</Text>
              )}
            </Pressable>
          </Animated.View>

          {/* Content */}
          <View style={{ flex: 1 }}>
            {/* Title + priority */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: task.completed ? t.textMuted : t.text,
                  textDecorationLine: task.completed ? "line-through" : "none",
                  flexShrink: 1,
                }}
                numberOfLines={2}
              >
                {task.title}
              </Text>

              {!task.completed && priority !== "MEDIUM" && (
                <View style={{ backgroundColor: priorityBg, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                  <Text style={{ fontSize: 10, fontWeight: "700", color: pConfig.color }}>
                    {pConfig.label.toUpperCase()}
                  </Text>
                </View>
              )}
            </View>

            {/* Description */}
            {!!task.description && (
              <Text
                style={{ fontSize: 13, color: t.textMuted, lineHeight: 18, marginTop: 3 }}
                numberOfLines={2}
              >
                {task.description}
              </Text>
            )}

            {/* Tags */}
            {tags.length > 0 && !task.completed && (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                {tags.map((tag) => (
                  <View
                    key={tag}
                    style={{
                      backgroundColor: t.accentLight,
                      borderRadius: 6,
                      paddingHorizontal: 7,
                      paddingVertical: 2,
                      borderWidth: 1,
                      borderColor: t.accentMid,
                    }}
                  >
                    <Text style={{ fontSize: 10, fontWeight: "600", color: t.accent }}>#{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Due date */}
            {dueDateInfo && !task.completed && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 }}>
                <Text style={{ fontSize: 11 }}>📅</Text>
                <Text style={{ fontSize: 11, fontWeight: "600", color: dueDateInfo.color }}>
                  {dueDateInfo.text}
                </Text>
              </View>
            )}

            {/* Swipe hint */}
            {onEdit && !task.completed && (
              <Text style={{ fontSize: 10, color: t.textPlaceholder, marginTop: 4 }}>
                ← desliza para eliminar · → para completar
              </Text>
            )}
          </View>

          {/* Delete */}
          <Pressable
            onPress={() => onDelete(task.id)}
            hitSlop={12}
            style={{
              marginLeft: 12,
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: t.dangerLight,
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Text style={{ fontSize: 14, color: t.danger }}>✕</Text>
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
}
