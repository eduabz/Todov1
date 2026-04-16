import { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";

type Props = {
  value: string | null;
  onChange: (date: string | null) => void;
};

function formatDisplay(dateStr: string | null): string {
  if (!dateStr) return "Sin fecha";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" });
}

// ── Web ──────────────────────────────────────────────────────────────────────
function WebDatePicker({ value, onChange }: Props) {
  const t = useTheme();
  return (
    <View>
      <input
        type="date"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        min={new Date().toISOString().split("T")[0]}
        style={{
          width: "100%",
          padding: "12px 14px",
          fontSize: 15,
          borderRadius: 12,
          border: "1.5px solid",
          borderColor: value ? t.accentMid : t.inputBorder,
          backgroundColor: t.inputBg,
          color: value ? t.text : t.textPlaceholder,
          outline: "none",
          fontFamily: "inherit",
          boxSizing: "border-box",
        }}
      />
      {value && (
        <Pressable onPress={() => onChange(null)} style={{ position: "absolute", right: 10, top: 10 }}>
          <Text style={{ color: t.textMuted, fontSize: 16 }}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

// ── Native ───────────────────────────────────────────────────────────────────
function NativeDatePicker({ value, onChange }: Props) {
  const t = useTheme();
  const [show, setShow] = useState(false);
  const DateTimePicker = require("@react-native-community/datetimepicker").default;
  const today = new Date();
  const selected = value ? new Date(value + "T00:00:00") : today;

  return (
    <View>
      <Pressable
        onPress={() => setShow(true)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1.5,
          borderColor: value ? t.accentMid : t.inputBorder,
          borderRadius: 12,
          padding: 14,
          backgroundColor: t.inputBg,
          gap: 8,
        }}
      >
        <Text style={{ fontSize: 16 }}>📅</Text>
        <Text style={{ flex: 1, fontSize: 15, color: value ? t.text : t.textPlaceholder }}>
          {formatDisplay(value)}
        </Text>
        {value && (
          <Pressable
            onPress={() => onChange(null)}
            hitSlop={8}
            style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: t.cardBorder, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ fontSize: 11, color: t.textSecondary }}>✕</Text>
          </Pressable>
        )}
      </Pressable>

      {show && (
        <DateTimePicker
          value={selected}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          minimumDate={today}
          onChange={(_: any, date?: Date) => {
            setShow(false);
            if (date) onChange(date.toISOString().split("T")[0]);
          }}
        />
      )}
    </View>
  );
}

// ── Export ───────────────────────────────────────────────────────────────────
export function DatePicker(props: Props) {
  if (Platform.OS === "web") return <WebDatePicker {...props} />;
  return <NativeDatePicker {...props} />;
}
