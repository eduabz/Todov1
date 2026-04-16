import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Platform, RefreshControl, View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmptyState } from "@/components/EmptyState";
import { ErrorBanner } from "@/components/ErrorBanner";
import { FAB } from "@/components/FAB";
import { TaskCounter } from "@/components/TaskCounter";
import { TaskFilter, FilterValue } from "@/components/TaskFilter";
import { SwipeableTaskItem } from "@/components/SwipeableTaskItem";
import { TaskListSkeleton } from "@/components/TaskItemSkeleton";
import { Toast, useToast } from "@/components/Toast";
import { UserAvatar } from "@/components/UserAvatar";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { signOut } from "@/services/authService";
import { deleteTodo, fetchTodos, patchTodoCompleted } from "@/services/todoService";
import { Task } from "@/type/Task";

let Haptics: typeof import("expo-haptics") | null = null;
if (Platform.OS !== "web") {
  try { Haptics = require("expo-haptics"); } catch {}
}

type SortValue = "priority" | "dueDate" | "createdAt";

const PRIORITY_ORDER = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

const DAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MONTHS = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

function getDateString() {
  const now = new Date();
  return `${DAYS[now.getDay()]}, ${now.getDate()} de ${MONTHS[now.getMonth()]}`;
}

function isToday(dateStr: string | null) {
  if (!dateStr) return false;
  return dateStr === new Date().toISOString().split("T")[0];
}

function isOverdue(dateStr: string | null) {
  if (!dateStr) return false;
  return dateStr < new Date().toISOString().split("T")[0];
}

