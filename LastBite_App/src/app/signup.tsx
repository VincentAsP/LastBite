import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { loginUser, registerUser } from "../api/authApi";

const BASE_URL = "https://backpack-outcast-upfront.ngrok-free.dev";

// === Error code mapping ===
const REGISTER_ERRORS: Record<number, string> = {
  400: "Email sudah terdaftar",
  500: "Kesalahan internal server. Silakan coba lagi",
};

const LOGIN_ERRORS: Record<number, string> = {
  400: "Email dan password wajib diisi",
  401: "Email atau password salah",
  403: "Email belum diverifikasi. Cek inbox kamu.",
  500: "Kesalahan pada server. Silakan coba lagi nanti",
};

export default function SignUp() {
  const [activeTab, setActiveTab] = useState<"signup" | "signin">("signup");
  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleTabChange = (tab: "signup" | "signin") => {
    setActiveTab(tab);
    setError(null);
  };

  const handleSignUp = async () => {
    setError(null);

    if (!agreed) {
      setError("Please agree to Terms & Conditions first");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Password and confirmation do not match");
      return;
    }

    setLoading(true);

    try {
      // 2. Gabungkan data agar sesuai dengan permintaan API
      const payload = {
        full_name: `${form.firstName} ${form.lastName}`.trim(),
        birth_date: form.birthDate, // Pastikan format tanggal sesuai dengan backend
        email: form.email,
        password: form.password,
        address: "Alamat belum diisi", // Tambahkan input address di UI jika ini wajib dari backend
      };

      // 3. Panggil fungsi dari authApi.js
      const data = await registerUser(payload);

      console.log("Register success:", data);
      router.push({ pathname: "/otpverify", params: { email: form.email } });
    } catch (e) {
      const err = e as any;
      // Menangkap error dari Axios (apiClient)
      const status = err.response?.status || 500;
      const msg =
        REGISTER_ERRORS[status] ||
        err.response?.data?.message ||
        "Terjadi kesalahan. Coba lagi";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setError(null);

    // Ubah form.email menjadi form.full_name jika backend memang wajib pakai full_name untuk login
    if (!form.email.trim() || !form.password.trim()) {
      setError(LOGIN_ERRORS[400]);
      return;
    }

    setLoading(true);

    try {
      // 4. Panggil fungsi login dari authApi.js
      // Asumsi backend direvisi jadi pakai email. Jika tetap full_name, ganti variabel di bawah.
      const data = await loginUser({
        email: form.email,
        password: form.password,
      });

      console.log("Login success:", data);
      // Lanjut arahkan user ke halaman Home
      if (data.user.roleID === 3) {
        router.replace("/Adminreport"); // Admin
      }
      // else if (data.user.roleID === 2) {
      //   router.replace('/seller');       // Seller
      // }
      else {
        router.replace("/home"); // Buyer (roleID === 1)
      }
    } catch (e) {
      const err = e as any;
      const status = err.response?.status || 500;
      const msg =
        LOGIN_ERRORS[status] ||
        err.response?.data?.message ||
        "Kesalahan pada server.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (activeTab === "signup") handleSignUp();
    else handleSignIn();
  };

  return (
    <LinearGradient colors={["#DAE6D8", "#92AF8C"]} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Get Started Now</Text>
          <Text style={styles.subtitle}>
            Create an account or Log in to explore!
          </Text>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabSwitcher}>
          <Pressable
            onPress={() => handleTabChange("signup")}
            style={[
              styles.tabButton,
              activeTab === "signup" && styles.tabButtonActive,
            ]}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "signup" && styles.tabButtonTextActive,
              ]}
            >
              Sign Up
            </Text>
          </Pressable>

          <Pressable
            onPress={() => handleTabChange("signin")}
            style={[
              styles.tabButton,
              activeTab === "signin" && styles.tabButtonActive,
            ]}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "signin" && styles.tabButtonTextActive,
              ]}
            >
              Sign In
            </Text>
          </Pressable>
        </View>

        {/* Error Banner */}
        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={16} color="#B91C1C" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Form Sign Up */}
        {activeTab === "signup" && (
          <View style={styles.form}>
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.input}
                  value={form.firstName}
                  onChangeText={(text) => handleChange("firstName", text)}
                  autoCapitalize="words"
                  editable={!loading}
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  value={form.lastName}
                  onChangeText={(text) => handleChange("lastName", text)}
                  autoCapitalize="words"
                  editable={!loading}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={form.email}
                onChangeText={(text) => handleChange("email", text)}
                placeholder="example@gmail.com"
                placeholderTextColor="rgba(116, 139, 111, 0.4)"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Birth of Date</Text>
              <TextInput
                style={styles.input}
                value={form.birthDate}
                onChangeText={(text) => handleChange("birthDate", text)}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="rgba(116, 139, 111, 0.4)"
                editable={!loading}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Set Password</Text>
              <TextInput
                style={styles.input}
                value={form.password}
                onChangeText={(text) => handleChange("password", text)}
                secureTextEntry
                editable={!loading}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                value={form.confirmPassword}
                onChangeText={(text) => handleChange("confirmPassword", text)}
                secureTextEntry
                editable={!loading}
              />
            </View>

            {/* Terms & Conditions */}
            <Pressable
              style={styles.termsRow}
              onPress={() => setAgreed((v) => !v)}
              disabled={loading}
            >
              <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                {agreed && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
              <Text style={styles.termsText}>
                I agree to the{" "}
                <Text
                  style={styles.termsLink}
                  onPress={() => setShowTerms(true)}
                >
                  Terms & Conditions
                </Text>{" "}
                for customers and sellers
              </Text>
            </Pressable>

            <View style={styles.submitWrapper}>
              <Pressable
                style={[
                  styles.submitButton,
                  (!agreed || loading) && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={!agreed || loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#DAE6D8" />
                ) : (
                  <Text style={styles.submitButtonText}>Sign Up</Text>
                )}
              </Pressable>
            </View>
          </View>
        )}

        {/* Form Sign In */}
        {activeTab === "signin" && (
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={form.email}
                onChangeText={(text) => handleChange("email", text)}
                placeholder="example@gmail.com"
                placeholderTextColor="rgba(116, 139, 111, 0.4)"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={form.password}
                onChangeText={(text) => handleChange("password", text)}
                secureTextEntry
                editable={!loading}
              />
            </View>

            <View style={styles.submitWrapper}>
              <Pressable
                style={[
                  styles.submitButton,
                  loading && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#DAE6D8" />
                ) : (
                  <Text style={styles.submitButtonText}>Sign In</Text>
                )}
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Modal Terms & Conditions */}
      <Modal
        visible={showTerms}
        animationType="slide"
        transparent
        onRequestClose={() => setShowTerms(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Terms & Conditions</Text>
              <Pressable
                onPress={() => setShowTerms(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={20} color="#324D3E" />
              </Pressable>
            </View>

            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.sectionHeading}>1. General</Text>
              <Text style={styles.sectionBody}>
                By creating an account, you agree to be bound by these Terms &
                Conditions. You confirm that the information you provide is
                accurate and that you are at least 17 years old.
              </Text>

              <Text style={styles.sectionHeading}>2. As a Customer</Text>
              <Text style={styles.sectionBody}>
                You agree to provide valid payment and delivery information, to
                follow the ordering and cancellation policies, and not to misuse
                the platform for fraudulent activity such as fake orders or
                chargeback abuse.
              </Text>

              <Text style={styles.sectionHeading}>3. As a Seller</Text>
              <Text style={styles.sectionBody}>
                If you choose to sell on this platform, you agree to provide
                accurate menu, price, and stock information, to fulfill orders
                in a timely manner, and to comply with all applicable food
                safety, hygiene, and tax regulations in your area.
              </Text>

              <Text style={styles.sectionHeading}>4. Fees & Payments</Text>
              <Text style={styles.sectionBody}>
                A service fee may be deducted from each transaction. Payouts to
                sellers will be processed according to the schedule stated in
                the seller dashboard.
              </Text>

              <Text style={styles.sectionHeading}>5. Account Suspension</Text>
              <Text style={styles.sectionBody}>
                We reserve the right to suspend or terminate accounts that
                violate these terms, including fraud, harassment, or repeated
                negative reviews and complaints.
              </Text>

              <Text style={styles.sectionHeading}>6. Privacy</Text>
              <Text style={styles.sectionBody}>
                Your data will be processed according to our Privacy Policy. We
                will never sell your personal information to third parties.
              </Text>

              <Text style={styles.sectionHeading}>7. Changes</Text>
              <Text style={styles.sectionBody}>
                These terms may be updated from time to time. Continued use of
                the platform after changes are published means you accept the
                updated terms.
              </Text>
            </ScrollView>

            <Pressable
              style={styles.modalAgreeButton}
              onPress={() => {
                setAgreed(true);
                setShowTerms(false);
              }}
            >
              <Text style={styles.modalAgreeText}>I Agree</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  android: {
    elevation: 4,
  },
  default: {
    boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    color: "#748B6F",
    fontWeight: "700",
    fontSize: 32,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: "#748B6F",
    fontSize: 12,
    textAlign: "center",
  },
  tabSwitcher: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 999,
    padding: 4,
    marginBottom: 20,
    ...shadowStyle,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: "#324D3E",
  },
  tabButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#DAE6D8",
  },
  tabButtonTextActive: {
    color: "#DAE6D8",
  },

  /* Error banner */
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEE2E2",
    borderLeftWidth: 3,
    borderLeftColor: "#DC2626",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: "#B91C1C",
    lineHeight: 16,
  },

  form: {
    gap: 20,
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  field: {
    gap: 4,
  },
  halfField: {
    flex: 1,
    gap: 4,
  },
  label: {
    color: "#748B6F",
    fontSize: 14,
    fontWeight: "700",
    paddingLeft: 4,
  },
  input: {
    height: 41,
    borderRadius: 999,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    color: "#748B6F",
    fontSize: 14,
    ...shadowStyle,
  },

  /* Terms */
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingHorizontal: 4,
    marginTop: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#324D3E",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: "#324D3E",
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: "#748B6F",
    lineHeight: 18,
  },
  termsLink: {
    fontWeight: "700",
    color: "#324D3E",
    textDecorationLine: "underline",
  },

  /* Submit */
  submitWrapper: {
    alignItems: "center",
    marginTop: 8,
  },
  submitButton: {
    paddingHorizontal: 32,
    paddingVertical: 10,
    minWidth: 140,
    borderRadius: 999,
    backgroundColor: "#324D3E",
    alignItems: "center",
    justifyContent: "center",
    ...shadowStyle,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: "#DAE6D8",
    fontSize: 14,
    fontWeight: "700",
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    maxHeight: "85%",
    width: "100%",
    maxWidth: 402,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#324D3E",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#DAE6D8",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBody: {
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: "700",
    color: "#324D3E",
    marginTop: 12,
    marginBottom: 4,
  },
  sectionBody: {
    fontSize: 13,
    color: "#5C6E5E",
    lineHeight: 19,
  },
  modalAgreeButton: {
    backgroundColor: "#324D3E",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    ...shadowStyle,
  },
  modalAgreeText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
