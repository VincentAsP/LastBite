import {
  View, Text, Pressable,
  ScrollView, StyleSheet, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const ADDRESSES = [
  { id: 1, name: 'Sia Landia', phone: '(+62) 896-1761-0908', address: 'Slateford Road, Edinburgh' },
  { id: 2, name: 'Sia Landia', phone: '(+62) 896-1761-0908', address: 'Gorgie Road, Edinburgh' },
];

export default function AddressesPage() {
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
          <Text style={styles.headerTitle}>My Addresses</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Address list */}
        <View style={styles.list}>
          {ADDRESSES.map((item) => (
            <Pressable key={item.id} style={styles.addressCard}>
              <View style={styles.addressTop}>
                <Text style={styles.addressName}>{item.name}</Text>
                <Text style={styles.addressSeparator}> | </Text>
                <Text style={styles.addressPhone}>{item.phone}</Text>
              </View>
              <Text style={styles.addressText}>{item.address}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Add Address button */}
      <View style={styles.bottomBar}>
        <Pressable
          style={styles.addButton}
          onPress={() => router.push('/addadresses')}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add Address</Text>
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

  list: { gap: 12 },
  addressCard: {
    backgroundColor: '#fff', borderRadius: 16,
    padding: 18, ...shadowStyle,
  },
  addressTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  addressName: { fontSize: 15, fontWeight: '700', color: '#1F3A2E' },
  addressSeparator: { fontSize: 15, color: '#9CA3AF', marginHorizontal: 2 },
  addressPhone: { fontSize: 14, color: '#5F5E5B' },
  addressText: { fontSize: 14, color: '#5F5E5B' },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 20, paddingBottom: 32, paddingTop: 16,
    backgroundColor: 'transparent',
  },
  addButton: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8,
    backgroundColor: '#324D3E', borderRadius: 14, paddingVertical: 16,
    ...Platform.select({
      ios: { shadowColor: '#324D3E', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10 },
      android: { elevation: 6 },
      default: { boxShadow: '0 6px 12px 0 rgba(50,77,62,0.3)' },
    }),
  },
  addButtonText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});