function sortTasks(tasks: Task[], sort: SortValue): Task[] {
  return [...tasks].sort((a, b) => {
    if (sort === "priority") {
      const pa = PRIORITY_ORDER[a.priority as keyof typeof PRIORITY_ORDER] ?? 2;
      const pb = PRIORITY_ORDER[b.priority as keyof typeof PRIORITY_ORDER] ?? 2;
      return pa - pb;
    }
    if (sort === "dueDate") {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

const SORT_OPTIONS: { value: SortValue; label: string; emoji: string }[] = [
  { value: "priority",  label: "Prioridad", emoji: "🔺" },
  { value: "dueDate",   label: "Fecha",     emoji: "📅" },
  { value: "createdAt", label: "Recientes", emoji: "🕐" },
];

export default function HomeScreen() {
  const { getToken, user } = useAuth();
  const t = useTheme();
  const { toastProps, show: showToast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterValue>("pending");
  const [sort, setSort] = useState<SortValue>("priority");
  const [showSort, setShowSort] = useState(false);

  const loadTasks = useCallback(async () => {
    try {
      setError(null);
      const token = await getToken();
      const data = await fetchTodos(token);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [getToken]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadTasks().finally(() => setLoading(false));
    }, [loadTasks]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  };

  const handleToggle = async (id: string) => {
    const task = tasks.find((tk) => tk.id === id);
    if (!task) return;
    const newCompleted = !task.completed;
    setTasks((prev) => prev.map((tk) => (tk.id === id ? { ...tk, completed: newCompleted } : tk)));
    if (newCompleted) Haptics?.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      const token = await getToken();
      await patchTodoCompleted(id, newCompleted, token);
      showToast(newCompleted ? "¡Tarea completada! 🎉" : "Tarea pendiente de nuevo", "success");
    } catch {
      setTasks((prev) => prev.map((tk) => (tk.id === id ? { ...tk, completed: task.completed } : tk)));
      showToast("No se pudo actualizar la tarea", "error");
    }
  };

  const handleDelete = async (id: string) => {
    Haptics?.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const token = await getToken();
      await deleteTodo(id, token);
      setTasks((prev) => prev.filter((tk) => tk.id !== id));
      showToast("Tarea eliminada", "success");
    } catch {
      showToast("No se pudo eliminar la tarea", "error");
    }
  };

  const handleEdit = (task: Task) => {
    router.push({
      pathname: "/edit-modal",
      params: {
        id: task.id,
        title: task.title,
        description: task.description ?? "",
        priority: task.priority ?? "MEDIUM",
        dueDate: task.dueDate ?? "",
        tags: task.tags ?? "",
      },
    });
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/login");
  };

  const pendingTasks   = tasks.filter((tk) => !tk.completed);
  const completedTasks = tasks.filter((tk) => tk.completed);
  const todayTasks     = tasks.filter((tk) => !tk.completed && (isToday(tk.dueDate) || isOverdue(tk.dueDate)));

  const filteredTasks = (() => {
    let base: Task[];
    if (filter === "pending")   base = pendingTasks;
    else if (filter === "completed") base = completedTasks;
    else if (filter === "today")     base = todayTasks;
    else base = tasks;
    return sortTasks(base, sort);
  })();

  const completedCount = completedTasks.length;
  const displayName = user?.displayName ?? user?.email?.split("@")[0] ?? "Usuario";
  const firstName = displayName.split(" ")[0];

  const FILTER_EMPTY = {
    pending:   { icon: "🎉", title: "¡Todo al día!", subtitle: "No tienes tareas pendientes. ¡Excelente!" },
    completed: { icon: "⏳", title: "Sin completadas", subtitle: "Completa alguna tarea para verla aquí" },
    today:     { icon: "🌅", title: "Sin tareas para hoy", subtitle: "No tienes tareas vencidas ni para hoy" },
    all:       { icon: "🚀", title: "Sin tareas", subtitle: "" },
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ flex: 1, paddingHorizontal: 20 }}>

        {/* HEADER */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 16, paddingBottom: 20 }}>
          <View>
            <Text style={{ fontSize: 12, color: t.textMuted, fontWeight: "500", marginBottom: 2 }}>{getDateString()}</Text>
            <Text style={{ fontSize: 24, fontWeight: "800", color: t.text, letterSpacing: -0.5 }}>
              {getGreeting()},{"\n"}<Text style={{ color: t.accent }}>{firstName} 👋</Text>
            </Text>
          </View>
          <View style={{ alignItems: "flex-end", gap: 8 }}>
            <UserAvatar name={displayName} size="lg" onPress={handleSignOut} />
            <Text style={{ fontSize: 10, color: t.textMuted, fontWeight: "500" }}>Cerrar sesión</Text>
          </View>
        </View>

        {/* COUNTER */}
        {!loading && !error && tasks.length > 0 && (
          <TaskCounter completed={completedCount} total={tasks.length} />
        )}

        {/* SECTION TITLE + SORT */}
        {!loading && !error && tasks.length > 0 && (
          <>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: t.text }}>Mis tareas</Text>
              <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                <Pressable
                  onPress={() => setShowSort(!showSort)}
                  style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: t.accentLight, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 }}
                >
                  <Text style={{ fontSize: 12 }}>{SORT_OPTIONS.find(s => s.value === sort)?.emoji}</Text>
                  <Text style={{ fontSize: 11, fontWeight: "700", color: t.accent }}>
                    {SORT_OPTIONS.find(s => s.value === sort)?.label}
                  </Text>
                </Pressable>
                <Pressable onPress={() => router.push("/modal")}>
                  <Text style={{ fontSize: 13, color: t.accent, fontWeight: "600" }}>+ Nueva</Text>
                </Pressable>
              </View>
            </View>

            {/* Sort dropdown */}
            {showSort && (
              <View style={{ backgroundColor: t.card, borderRadius: 14, padding: 6, marginBottom: 10, borderWidth: 1, borderColor: t.cardBorder, shadowColor: t.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 }}>
                {SORT_OPTIONS.map((s) => (
                  <Pressable
                    key={s.value}
                    onPress={() => { setSort(s.value); setShowSort(false); }}
                    style={{ flexDirection: "row", alignItems: "center", gap: 10, padding: 10, borderRadius: 10, backgroundColor: sort === s.value ? t.accentLight : "transparent" }}
                  >
                    <Text style={{ fontSize: 16 }}>{s.emoji}</Text>
                    <Text style={{ fontSize: 14, fontWeight: sort === s.value ? "700" : "500", color: sort === s.value ? t.accent : t.textSecondary }}>{s.label}</Text>
                    {sort === s.value && <Text style={{ marginLeft: "auto", color: t.accent }}>✓</Text>}
                  </Pressable>
                ))}
              </View>
            )}

            <TaskFilter
              value={filter}
              onChange={(v) => { setFilter(v); setShowSort(false); }}
              counts={{ all: tasks.length, today: todayTasks.length, pending: pendingTasks.length, completed: completedTasks.length }}
            />
          </>
        )}

        {loading && <TaskListSkeleton count={4} />}

        {!loading && error && (
          <View style={{ marginTop: 8 }}>
            <ErrorBanner message={error} onRetry={loadTasks} />
          </View>
        )}

        {!loading && !error && tasks.length === 0 && (
          <EmptyState icon="🚀" title="¡Empieza hoy!" subtitle="Crea tu primera tarea y comienza a organizar tu día" actionLabel="Crear tarea" onAction={() => router.push("/modal")} />
        )}

        {!loading && !error && tasks.length > 0 && filteredTasks.length === 0 && (
          <EmptyState
            icon={FILTER_EMPTY[filter].icon}
            title={FILTER_EMPTY[filter].title}
            subtitle={FILTER_EMPTY[filter].subtitle}
          />
        )}

        {!loading && !error && filteredTasks.length > 0 && (
          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <SwipeableTaskItem task={item} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleEdit} />
            )}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={t.accent} colors={[t.accent]} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </View>

      {!loading && <FAB onPress={() => router.push("/modal")} />}
      <Toast {...toastProps} />
    </SafeAreaView>
  );
}
