import { useRef } from "react";
import { Animated, Platform, Pressable, StyleSheet, View, Text } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { TaskItem } from "@/components/TaskItem";
import { useTheme } from "@/hooks/useTheme";
import { Task } from "@/type/Task";

let Haptics: typeof import("expo-haptics") | null = null;
if (Platform.OS !== "web") {
  try { Haptics = require("expo-haptics"); } catch {}
}

const SWIPE_THRESHOLD = 60;
const ACTION_WIDTH = 72;

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (task: Task) => void;
};

export function SwipeableTaskItem({ task, onToggle, onDelete, onEdit }: Props) {
  const t = useTheme();
  const translateX = useRef(new Animated.Value(0)).current;

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true },
  );

  const clampedX = translateX.interpolate({
    inputRange: [-ACTION_WIDTH, 0, ACTION_WIDTH],
    outputRange: [-ACTION_WIDTH, 0, ACTION_WIDTH],
    extrapolate: "clamp",
  });

  const snapBack = () =>
    Animated.spring(translateX, { toValue: 0, useNativeDriver: true, tension: 120, friction: 10 }).start();

  const onHandlerStateChange = (event: any) => {
    const { translationX, state } = event.nativeEvent;
    if (state !== 5) return;

    if (translationX < -SWIPE_THRESHOLD) {
      // Left swipe → delete
      Haptics?.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Animated.timing(translateX, { toValue: -400, duration: 220, useNativeDriver: true }).start(() => {
        onDelete(task.id);
      });
    } else if (translationX > SWIPE_THRESHOLD && !task.completed) {
      // Right swipe → complete
      Haptics?.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onToggle(task.id);
      snapBack();
    } else {
      snapBack();
    }
  };

  // Opacity of action indicators
  const deleteOpacity = clampedX.interpolate({
    inputRange: [-ACTION_WIDTH, -SWIPE_THRESHOLD / 2, 0],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });
  const completeOpacity = clampedX.interpolate({
    inputRange: [0, SWIPE_THRESHOLD / 2, ACTION_WIDTH],
    outputRange: [0, 0.5, 1],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.wrapper}>
      {/* Delete action (revealed on right side when swiping left) */}
      <Animated.View style={[styles.actionRight, { opacity: deleteOpacity }]}>
        <View style={[styles.actionBtn, { backgroundColor: t.danger }]}>
          <Text style={{ fontSize: 22 }}>🗑</Text>
        </View>
      </Animated.View>

      {/* Complete action (revealed on left side when swiping right) */}
      {!task.completed && (
        <Animated.View style={[styles.actionLeft, { opacity: completeOpacity }]}>
          <View style={[styles.actionBtn, { backgroundColor: t.success }]}>
            <Text style={{ fontSize: 22, color: "white", fontWeight: "700" }}>✓</Text>
          </View>
        </Animated.View>
      )}

      {/* Swipeable row */}
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetX={[-8, 8]}
        failOffsetY={[-12, 12]}
      >
        <Animated.View style={{ transform: [{ translateX: clampedX }] }}>
          <TaskItem task={task} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: "relative" },
  actionRight: {
    position: "absolute",
    right: 8, top: 0, bottom: 10,
    width: ACTION_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  actionLeft: {
    position: "absolute",
    left: 8, top: 0, bottom: 10,
    width: ACTION_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  actionBtn: {
    width: 52, height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
});
