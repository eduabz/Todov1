import { View } from "react-native";

type Props = {
  children: React.ReactNode;
};

export function AuthCard({ children }: Props) {
  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 20,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
      }}
    >
      {children}
    </View>
  );
}
