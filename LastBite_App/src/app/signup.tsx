import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SignUp() {
  const [activeTab, setActiveTab] = useState<'signup' | 'signin'>('signup');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', form);
    // TODO: validasi + kirim ke API
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
            onPress={() => setActiveTab('signup')}
            style={[
              styles.tabButton,
              activeTab === 'signup' && styles.tabButtonActive,
            ]}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'signup' && styles.tabButtonTextActive,
              ]}
            >
              Sign Up
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('signin')}
            style={[
              styles.tabButton,
              activeTab === 'signin' && styles.tabButtonActive,
            ]}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'signin' && styles.tabButtonTextActive,
              ]}
            >
              Sign In
            </Text>
          </Pressable>
        </View>

        {/* Form Sign Up */}
        {activeTab === 'signup' && (
          <View style={styles.form}>
            {/* First & Last Name */}
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.input}
                  value={form.firstName}
                  onChangeText={(text) => handleChange('firstName', text)}
                  autoCapitalize="words"
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  value={form.lastName}
                  onChangeText={(text) => handleChange('lastName', text)}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={form.email}
                onChangeText={(text) => handleChange('email', text)}
                placeholder="example@gmail.com"
                placeholderTextColor="rgba(116, 139, 111, 0.4)"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Birth of Date */}
            <View style={styles.field}>
              <Text style={styles.label}>Birth of Date</Text>
              <TextInput
                style={styles.input}
                value={form.birthDate}
                onChangeText={(text) => handleChange('birthDate', text)}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="rgba(116, 139, 111, 0.4)"
              />
            </View>

            {/* Set Password */}
            <View style={styles.field}>
              <Text style={styles.label}>Set Password</Text>
              <TextInput
                style={styles.input}
                value={form.password}
                onChangeText={(text) => handleChange('password', text)}
                secureTextEntry
              />
            </View>

            {/* Confirm Password */}
            <View style={styles.field}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                value={form.confirmPassword}
                onChangeText={(text) => handleChange('confirmPassword', text)}
                secureTextEntry
              />
            </View>

            {/* Submit Button */}
            <View style={styles.submitWrapper}>
              <Pressable style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Sign Up</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Form Sign In */}
        {activeTab === 'signin' && (
          <View style={styles.form}>
            {/* Email */}
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={form.email}
                onChangeText={(text) => handleChange('email', text)}
                placeholder="example@gmail.com"
                placeholderTextColor="rgba(116, 139, 111, 0.4)"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password */}
            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={form.password}
                onChangeText={(text) => handleChange('password', text)}
                secureTextEntry
              />
            </View>

            {/* Submit Button */}
            <View style={styles.submitWrapper}>
              <Pressable style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Sign In</Text>
              </Pressable>
            </View>
          </View>
        )}
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
    // web fallback
    boxShadow: '0 4px 4px 0 rgba(0,0,0,0.25)',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    color: '#748B6F',
    fontWeight: '700',
    fontSize: 32,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#748B6F',
    fontSize: 12,
    textAlign: 'center',
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 999,
    padding: 4,
    marginBottom: 32,
    ...shadowStyle,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#324D3E',
  },
  tabButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#DAE6D8',
  },
  tabButtonTextActive: {
    color: '#DAE6D8',
  },
  form: {
    gap: 20,
  },
  row: {
    flexDirection: 'row',
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
    color: '#748B6F',
    fontSize: 14,
    fontWeight: '700',
    paddingLeft: 4,
  },
  input: {
    height: 41,
    borderRadius: 999,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    color: '#748B6F',
    fontSize: 14,
    ...shadowStyle,
  },
  submitWrapper: {
    alignItems: 'center',
    marginTop: 8,
  },
  submitButton: {
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#324D3E',
    ...shadowStyle,
  },
  submitButtonText: {
    color: '#DAE6D8',
    fontSize: 14,
    fontWeight: '700',
  },
});