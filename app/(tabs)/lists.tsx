import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { createList, deleteList, fetchLists } from "@/services/todoService";
import { TaskList } from "@/type/Task";
import { router, useFocusEffect } from "expo-router";
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
import { Toast, useToast } from "@/components/Toast";

const LIST_COLORS = ["#6366F1","#EF4444","#F97316","#10B981","#3B82F6","#8B5CF6","#EC4899","#F59E0B"];
const LIST_ICONS  = ["📋","💼","🏠","📚","🏃","🎯","💡","🛒","❤️","🎨"];

export default function ListsScreen() {
  const { getToken } = useAuth();
  const t = useTheme();
  const { toastProps, show: showToast } = useToast();
  const [lists, setLists] = useState<TaskList[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState(LIST_COLORS[0]);
  const [newIcon, setNewIcon] = useState(LIST_ICONS[0]);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        try {
          setLoading(true);
          const token = await getToken();
          const data = await fetchLists(token);
          setLists(data);
        } catch {
          showToast("Error al cargar listas", "error");
        } finally {
          setLoading(false);
        }
      };
      load();
    }, [getToken]),
  );

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    try {
      setSaving(true);
      const token = await getToken();
      const created = await createList({ title: newTitle.trim(), color: newColor, icon: newIcon }, token);
      setLists((prev) => [...prev, created]);
      setNewTitle("");
      setNewColor(LIST_COLORS[0]);
      setNewIcon(LIST_ICONS[0]);
      setShowForm(false);
      showToast("Lista creada", "success");
    } catch {
      showToast("No se pudo crear la lista", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = await getToken();
      await deleteList(id, token);
      setLists((prev) => prev.filter((l) => l.id !== id));
      showToast("Lista eliminada", "success");
    } catch {
      showToast("No se pudo eliminar", "error");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ flex: 1, paddingHorizontal: 20 }}>

        {/* HEADER */}
        <View style={{ paddingTop: 16, paddingBottom: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
          <View>
            <Text style={{ fontSize: 10, color: t.textMuted, fontWeight: "700", letterSpacing: 1, marginBottom: 4 }}>MIS LISTAS</Text>
            <Text style={{ fontSize: 24, fontWeight: "800", color: t.text, letterSpacing: -0.5 }}>Organiza por listas</Text>
          </View>
          <Pressable
            onPress={() => setShowForm(!showForm)}
            style={{ backgroundColor: t.accent, width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", shadowColor: t.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 }}
          >
            <Text style={{ color: "white", fontSize: 24, lineHeight: 28 }}>{showForm ? "✕" : "+"}</Text>
          </Pressable>
        </View>

        {/* CREATE FORM */}
        {showForm && (
          <View style={{ backgroundColor: t.card, borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: t.cardBorder, shadowColor: t.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 }}>
            <Text style={{ fontSize: 14, fontWeight: "700", color: t.text, marginBottom: 14 }}>Nueva lista</Text>

            <TextInput
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="Nombre de la lista..."
              placeholderTextColor={t.textPlaceholder}
              autoFocus
              style={{ borderWidth: 1.5, borderColor: newTitle.length > 0 ? t.accentMid : t.inputBorder, borderRadius: 12, padding: 14, fontSize: 15, color: t.text, backgroundColor: t.inputBg, marginBottom: 16 }}
            />

            {/* Icon picker */}
            <Text style={{ fontSize: 11, fontWeight: "700", color: t.textSecondary, marginBottom: 8, letterSpacing: 0.5 }}>ÍCONO</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {LIST_ICONS.map((icon) => (
                <Pressable
                  key={icon}
                  onPress={() => setNewIcon(icon)}
                  style={{ width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: newIcon === icon ? t.accentLight : t.cardHighlight, borderWidth: 2, borderColor: newIcon === icon ? t.accent : t.inputBorder }}
                >
                  <Text style={{ fontSize: 20 }}>{icon}</Text>
                </Pressable>
              ))}
            </View>

            {/* Color picker */}
            <Text style={{ fontSize: 11, fontWeight: "700", color: t.textSecondary, marginBottom: 8, letterSpacing: 0.5 }}>COLOR</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
              {LIST_COLORS.map((color) => (
                <Pressable
                  key={color}
                  onPress={() => setNewColor(color)}
                  style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: color, borderWidth: 3, borderColor: newColor === color ? (t.bg === "#0F172A" ? "#F1F5F9" : "#0F172A") : "transparent", alignItems: "center", justifyContent: "center" }}
                >
                  {newColor === color && <Text style={{ color: "white", fontSize: 14, fontWeight: "800" }}>✓</Text>}
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={handleCreate}
              disabled={!newTitle.trim() || saving}
              style={{ backgroundColor: newTitle.trim() ? t.accent : t.accentMid, borderRadius: 14, padding: 14, alignItems: "center" }}
            >
              {saving ? <ActivityIndicator color="white" /> : <Text style={{ color: "white", fontWeight: "700", fontSize: 15 }}>Crear lista</Text>}
            </Pressable>
          </View>
        )}

        {/* LIST */}
        {loading ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator color={t.accent} size="large" />
          </View>
        ) : lists.length === 0 ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 60 }}>
            <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: t.accentLight, alignItems: "center", justifyContent: "center", marginBottom: 16, borderWidth: 2, borderColor: t.accentMid }}>
              <Text style={{ fontSize: 40 }}>📋</Text>
            </View>
            <Text style={{ fontSize: 18, fontWeight: "800", color: t.text, marginBottom: 8 }}>Sin listas aún</Text>
            <Text style={{ fontSize: 13, color: t.textMuted, textAlign: "center" }}>
              Crea una lista para agrupar{"\n"}tus tareas por categoría
            </Text>
          </View>
        ) : (
          <FlatList
            data={lists}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            renderItem={({ item }) => (
              <View
                style={{
                  backgroundColor: t.card,
                  borderRadius: 18,
                  marginBottom: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  overflow: "hidden",
                  shadowColor: item.color,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                  elevation: 2,
                  borderWidth: 1,
                  borderColor: t.cardBorder,
                }}
              >
                <View style={{ width: 6, alignSelf: "stretch", backgroundColor: item.color }} />
                <View style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: item.color + "20", alignItems: "center", justifyContent: "center", marginHorizontal: 14 }}>
                  <Text style={{ fontSize: 24 }}>{item.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: "700", color: t.text }}>{item.title}</Text>
                  <Text style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>
                    {new Date(item.createdAt).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                  </Text>
                </View>
                <Pressable
                  onPress={() => handleDelete(item.id)}
                  hitSlop={12}
                  style={{ marginRight: 16, width: 32, height: 32, borderRadius: 8, backgroundColor: t.dangerLight, alignItems: "center", justifyContent: "center" }}
                >
                  <Text style={{ fontSize: 14, color: t.danger }}>✕</Text>
                </Pressable>
              </View>
            )}
          />
        )}
      </View>
      <Toast {...toastProps} />
    </SafeAreaView>
  );
}
