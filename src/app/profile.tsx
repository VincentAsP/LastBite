import { useState } from 'react';
import {
  View, Text, TextInput, Pressable,
  ScrollView, StyleSheet, Platform, Modal, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// ── Small toast for cancelled feedback ──
function Toast({ visible, message }: { visible: boolean; message: string }) {
  return visible ? (
    <View style={toast.box}>
      <Ionicons name="close-circle" size={16} color="#fff" />
      <Text style={toast.text}>{message}</Text>
    </View>
  ) : null;
}

const toast = StyleSheet.create({
  box: {
    position: 'absolute', bottom: 32, left: 24, right: 24,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#374151', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 12, zIndex: 999,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
      android: { elevation: 8 },
      default: { boxShadow: '0 4px 8px rgba(0,0,0,0.2)' },
    }),
  },
  text: { fontSize: 13, fontWeight: '600', color: '#fff', flex: 1 },
});

export default function ProfilePage() {
  const [fullName, setFullName] = useState('Sia Landia');
  const [email, setEmail] = useState('sialandia@lastbite.com');
  const [phone, setPhone] = useState('+62 896-1761-0908');
  const [alamat, setAlamat] = useState('Slateford Road, Edinburgh');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Delete account modal states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showCancelledToast, setShowCancelledToast] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    // TODO: replace with real API call
    await new Promise(r => setTimeout(r, 900));
    setDeleting(false);
    setShowDeleteConfirm(false);
    setShowDeleteSuccess(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setShowCancelledToast(true);
    setTimeout(() => setShowCancelledToast(false), 2800);
  };

  const handleDeleteSuccessClose = () => {
    setShowDeleteSuccess(false);
    router.replace('/');
  };

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
            <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="Full Name" placeholderTextColor="#A8A29E" />
          </View>

          <Text style={styles.fieldLabel}>Email</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={16} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" placeholderTextColor="#A8A29E" keyboardType="email-address" autoCapitalize="none" />
          </View>

          <Text style={styles.fieldLabel}>Phone Number</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="call-outline" size={16} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Phone Number" placeholderTextColor="#A8A29E" keyboardType="phone-pad" />
          </View>

          <Text style={styles.fieldLabel}>Address</Text>
          <Pressable style={styles.inputWrapper} onPress={() => router.push('/adresses')}>
            <Ionicons name="location-outline" size={16} color="#9CA3AF" style={styles.inputIcon} />
            <Text style={styles.inputText}>{alamat}</Text>
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
            <TextInput style={styles.input} value={currentPassword} onChangeText={setCurrentPassword} placeholder="Enter current password" placeholderTextColor="#A8A29E" secureTextEntry={!showCurrent} />
            <Pressable onPress={() => setShowCurrent(!showCurrent)}>
              <Ionicons name={showCurrent ? 'eye-outline' : 'eye-off-outline'} size={16} color="#9CA3AF" />
            </Pressable>
          </View>

          <Text style={styles.fieldLabel}>New Password</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={16} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput style={styles.input} value={newPassword} onChangeText={setNewPassword} placeholder="Enter new password" placeholderTextColor="#A8A29E" secureTextEntry={!showNew} />
            <Pressable onPress={() => setShowNew(!showNew)}>
              <Ionicons name={showNew ? 'eye-outline' : 'eye-off-outline'} size={16} color="#9CA3AF" />
            </Pressable>
          </View>

          <Text style={styles.fieldLabel}>Confirm New Password</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={16} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Re-enter new password" placeholderTextColor="#A8A29E" secureTextEntry={!showConfirm} />
            <Pressable onPress={() => setShowConfirm(!showConfirm)}>
              <Ionicons name={showConfirm ? 'eye-outline' : 'eye-off-outline'} size={16} color="#9CA3AF" />
            </Pressable>
          </View>
        </View>

        {/* Save Button */}
        <Pressable style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </Pressable>

        {/* Delete Account Button */}
        <Pressable style={styles.deleteButton} onPress={() => setShowDeleteConfirm(true)}>
          <Ionicons name="trash-outline" size={16} color="#DC2626" />
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </Pressable>
      </ScrollView>

      {/* ── Cancelled toast ── */}
      <Toast visible={showCancelledToast} message="Account deletion cancelled." />

      {/* ── Confirmation Modal ── */}
      <Modal visible={showDeleteConfirm} transparent animationType="fade" onRequestClose={handleDeleteCancel}>
        <Pressable style={modal.overlay} onPress={handleDeleteCancel}>
          <Pressable style={modal.card} onPress={e => e.stopPropagation()}>
            {/* Icon */}
            <View style={modal.iconOuter}>
              <View style={modal.iconInner}>
                <Ionicons name="trash-outline" size={28} color="#fff" />
              </View>
            </View>

            <Text style={modal.title}>Delete Account?</Text>
            <Text style={modal.body}>
              This action is <Text style={modal.bold}>permanent</Text> and cannot be undone.
              All your data, orders, and history will be removed.
            </Text>

            <View style={modal.buttonRow}>
              {/* Cancel */}
              <Pressable
                style={[modal.btn, modal.btnCancel]}
                onPress={handleDeleteCancel}
                disabled={deleting}
              >
                <Ionicons name="close" size={16} color="#324D3E" />
                <Text style={modal.btnCancelText}>Cancel</Text>
              </Pressable>

              {/* Confirm delete */}
              <Pressable
                style={[modal.btn, modal.btnDelete, deleting && modal.btnDisabled]}
                onPress={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? (
                  <Text style={modal.btnDeleteText}>Deleting…</Text>
                ) : (
                  <>
                    <Ionicons name="trash" size={16} color="#fff" />
                    <Text style={modal.btnDeleteText}>Yes, Delete</Text>
                  </>
                )}
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ── Success Modal ── */}
      <Modal visible={showDeleteSuccess} transparent animationType="fade" onRequestClose={handleDeleteSuccessClose}>
        <Pressable style={modal.overlay} onPress={handleDeleteSuccessClose}>
          <Pressable style={modal.card} onPress={e => e.stopPropagation()}>
            <View style={modal.iconOuter}>
              <View style={[modal.iconInner, modal.iconSuccess]}>
                <Ionicons name="checkmark" size={28} color="#fff" />
              </View>
            </View>

            <Text style={modal.title}>Account Deleted</Text>
            <Text style={modal.body}>
              Your account has been successfully deleted.{'\n'}
              We're sorry to see you go 👋
            </Text>

            <Pressable style={[modal.btn, modal.btnFull, modal.btnDelete]} onPress={handleDeleteSuccessClose}>
              <Text style={modal.btnDeleteText}>Back to Login</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
}

