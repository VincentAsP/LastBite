import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// === Error code mapping ===
const FORGOT_ERRORS: Record<number, string> = {
  400: 'Email tidak valid',
  404: 'Email tidak terdaftar',
  429: 'Terlalu banyak permintaan. Coba lagi dalam beberapa menit',
  500: 'Kesalahan pada server. Silakan coba lagi nanti',
};

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const handleSendCode = async () => {
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (!isValidEmail(email)) {
      setError(FORGOT_ERRORS[400]);
      return;
    }

    setLoading(true);

    try {
      // TODO: ganti dengan real API call
      // const res = await fetch('https://api.your-app.com/auth/forgot-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });
      //
      // if (!res.ok) {
      //   const msg = FORGOT_ERRORS[res.status] ?? 'Terjadi kesalahan. Coba lagi';
      //   setError(msg);
      //   return;
      // }

      // === Dummy logic untuk testing UI ===
      await new Promise((r) => setTimeout(r, 800));

      if (email === 'notfound@gmail.com') {
        setError(FORGOT_ERRORS[404]);
        return;
      }

      // Sukses → navigate ke OTP page dengan param mode=reset
      router.push({
        pathname: '/otpverify',
        params: { email: email.trim(), mode: 'reset' },
      });
    } catch (e) {
      setError(FORGOT_ERRORS[500]);
    } finally {
      setLoading(false);
    }
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
        {/* Back button */}
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#324D3E" />
        </Pressable>

        {/* Lock icon */}
        <View style={styles.iconWrapper}>
          <View style={styles.iconCircle}>
            <Ionicons name="lock-closed" size={36} color="#fff" />
          </View>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Don't worry! Enter your email and we'll send you a verification code to reset your password.
          </Text>
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
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons name="mail-outline" size={18} color="#92AF8C" style={styles.inputLeftIcon} />
              <TextInput
                style={[styles.input, styles.inputWithIconField]}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (error) setError(null);
                }}
                placeholder="example@gmail.com"
                placeholderTextColor="rgba(116, 139, 111, 0.4)"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!loading}
              />
            </View>
          </View>

          {/* Submit */}
          <View style={styles.submitWrapper}>
            <Pressable
              style={[
                styles.submitButton,
                loading && styles.submitButtonDisabled,
              ]}
              onPress={handleSendCode}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#DAE6D8" />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Send Reset Code</Text>
                  <Ionicons name="arrow-forward" size={16} color="#DAE6D8" />
                </>
              )}
            </Pressable>
          </View>

          {/* Footer: Back to Sign In */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Remember your password? </Text>
            <Pressable onPress={() => router.push('/')}>
              <Text style={styles.footerLink}>Sign In</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
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
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadowStyle,
  },

  /* Lock icon */
  iconWrapper: {
    alignItems: 'center',
    marginTop: 30,
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
    marginBottom: 28,
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
  form: { gap: 18 },
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
  inputWithIconField: {
    paddingLeft: 46,
  },

  /* Submit */
  submitWrapper: {
    alignItems: 'center',
    marginTop: 12,
  },
  submitButton: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 28,
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

  /* Footer */
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  footerText: {
    fontSize: 13,
    color: '#5C6E5E',
  },
  footerLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#324D3E',
    textDecorationLine: 'underline',
  },
});