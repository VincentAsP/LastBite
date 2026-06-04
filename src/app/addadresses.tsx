import { useState } from 'react';
import {
  View, Text, TextInput, Pressable,
  ScrollView, StyleSheet, Platform, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function AddAddressPage() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [road, setRoad] = useState('');
  const [details, setDetails] = useState('');

  const handleSave = () => {
    if (!fullName || !phone || !city || !road) {
      Alert.alert('Incomplete', 'Please fill in all required fields.');
      return;
    }
    Alert.alert('Address Saved!', `${road}, ${city}`, [
      { text: 'OK', onPress: () => router.back() },
    ]);
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
          <Text style={styles.headerTitle}>Add Addresses</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Address</Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#A8A29E"
            value={fullName}
            onChangeText={setFullName}
          />
          <TextInput
            style={styles.input}
            placeholder="Telephone Number"
            placeholderTextColor="#A8A29E"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Province, City"
            placeholderTextColor="#A8A29E"
            value={city}
            onChangeText={setCity}
          />
          <TextInput
            style={styles.input}
            placeholder="Road, Building"
            placeholderTextColor="#A8A29E"
            value={road}
            onChangeText={setRoad}
          />
          <TextInput
            style={[styles.input, { marginBottom: 0 }]}
            placeholder="More Details (Optional)"
            placeholderTextColor="#A8A29E"
            value={details}
            onChangeText={setDetails}
          />
        </View>
      </ScrollView>

      {/* Save button */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </View>
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
  scrollContent: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 120 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', ...shadowStyle },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1F3A2E' },

  card: { backgroundColor: '#fff', borderRadius: 20, padding: 18, ...shadowStyle },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1F3A2E', marginBottom: 16 },
  input: {
    borderWidth: 1, borderColor: '#E5E7E5',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 14, color: '#1F3A2E',
    backgroundColor: '#FAFAFA', marginBottom: 12,
  },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 20, paddingBottom: 32, paddingTop: 16,
  },
  saveButton: {
    backgroundColor: '#324D3E', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#324D3E', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10 },
      android: { elevation: 6 },
      default: { boxShadow: '0 6px 12px 0 rgba(50,77,62,0.3)' },
    }),
  },
  saveButtonText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});