const shadowStyle = Platform.select({
  ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  android: { elevation: 3 },
  default: { boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)' },
});

const styles = StyleSheet.create({
  container: { flex: 1, maxWidth: 402, alignSelf: 'center', width: '100%' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 48 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', ...shadowStyle },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1F3A2E' },
  avatarWrapper: { alignItems: 'center', marginBottom: 24 },
  avatarCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', ...shadowStyle },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 18, marginBottom: 16, ...shadowStyle },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1F3A2E' },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: '#5F6B5F', marginBottom: 6 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7E5', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 14, backgroundColor: '#FAFAFA' },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 14, color: '#1F3A2E' },
  inputText: { flex: 1, fontSize: 14, color: '#1F3A2E' },
  saveButton: {
    backgroundColor: '#324D3E', borderRadius: 14, paddingVertical: 16, alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#324D3E', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10 },
      android: { elevation: 6 },
      default: { boxShadow: '0 6px 12px 0 rgba(50,77,62,0.3)' },
    }),
  },
  saveButtonText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  deleteButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FCA5A5', borderRadius: 14, paddingVertical: 16, marginTop: 12 },
  deleteButtonText: { fontSize: 15, fontWeight: '700', color: '#DC2626' },
});

const modal = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 28 },
  card: {
    backgroundColor: '#fff', borderRadius: 24, padding: 24,
    width: '100%', maxWidth: 340, alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 24 },
      android: { elevation: 14 },
      default: { boxShadow: '0 8px 32px rgba(0,0,0,0.18)' },
    }),
  },

  /* Icon */
  iconOuter: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  iconInner: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#DC2626', alignItems: 'center', justifyContent: 'center' },
  iconSuccess: { backgroundColor: '#065F46' },

  title: { fontSize: 20, fontWeight: '800', color: '#1F3A2E', marginBottom: 10, textAlign: 'center' },
  body: { fontSize: 13, color: '#5F6B5F', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  bold: { fontWeight: '700', color: '#DC2626' },

  buttonRow: { flexDirection: 'row', gap: 10, width: '100%' },
  btn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 12, paddingVertical: 13 },
  btnFull: { flex: 0, width: '100%' },
  btnCancel: { backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB' },
  btnCancelText: { fontSize: 14, fontWeight: '700', color: '#324D3E' },
  btnDelete: {
    backgroundColor: '#DC2626',
    ...Platform.select({
      ios: { shadowColor: '#DC2626', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
      android: { elevation: 4 },
      default: { boxShadow: '0 4px 8px rgba(220,38,38,0.3)' },
    }),
  },
  btnDeleteText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  btnDisabled: { opacity: 0.6 },
});