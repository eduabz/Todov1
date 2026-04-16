import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { fetchTodos, deleteTodo, patchTodoCompleted } from "@/services/todoService";
import { Task } from "@/type/Task";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TaskItem } from "@/components/TaskItem";
import { Toast, useToast } from "@/components/Toast";

export default function SearchScreen() {
  const { getToken } = useAuth();
  const t = useTheme();
  const { toastProps, show: showToast } = useToast();
  const [query, setQuery] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        try {
          setLoading(true);
          const token = await getToken();
          const data = await fetchTodos(token);
          setTasks(data);
        } catch {
          // silent
        } finally {
          setLoading(false);
        }
      };
      load();
    }, [getToken]),
  );

  const handleToggle = async (id: string) => {
    const task = tasks.find((tk) => tk.id === id);
    if (!task) return;
    const newCompleted = !task.completed;
    setTasks((prev) => prev.map((tk) => (tk.id === id ? { ...tk, completed: newCompleted } : tk)));
    try {
      const token = await getToken();
      await patchTodoCompleted(id, newCompleted, token);
    } catch {
      setTasks((prev) => prev.map((tk) => (tk.id === id ? { ...tk, completed: task.completed } : tk)));
      showToast("No se pudo actualizar", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = await getToken();
      await deleteTodo(id, token);
      setTasks((prev) => prev.filter((tk) => tk.id !== id));
      showToast("Tarea eliminada", "success");
    } catch {
      showToast("No se pudo eliminar", "error");
    }
  };

  const trimmed = query.trim().toLowerCase();
  const filtered = trimmed
    ? tasks.filter(
        (tk) =>
          tk.title.toLowerCase().includes(trimmed) ||
          tk.description?.toLowerCase().includes(trimmed) ||
          tk.tags?.toLowerCase().includes(trimmed),
      )
    : [];

  const pendingCount   = tasks.filter((tk) => !tk.completed).length;
  const completedCount = tasks.filter((tk) => tk.completed).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ flex: 1, paddingHorizontal: 20 }}>

        {/* HEADER */}
        <View style={{ paddingTop: 16, paddingBottom: 20 }}>
          <Text style={{ fontSize: 10, color: t.textMuted, fontWeight: "700", letterSpacing: 1, marginBottom: 4 }}>BUSCAR</Text>
          <Text style={{ fontSize: 24, fontWeight: "800", color: t.text, letterSpacing: -0.5 }}>Encuentra tus tareas</Text>
        </View>

        {/* SEARCH BAR */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: t.card,
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 4,
            marginBottom: 20,
            borderWidth: 2,
            borderColor: focused ? t.accent : t.inputBorder,
            shadowColor: focused ? t.accent : t.text,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: focused ? 0.15 : 0.04,
            shadowRadius: 8,
            elevation: focused ? 3 : 1,
          }}
        >
          <Text style={{ fontSize: 18, marginRight: 10 }}>🔍</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Título, descripción o #etiqueta..."
            placeholderTextColor={t.textPlaceholder}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{ flex: 1, fontSize: 15, color: t.text, paddingVertical: 12 }}
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")} hitSlop={8}>
              <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: t.cardBorder, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 12, color: t.textSecondary }}>✕</Text>
              </View>
            </Pressable>
          )}
        </View>

        {/* STATS CHIPS */}
        {!trimmed && !loading && (
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
            <View style={{ flex: 1, backgroundColor: t.accentLight, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: t.accentMid }}>
              <Text style={{ fontSize: 24, fontWeight: "800", color: t.accent }}>{tasks.length}</Text>
              <Text style={{ fontSize: 12, color: t.accent, fontWeight: "600", marginTop: 2 }}>Total tareas</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: t.warningLight, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: t.warning + "44" }}>
              <Text style={{ fontSize: 24, fontWeight: "800", color: t.warning }}>{pendingCount}</Text>
              <Text style={{ fontSize: 12, color: t.warning, fontWeight: "600", marginTop: 2 }}>Pendientes</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: t.successLight, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: t.success + "44" }}>
              <Text style={{ fontSize: 24, fontWeight: "800", color: t.success }}>{completedCount}</Text>
              <Text style={{ fontSize: 12, color: t.success, fontWeight: "600", marginTop: 2 }}>Completadas</Text>
            </View>
          </View>
        )}

        {/* HINT */}
        {!trimmed && !loading && (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 60 }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: t.accentLight, alignItems: "center", justifyContent: "center", marginBottom: 16, borderWidth: 2, borderColor: t.accentMid }}>
              <Text style={{ fontSize: 36 }}>🔍</Text>
            </View>
            <Text style={{ fontSize: 17, fontWeight: "700", color: t.text, marginBottom: 6 }}>Busca cualquier tarea</Text>
            <Text style={{ fontSize: 13, color: t.textMuted, textAlign: "center" }}>
              Escribe el título, descripción{"\n"}o una #etiqueta
            </Text>
          </View>
        )}

        {loading && (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator color={t.accent} size="large" />
          </View>
        )}

        {/* RESULTS */}
        {trimmed && !loading && (
          <>
            <Text style={{ fontSize: 13, color: t.textMuted, fontWeight: "600", marginBottom: 12 }}>
              {filtered.length === 0
                ? "Sin resultados"
                : `${filtered.length} resultado${filtered.length !== 1 ? "s" : ""} para "${query}"`}
            </Text>

            {filtered.length === 0 ? (
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 60 }}>
                <Text style={{ fontSize: 48, marginBottom: 12 }}>😕</Text>
                <Text style={{ fontSize: 17, fontWeight: "700", color: t.text, marginBottom: 6 }}>No encontramos nada</Text>
                <Text style={{ fontSize: 13, color: t.textMuted, textAlign: "center" }}>Intenta con otras palabras</Text>
              </View>
            ) : (
              <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TaskItem task={item} onToggle={handleToggle} onDelete={handleDelete} />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
              />
            )}
          </>
        )}
      </View>
      <Toast {...toastProps} />
    </SafeAreaView>
  );
}
