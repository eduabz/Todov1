import { Text } from "@/components/ui/text";
import { TextInput, TextInputProps, View } from "react-native";

type Props = TextInputProps & {
  label: string;
  error?: string;
};

export function FormInput({ label, error, style, ...props }: Props) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text className="text-sm font-semibold text-gray-600 mb-1">{label}</Text>
      <TextInput
        style={[
          {
            borderWidth: 1,
            borderColor: error ? "#EF4444" : "#D1D5DB",
            borderRadius: 12,
            padding: 12,
            fontSize: 16,
            backgroundColor: "white",
            color: "#111827",
          },
          style,
        ]}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
}
