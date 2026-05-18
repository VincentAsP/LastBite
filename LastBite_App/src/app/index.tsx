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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login:', { email, password, rememberMe });
    // TODO: validasi + API call nanti
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

        {/* Email Field */}
        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="example@gmail.com"
            placeholderTextColor="rgba(116, 139, 111, 0.4)"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password Field */}
        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password here"
              placeholderTextColor="rgba(116, 139, 111, 0.4)"
              secureTextEntry={!showPassword}
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
          <Pressable
            style={styles.rememberMeRow}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View
              style={[
                styles.radioCircle,
                rememberMe && styles.radioCircleActive,
              ]}
            >
              {rememberMe && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.smallText}>Remember me</Text>
          </Pressable>

          <Pressable>
            <Text style={styles.smallText}>Forgot Password?</Text>
          </Pressable>
        </View>

        {/* Get Started Button */}
        <Pressable style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </Pressable>

        {/* Or Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Sign in with Google */}
        <Pressable style={styles.socialButton}>
          <Ionicons name="logo-google" size={20} color="#fff" />
          <Text style={styles.socialButtonText}>Sign in with Google</Text>
        </Pressable>

        {/* Continue with Apple */}
        <Pressable style={styles.socialButton}>
          <Ionicons name="logo-apple" size={20} color="#fff" />
          <Text style={styles.socialButtonText}>Continue with Apple</Text>
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
    marginBottom: 32,
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
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  dividerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#748B6F',
  },
  dividerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#748B6F',
  },
  socialButton: {
    width: 264,
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#324D3E',
    borderRadius: 999,
    paddingLeft: 32,
    marginBottom: 12,
    ...shadowStyle,
  },
  socialButtonText: {
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