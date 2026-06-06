import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Pressable,
  ScrollView, StyleSheet, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getCurrentUser } from '../api/authApi';
import { updateProfile, changePassword, deleteAccount } from '../api/userApi.js';

export default function ProfilePage() {
  const [fullName, setFullName]           = useState('');
  const [email, setEmail]                 = useState('');
  const [phone, setPhone]                 = useState('');
  const [alamat, setAlamat]               = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent]     = useState(false);
  const [showNew, setShowNew]             = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [loading, setLoading]             = useState(true);
  const [saving, setSaving]               = useState(false);

  const getErrorMessage = (err: any, fallback: string) => {
  if (err && typeof err === 'object' && 'response' in err) {
    return err.response?.data?.message ?? fallback;
  }
  return fallback;
};
  // ─── Load user on mount ───────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setFullName(user.full_name  ?? '');
          setEmail(user.email         ?? '');
          setPhone(user.phone         ?? '');
          setAlamat(user.address      ?? '');
        }
      } catch (err) {
        Alert.alert('Error', 'Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ─── Save changes ─────────────────────────────────────────────────────────
  const handleSave = async () => {
    // Password validation (only when user is trying to change password)
    const isChangingPassword =
      currentPassword || newPassword || confirmPassword;

    if (isChangingPassword) {
      if (!currentPassword) {
        return Alert.alert('Validation', 'Please enter your current password.');
      }
      if (newPassword.length < 8) {
        return Alert.alert('Validation', 'New password must be at least 8 characters.');
      }
      if (newPassword !== confirmPassword) {
        return Alert.alert('Validation', 'New password and confirmation do not match.');
      }
    }

    try {
      setSaving(true);

      // Update profile info
      await updateProfile({ full_name: fullName, email, phone, address: alamat });

      // Update password only if the user filled in the password fields
      if (isChangingPassword) {
        await changePassword({
          current_password: currentPassword,
          new_password: newPassword,
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }

      Alert.alert('Success', 'Profile updated successfully.');
    } catch (err) {
      
      Alert.alert('Error', getErrorMessage(err, 'Failed to save changes.'));
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete account ───────────────────────────────────────────────────────
  const handleDelete = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
              router.replace('/');
            } catch (err) {
              
              Alert.alert('Error', getErrorMessage(err, 'Failed to delete account.'));
            }
          },
        },
      ]
    );
  };

  // ─── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <LinearGradient colors={['#DAE6D8', '#92AF8C']} style={styles.centered}>
        <ActivityIndicator size="large" color="#324D3E" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#DAE6D8', '#92AF8C']} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={20} color="#1F3A2E" />
          </Pressable>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={40} color="#324D3E" />
          </View>
        </View>

        {/* Personal Information Card */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="person-outline" size={18} color="#324D3E" />
            <Text style={styles.cardTitle}>Personal Information</Text>
          </View>

          <Text style={styles.fieldLabel}>Full Name</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={16} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Full Name"
              placeholderTextColor="#A8A29E"
            />
          </View>

          <Text style={styles.fieldLabel}>Email</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={16} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#A8A29E"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.fieldLabel}>Phone Number</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="call-outline" size={16} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone Number"
              placeholderTextColor="#A8A29E"
              keyboardType="phone-pad"
            />
          </View>

          <Text style={styles.fieldLabel}>Alamat</Text>
          <Pressable
            style={styles.inputWrapper}
            onPress={() => router.push('/adresses')} 
          >
            <Ionicons name="location-outline" size={16} color="#9CA3AF" style={styles.inputIcon} />
            <Text style={styles.inputText}>{alamat || 'Add address'}</Text>
            <Ionicons name="create-outline" size={16} color="#9CA3AF" />
          </Pressable>
        </View>

        {/* Change Password Card */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="lock-closed-outline" size={18} color="#324D3E" />
            <Text style={styles.cardTitle}>Change Password</Text>
          </View>

          <Text style={styles.fieldLabel}>Current Password</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={16} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Enter current password"
              placeholderTextColor="#A8A29E"
              secureTextEntry={!showCurrent}
            />
            <Pressable onPress={() => setShowCurrent(!showCurrent)}>
              <Ionicons name={showCurrent ? 'eye-outline' : 'eye-off-outline'} size={16} color="#9CA3AF" />
            </Pressable>
          </View>

          <Text style={styles.fieldLabel}>New Password</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={16} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              placeholderTextColor="#A8A29E"
              secureTextEntry={!showNew}
            />
            <Pressable onPress={() => setShowNew(!showNew)}>
              <Ionicons name={showNew ? 'eye-outline' : 'eye-off-outline'} size={16} color="#9CA3AF" />
            </Pressable>
          </View>

          <Text style={styles.fieldLabel}>Confirm New Password</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={16} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Re-enter new password"
              placeholderTextColor="#A8A29E"
              secureTextEntry={!showConfirm}
            />
            <Pressable onPress={() => setShowConfirm(!showConfirm)}>
              <Ionicons name={showConfirm ? 'eye-outline' : 'eye-off-outline'} size={16} color="#9CA3AF" />
            </Pressable>
          </View>
        </View>

        {/* Save Button */}
        <Pressable style={[styles.saveButton, saving && { opacity: 0.7 }]} onPress={handleSave} disabled={saving}>
          {saving
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.saveButtonText}>Save Changes</Text>
          }
        </Pressable>

        {/* Delete Account Button */}
        <Pressable style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={16} color="#DC2626" />
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
}

const shadowStyle = Platform.select({
  ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  android: { elevation: 3 },
  default: { boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)' },
});

const styles = StyleSheet.create({
  container:     { flex: 1, maxWidth: 402, alignSelf: 'center', width: '100%' },
  centered:      { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 48 },

  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backButton:  { width: 40, height: 40, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', ...shadowStyle },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1F3A2E' },

  avatarWrapper: { alignItems: 'center', marginBottom: 24 },
  avatarCircle:  { width: 72, height: 72, borderRadius: 36, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', ...shadowStyle },

  card:         { backgroundColor: '#fff', borderRadius: 20, padding: 18, marginBottom: 16, ...shadowStyle },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  cardTitle:    { fontSize: 15, fontWeight: '700', color: '#1F3A2E' },

  fieldLabel:   { fontSize: 12, fontWeight: '600', color: '#5F6B5F', marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#E5E7E5',
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10,
    marginBottom: 14, backgroundColor: '#FAFAFA',
  },
  inputIcon:  { marginRight: 8 },
  input:      { flex: 1, fontSize: 14, color: '#1F3A2E' },
  inputText:  { flex: 1, fontSize: 14, color: '#1F3A2E' },

  saveButton: {
    backgroundColor: '#324D3E', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
    ...Platform.select({
      ios:     { shadowColor: '#324D3E', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10 },
      android: { elevation: 6 },
      default: { boxShadow: '0 6px 12px 0 rgba(50,77,62,0.3)' },
    }),
  },
  saveButtonText: { fontSize: 15, fontWeight: '700', color: '#fff' },

  deleteButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FCA5A5',
    borderRadius: 14, paddingVertical: 16, marginTop: 12,
  },
  deleteButtonText: { fontSize: 15, fontWeight: '700', color: '#DC2626' },
});
