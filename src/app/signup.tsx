import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// === Error code mapping ===
const REGISTER_ERRORS: Record<number, string> = {
  400: 'Email is already registered',
  500: 'Internal server error. Please try again',
};

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const WEEKDAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

// ─── Calendar Picker ───
function CalendarPicker({
  visible,
  selectedDate,
  onSelect,
  onClose,
}: {
  visible: boolean;
  selectedDate: Date | null;
  onSelect: (d: Date) => void;
  onClose: () => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const initYear = selectedDate ? selectedDate.getFullYear() : today.getFullYear() - 20;
  const initMonth = selectedDate ? selectedDate.getMonth() : today.getMonth();

  const [viewYear, setViewYear] = useState(initYear);
  const [viewMonth, setViewMonth] = useState(initMonth);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isSel = (d: number) =>
    selectedDate !== null &&
    selectedDate.getDate() === d &&
    selectedDate.getMonth() === viewMonth &&
    selectedDate.getFullYear() === viewYear;

  // For birth date: allow past dates only (up to today)
  const isFuture = (d: number) => {
    const cell = new Date(viewYear, viewMonth, d);
    cell.setHours(0, 0, 0, 0);
    return cell > today;
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={cal.overlay} onPress={onClose}>
        <Pressable style={cal.card} onPress={e => e.stopPropagation()}>
          {/* Header */}
          <View style={cal.header}>
            <Pressable style={cal.navBtn} onPress={prevMonth}>
              <Ionicons name="chevron-back" size={18} color="#1F3A2E" />
            </Pressable>
            <View style={cal.monthYearRow}>
              <Text style={cal.monthLabel}>{MONTHS[viewMonth]}</Text>
              <Text style={cal.yearLabel}>{viewYear}</Text>
            </View>
            <Pressable style={cal.navBtn} onPress={nextMonth}>
              <Ionicons name="chevron-forward" size={18} color="#1F3A2E" />
            </Pressable>
          </View>

          {/* Weekday labels */}
          <View style={cal.weekRow}>
            {WEEKDAYS.map(w => (
              <Text key={w} style={cal.weekLabel}>{w}</Text>
            ))}
          </View>

          {/* Days grid */}
          <View style={cal.grid}>
            {cells.map((d, i) => {
              if (!d) return <View key={`e-${i}`} style={cal.cell} />;
              const future = isFuture(d);
              const sel = isSel(d);
              return (
                <Pressable
                  key={`d-${d}`}
                  style={[cal.cell, sel && cal.cellSel, future && cal.cellDisabled]}
                  onPress={() => {
                    if (!future) {
                      onSelect(new Date(viewYear, viewMonth, d));
                      onClose();
                    }
                  }}
                  disabled={future}
                >
                  <Text style={[cal.cellText, sel && cal.cellTextSel, future && cal.cellTextDisabled]}>
                    {d}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable style={cal.cancelBtn} onPress={onClose}>
            <Text style={cal.cancelText}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const cal = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center', alignItems: 'center', padding: 24,
  },
  card: {
    backgroundColor: '#fff', borderRadius: 20, padding: 20,
    width: '100%', maxWidth: 340,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.18, shadowRadius: 24 },
      android: { elevation: 12 },
      default: { boxShadow: '0 8px 32px rgba(0,0,0,0.18)' },
    }),
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  navBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F3F4F3', alignItems: 'center', justifyContent: 'center' },
  monthYearRow: { alignItems: 'center' },
  monthLabel: { fontSize: 16, fontWeight: '700', color: '#1F3A2E' },
  yearLabel: { fontSize: 12, color: '#7A8A7A', marginTop: 1 },
  weekRow: { flexDirection: 'row', marginBottom: 8 },
  weekLabel: { flex: 1, textAlign: 'center', fontSize: 11, fontWeight: '600', color: '#9BA89B' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100/7}%` as any, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  cellSel: { backgroundColor: '#324D3E' },
  cellDisabled: { opacity: 0.25 },
  cellText: { fontSize: 14, color: '#1F3A2E', fontWeight: '500' },
  cellTextSel: { color: '#fff', fontWeight: '700' },
  cellTextDisabled: { color: '#9BA89B' },
  cancelBtn: { marginTop: 16, paddingVertical: 12, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F3F4F3' },
  cancelText: { fontSize: 14, color: '#B91C1C', fontWeight: '600' },
});

// ─── Main Component ───
export default function SignUp() {
  const [showTerms, setShowTerms] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedBirthDate, setSelectedBirthDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const formatDate = (d: Date) =>
    `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;

  const handleSignUp = async () => {
    setError(null);

    if (!form.fullName.trim()) { setError('Please enter your full name'); return; }
    if (!form.email.trim()) { setError('Please enter your email'); return; }
    if (!selectedBirthDate) { setError('Please select your date of birth'); return; }
    if (form.password !== form.confirmPassword) { setError('Password and confirmation do not match'); return; }

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      if (form.email === 'taken@gmail.com') { setError(REGISTER_ERRORS[400]); return; }
      console.log('Register success:', { ...form, birthDate: formatDate(selectedBirthDate) });
    } catch {
      setError(REGISTER_ERRORS[500]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#DAE6D8', '#92AF8C']} style={styles.container}>
      {/* Calendar popup */}
      <CalendarPicker
        visible={showCalendar}
        selectedDate={selectedBirthDate}
        onSelect={(d) => { setSelectedBirthDate(d); if (error) setError(null); }}
        onClose={() => setShowCalendar(false)}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Get Started Now</Text>
          <Text style={styles.subtitle}>Create an account or Log in to explore!</Text>
        </View>

        <Text style={styles.pageTitle}>Sign Up</Text>

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
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={form.fullName}
              onChangeText={(t) => handleChange('fullName', t)}
              autoCapitalize="words"
              editable={!loading}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={form.email}
              onChangeText={(t) => handleChange('email', t)}
              placeholder="example@gmail.com"
              placeholderTextColor="rgba(116,139,111,0.4)"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          {/* Birth Date — calendar picker */}
          <View style={styles.field}>
            <Text style={styles.label}>Date of Birth</Text>
            <Pressable
              style={[styles.input, styles.dateButton]}
              onPress={() => !loading && setShowCalendar(true)}
            >
              <Text style={[styles.dateButtonText, !selectedBirthDate && styles.dateButtonPlaceholder]}>
                {selectedBirthDate ? formatDate(selectedBirthDate) : 'DD/MM/YYYY'}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#324D3E" />
            </Pressable>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Set Password</Text>
            <TextInput
              style={styles.input}
              value={form.password}
              onChangeText={(t) => handleChange('password', t)}
              secureTextEntry
              editable={!loading}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              value={form.confirmPassword}
              onChangeText={(t) => handleChange('confirmPassword', t)}
              secureTextEntry
              editable={!loading}
            />
          </View>

          {/* Sign Up Button */}
          <View style={styles.submitWrapper}>
            <Pressable
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#DAE6D8" />
              ) : (
                <Text style={styles.submitButtonText}>Sign Up</Text>
              )}
            </Pressable>
          </View>

          <Text style={styles.fineprint}>
            By signing up, you agree to our{' '}
            <Text style={styles.fineprintLink} onPress={() => setShowTerms(true)}>
              Terms & Conditions
            </Text>
          </Text>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable onPress={() => router.push('/')}>
              <Text style={styles.footerLink}>Sign In</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Modal Terms & Conditions */}
      <Modal visible={showTerms} animationType="slide" transparent onRequestClose={() => setShowTerms(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Terms & Conditions</Text>
              <Pressable onPress={() => setShowTerms(false)} style={styles.closeButton}>
                <Ionicons name="close" size={20} color="#324D3E" />
              </Pressable>
            </View>
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {[
                ['1. General', 'By creating an account, you agree to be bound by these Terms & Conditions. You confirm that the information you provide is accurate and that you are at least 17 years old.'],
                ['2. As a Customer', 'You agree to provide valid payment and delivery information, to follow the ordering and cancellation policies, and not to misuse the platform for fraudulent activity such as fake orders or chargeback abuse.'],
                ['3. As a Seller', 'If you choose to sell on this platform, you agree to provide accurate menu, price, and stock information, to fulfill orders in a timely manner, and to comply with all applicable food safety, hygiene, and tax regulations in your area.'],
                ['4. Fees & Payments', 'A service fee may be deducted from each transaction. Payouts to sellers will be processed according to the schedule stated in the seller dashboard.'],
                ['5. Account Suspension', 'We reserve the right to suspend or terminate accounts that violate these terms, including fraud, harassment, or repeated negative reviews and complaints.'],
                ['6. Privacy', 'Your data will be processed according to our Privacy Policy. We will never sell your personal information to third parties.'],
                ['7. Changes', 'These terms may be updated from time to time. Continued use of the platform after changes are published means you accept the updated terms.'],
              ].map(([heading, body]) => (
                <View key={heading}>
                  <Text style={styles.sectionHeading}>{heading}</Text>
                  <Text style={styles.sectionBody}>{body}</Text>
                </View>
              ))}
            </ScrollView>
            <Pressable style={styles.modalAgreeButton} onPress={() => setShowTerms(false)}>
              <Text style={styles.modalAgreeText}>Got it</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const shadowStyle = Platform.select({
  ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 4 },
  android: { elevation: 4 },
  default: { boxShadow: '0 4px 4px 0 rgba(0,0,0,0.25)' },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 },
  header: { alignItems: 'center', marginBottom: 12 },
  title: { color: '#324D3E', fontWeight: '800', fontSize: 30, marginBottom: 6, textAlign: 'center' },
  subtitle: { color: '#5C6E5E', fontSize: 12, textAlign: 'center' },
  pageTitle: { color: '#324D3E', fontSize: 30, fontWeight: '800', textAlign: 'center', marginBottom: 20, marginTop: 4 },
  errorBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FEE2E2', borderLeftWidth: 3, borderLeftColor: '#DC2626', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 16 },
  errorText: { flex: 1, fontSize: 12, fontWeight: '600', color: '#B91C1C', lineHeight: 16 },
  form: { gap: 16 },
  field: { gap: 6 },
  label: { color: '#324D3E', fontSize: 13, fontWeight: '700', paddingLeft: 4 },
  input: {
    height: 44, borderRadius: 999, backgroundColor: '#fff',
    paddingHorizontal: 18, color: '#324D3E', fontSize: 14,
    ...shadowStyle,
    ...(Platform.OS === 'web' ? { outlineWidth: 0 } : {}),
  } as any,

  /* Date picker button — same shape as input */
  dateButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingRight: 14,
  },
  dateButtonText: { fontSize: 14, color: '#324D3E', flex: 1 },
  dateButtonPlaceholder: { color: 'rgba(116,139,111,0.4)' },

  submitWrapper: { alignItems: 'center', marginTop: 16 },
  submitButton: { paddingHorizontal: 40, paddingVertical: 12, minWidth: 160, borderRadius: 999, backgroundColor: '#324D3E', alignItems: 'center', justifyContent: 'center', ...shadowStyle },
  submitButtonDisabled: { opacity: 0.5 },
  submitButtonText: { color: '#DAE6D8', fontSize: 15, fontWeight: '700' },
  fineprint: { fontSize: 11, color: '#5C6E5E', textAlign: 'center', marginTop: 6, lineHeight: 16 },
  fineprintLink: { fontWeight: '700', color: '#324D3E', textDecorationLine: 'underline' },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 14 },
  footerText: { fontSize: 13, color: '#5C6E5E' },
  footerLink: { fontSize: 13, fontWeight: '700', color: '#324D3E', textDecorationLine: 'underline' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end', alignItems: 'center' },
  modalContainer: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 32, maxHeight: '85%', width: '100%', maxWidth: 402 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#324D3E' },
  closeButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#DAE6D8', alignItems: 'center', justifyContent: 'center' },
  modalBody: { marginBottom: 16 },
  sectionHeading: { fontSize: 14, fontWeight: '700', color: '#324D3E', marginTop: 12, marginBottom: 4 },
  sectionBody: { fontSize: 13, color: '#5C6E5E', lineHeight: 19 },
  modalAgreeButton: { backgroundColor: '#324D3E', borderRadius: 999, paddingVertical: 14, alignItems: 'center', ...shadowStyle },
  modalAgreeText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});