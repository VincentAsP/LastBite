import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCart } from '../context/CartContext';

const HOME_NAV_ICON = 'https://api.builder.io/api/v1/image/assets/TEMP/bed9da29344886f2e34a5b3e19c35277006023da?width=60';
const CART_NAV_ICON = 'https://api.builder.io/api/v1/image/assets/TEMP/e89e2d602d11a2de8ff32895a3552e5d9987bf68?width=60';
const HISTORY_NAV_ICON = 'https://api.builder.io/api/v1/image/assets/TEMP/8c990238ba69088582be0114e07ca52e0eb6de07?width=60';

export default function HistoryPage() {
  const { orders } = useCart();

  return (
    <LinearGradient colors={['#DAE6D8', '#92AF8C']} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>History</Text>

        {/* Empty state */}
        {orders.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color="#324D3E" />
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySubtitle}>
              Complete an order to see it here
            </Text>
            <Pressable
              style={styles.shopButton}
              onPress={() => router.push('/home')}
            >
              <Text style={styles.shopButtonText}>Start Shopping</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.ordersList}>
            {orders.map((order) => (
              <View key={order.orderId} style={styles.orderCard}>
                {/* Order items preview */}
                {order.items.map((item) => (
                  <View key={item.id} style={styles.itemRow}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.itemImage}
                    />
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName} numberOfLines={1}>
                        {item.name} ×{item.quantity}
                      </Text>
                      <Text style={styles.itemTotal}>
                        Total : Rp{(item.price * item.quantity).toLocaleString('id-ID')}
                      </Text>
                    </View>
                    <View style={styles.rightCol}>
                      <Text style={styles.dateText}>{order.date}</Text>
                      <View
                        style={[
                          styles.statusBadge,
                          order.status === 'Completed'
                            ? styles.statusCompleted
                            : styles.statusCancelled,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            order.status === 'Completed'
                              ? styles.statusTextCompleted
                              : styles.statusTextCancelled,
                          ]}
                        >
                          {order.status}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}

                {/* Report link */}
                <Pressable
                  style={styles.reportRow}
                  onPress={() => router.push('/report')}
                >
                  <Text style={styles.reportText}>Report</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom navigation */}
      <LinearGradient
        colors={['#DAE6D8', '#92AF8C']}
        style={styles.bottomNav}
      >
        <Pressable
          style={styles.bottomNavItem}
          onPress={() => router.push('/home')}
        >
          <Image source={{ uri: HOME_NAV_ICON }} style={styles.bottomNavIcon} />
          <Text style={styles.bottomNavLabel}>Home</Text>
        </Pressable>

        <Pressable
          style={styles.bottomNavItem}
          onPress={() => router.push('/cart')}
        >
          <Image source={{ uri: CART_NAV_ICON }} style={styles.bottomNavIcon} />
          <Text style={styles.bottomNavLabel}>Cart</Text>
        </Pressable>

        <Pressable style={[styles.bottomNavItem, styles.bottomNavItemActive]}>
          <Image source={{ uri: HISTORY_NAV_ICON }} style={styles.bottomNavIcon} />
          <Text style={[styles.bottomNavLabel, styles.bottomNavLabelActive]}>
            History
          </Text>
        </Pressable>
      </LinearGradient>
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
  scrollContent: { paddingHorizontal: 20, paddingTop: 32, paddingBottom: 96 },

  title: { fontSize: 28, fontWeight: '700', color: '#324D3E', marginBottom: 24 },

  /* Empty */
  emptyState: { alignItems: 'center', paddingVertical: 80, gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#324D3E', marginTop: 16 },
  emptySubtitle: { fontSize: 13, color: '#5F5E5B', textAlign: 'center' },
  shopButton: { marginTop: 16, backgroundColor: '#324D3E', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 999 },
  shopButtonText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  /* Orders list */
  ordersList: { gap: 12 },
  orderCard: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', ...shadowStyle },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  itemImage: { width: 52, height: 52, borderRadius: 12 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '600', color: '#161D1F', marginBottom: 4 },
  itemTotal: { fontSize: 12, color: '#5F5E5B' },

  rightCol: { alignItems: 'flex-end', gap: 6 },
  dateText: { fontSize: 11, color: '#7A8A7A' },

  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  statusCompleted: { backgroundColor: '#E5EDFF' },
  statusCancelled: { backgroundColor: '#FFE5E5' },
  statusText: { fontSize: 11, fontWeight: '700' },
  statusTextCompleted: { color: '#1D4ED8' },
  statusTextCancelled: { color: '#DC2626' },

  reportRow: { paddingHorizontal: 14, paddingBottom: 10 },
  reportText: { fontSize: 12, color: '#5F5E5B', textDecorationLine: 'underline' },

  /* Bottom Nav */
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 24 },
  bottomNavItem: { alignItems: 'center', gap: 2 },
  bottomNavItemActive: { opacity: 0.7 },
  bottomNavIcon: { width: 28, height: 28 },
  bottomNavLabel: { fontSize: 10, color: '#fff' },
  bottomNavLabelActive: { fontWeight: '700', color: '#324D3E' },
});