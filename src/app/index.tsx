import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';

// === Error code mapping ===
const ERROR_MESSAGES: Record<number, string> = {
  400: 'Email dan password wajib diisi',
  401: 'Email atau password salah',
  500: 'Kesalahan pada server. Silakan coba lagi nanti',
};

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);

    // Client-side validation cepat — preempt 400
    if (!email.trim() || !password.trim()) {
      setError(ERROR_MESSAGES[400]);
      return;
    }

    setLoading(true);

    try {
      // TODO: ganti dengan real API call ke backend
      // Contoh struktur:
      // const res = await fetch('https://api.your-app.com/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password, rememberMe }),
      // });
      //
      // if (!res.ok) {
      //   const msg = ERROR_MESSAGES[res.status] ?? 'Terjadi kesalahan. Coba lagi';
      //   setError(msg);
      //   return;
      // }
      //
      // const data = await res.json();
      // // simpan token: AsyncStorage / SecureStore
      // router.replace('/home');

      // === Dummy logic untuk testing UI ===
      await new Promise((r) => setTimeout(r, 800));

      // Simulasi error 401 untuk testing — hapus block ini nanti
      if (password === 'wrong') {
        setError(ERROR_MESSAGES[401]);
        return;
      }

      console.log('Login success:', { email, rememberMe });
      router.replace('/home');
    } catch (e) {
      // Network error atau exception lain — perlakukan sebagai 500
      setError(ERROR_MESSAGES[500]);
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
        {/* Logo */}
        <Image
          source={{
            uri: 'https://api.builder.io/api/v1/image/assets/TEMP/50cba1698601e650ab853fd68a32e371ac49f6cf?width=298',
          }}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Title */}
        <Text style={styles.title}>Sign In</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Access your account to manage settings,{'\n'}explore features.
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
              if (error) setError(null); // clear error saat user mulai retry
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
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={18}
                color="#748B6F"
              />
            </Pressable>
          </View>
        </View>

        {/* Remember me + Forgot Password */}
        <View style={styles.rowBetween}>
          <Pressable onPress={() => navigation.navigate('/forgotpassword')}>
            <Text style={styles.smallText}>Forgot Password?</Text>
          </Pressable>
        </View>

        {/* Get Started Button */}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  android: {
    elevation: 4,
  },
  default: {
    boxShadow: '0 4px 4px 0 rgba(0,0,0,0.25)',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    maxWidth: 402,
    alignSelf: 'center',
    width: '100%',
  },
  logo: {
    width: 144,
    height: 144,
    marginTop: 32,
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#748B6F',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#748B6F',
    textAlign: 'center',
    marginBottom: 24,
  },

  /* Error banner */
  errorBanner: {
    width: '100%',
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

  field: {
    width: '100%',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#748B6F',
    marginBottom: 8,
    paddingLeft: 4,
  },
  input: {
    width: '100%',
    height: 41,
    borderRadius: 999,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    fontSize: 12,
    color: '#748B6F',
    ...shadowStyle,
  },
  passwordContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    width: '100%',
    height: 41,
    borderRadius: 999,
    backgroundColor: '#fff',
    paddingLeft: 20,
    paddingRight: 48,
    fontSize: 12,
    color: '#748B6F',
    ...shadowStyle,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    height: '100%',
    justifyContent: 'center',
  },
  rowBetween: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  rememberMeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioCircle: {
    width: 11,
    height: 11,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  radioCircleActive: {
    backgroundColor: '#324D3E',
  },
  radioDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#fff',
  },
  smallText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#324D3E',
  },
  primaryButton: {
    paddingHorizontal: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: '#324D3E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    ...shadowStyle,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  signupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  signupText: {
    color: '#fff',
    fontSize: 14,
  },
  signupLink: {
    color: '#748B6F',
    fontSize: 14,
    fontWeight: '700',
  },
});