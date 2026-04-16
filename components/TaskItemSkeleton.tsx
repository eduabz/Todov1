import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";

function ShimmerBar({ width, height = 14, style }: { width: string | number; height?: number; style?: object }) {
  const t = useTheme();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 750, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 750, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius: 6, backgroundColor: t.skeleton },
        { opacity },
        style,
      ]}
    />
  );
}

export function TaskItemSkeleton() {
  const t = useTheme();

  // Vary the "priority" color per skeleton to look natural
  const accentColors = ["#94A3B8", "#3B82F6", "#F97316", "#EF4444"];
  const accentColor = accentColors[Math.floor(Math.random() * accentColors.length)];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: t.card,
          borderColor: t.cardBorder,
          borderLeftColor: t.skeleton,
        },
      ]}
    >
      {/* Checkbox */}
      <ShimmerBar width={24} height={24} style={{ borderRadius: 12, flexShrink: 0 }} />

      {/* Text block */}
      <View style={styles.textBlock}>
        {/* Title + badge row */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <ShimmerBar width="62%" height={14} />
          <ShimmerBar width={38} height={16} style={{ borderRadius: 6 }} />
        </View>
        {/* Description */}
        <ShimmerBar width="80%" height={11} style={{ marginBottom: 4 }} />
        <ShimmerBar width="50%" height={11} />
        {/* Tags row */}
        <View style={{ flexDirection: "row", gap: 4, marginTop: 8 }}>
          <ShimmerBar width={52} height={16} style={{ borderRadius: 6 }} />
          <ShimmerBar width={44} height={16} style={{ borderRadius: 6 }} />
        </View>
      </View>

      {/* Delete button placeholder */}
      <ShimmerBar width={32} height={32} style={{ borderRadius: 8, flexShrink: 0 }} />
    </View>
  );
}

export function TaskListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <TaskItemSkeleton key={i} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderLeftWidth: 4,
    gap: 14,
  },
  textBlock: {
    flex: 1,
  },
});
