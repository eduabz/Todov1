import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";

type Props = {
  completed: number;
  total: number;
};

function getMotivation(percentage: number): string {
  if (percentage === 0) return "¡Empieza hoy con fuerza!";
  if (percentage < 25) return "Buen inicio, sigue así";
  if (percentage < 50) return "Vas por buen camino";
  if (percentage < 75) return "Más de la mitad, excelente";
  if (percentage < 100) return "¡Casi lo logras!";
  return "¡Día completado! 🎉";
}

export function TaskCounter({ completed, total }: Props) {
  const t = useTheme();
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  const remaining = total - completed;
  const motivation = getMotivation(percentage);

  return (
    <View style={[styles.card, { backgroundColor: t.accent, shadowColor: t.accent }]}>
      {/* Top row */}
      <View style={styles.topRow}>
        <View>
          <Text style={styles.label}>PROGRESO DEL DÍA</Text>
          <Text style={styles.mainText}>
            {completed} <Text style={styles.mainTextLight}>de {total} tareas</Text>
          </Text>
          <Text style={styles.motivation}>{motivation}</Text>
        </View>

        <View style={styles.circle}>
          <Text style={styles.circleNumber}>{percentage}</Text>
          <Text style={styles.circlePercent}>%</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percentage}%` }]} />
      </View>

      {/* Bottom badges */}
      <View style={styles.bottomRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{remaining} pendiente{remaining !== 1 ? "s" : ""}</Text>
        </View>
        <View style={[styles.badge, styles.badgeSuccess]}>
          <Text style={[styles.badgeText, styles.badgeTextSuccess]}>{completed} hecha{completed !== 1 ? "s" : ""}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  label: { color: "rgba(255,255,255,0.65)", fontSize: 10, fontWeight: "700", letterSpacing: 1.2, marginBottom: 4 },
  mainText: { color: "white", fontSize: 22, fontWeight: "800" },
  mainTextLight: { fontWeight: "400", opacity: 0.85, fontSize: 18 },
  motivation: { color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 4 },
  circle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center", justifyContent: "center",
    flexDirection: "row", alignSelf: "center",
  },
  circleNumber: { color: "white", fontSize: 22, fontWeight: "800" },
  circlePercent: { color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: "700", alignSelf: "flex-end", marginBottom: 4 },
  track: { height: 6, backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 3, overflow: "hidden", marginBottom: 12 },
  fill: { height: "100%", backgroundColor: "rgba(255,255,255,0.9)", borderRadius: 3 },
  bottomRow: { flexDirection: "row", gap: 8 },
  badge: { backgroundColor: "rgba(255,255,255,0.15)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeSuccess: { backgroundColor: "rgba(16,185,129,0.25)" },
  badgeText: { color: "rgba(255,255,255,0.9)", fontSize: 11, fontWeight: "600" },
  badgeTextSuccess: { color: "#6EE7B7" },
});
