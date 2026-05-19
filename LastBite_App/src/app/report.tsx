import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const REASONS = [
  'Wrong or missing item',
  'Food quality issue',
  'Misleading photo or description',
  'Fake review or spam',
  'Payment problem',
  'Other',
];

export default function ReportPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <LinearGradient colors={['#DAE6D8', '#92AF8C']} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={20} color="#1F3A2E" />
          </Pressable>
          <Pressable style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={20} color="#1F3A2E" />
          </Pressable>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Help us understand{'\n'}your report</Text>
          <Text style={styles.subtitle}>
            select the reason that best describes the issue
          </Text>
        </View>

        {/* Options */}
        <View style={styles.optionsList}>
          {REASONS.map((reason) => (
            <Pressable
              key={reason}
              style={[
                styles.optionRow,
                selected === reason && styles.optionRowSelected,
              ]}
              onPress={() => setSelected(reason)}
            >
              <Text
                style={[
                  styles.optionText,
                  selected === reason && styles.optionTextSelected,
                ]}
              >
                {reason}
              </Text>
              <View
                style={[
                  styles.radio,
                  selected === reason && styles.radioSelected,
                ]}
              >
                {selected === reason && <View style={styles.radioDot} />}
              </View>
            </Pressable>
          ))}
        </View>

        {/* Submit */}
        <Pressable
          style={[styles.submitButton, !selected && styles.submitButtonDisabled]}
          onPress={() => {
            if (selected) router.push('/finishreport');
          }}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
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
  container: { flex: 1, maxWidth: 402, alignSelf: 'center', width: '100%' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 48 },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    ...shadowStyle,
  },
  settingsButton: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    ...shadowStyle,
  },

  /* Title */
  titleSection: { marginBottom: 28 },
  title: { fontSize: 24, fontWeight: '700', color: '#1F3A2E', lineHeight: 32, marginBottom: 8 },
  subtitle: { fontSize: 13, color: '#5F5E5B' },

  /* Options */
  optionsList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 28,
    ...shadowStyle,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionRowSelected: {
    backgroundColor: '#F0F7F0',
  },
  optionText: { fontSize: 14, color: '#1F3A2E', flex: 1, marginRight: 12 },
  optionTextSelected: { fontWeight: '600', color: '#324D3E' },

  /* Radio */
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: '#C4C4C4',
    alignItems: 'center', justifyContent: 'center',
  },
  radioSelected: { borderColor: '#324D3E' },
  radioDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#324D3E',
  },

  /* Submit */
  submitButton: {
    backgroundColor: '#324D3E',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#324D3E', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10 },
      android: { elevation: 6 },
      default: { boxShadow: '0 6px 12px 0 rgba(50,77,62,0.3)' },
    }),
  },
  submitButtonDisabled: { opacity: 0.4 },
  submitButtonText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});