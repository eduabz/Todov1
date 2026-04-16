import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { Text } from "@/components/ui/text";

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  placeholder?: string;
};

export function PasswordInput({ label, value, onChangeText, error, placeholder }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ marginBottom: 16 }}>
      <Text className="text-sm font-semibold text-gray-600 mb-1">{label}</Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: error ? "#EF4444" : "#D1D5DB",
          borderRadius: 12,
          backgroundColor: "white",
          paddingHorizontal: 12,
        }}
      >
        <TextInput
          style={{ flex: 1, paddingVertical: 12, fontSize: 16, color: "#111827" }}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!visible}
          placeholder={placeholder ?? "••••••••"}
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
        />
        <Pressable onPress={() => setVisible((v) => !v)} style={{ paddingLeft: 8 }}>
          <Text className="text-gray-400 text-base">{visible ? "🙈" : "👁"}</Text>
        </Pressable>
      </View>

      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
}
