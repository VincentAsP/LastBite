import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { loginUser } from "../api/authApi";

const ERROR_MESSAGES: Record<number, string> = {
  400: "Email dan password wajib diisi",
  401: "Email atau password salah",
  403: "Email belum diverifikasi",
  500: "Kesalahan pada server. Silakan coba lagi nanti",
};

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError(ERROR_MESSAGES[400]);
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser({
        email: email.trim(),
        password: password.trim(),
      });

      console.log("Login success:", data);

      if (data.user?.roleID === 3) {
        router.replace("/Adminreport");
      } else {
        router.replace("/home");
      }
    } catch (e: any) {
      const status = e.response?.status || 500;

      // Kalau inactive → redirect ke OTP verify
      if (status === 403) {
        router.push({ pathname: "/otpverify", params: { email: email.trim() } });
        return;
      }

      const msg = ERROR_MESSAGES[status] || e.message || ERROR_MESSAGES[500];
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#DAE6D8", "#92AF8C"]} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <Image
          source={{
            uri: "https://api.builder.io/api/v1/image/assets/TEMP/50cba1698601e650ab853fd68a32e371ac49f6cf?width=298",
          }}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Title */}
        <Text style={styles.title}>Sign In</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Access your account to manage settings,{"\n"}explore features.
        </Text>

        {/* Error Banner */}
        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={16} color="#B91C1C" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Email Field */}
        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              if (error) setError(null);
            }}
            placeholder="example@gmail.com"
            placeholderTextColor="rgba(116, 139, 111, 0.4)"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        {/* Password Field */}
        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                if (error) setError(null);
              }}
              placeholder="Enter your password here"
              placeholderTextColor="rgba(116, 139, 111, 0.4)"
              secureTextEntry={!showPassword}
              editable={!loading}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={18}
                color="#748B6F"
              />
            </Pressable>
          </View>
        </View>

        {/* Forgot Password */}
        <View style={styles.rowBetween}>
          <Pressable onPress={() => router.push("/forgotpassword")}>
            <Text style={styles.smallText}>Forgot Password?</Text>
          </Pressable>
        </View>

        {/* Login Button */}
        <Pressable
          style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>Get Started</Text>
          )}
        </Pressable>

        {/* Sign up link */}
        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <Link href="/signup" asChild>
            <Pressable>
              <Text style={styles.signupLink}>Sign up</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const shadowStyle = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  android: { elevation: 4 },
  default: { boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)" },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
    maxWidth: 402,
    alignSelf: "center",
    width: "100%",
  },
  logo: { width: 144, height: 144, marginTop: 32, marginBottom: 24 },
  title: { fontSize: 30, fontWeight: "700", color: "#748B6F", textAlign: "center", marginBottom: 4 },
  subtitle: { fontSize: 12, color: "#748B6F", textAlign: "center", marginBottom: 24 },
  errorBanner: {
    width: "100%", flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#FEE2E2", borderLeftWidth: 3, borderLeftColor: "#DC2626",
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 16,
  },
  errorText: { flex: 1, fontSize: 12, fontWeight: "600", color: "#B91C1C", lineHeight: 16 },
  field: { width: "100%", marginBottom: 12 },
  label: { fontSize: 14, fontWeight: "700", color: "#748B6F", marginBottom: 8, paddingLeft: 4 },
  input: {
    width: "100%", height: 41, borderRadius: 999, backgroundColor: "#fff",
    paddingHorizontal: 20, fontSize: 12, color: "#748B6F", ...shadowStyle,
  },
  passwordContainer: { position: "relative", justifyContent: "center" },
  passwordInput: {
    width: "100%", height: 41, borderRadius: 999, backgroundColor: "#fff",
    paddingLeft: 20, paddingRight: 48, fontSize: 12, color: "#748B6F", ...shadowStyle,
  },
  eyeIcon: { position: "absolute", right: 16, height: "100%", justifyContent: "center" },
  rowBetween: {
    width: "100%", flexDirection: "row", justifyContent: "flex-end",
    alignItems: "center", marginTop: 4, marginBottom: 24, paddingHorizontal: 4,
  },
  smallText: { fontSize: 12, fontWeight: "700", color: "#324D3E" },
  primaryButton: {
    paddingHorizontal: 32, height: 40, borderRadius: 999, backgroundColor: "#324D3E",
    alignItems: "center", justifyContent: "center", marginBottom: 24, ...shadowStyle,
  },
  primaryButtonDisabled: { opacity: 0.6 },
  primaryButtonText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  signupRow: { flexDirection: "row", alignItems: "center", marginTop: 16 },
  signupText: { color: "#fff", fontSize: 14 },
  signupLink: { color: "#748B6F", fontSize: 14, fontWeight: "700" },
});
