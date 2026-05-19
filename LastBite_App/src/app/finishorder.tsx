import { useMemo, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCart } from '../context/CartContext';

export default function FinishOrder() {
  const { items, orders, addOrder, clearCart } = useCart();

  const orderId = useMemo(
    () => `LBT-${Math.floor(100000 + Math.random() * 900000)}`,
    []
  );

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2, '0')}-${String(
    today.getMonth() + 1
  ).padStart(2, '0')}-${today.getFullYear()}`;

  // Simpan order ke history sekali saat mount
  useEffect(() => {
    // Cek biar gak duplikat kalau re-render
    const alreadySaved = orders.some((o) => o.orderId === orderId);
    if (!alreadySaved && items.length > 0) {
      addOrder({
        orderId,
        date: dateStr,
        items: [...items],
        total,
        status: 'Completed',
      });
      clearCart();
    }
  }, []);

  return (
    <LinearGradient
      colors={['#DAE6D8', '#92AF8C']}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Card */}
        <View style={styles.successCard}>
          <View style={styles.iconOuter}>
            <View style={styles.iconInner}>
              <Ionicons name="checkmark" size={44} color="#fff" />
            </View>
          </View>

          <Text style={styles.successTitle}>Order Placed!</Text>
          <Text style={styles.successSubtitle}>
            Your eco-rescue food has been reserved.{'\n'}
            Thank you for reducing food waste! 🌱
          </Text>

          <View style={styles.detailsBox}>
            <View style={styles.detailRow}>
              <View style={styles.detailLabelRow}>
                <Ionicons name="receipt-outline" size={14} color="#7A8A7A" />
                <Text style={styles.detailLabel}>Order ID</Text>
              </View>
              <Text style={styles.orderIdValue}>{orderId}</Text>
            </View>

            <View style={styles.dashedDivider} />

            <View style={styles.detailRow}>
              <View style={styles.detailLabelRow}>
                <Ionicons name="card-outline" size={14} color="#7A8A7A" />
                <Text style={styles.detailLabel}>Payment</Text>
              </View>
              <View style={styles.paidBadge}>
                <View style={styles.paidDot} />
                <Text style={styles.paidText}>PAID</Text>
              </View>
            </View>

            <View style={styles.dashedDivider} />

            <View style={styles.detailRow}>
              <View style={styles.detailLabelRow}>
                <Ionicons name="bag-handle-outline" size={14} color="#7A8A7A" />
                <Text style={styles.detailLabel}>Pickup</Text>
              </View>
              <Text style={styles.detailValue}>Self-Pickup</Text>
            </View>
          </View>

          <View style={styles.warningCard}>
            <MaterialCommunityIcons name="clock-alert-outline" size={18} color="#B45309" />
            <Text style={styles.warningText}>
              Pick up before the store's countdown timer ends!
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
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
      </ScrollView>
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
  scrollContent: { paddingHorizontal: 24, paddingTop: 80, paddingBottom: 40, minHeight: '100%', justifyContent: 'space-between' },
  successCard: { backgroundColor: '#fff', borderRadius: 28, padding: 28, alignItems: 'center', ...shadowStyle },
  iconOuter: { width: 92, height: 92, borderRadius: 46, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center' },
  iconInner: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#065F46', alignItems: 'center', justifyContent: 'center',
    ...Platform.select({ ios: { shadowColor: '#065F46', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 10 }, android: { elevation: 8 }, default: { boxShadow: '0 6px 10px 0 rgba(6,95,70,0.4)' } })
  },
  successTitle: { fontSize: 24, fontWeight: '700', color: '#324D3E', marginTop: 20, textAlign: 'center' },
  successSubtitle: { fontSize: 13, color: '#5F6B5F', marginTop: 8, textAlign: 'center', lineHeight: 20 },
  detailsBox: { width: '100%', backgroundColor: '#F9FAF9', borderRadius: 16, padding: 16, marginTop: 24, gap: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailLabel: { fontSize: 12, color: '#7A8A7A' },
  detailValue: { fontSize: 13, fontWeight: '600', color: '#324D3E' },
  orderIdValue: { fontSize: 13, fontWeight: '700', color: '#324D3E',
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }), letterSpacing: 0.5
  },
  dashedDivider: { height: 1, borderTopWidth: 1, borderTopColor: '#E5E7E5', borderStyle: 'dashed' },
  paidBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  paidDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#065F46' },
  paidText: { fontSize: 10, fontWeight: '700', color: '#065F46', letterSpacing: 0.5 },
  warningCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FEF3C7', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginTop: 16, width: '100%' },
  warningText: { flex: 1, fontSize: 11, color: '#92400E', lineHeight: 16 },
  actionButtons: { gap: 10, marginTop: 28 },
  primaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#324D3E', borderRadius: 14, paddingVertical: 16,
    ...Platform.select({ ios: { shadowColor: '#324D3E', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12 }, android: { elevation: 6 }, default: { boxShadow: '0 8px 16px 0 rgba(50,77,62,0.3)' } })
  },
  primaryButtonText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  secondaryButton: { alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 14, paddingVertical: 14 },
  secondaryButtonText: { fontSize: 14, fontWeight: '600', color: '#324D3E' },
});