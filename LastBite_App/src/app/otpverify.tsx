import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { resendOtp, verifyOtp } from '../api/authApi';

const OTP_LENGTH = 4;
const RESEND_SECONDS = 30;

export default function OtpVerify() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const displayEmail = email || 'your email';

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputsRef = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (value: string, index: number) => {
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (error) setError(null);

    if (digit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) return;

    setLoading(true);
    setError(null);

    try {
      const data = await verifyOtp({ email: email ?? '', otp: code });
      console.log('OTP verified:', data);

      // Redirect berdasarkan role
      if (data.user?.roleID === 3) {
        router.replace('/Adminreport');
      } else {
        router.replace('/home');
      }
    } catch (e: any) {
      const status = e.response?.status || 500;
      setError(
        status === 400
          ? 'Kode OTP salah atau sudah kedaluwarsa'
          : 'Terjadi kesalahan. Silakan coba lagi'
      );
      // Kosongkan kotak OTP biar user input ulang
      setOtp(Array(OTP_LENGTH).fill(''));
      setTimeout(() => inputsRef.current[0]?.focus(), 100);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resendLoading) return;

    setResendLoading(true);
    setError(null);

    try {
      await resendOtp({ email: email ?? '' });
      setCountdown(RESEND_SECONDS);
      setOtp(Array(OTP_LENGTH).fill(''));
      setTimeout(() => inputsRef.current[0]?.focus(), 100);
    } catch (e: any) {
      setError('Gagal mengirim ulang OTP. Coba lagi.');
    } finally {
      setResendLoading(false);
    }
  };

  const isComplete = otp.every((d) => d !== '');

  return (
    <LinearGradient colors={['#DAE6D8', '#92AF8C']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          {/* Back button */}
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={20} color="#1F3A2E" />
          </Pressable>

          {/* Icon */}
          <View style={styles.iconCircle}>
            <Ionicons name="mail-outline" size={36} color="#fff" />
          </View>

          {/* Title & description */}
          <Text style={styles.title}>Verify your email</Text>
          <Text style={styles.subtitle}>
            We've sent a {OTP_LENGTH}-digit code to{'\n'}
            <Text style={styles.emailText}>{displayEmail}</Text>
          </Text>

          {/* Error Banner */}
          {error && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={16} color="#B91C1C" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* OTP boxes */}
          <View style={styles.otpRow}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(el) => { inputsRef.current[index] = el; }}
                style={[styles.otpBox, digit !== '' && styles.otpBoxFilled]}
                value={digit}
                onChangeText={(val) => handleChange(val, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                selectTextOnFocus
                editable={!loading}
              />
            ))}
          </View>

          {/* Verify button */}
          <Pressable
            style={[styles.verifyButton, (!isComplete || loading) && styles.verifyButtonDisabled]}
            onPress={handleVerify}
            disabled={!isComplete || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.verifyText}>Verify</Text>
            )}
          </Pressable>

          {/* Resend */}
          <View style={styles.resendRow}>
            <Text style={styles.resendLabel}>Didn't receive the code?</Text>
            <Pressable onPress={handleResend} disabled={countdown > 0 || resendLoading}>
              {resendLoading ? (
                <ActivityIndicator size="small" color="#246DC1" />
              ) : (
                <Text style={[styles.resendLink, countdown > 0 && styles.resendLinkDisabled]}>
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend'}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 402,
    alignSelf: 'center',
    width: '100%',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
      android: { elevation: 3 },
      default: { boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)' },
    }),
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#324D3E',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
    ...Platform.select({
      ios: { shadowColor: '#324D3E', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 14 },
      android: { elevation: 5 },
      default: { boxShadow: '0 8px 14px 0 rgba(50,77,62,0.25)' },
    }),
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#324D3E',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#5C6E5E',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  emailText: {
    fontWeight: '700',
    color: '#324D3E',
  },
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
    marginBottom: 20,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#B91C1C',
    lineHeight: 16,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32,
  },
  otpBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#fff',
    fontSize: 22,
    fontWeight: '700',
    color: '#324D3E',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    padding: 0,
    lineHeight: 56,
    borderWidth: 1.5,
    borderColor: 'transparent',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 },
      android: { elevation: 2 },
      default: { boxShadow: '0 2px 6px 0 rgba(0,0,0,0.06)' },
    }),
  },
  otpBoxFilled: {
    borderColor: '#324D3E',
  },
  verifyButton: {
    backgroundColor: '#324D3E',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    ...Platform.select({
      ios: { shadowColor: '#324D3E', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12 },
      android: { elevation: 6 },
      default: { boxShadow: '0 8px 16px 0 rgba(50,77,62,0.3)' },
    }),
  },
  verifyButtonDisabled: { opacity: 0.5 },
  verifyText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  resendRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  resendLabel: { fontSize: 13, color: '#5C6E5E' },
  resendLink: { fontSize: 13, fontWeight: '700', color: '#246DC1' },
  resendLinkDisabled: { color: '#7A8A7A' },
});
