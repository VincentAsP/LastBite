import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function FinishReport() {
  return (
    <LinearGradient colors={['#DAE6D8', '#92AF8C']} style={styles.container}>
      <View style={styles.content}>

        {/* Success Card */}
        <View style={styles.card}>
          {/* Layered check icon */}
          <View style={styles.iconOuter}>
            <View style={styles.iconMiddle}>
              <View style={styles.iconInner}>
                <Ionicons name="checkmark" size={48} color="#22C55E" />
              </View>
            </View>
          </View>

          {/* Text */}
          <Text style={styles.cardTitle}>Report Submitted!</Text>
          <Text style={styles.cardSubtitle}>
            Thank you for helping us improve.
          </Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Info text */}
          <View style={styles.infoBox}>
            <Ionicons name="shield-checkmark-outline" size={18} color="#324D3E" />
            <Text style={styles.infoText}>
              Your feedback helps keep our community safe. We'll review the issue and follow up if we need more information.
            </Text>
          </View>

          {/* What happens next */}
          <View style={styles.stepsBox}>
            <Text style={styles.stepsTitle}>What happens next?</Text>

            <View style={styles.stepRow}>
              <View style={styles.stepDot} />
              <Text style={styles.stepText}>Our team reviews your report within 24 hours</Text>
            </View>
            <View style={styles.stepRow}>
              <View style={styles.stepDot} />
              <Text style={styles.stepText}>We may contact you for more details</Text>
            </View>
            <View style={styles.stepRow}>
              <View style={[styles.stepDot, { backgroundColor: '#92AF8C' }]} />
              <Text style={styles.stepText}>Action taken if the report is verified</Text>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.actionButtons}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => router.push('/home')}
          >
            <Ionicons name="home" size={18} color="#fff" />
            <Text style={styles.primaryButtonText}>Back to Homepage</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push('/history')}
          >
            <Text style={styles.secondaryButtonText}>View Order History</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const shadowStyle = Platform.select({
  ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 },
  android: { elevation: 5 },
  default: { boxShadow: '0 4px 12px 0 rgba(0,0,0,0.1)' },
});

const styles = StyleSheet.create({
  container: { flex: 1, maxWidth: 402, alignSelf: 'center', width: '100%' },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },

  /* Card */
  card: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    ...shadowStyle,
  },

  /* Icon layers */
  iconOuter: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: '#F0FDF4',
    alignItems: 'center', justifyContent: 'center',
  },
  iconMiddle: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: '#DCFCE7',
    alignItems: 'center', justifyContent: 'center',
  },
  iconInner: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#22C55E',
    alignItems: 'center', justifyContent: 'center',
  },

  cardTitle: {
    fontSize: 22, fontWeight: '700', color: '#1F3A2E',
    marginTop: 20, textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 13, color: '#5F6B5F',
    marginTop: 6, textAlign: 'center',
  },

  divider: {
    width: '100%', height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 20,
  },

  /* Info box */
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#F0F7F0',
    borderRadius: 14,
    padding: 14,
    width: '100%',
    marginBottom: 20,
  },
  infoText: {
    flex: 1, fontSize: 12,
    color: '#324D3E', lineHeight: 18,
  },

  /* Steps */
  stepsBox: { width: '100%', gap: 10 },
  stepsTitle: {
    fontSize: 13, fontWeight: '700',
    color: '#1F3A2E', marginBottom: 4,
  },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  stepDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#324D3E',
    marginTop: 5,
  },
  stepText: { flex: 1, fontSize: 12, color: '#5F6B5F', lineHeight: 18 },

  /* Buttons */
  actionButtons: { gap: 10, marginTop: 24 },
  primaryButton: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10,
    backgroundColor: '#324D3E',
    borderRadius: 14, paddingVertical: 16,
    ...Platform.select({
      ios: { shadowColor: '#324D3E', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12 },
      android: { elevation: 6 },
      default: { boxShadow: '0 8px 16px 0 rgba(50,77,62,0.3)' },
    }),
  },
  primaryButtonText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  secondaryButton: {
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 14, paddingVertical: 14,
  },
  secondaryButtonText: { fontSize: 14, fontWeight: '600', color: '#324D3E' },
});