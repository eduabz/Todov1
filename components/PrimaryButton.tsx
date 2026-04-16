import { ActivityIndicator, Pressable } from "react-native";
import { Text } from "@/components/ui/text";

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "danger" | "ghost";
};

const VARIANTS = {
  primary: { bg: "#2563EB", text: "white", border: "transparent" },
  danger:  { bg: "#EF4444", text: "white", border: "transparent" },
  ghost:   { bg: "transparent", text: "#2563EB", border: "#2563EB" },
};

export function PrimaryButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
}: Props) {
  const { bg, text, border } = VARIANTS[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={{
        backgroundColor: bg,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: variant === "ghost" ? 1.5 : 0,
        borderColor: border,
        opacity: isDisabled ? 0.5 : 1,
      }}
    >
      {loading ? (
        <ActivityIndicator color={text} />
      ) : (
        <Text style={{ color: text, fontSize: 16, fontWeight: "600" }}>{label}</Text>
      )}
    </Pressable>
  );
}
