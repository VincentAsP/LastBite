import { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

// === Error code mapping ===
const RESET_ERRORS: Record<number, string> = {
  400: 'Password tidak memenuhi syarat',
  401: 'Sesi tidak valid. Silakan ulangi proses verifikasi',
  500: 'Kesalahan pada server. Silakan coba lagi nanti',
};

type PasswordRule = {
  label: string;
  test: (val: string) => boolean;
};

const PASSWORD_RULES: PasswordRule[] = [
  { label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { label: 'Contains a number', test: (v) => /\d/.test(v) },
  { label: 'Contains an uppercase letter', test: (v) => /[A-Z]/.test(v) },
];

export default function ResetPassword() {
  // Ambil email dari param (dipass dari OTP page)
  const { email } = useLocalSearchParams<{ email?: string }>();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Cek setiap aturan password
  const ruleResults = useMemo(
    () => PASSWORD_RULES.map((r) => ({ ...r, passed: r.test(password) })),
    [password]
  );

  const allRulesPassed = ruleResults.every((r) => r.passed);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const canSubmit = allRulesPassed && passwordsMatch && !loading;

  const handleReset = async () => {
    setError(null);

    if (!allRulesPassed) {
      setError(RESET_ERRORS[400]);
      return;
    }

    if (!passwordsMatch) {
      setError('Password and confirmation do not match');
      return;
    }

    setLoading(true);

    try {
      // TODO: ganti dengan real API call
      // const res = await fetch('https://api.your-app.com/auth/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, newPassword: password }),
      // });
      //
      // if (!res.ok) {
      //   const msg = RESET_ERRORS[res.status] ?? 'Terjadi kesalahan. Coba lagi';
      //   setError(msg);
      //   return;
      // }

      // === Dummy logic untuk testing UI ===
      await new Promise((r) => setTimeout(r, 800));

      setShowSuccess(true);
    } catch (e) {
      setError(RESET_ERRORS[500]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessDone = () => {
    setShowSuccess(false);
    router.replace('/');
  };

  return (
    <LinearGradient
      colors={['#DAE6D8', '#92AF8C']}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Lock icon */}
        <View style={styles.iconWrapper}>
          <View style={styles.iconCircle}>
            <Ionicons name="shield-checkmark" size={36} color="#fff" />
          </View>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Create New Password</Text>
          <Text style={styles.subtitle}>
            Your new password must be different from previously used passwords.
          </Text>
          {email && (
            <Text style={styles.emailHint}>
              For: <Text style={styles.emailHintBold}>{email}</Text>
            </Text>
          )}
        </View>

        {/* Error Banner */}
        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={16} color="#B91C1C" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Form */}
        <View style={styles.form}>
          {/* New Password */}
          <View style={styles.field}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color="#92AF8C"
                style={styles.inputLeftIcon}
              />
              <TextInput
                style={[styles.input, styles.inputWithBothIcons]}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (error) setError(null);
                }}
                placeholder="Enter new password"
                placeholderTextColor="rgba(116, 139, 111, 0.4)"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!loading}
              />
              <Pressable
                style={styles.eyeIcon}
                onPress={() => setShowPassword((v) => !v)}
                disabled={loading}
              >
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#324D3E"
                />
              </Pressable>
            </View>
          </View>

          {/* Password rules */}
          {password.length > 0 && (
            <View style={styles.rulesWrapper}>
              {ruleResults.map((rule) => (
                <View key={rule.label} style={styles.ruleRow}>
                  <Ionicons
                    name={rule.passed ? 'checkmark-circle' : 'ellipse-outline'}
                    size={14}
                    color={rule.passed ? '#16A34A' : '#9CA3AF'}
                  />
                  <Text
                    style={[
                      styles.ruleText,
                      rule.passed && styles.ruleTextPassed,
                    ]}
                  >
                    {rule.label}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Confirm Password */}
          <View style={styles.field}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color="#92AF8C"
                style={styles.inputLeftIcon}
              />
              <TextInput
                style={[styles.input, styles.inputWithBothIcons]}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (error) setError(null);
                }}
                placeholder="Re-enter new password"
                placeholderTextColor="rgba(116, 139, 111, 0.4)"
                secureTextEntry={!showConfirm}
                autoCapitalize="none"
                editable={!loading}
              />
              <Pressable
                style={styles.eyeIcon}
                onPress={() => setShowConfirm((v) => !v)}
                disabled={loading}
              >
                <Ionicons
                  name={showConfirm ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#324D3E"
                />
              </Pressable>
            </View>

            {confirmPassword.length > 0 && !passwordsMatch && (
              <View style={styles.ruleRow}>
                <Ionicons name="close-circle" size={14} color="#DC2626" />
                <Text style={[styles.ruleText, { color: '#DC2626' }]}>
                  Passwords do not match
                </Text>
              </View>
            )}
          </View>

          {/* Submit */}
          <View style={styles.submitWrapper}>
            <Pressable
              style={[
                styles.submitButton,
                !canSubmit && styles.submitButtonDisabled,
              ]}
              onPress={handleReset}
              disabled={!canSubmit}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#DAE6D8" />
              ) : (
                <Text style={styles.submitButtonText}>Reset Password</Text>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Success Modal */}
      <Modal
        visible={showSuccess}
        animationType="fade"
        transparent
        onRequestClose={handleSuccessDone}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark" size={42} color="#fff" />
            </View>

            <Text style={styles.modalTitle}>Password Reset!</Text>
            <Text style={styles.modalBody}>
              Your password has been changed successfully. You can now sign in with your new password.
            </Text>

            <Pressable
              style={styles.modalButton}
              onPress={handleSuccessDone}
            >
              <Text style={styles.modalButtonText}>Continue to Sign In</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const shadowStyle = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  android: { elevation: 4 },
  default: { boxShadow: '0 4px 4px 0 rgba(0,0,0,0.25)' },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },

  /* Icon */
  iconWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#324D3E',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadowStyle,
  },

  /* Header */
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#324D3E',
    fontWeight: '800',
    fontSize: 26,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    color: '#5C6E5E',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 8,
  },
  emailHint: {
    fontSize: 12,
    color: '#5C6E5E',
    marginTop: 8,
  },
  emailHintBold: {
    fontWeight: '700',
    color: '#324D3E',
  },

  /* Error banner */
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    borderLeftWidth: 3,
    borderLeftColor: '#DC2626',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#B91C1C',
    lineHeight: 16,
  },

  /* Form */
  form: { gap: 14 },
  field: { gap: 6 },
  label: {
    color: '#324D3E',
    fontSize: 13,
    fontWeight: '700',
    paddingLeft: 4,
  },
  inputWithIcon: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputLeftIcon: {
    position: 'absolute',
    left: 18,
    zIndex: 1,
  },
  input: {
    height: 48,
    borderRadius: 999,
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    color: '#324D3E',
    fontSize: 14,
    ...shadowStyle,
    ...(Platform.OS === 'web' ? { outlineWidth: 0 } : {}),
  } as any,
  inputWithBothIcons: {
    paddingLeft: 46,
    paddingRight: 48,
  },
  eyeIcon: {
    position: 'absolute',
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 28,
  },

  /* Password rules */
  rulesWrapper: {
    gap: 6,
    paddingHorizontal: 8,
    marginTop: -4,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ruleText: {
    fontSize: 12,
    color: '#5C6E5E',
  },
  ruleTextPassed: {
    color: '#16A34A',
    fontWeight: '600',
  },

  /* Submit */
  submitWrapper: {
    alignItems: 'center',
    marginTop: 16,
  },
  submitButton: {
    paddingHorizontal: 40,
    paddingVertical: 14,
    minWidth: 200,
    borderRadius: 999,
    backgroundColor: '#324D3E',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadowStyle,
  },
  submitButtonDisabled: { opacity: 0.5 },
  submitButtonText: {
    color: '#DAE6D8',
    fontSize: 15,
    fontWeight: '700',
  },

  /* Success Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#324D3E',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalBody: {
    fontSize: 13,
    color: '#5C6E5E',
    lineHeight: 19,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: '#324D3E',
    borderRadius: 999,
    paddingHorizontal: 28,
    paddingVertical: 13,
    width: '100%',
    alignItems: 'center',
    ...shadowStyle,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});