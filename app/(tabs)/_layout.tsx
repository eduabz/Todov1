import { Tabs } from "expo-router";
import { Text, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.4 }}>{emoji}</Text>
    </View>
  );
}

export default function TabLayout() {
  const t = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: t.tabBar,
          borderTopWidth: 1,
          borderTopColor: t.tabBarBorder,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
          shadowColor: "#0F172A",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 12,
        },
        tabBarActiveTintColor: t.accent,
        tabBarInactiveTintColor: t.textMuted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "700", letterSpacing: 0.3, marginTop: 2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Inicio", tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} /> }}
      />
      <Tabs.Screen
        name="lists"
        options={{ title: "Listas", tabBarIcon: ({ focused }) => <TabIcon emoji="📋" focused={focused} /> }}
      />
      <Tabs.Screen
        name="search"
        options={{ title: "Buscar", tabBarIcon: ({ focused }) => <TabIcon emoji="🔍" focused={focused} /> }}
      />
      <Tabs.Screen
        name="about"
        options={{ title: "Perfil", tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} /> }}
      />
    </Tabs>
  );
}
