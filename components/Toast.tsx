import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";

type ToastType = "success" | "error" | "info";

type Props = {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onHide: () => void;
};

const STYLES: Record<ToastType, { container: string; text: string; icon: string }> = {
  success: { container: "bg-green-600", text: "text-white", icon: "✓" },
  error:   { container: "bg-red-600",   text: "text-white", icon: "✕" },
  info:    { container: "bg-gray-800",  text: "text-white", icon: "ℹ" },
};

export function Toast({ visible, message, type = "info", duration = 3000, onHide }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.delay(duration),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => onHide());
    }
  }, [visible]);

  if (!visible) return null;

  const s = STYLES[type];

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Box className={`${s.container} flex-row items-center gap-3 px-4 py-3 rounded-xl shadow-lg`}>
        <Text className={`${s.text} font-bold text-base`}>{s.icon}</Text>
        <Text className={`${s.text} text-sm flex-1`}>{message}</Text>
      </Box>
    </Animated.View>
  );
}

// Hook para manejar el estado del toast fácilmente
export function useToast() {
  const [state, setState] = useState<{
    visible: boolean;
    message: string;
    type: ToastType;
  }>({ visible: false, message: "", type: "info" });

  const show = (message: string, type: ToastType = "info") => {
    setState({ visible: true, message, type });
  };

  const hide = () => setState((prev) => ({ ...prev, visible: false }));

  return { toastProps: { ...state, onHide: hide }, show };
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 90,
    left: 16,
    right: 16,
    zIndex: 999,
  },
});
