import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { DatePicker } from "@/components/DatePicker";
import { updateTodo, fetchSubtasks, createSubtask, patchSubtaskCompleted, deleteSubtask } from "@/services/todoService";
import { Priority, Subtask } from "@/type/Task";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

let Haptics: typeof import("expo-haptics") | null = null;
if (Platform.OS !== "web") {
  try { Haptics = require("expo-haptics"); } catch {}
}

const PRIORITIES: { value: Priority; label: string; color: string; emoji: string }[] = [
  { value: "LOW",    label: "Baja",    color: "#94A3B8", emoji: "🔵" },
  { value: "MEDIUM", label: "Media",   color: "#3B82F6", emoji: "🟡" },
  { value: "HIGH",   label: "Alta",    color: "#F97316", emoji: "🟠" },
  { value: "URGENT", label: "Urgente", color: "#EF4444", emoji: "🔴" },
];

export default function EditTodoModal() {
  const { getToken } = useAuth();
  const t = useTheme();
  const params = useLocalSearchParams<{ id: string; title: string; description: string; priority: Priority; dueDate: string; tags: string }>();

  const [title, setTitle] = useState(params.title ?? "");
  const [description, setDescription] = useState(params.description ?? "");
  const [priority, setPriority] = useState<Priority>(params.priority ?? "MEDIUM");
  const [dueDate, setDueDate] = useState<string | null>(params.dueDate && params.dueDate !== "null" ? params.dueDate : null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialTags = params.tags && params.tags !== "null" ? params.tags.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(initialTags);

  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [subtaskInput, setSubtaskInput] = useState("");
  const [addingSubtask, setAddingSubtask] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken();
        const data = await fetchSubtasks(params.id, token);
        setSubtasks(data);
      } catch {
        // silent
      }
    };
    load();
  }, [params.id]);

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (tag && !tags.includes(tag)) setTags((prev) => [...prev, tag]);
    setTagInput("");
  };

  const handleAddSubtask = async () => {
    if (!subtaskInput.trim()) return;
    try {
      setAddingSubtask(true);
      const token = await getToken();
      const created = await createSubtask(params.id, subtaskInput.trim(), token);
      setSubtasks((prev) => [...prev, created]);
      setSubtaskInput("");
      Haptics?.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // silent
    } finally {
      setAddingSubtask(false);
    }
  };

  const handleToggleSubtask = async (subtask: Subtask) => {
    const newCompleted = !subtask.completed;
    setSubtasks((prev) => prev.map((s) => (s.id === subtask.id ? { ...s, completed: newCompleted } : s)));
    if (newCompleted) Haptics?.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      const token = await getToken();
      await patchSubtaskCompleted(params.id, subtask.id, newCompleted, token);
    } catch {
      setSubtasks((prev) => prev.map((s) => (s.id === subtask.id ? { ...s, completed: subtask.completed } : s)));
    }
  };

  const handleDeleteSubtask = async (id: string) => {
    Haptics?.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const token = await getToken();
      await deleteSubtask(params.id, id, token);
      setSubtasks((prev) => prev.filter((s) => s.id !== id));
    } catch {
      // silent
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) { setError("El título es obligatorio"); return; }
    try {
      setError(null);
      setLoading(true);
      const token = await getToken();
      await updateTodo(params.id, { title: title.trim(), description: description.trim(), priority, dueDate, tags: tags.length > 0 ? tags.join(",") : null }, token);
      Haptics?.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.dismiss();
    } catch (err) {
      Haptics?.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = title.trim().length > 0 && !loading;
  const completedSubtasks = subtasks.filter((s) => s.completed).length;

  const PRIORITY_BG: Record<Priority, string> = { LOW: "#F1F5F9", MEDIUM: "#DBEAFE", HIGH: "#FFF7ED", URGENT: "#FEF2F2" };
  const PRIORITY_BG_DARK: Record<Priority, string> = { LOW: "#1E293B", MEDIUM: "#1E3A5F", HIGH: "#431407", URGENT: "#450A0A" };
  const isDark = t.bg === "#0F172A";
  const getPriorityBg = (p: Priority, active: boolean) => active ? (isDark ? PRIORITY_BG_DARK[p] : PRIORITY_BG[p]) : t.cardHighlight;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">

          {/* HEADER */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 }}>
            <View>
              <Text style={{ fontSize: 10, color: t.accent, fontWeight: "700", letterSpacing: 1, marginBottom: 2 }}>EDITAR TAREA</Text>
              <Text style={{ fontSize: 22, fontWeight: "800", color: t.text }}>Modificar tarea</Text>
            </View>
            <Pressable onPress={() => router.dismiss()} hitSlop={12} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: t.cardBorder, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 18, color: t.textSecondary }}>✕</Text>
            </Pressable>
          </View>

          {/* MAIN CARD */}
          <View style={{ marginHorizontal: 20, backgroundColor: t.card, borderRadius: 20, padding: 20, shadowColor: t.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3, borderWidth: 1, borderColor: t.cardBorder }}>

            <Text style={{ fontSize: 12, fontWeight: "700", color: t.textSecondary, marginBottom: 8, letterSpacing: 0.5 }}>TÍTULO *</Text>
            <TextInput
              value={title}
              onChangeText={(v) => { setTitle(v); setError(null); }}
              maxLength={150}
              autoFocus
              placeholderTextColor={t.textPlaceholder}
              style={{ borderWidth: 1.5, borderColor: error ? t.danger : t.accentMid, borderRadius: 12, padding: 14, fontSize: 16, color: t.text, backgroundColor: t.inputBg, marginBottom: 4 }}
            />
            <Text style={{ fontSize: 11, color: t.textPlaceholder, textAlign: "right", marginBottom: 20 }}>{title.length}/150</Text>

            <Text style={{ fontSize: 12, fontWeight: "700", color: t.textSecondary, marginBottom: 8, letterSpacing: 0.5 }}>DESCRIPCIÓN</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              maxLength={500}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              placeholderTextColor={t.textPlaceholder}
              style={{ borderWidth: 1.5, borderColor: t.inputBorder, borderRadius: 12, padding: 14, fontSize: 15, color: t.text, backgroundColor: t.inputBg, minHeight: 90, marginBottom: 4 }}
            />
            <Text style={{ fontSize: 11, color: t.textPlaceholder, textAlign: "right", marginBottom: 20 }}>{description.length}/500</Text>

            <Text style={{ fontSize: 12, fontWeight: "700", color: t.textSecondary, marginBottom: 8, letterSpacing: 0.5 }}>PRIORIDAD</Text>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 20 }}>
              {PRIORITIES.map((p) => {
                const active = priority === p.value;
                return (
                  <Pressable
                    key={p.value}
                    onPress={() => { setPriority(p.value); Haptics?.selectionAsync(); }}
                    style={{ flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 12, backgroundColor: getPriorityBg(p.value, active), borderWidth: 2, borderColor: active ? p.color : t.inputBorder }}
                  >
                    <Text style={{ fontSize: 16, marginBottom: 2 }}>{p.emoji}</Text>
                    <Text style={{ fontSize: 10, fontWeight: "700", color: active ? p.color : t.textMuted }}>{p.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={{ fontSize: 12, fontWeight: "700", color: t.textSecondary, marginBottom: 8, letterSpacing: 0.5 }}>FECHA DE VENCIMIENTO</Text>
            <DatePicker value={dueDate} onChange={setDueDate} />

            {/* TAGS */}
            <Text style={{ fontSize: 12, fontWeight: "700", color: t.textSecondary, marginTop: 20, marginBottom: 8, letterSpacing: 0.5 }}>ETIQUETAS</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <TextInput
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={addTag}
                placeholder="trabajo, personal..."
                placeholderTextColor={t.textPlaceholder}
                returnKeyType="done"
                style={{ flex: 1, borderWidth: 1.5, borderColor: t.inputBorder, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, color: t.text, backgroundColor: t.inputBg }}
              />
              <Pressable onPress={addTag} style={{ backgroundColor: t.accentLight, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, borderWidth: 1.5, borderColor: t.accentMid }}>
                <Text style={{ color: t.accent, fontWeight: "700", fontSize: 14 }}>+</Text>
              </Pressable>
            </View>
            {tags.length > 0 && (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 4 }}>
                {tags.map((tag) => (
                  <Pressable
                    key={tag}
                    onPress={() => setTags((prev) => prev.filter((tg) => tg !== tag))}
                    style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: t.accentLight, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: t.accentMid }}
                  >
                    <Text style={{ fontSize: 12, color: t.accent, fontWeight: "600" }}>#{tag}</Text>
                    <Text style={{ fontSize: 10, color: t.textMuted }}>✕</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* SUBTASKS CARD */}
          <View style={{ marginHorizontal: 20, marginTop: 16, backgroundColor: t.card, borderRadius: 20, padding: 20, shadowColor: t.accent, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: t.cardBorder }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <Text style={{ fontSize: 12, fontWeight: "700", color: t.textSecondary, letterSpacing: 0.5 }}>SUBTAREAS</Text>
              {subtasks.length > 0 && (
                <Text style={{ fontSize: 12, fontWeight: "700", color: completedSubtasks === subtasks.length ? t.success : t.accent }}>
                  {completedSubtasks}/{subtasks.length}
                </Text>
              )}
            </View>

            {/* Progress bar */}
            {subtasks.length > 0 && (
              <View style={{ height: 4, backgroundColor: t.accentLight, borderRadius: 2, marginBottom: 14, overflow: "hidden" }}>
                <View style={{ height: "100%", width: `${(completedSubtasks / subtasks.length) * 100}%`, backgroundColor: t.success, borderRadius: 2 }} />
              </View>
            )}

            {/* Subtask list */}
            {subtasks.map((subtask) => (
              <View key={subtask.id} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: t.divider }}>
                <Pressable
                  onPress={() => handleToggleSubtask(subtask)}
                  style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: subtask.completed ? t.success : t.accentMid, backgroundColor: subtask.completed ? t.success : "transparent", alignItems: "center", justifyContent: "center", marginRight: 12 }}
                >
                  {subtask.completed && <Text style={{ color: "white", fontSize: 10, fontWeight: "800" }}>✓</Text>}
                </Pressable>
                <Text style={{ flex: 1, fontSize: 14, color: subtask.completed ? t.textMuted : t.text, textDecorationLine: subtask.completed ? "line-through" : "none" }}>
                  {subtask.title}
                </Text>
                <Pressable
                  onPress={() => handleDeleteSubtask(subtask.id)}
                  hitSlop={8}
                  style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: t.dangerLight, alignItems: "center", justifyContent: "center" }}
                >
                  <Text style={{ fontSize: 12, color: t.danger }}>✕</Text>
                </Pressable>
              </View>
            ))}

            {/* Add subtask */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: subtasks.length > 0 ? 12 : 0 }}>
              <TextInput
                value={subtaskInput}
                onChangeText={setSubtaskInput}
                onSubmitEditing={handleAddSubtask}
                placeholder="Agregar subtarea..."
                placeholderTextColor={t.textPlaceholder}
                returnKeyType="done"
                style={{ flex: 1, borderWidth: 1.5, borderColor: t.inputBorder, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, color: t.text, backgroundColor: t.inputBg }}
              />
              <Pressable
                onPress={handleAddSubtask}
                disabled={addingSubtask || !subtaskInput.trim()}
                style={{ backgroundColor: subtaskInput.trim() ? t.accentLight : t.cardHighlight, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, borderWidth: 1.5, borderColor: subtaskInput.trim() ? t.accentMid : t.inputBorder }}
              >
                {addingSubtask ? <ActivityIndicator color={t.accent} size="small" /> : <Text style={{ color: subtaskInput.trim() ? t.accent : t.textPlaceholder, fontWeight: "700", fontSize: 14 }}>+</Text>}
              </Pressable>
            </View>
          </View>

          {error && (
            <View style={{ marginHorizontal: 20, marginTop: 12, backgroundColor: t.dangerLight, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: t.danger + "44" }}>
              <Text style={{ color: t.danger, fontSize: 13 }}>⚠ {error}</Text>
            </View>
          )}

          <View style={{ marginHorizontal: 20, marginTop: 20 }}>
            <Pressable
              onPress={handleSubmit}
              disabled={!canSubmit}
              style={({ pressed }) => ({ backgroundColor: canSubmit ? (pressed ? t.accentDark : t.accent) : t.accentMid, borderRadius: 16, padding: 18, alignItems: "center", shadowColor: t.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: canSubmit ? 0.35 : 0, shadowRadius: 12, elevation: canSubmit ? 6 : 0 })}
            >
              {loading ? <ActivityIndicator color="white" /> : <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>Guardar cambios</Text>}
            </Pressable>
            <Pressable onPress={() => router.dismiss()} style={{ alignItems: "center", padding: 16 }}>
              <Text style={{ color: t.textMuted, fontSize: 14, fontWeight: "500" }}>Cancelar</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
