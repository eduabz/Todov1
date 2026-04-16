import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { signOut } from "@/services/authService";
import { fetchTodos } from "@/services/todoService";
import { Task } from "@/type/Task";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DAYS_ES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

type Stats = { total: number; completed: number; pending: number; rate: number };

function getWeeklyData(tasks: Task[]): { day: string; count: number }[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const result: { day: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const count = tasks.filter((tk) => {
      if (!tk.completed) return false;
      const completedDate = tk.completedAt ? tk.completedAt.split("T")[0] : null;
      return completedDate === dateStr;
    }).length;
    result.push({ day: DAYS_ES[date.getDay()], count });
  }
  return result;
}

function getStreak(tasks: Task[]): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const completedThatDay = tasks.some((tk) => {
      if (!tk.completed || !tk.completedAt) return false;
      return tk.completedAt.split("T")[0] === dateStr;
    });
    if (completedThatDay) { streak++; } else if (i > 0) { break; }
  }
  return streak;
}

function WeeklyChart({ data }: { data: { day: string; count: number }[] }) {
  const t = useTheme();
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <View style={{ backgroundColor: t.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: t.cardBorder }}>
      <Text style={{ fontSize: 13, fontWeight: "700", color: t.text, marginBottom: 16 }}>Completadas esta semana</Text>
      <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", height: 90 }}>
        {data.map((d, i) => {
          const barHeight = max === 0 ? 4 : Math.max((d.count / max) * 64, d.count > 0 ? 8 : 4);
          const isToday = i === 6;
          return (
            <View key={i} style={{ alignItems: "center", flex: 1 }}>
              {d.count > 0 && (
                <Text style={{ fontSize: 10, fontWeight: "700", color: isToday ? t.accent : t.textSecondary, marginBottom: 4 }}>
                  {d.count}
                </Text>
              )}
              <View
                style={{
                  width: 28, height: barHeight,
                  backgroundColor: isToday ? t.accent : d.count > 0 ? t.accentMid : t.accentLight,
                  borderRadius: 6, marginBottom: 6,
                }}
              />
              <Text style={{ fontSize: 10, color: isToday ? t.accent : t.textMuted, fontWeight: isToday ? "700" : "500" }}>
                {d.day}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function StatBox({ value, label, color }: { value: string | number; label: string; color: string }) {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.card, borderRadius: 16, padding: 16, alignItems: "center", borderWidth: 1, borderColor: t.cardBorder, shadowColor: t.accent, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 }}>
      <Text style={{ fontSize: 26, fontWeight: "800", color }}>{value}</Text>
      <Text style={{ fontSize: 11, color: t.textMuted, fontWeight: "600", marginTop: 2, textAlign: "center" }}>{label}</Text>
    </View>
  );
}

function MenuRow({ emoji, label, onPress, danger }: { emoji: string; label: string; onPress: () => void; danger?: boolean }) {
  const t = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", padding: 16, backgroundColor: pressed ? t.cardHighlight : t.card, gap: 14 })}
    >
      <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: danger ? t.dangerLight : t.accentLight, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 20 }}>{emoji}</Text>
      </View>
      <Text style={{ flex: 1, fontSize: 15, fontWeight: "600", color: danger ? t.danger : t.text }}>{label}</Text>
      <Text style={{ fontSize: 18, color: t.textMuted }}>›</Text>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const { user, getToken } = useAuth();
  const t = useTheme();
  const [stats, setStats] = useState<Stats | null>(null);
  const [weeklyData, setWeeklyData] = useState<{ day: string; count: number }[]>([]);
  const [streak, setStreak] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        try {
          setLoadingStats(true);
          const token = await getToken();
          const data = await fetchTodos(token);
          const completed = data.filter((tk) => tk.completed).length;
          const total = data.length;
          setStats({ total, completed, pending: total - completed, rate: total === 0 ? 0 : Math.round((completed / total) * 100) });
          setWeeklyData(getWeeklyData(data));
          setStreak(getStreak(data));
        } catch {
          // silent
        } finally {
          setLoadingStats(false);
        }
      };
      load();
    }, [getToken]),
  );

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/login");
  };

  const displayName = user?.displayName ?? user?.email?.split("@")[0] ?? "Usuario";
  const email = user?.email ?? "";
  const initial = displayName.trim().charAt(0).toUpperCase();

  const AVATAR_COLORS = ["#6366F1", "#7C3AED", "#059669", "#DC2626", "#D97706", "#0891B2"];
  let hash = 0;
  for (let i = 0; i < displayName.length; i++) hash = displayName.charCodeAt(i) + ((hash << 5) - hash);
  const avatarColor = AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* HEADER */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
          <Text style={{ fontSize: 10, color: t.textMuted, fontWeight: "700", letterSpacing: 1, marginBottom: 4 }}>PERFIL</Text>
          <Text style={{ fontSize: 24, fontWeight: "800", color: t.text, letterSpacing: -0.5 }}>Mi cuenta</Text>
        </View>

        {/* PROFILE CARD */}
        <View style={{ marginHorizontal: 20, marginTop: 16, backgroundColor: t.card, borderRadius: 20, padding: 24, alignItems: "center", shadowColor: t.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4, borderWidth: 1, borderColor: t.cardBorder }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: avatarColor, alignItems: "center", justifyContent: "center", marginBottom: 14, borderWidth: 3, borderColor: t.card, shadowColor: avatarColor, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6 }}>
            <Text style={{ color: "white", fontSize: 32, fontWeight: "800" }}>{initial}</Text>
          </View>
          <Text style={{ fontSize: 20, fontWeight: "800", color: t.text, marginBottom: 4 }}>{displayName}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: t.bg, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
            <Text style={{ fontSize: 12 }}>✉️</Text>
            <Text style={{ fontSize: 13, color: t.textSecondary, fontWeight: "500" }}>{email}</Text>
          </View>

          {streak > 0 && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: t.warningLight, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, marginTop: 12, borderWidth: 1, borderColor: t.warning + "44" }}>
              <Text style={{ fontSize: 16 }}>🔥</Text>
              <Text style={{ fontSize: 13, fontWeight: "700", color: t.warning }}>{streak} día{streak !== 1 ? "s" : ""} seguidos</Text>
            </View>
          )}
        </View>

        {/* STATS */}
        <View style={{ marginHorizontal: 20, marginTop: 20 }}>
          <Text style={{ fontSize: 13, fontWeight: "700", color: t.textSecondary, marginBottom: 12, letterSpacing: 0.5 }}>ESTADÍSTICAS</Text>

          {loadingStats ? (
            <View style={{ height: 80, alignItems: "center", justifyContent: "center" }}>
              <ActivityIndicator color={t.accent} />
            </View>
          ) : stats ? (
            <>
              <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
                <StatBox value={stats.total}     label="Total"       color={t.accent} />
                <StatBox value={stats.pending}   label="Pendientes"  color={t.warning} />
                <StatBox value={stats.completed} label="Completadas" color={t.success} />
              </View>

              {/* Completion rate */}
              <View style={{ backgroundColor: t.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: t.cardBorder, marginBottom: 10 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                  <Text style={{ fontSize: 13, fontWeight: "700", color: t.text }}>Tasa de completación</Text>
                  <Text style={{ fontSize: 13, fontWeight: "800", color: t.accent }}>{stats.rate}%</Text>
                </View>
                <View style={{ height: 8, backgroundColor: t.accentLight, borderRadius: 4, overflow: "hidden" }}>
                  <View style={{ height: "100%", width: `${stats.rate}%`, backgroundColor: t.accent, borderRadius: 4 }} />
                </View>
                <Text style={{ fontSize: 12, color: t.textMuted, marginTop: 8 }}>
                  {stats.rate >= 80 ? "🔥 ¡Productividad excelente!" : stats.rate >= 50 ? "💪 Buen ritmo, sigue así" : stats.total === 0 ? "✨ Crea tu primera tarea" : "⏳ Puedes mejorar tu ritmo"}
                </Text>
              </View>

              {/* Weekly chart */}
              <WeeklyChart data={weeklyData} />
            </>
          ) : null}
        </View>

        {/* MENU */}
        <View style={{ marginHorizontal: 20, marginTop: 24 }}>
          <Text style={{ fontSize: 13, fontWeight: "700", color: t.textSecondary, marginBottom: 12, letterSpacing: 0.5 }}>CUENTA</Text>
          <View style={{ backgroundColor: t.card, borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: t.cardBorder }}>
            <MenuRow emoji="🔔" label="Notificaciones" onPress={() => {}} />
            <View style={{ height: 1, backgroundColor: t.divider }} />
            <MenuRow emoji="🔒" label="Cambiar contraseña" onPress={() => {}} />
            <View style={{ height: 1, backgroundColor: t.divider }} />
            <MenuRow emoji="🚪" label="Cerrar sesión" onPress={handleSignOut} danger />
          </View>
        </View>

        <Text style={{ textAlign: "center", color: t.textMuted, fontSize: 12, marginTop: 28 }}>TodoApp v1.0.0 • Semana 3</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
