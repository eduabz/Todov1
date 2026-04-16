import { register } from "@/services/authService";
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

function PasswordStrength({ password }: { password: string }) {
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const score = [hasLength, hasUpper, hasNumber].filter(Boolean).length;
  const colors = ["#E2E8F0", "#EF4444", "#F59E0B", "#10B981"];
  const labels = ["", "Débil", "Regular", "Fuerte"];

  if (!password) return null;
  return (
    <View style={{ marginBottom: 16 }}>
      <View style={{ flexDirection: "row", gap: 4, marginBottom: 4 }}>
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              backgroundColor: i <= score ? colors[score] : "#E2E8F0",
            }}
          />
        ))}
      </View>
      <Text style={{ fontSize: 11, color: colors[score], fontWeight: "600" }}>
        {labels[score]}
        {score < 3 && password.length > 0 && (
          <>
            {!hasLength ? " · mín. 8 caracteres" : ""}
            {!hasUpper && hasLength ? " · agrega una mayúscula" : ""}
            {!hasNumber && hasLength && hasUpper ? " · agrega un número" : ""}
          </>
        )}
      </Text>
    </View>
  );
}

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password || !passwordConfirm) {
      setError("Completa todos los campos");
      return;
    }
    if (password !== passwordConfirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    try {
      setError(null);
      setLoading(true);
      await register({ fullName: fullName.trim(), email: email.trim(), password, passwordConfirm });
      router.replace("/(tabs)");
    } catch (err: unknown) {
      const msg = (err as any)?.code === "auth/email-already-in-use"
        ? "Este email ya está registrado"
        : (err as any)?.code === "auth/invalid-email"
        ? "El email no es válido"
        : "Error al crear la cuenta. Inténtalo de nuevo.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (value: string, hasError: boolean) => ({
    borderWidth: 1.5,
    borderColor: hasError ? "#FCA5A5" : value.length > 0 ? "#A5B4FC" : "#E2E8F0",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#0F172A",
    backgroundColor: "#FAFAFA",
    marginBottom: 20,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F1F5F9" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back */}
          <Pressable
            onPress={() => router.back()}
            style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 24 }}
          >
            <Text style={{ fontSize: 20, color: "#6366F1" }}>←</Text>
            <Text style={{ color: "#6366F1", fontSize: 14, fontWeight: "600" }}>Volver</Text>
          </Pressable>

          {/* Title */}
          <Text style={{ fontSize: 28, fontWeight: "800", color: "#0F172A", marginBottom: 4 }}>
            Crear cuenta
          </Text>
          <Text style={{ fontSize: 14, color: "#94A3B8", marginBottom: 28 }}>
            Únete y empieza a organizar tu vida
          </Text>

          {/* CARD */}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 20,
              padding: 24,
              shadowColor: "#6366F1",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 16,
              elevation: 4,
              borderWidth: 1,
              borderColor: "#EEF2FF",
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "700", color: "#64748B", marginBottom: 8, letterSpacing: 0.5 }}>
              NOMBRE COMPLETO
            </Text>
            <TextInput
              value={fullName}
              onChangeText={(t) => { setFullName(t); setError(null); }}
              placeholder="Juan Pérez"
              placeholderTextColor="#CBD5E1"
              autoCapitalize="words"
              style={inputStyle(fullName, false)}
            />

            <Text style={{ fontSize: 12, fontWeight: "700", color: "#64748B", marginBottom: 8, letterSpacing: 0.5 }}>
              EMAIL
            </Text>
            <TextInput
              value={email}
              onChangeText={(t) => { setEmail(t); setError(null); }}
              placeholder="correo@ejemplo.com"
              placeholderTextColor="#CBD5E1"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={inputStyle(email, false)}
            />

            <Text style={{ fontSize: 12, fontWeight: "700", color: "#64748B", marginBottom: 8, letterSpacing: 0.5 }}>
              CONTRASEÑA
            </Text>
            <View
              style={{
                flexDirection: "row",
                borderWidth: 1.5,
                borderColor: password.length > 0 ? "#A5B4FC" : "#E2E8F0",
                borderRadius: 12,
                backgroundColor: "#FAFAFA",
                marginBottom: 8,
                alignItems: "center",
              }}
            >
              <TextInput
                value={password}
                onChangeText={(t) => { setPassword(t); setError(null); }}
                placeholder="Mínimo 8 caracteres"
                placeholderTextColor="#CBD5E1"
                secureTextEntry={!showPassword}
                style={{ flex: 1, padding: 14, fontSize: 16, color: "#0F172A" }}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8} style={{ paddingRight: 14 }}>
                <Text style={{ fontSize: 18 }}>{showPassword ? "🙈" : "👁"}</Text>
              </Pressable>
            </View>

            <PasswordStrength password={password} />

            <Text style={{ fontSize: 12, fontWeight: "700", color: "#64748B", marginBottom: 8, letterSpacing: 0.5 }}>
              CONFIRMAR CONTRASEÑA
            </Text>
            <TextInput
              value={passwordConfirm}
              onChangeText={(t) => { setPasswordConfirm(t); setError(null); }}
              placeholder="Repite tu contraseña"
              placeholderTextColor="#CBD5E1"
              secureTextEntry={!showPassword}
              style={{
                borderWidth: 1.5,
                borderColor: passwordConfirm.length > 0 && password !== passwordConfirm
                  ? "#FCA5A5"
                  : passwordConfirm.length > 0 && password === passwordConfirm
                  ? "#6EE7B7"
                  : "#E2E8F0",
                borderRadius: 12,
                padding: 14,
                fontSize: 16,
                color: "#0F172A",
                backgroundColor: "#FAFAFA",
                marginBottom: 20,
              }}
            />

            {/* Error */}
            {error && (
              <View
                style={{
                  backgroundColor: "#FEF2F2",
                  borderRadius: 10,
                  padding: 12,
                  marginBottom: 16,
                  borderWidth: 1,
                  borderColor: "#FECACA",
                }}
              >
                <Text style={{ color: "#DC2626", fontSize: 13 }}>⚠ {error}</Text>
              </View>
            )}

            {/* Submit */}
            <Pressable
              onPress={handleRegister}
              disabled={loading}
              style={({ pressed }) => ({
                backgroundColor: loading ? "#C7D2FE" : pressed ? "#4F46E5" : "#6366F1",
                borderRadius: 14,
                padding: 16,
                alignItems: "center",
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
                  Crear cuenta
                </Text>
              )}
            </Pressable>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 24, gap: 6 }}>
            <Text style={{ color: "#94A3B8", fontSize: 14 }}>¿Ya tienes cuenta?</Text>
            <Pressable onPress={() => router.back()}>
              <Text style={{ color: "#6366F1", fontSize: 14, fontWeight: "700" }}>Inicia sesión</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
