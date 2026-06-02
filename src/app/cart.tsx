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
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCart } from '../context/CartContext';

const formatPrice = (amount: number) => `Rp${amount.toLocaleString('id-ID')}`;

export default function CartPage() {
  const { items, increment, decrement } = useCart();

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <LinearGradient colors={['#DAE6D8', '#92AF8C']} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Cart</Text>
          <View style={styles.cartCountBadge}>
            <Text style={styles.cartCountText}>{items.length} items</Text>
          </View>
        </View>

        {/* Cart items / Empty state */}
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="bag-outline" size={64} color="#324D3E" />
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtitle}>
              Add food from Mystery Boxes or Food Pages
            </Text>
          </View>
        ) : (
          <View style={styles.itemsList}>
            {items.map((item) => (
              <View key={item.id} style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <View style={styles.restaurantRow}>
                    <MaterialCommunityIcons
                      name="storefront-outline"
                      size={12}
                      color="#5F5E5B"
                    />
                    <Text style={styles.restaurantText}>{item.restaurant}</Text>
                  </View>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceText}>{formatPrice(item.price)}</Text>
                    <View style={styles.quantityControl}>
                      {/* Minus button — white icon on dark bg */}
                      <Pressable
                        onPress={() => decrement(item.id)}
                        style={styles.qtyButtonMinus}
                      >
                        <Ionicons name="remove" size={14} color="#324D3E" />
                      </Pressable>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      {/* Plus button */}
                      <Pressable
                        onPress={() => increment(item.id)}
                        style={styles.qtyButtonPlus}
                      >
                        <Ionicons name="add" size={14} color="#fff" />
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Total + Checkout */}
        {items.length > 0 && (
          <View style={styles.checkoutSection}>
            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatPrice(subtotal)}</Text>
            </View>
            <Pressable
              style={styles.checkoutButton}
              onPress={() => router.push('/ordersum')}
            >
              <Text style={styles.checkoutButtonText}>Checkout</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* ─── BOTTOM NAVIGATION BAR ─── */}
      <View style={styles.bottomNav}>
        <Pressable style={styles.bottomNavItem} onPress={() => router.push('/home')}>
          <Ionicons name="home-outline" size={24} color="#fff" />
          <Text style={styles.bottomNavLabel}>Home</Text>
        </Pressable>
        <Pressable style={styles.bottomNavItem}>
          <Feather name="shopping-cart" size={24} color="#fff" />
          <Text style={[styles.bottomNavLabel, styles.bottomNavLabelActive]}>Cart</Text>
        </Pressable>
        <Pressable style={styles.bottomNavItem} onPress={() => router.push('/history')}>
          <Ionicons name="receipt-outline" size={24} color="#fff" />
          <Text style={styles.bottomNavLabel}>History</Text>
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
  scrollContent: { paddingHorizontal: 20, paddingTop: 32, paddingBottom: 110 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '700', color: '#324D3E' },
  cartCountBadge: { backgroundColor: 'rgba(255,255,255,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  cartCountText: { fontSize: 13, fontWeight: '600', color: '#324D3E' },
  itemsList: { gap: 12 },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, padding: 14, gap: 14, alignItems: 'center', ...shadowStyle },
  itemImage: { width: 72, height: 72, borderRadius: 14 },
  itemDetails: { flex: 1, gap: 4 },
  restaurantRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  restaurantText: { fontSize: 12, color: '#5F5E5B' },
  itemName: { fontSize: 16, fontWeight: '600', color: '#161D1F' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  priceText: { fontSize: 15, fontWeight: '700', color: '#324D3E' },
  quantityControl: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  /* Minus: outlined style so the icon is visible */
  qtyButtonMinus: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#E8EDEA',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#C5D0C9',
  },
  /* Plus: filled dark */
  qtyButtonPlus: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#324D3E',
    alignItems: 'center', justifyContent: 'center',
  },
  quantityText: { fontSize: 14, fontWeight: '700', color: '#324D3E', minWidth: 16, textAlign: 'center' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80, gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#324D3E', marginTop: 16 },
  emptySubtitle: { fontSize: 13, color: '#5F5E5B', textAlign: 'center' },
  checkoutSection: { marginTop: 24, gap: 12 },
  totalCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 14, paddingHorizontal: 18, paddingVertical: 14 },
  totalLabel: { fontSize: 14, fontWeight: '600', color: '#324D3E' },
  totalValue: { fontSize: 18, fontWeight: '700', color: '#324D3E' },
  checkoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: '#324D3E', borderRadius: 14, paddingVertical: 16,
    ...Platform.select({
      ios: { shadowColor: '#324D3E', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12 },
      android: { elevation: 6 },
      default: { boxShadow: '0 8px 16px 0 rgba(50,77,62,0.3)' },
    }),
  },
  checkoutButtonText: { fontSize: 16, fontWeight: '700', color: '#fff' },

  /* Bottom Nav — matches home */
  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    maxWidth: 402, alignSelf: 'center', width: '100%',
    height: 90, backgroundColor: '#92AF8C',
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 20 : 12, paddingTop: 12,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 8 },
      android: { elevation: 12 },
      default: { boxShadow: '0 -4px 8px rgba(0,0,0,0.1)' },
    }),
  },
  bottomNavItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 6 },
  bottomNavLabel: { fontSize: 12, fontWeight: '600', color: '#fff' },
  bottomNavLabelActive: { color: '#DAE6D8', fontWeight: '800' },
});