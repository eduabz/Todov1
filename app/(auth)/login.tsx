import { signIn } from "@/services/authService";
import { useTheme } from "@/hooks/useTheme";
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

export default function LoginScreen() {
  const t = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("Completa todos los campos");
      return;
    }
    try {
      setError(null);
      setLoading(true);
      await signIn(email.trim(), password);
      router.replace("/(tabs)");
    } catch {
      setError("Email o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* TOP BRAND SECTION */}
          <View
            style={{
              backgroundColor: t.accent,
              paddingTop: 48,
              paddingBottom: 48,
              alignItems: "center",
              borderBottomLeftRadius: 32,
              borderBottomRightRadius: 32,
            }}
          >
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                backgroundColor: "rgba(255,255,255,0.2)",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
                borderWidth: 2,
                borderColor: "rgba(255,255,255,0.3)",
              }}
            >
              <Text style={{ fontSize: 36 }}>✅</Text>
            </View>
            <Text style={{ color: "white", fontSize: 28, fontWeight: "800", letterSpacing: -0.5 }}>
              TodoApp
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, marginTop: 4 }}>
              Organiza tu día, logra tus metas
            </Text>
          </View>

          {/* FORM SECTION */}
          <View style={{ paddingHorizontal: 24, paddingTop: 32 }}>
            <Text style={{ fontSize: 22, fontWeight: "800", color: t.text, marginBottom: 4 }}>
              Bienvenido de vuelta
            </Text>
            <Text style={{ fontSize: 14, color: t.textMuted, marginBottom: 24 }}>
              Inicia sesión para continuar
            </Text>

            {/* CARD */}
            <View
              style={{
                backgroundColor: t.card,
                borderRadius: 20,
                padding: 24,
                shadowColor: "#6366F1",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 16,
                elevation: 4,
                borderWidth: 1,
                borderColor: t.cardBorder,
              }}
            >
              {/* Email */}
              <Text style={{ fontSize: 12, fontWeight: "700", color: t.textSecondary, marginBottom: 8, letterSpacing: 0.5 }}>
                EMAIL
              </Text>
              <TextInput
                value={email}
                onChangeText={(t) => { setEmail(t); setError(null); }}
                placeholder="correo@ejemplo.com"
                placeholderTextColor={t.textPlaceholder}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={{
                  borderWidth: 1.5,
                  borderColor: error ? t.danger : email.length > 0 ? t.accentMid : t.inputBorder,
                  borderRadius: 12,
                  padding: 14,
                  fontSize: 16,
                  color: t.text,
                  backgroundColor: t.inputBg,
                  marginBottom: 20,
                }}
              />

              {/* Password */}
              <Text style={{ fontSize: 12, fontWeight: "700", color: t.textSecondary, marginBottom: 8, letterSpacing: 0.5 }}>
                CONTRASEÑA
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  borderWidth: 1.5,
                  borderColor: error ? t.danger : password.length > 0 ? t.accentMid : t.inputBorder,
                  borderRadius: 12,
                  backgroundColor: t.inputBg,
                  marginBottom: 8,
                  alignItems: "center",
                }}
              >
                <TextInput
                  value={password}
                  onChangeText={(t) => { setPassword(t); setError(null); }}
                  placeholder="Tu contraseña"
                  placeholderTextColor={t.textPlaceholder}
                  secureTextEntry={!showPassword}
                  style={{
                    flex: 1,
                    padding: 14,
                    fontSize: 16,
                    color: t.text,
                  }}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={8}
                  style={{ paddingRight: 14 }}
                >
                  <Text style={{ fontSize: 18 }}>{showPassword ? "🙈" : "👁"}</Text>
                </Pressable>
              </View>

              {/* Error */}
              {error && (
                <View
                  style={{
                    backgroundColor: t.dangerLight,
                    borderRadius: 10,
                    padding: 12,
                    marginBottom: 16,
                    borderWidth: 1,
                    borderColor: t.danger + "44",
                  }}
                >
                  <Text style={{ color: t.danger, fontSize: 13 }}>⚠ {error}</Text>
                </View>
              )}

              {/* Submit */}
              <Pressable
                onPress={handleLogin}
                disabled={loading}
                style={({ pressed }) => ({
                  backgroundColor: loading ? t.accentMid : pressed ? t.accentDark : t.accent,
                  borderRadius: 14,
                  padding: 16,
                  alignItems: "center",
                  marginTop: error ? 0 : 8,
                  shadowColor: "#6366F1",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: loading ? 0 : 0.35,
                  shadowRadius: 10,
                  elevation: loading ? 0 : 6,
                })}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>
                    Iniciar sesión
                  </Text>
                )}
              </Pressable>
            </View>

            {/* Register link */}
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 24, gap: 6 }}>
              <Text style={{ color: t.textMuted, fontSize: 14 }}>¿No tienes cuenta?</Text>
              <Pressable onPress={() => router.push("/(auth)/register")}>
                <Text style={{ color: t.accent, fontSize: 14, fontWeight: "700" }}>
                  Regístrate
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
