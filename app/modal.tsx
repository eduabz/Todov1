import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { DatePicker } from "@/components/DatePicker";
import { createTodo } from "@/services/todoService";
import { Priority } from "@/type/Task";
import { router } from "expo-router";
import { useState } from "react";
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

export default function CreateTodoModal() {
  const { getToken } = useAuth();
  const t = useTheme();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (tag && !tags.includes(tag)) setTags((prev) => [...prev, tag]);
    setTagInput("");
  };

  const handleSubmit = async () => {
    if (!title.trim()) { setError("El título es obligatorio"); return; }
    try {
      setError(null);
      setLoading(true);
      const token = await getToken();
      await createTodo({ title: title.trim(), description: description.trim(), priority, dueDate, tags: tags.length > 0 ? tags.join(",") : null }, token);
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

  const PRIORITY_BG: Record<Priority, string> = {
    LOW: "#F1F5F9", MEDIUM: "#DBEAFE", HIGH: "#FFF7ED", URGENT: "#FEF2F2",
  };
  const PRIORITY_BG_DARK: Record<Priority, string> = {
    LOW: "#1E293B", MEDIUM: "#1E3A5F", HIGH: "#431407", URGENT: "#450A0A",
  };
  const isDark = t.bg === "#0F172A";
  const getPriorityBg = (p: Priority, active: boolean) => {
    if (!active) return t.cardHighlight;
    return isDark ? PRIORITY_BG_DARK[p] : PRIORITY_BG[p];
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">

          {/* HEADER */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 }}>
            <View>
              <Text style={{ fontSize: 10, color: t.textMuted, fontWeight: "700", letterSpacing: 1, marginBottom: 2 }}>NUEVA TAREA</Text>
              <Text style={{ fontSize: 22, fontWeight: "800", color: t.text }}>¿Qué vas a hacer?</Text>
            </View>
            <Pressable onPress={() => router.dismiss()} hitSlop={12} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: t.cardBorder, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 18, color: t.textSecondary }}>✕</Text>
            </Pressable>
          </View>

          {/* CARD */}
          <View style={{ marginHorizontal: 20, backgroundColor: t.card, borderRadius: 20, padding: 20, shadowColor: t.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3, borderWidth: 1, borderColor: t.cardBorder }}>

            <Text style={{ fontSize: 12, fontWeight: "700", color: t.textSecondary, marginBottom: 8, letterSpacing: 0.5 }}>TÍTULO *</Text>
            <TextInput
              placeholder="Ej: Preparar presentación del viernes"
              value={title}
              onChangeText={(v) => { setTitle(v); setError(null); }}
              maxLength={150}
              autoFocus
              placeholderTextColor={t.textPlaceholder}
              style={{ borderWidth: 1.5, borderColor: error ? t.danger : title.length > 0 ? t.accentMid : t.inputBorder, borderRadius: 12, padding: 14, fontSize: 16, color: t.text, backgroundColor: t.inputBg, marginBottom: 4 }}
            />
            <Text style={{ fontSize: 11, color: t.textPlaceholder, textAlign: "right", marginBottom: 20 }}>{title.length}/150</Text>

            <Text style={{ fontSize: 12, fontWeight: "700", color: t.textSecondary, marginBottom: 8, letterSpacing: 0.5 }}>DESCRIPCIÓN</Text>
            <TextInput
              placeholder="Detalles opcionales..."
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
                placeholder="trabajo, personal, urgente..."
                placeholderTextColor={t.textPlaceholder}
                returnKeyType="done"
                style={{ flex: 1, borderWidth: 1.5, borderColor: t.inputBorder, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, color: t.text, backgroundColor: t.inputBg }}
              />
              <Pressable onPress={addTag} style={{ backgroundColor: t.accentLight, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, borderWidth: 1.5, borderColor: t.accentMid }}>
                <Text style={{ color: t.accent, fontWeight: "700", fontSize: 14 }}>+</Text>
              </Pressable>
            </View>
            {tags.length > 0 && (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
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
              {loading ? <ActivityIndicator color="white" /> : <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>Crear tarea</Text>}
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
