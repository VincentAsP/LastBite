import { useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCart } from '../context/CartContext';

type Order = ReturnType<typeof useCart>['orders'][number];

function OrderDetailModal({
  order,
  visible,
  onClose,
}: {
  order: Order | null;
  visible: boolean;
  onClose: () => void;
}) {
  if (!order) return null;

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryType: 'delivery' | 'pickup' = (order as any).deliveryType ?? 'pickup';
  const paymentMethod: string = (order as any).paymentMethod ?? 'BCA Virtual Account';
  const deliveryFee = deliveryType === 'delivery' ? 5000 : 0;
  const total = subtotal + deliveryFee;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={modal.overlay} onPress={onClose}>
        <Pressable style={modal.sheet} onPress={e => e.stopPropagation()}>
          <View style={modal.handle} />

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={modal.header}>
              <View>
                <Text style={modal.orderIdText}>Order Details</Text>
                <Text style={modal.orderIdSub}>{order.orderId} · {order.date}</Text>
              </View>
              <View style={[
                modal.statusBadge,
                order.status === 'Completed' ? modal.statusCompleted : modal.statusCancelled,
              ]}>
                <Text style={[
                  modal.statusText,
                  order.status === 'Completed' ? modal.statusTextCompleted : modal.statusTextCancelled,
                ]}>
                  {order.status}
                </Text>
              </View>
            </View>

            {/* Items */}
            <Text style={modal.sectionLabel}>Items</Text>
            {order.items.map((item) => (
              <View key={item.id} style={modal.itemRow}>
                <Image source={{ uri: item.image }} style={modal.itemImage} />
                <View style={{ flex: 1 }}>
                  <Text style={modal.itemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={modal.itemQty}>×{item.quantity}</Text>
                </View>
                <Text style={modal.itemPrice}>
                  Rp{(item.price * item.quantity).toLocaleString('id-ID')}
                </Text>
              </View>
            ))}

            {/* Delivery method — read only */}
            <Text style={[modal.sectionLabel, { marginTop: 20 }]}>Delivery Method</Text>
            <View style={modal.readOnlyRow}>
              <View style={modal.readOnlyIconBox}>
                <Ionicons
                  name={deliveryType === 'delivery' ? 'bicycle-outline' : 'walk-outline'}
                  size={20}
                  color="#fff"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={modal.readOnlyLabel}>
                  {deliveryType === 'delivery' ? 'Delivery' : 'Self Pickup'}
                </Text>
                <Text style={modal.readOnlyDesc}>
                  {deliveryType === 'delivery'
                    ? 'Delivered to your address'
                    : 'Picked up at the seller location'}
                </Text>
              </View>
              {deliveryType === 'delivery' && (
                <Text style={modal.readOnlyFee}>+Rp5.000</Text>
              )}
              {deliveryType === 'pickup' && (
                <Text style={modal.readOnlyFeeFree}>Free</Text>
              )}
            </View>

            {/* Payment method — read only */}
            <Text style={[modal.sectionLabel, { marginTop: 20 }]}>Payment Method</Text>
            <View style={modal.readOnlyRow}>
              <View style={modal.readOnlyIconBox}>
                <Ionicons name="wallet-outline" size={20} color="#fff" />
              </View>
              <Text style={modal.readOnlyLabel}>{paymentMethod}</Text>
            </View>

            {/* Price breakdown */}
            <View style={modal.priceBreakdown}>
              <View style={modal.priceRow}>
                <Text style={modal.priceRowLabel}>Subtotal</Text>
                <Text style={modal.priceRowValue}>Rp{subtotal.toLocaleString('id-ID')}</Text>
              </View>
              <View style={modal.priceRow}>
                <Text style={modal.priceRowLabel}>Delivery fee</Text>
                <Text style={modal.priceRowValue}>
                  {deliveryFee === 0 ? 'Free' : `Rp${deliveryFee.toLocaleString('id-ID')}`}
                </Text>
              </View>
              <View style={[modal.priceRow, modal.priceRowTotal]}>
                <Text style={modal.totalLabel}>Total</Text>
                <Text style={modal.totalValue}>Rp{total.toLocaleString('id-ID')}</Text>
              </View>
            </View>

            {/* Report */}
            <Pressable style={modal.reportRow} onPress={() => { onClose(); router.push('/report'); }}>
              <Ionicons name="flag-outline" size={14} color="#9CA3AF" />
              <Text style={modal.reportText}>Report an issue</Text>
            </Pressable>

            <Pressable style={modal.closeBtn} onPress={onClose}>
              <Text style={modal.closeBtnText}>Close</Text>
            </Pressable>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function HistoryPage() {
  const { orders } = useCart();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openOrder = (order: Order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  return (
    <LinearGradient colors={['#DAE6D8', '#92AF8C']} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>History</Text>

        {orders.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color="#324D3E" />
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySubtitle}>Complete an order to see it here</Text>
            <Pressable style={styles.shopButton} onPress={() => router.push('/home')}>
              <Text style={styles.shopButtonText}>Start Shopping</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.ordersList}>
            {orders.map((order) => (
              <Pressable
                key={order.orderId}
                style={styles.orderCard}
                onPress={() => openOrder(order)}
              >
                {order.items.map((item) => (
                  <View key={item.id} style={styles.itemRow}>
                    <Image source={{ uri: item.image }} style={styles.itemImage} />
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName} numberOfLines={1}>
                        {item.name} ×{item.quantity}
                      </Text>
                      <Text style={styles.itemTotal}>
                        Total: Rp{(item.price * item.quantity).toLocaleString('id-ID')}
                      </Text>
                    </View>
                    <View style={styles.rightCol}>
                      <Text style={styles.dateText}>{order.date}</Text>
                      <View style={[
                        styles.statusBadge,
                        order.status === 'Completed' ? styles.statusCompleted : styles.statusCancelled,
                      ]}>
                        <Text style={[
                          styles.statusText,
                          order.status === 'Completed' ? styles.statusTextCompleted : styles.statusTextCancelled,
                        ]}>
                          {order.status}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
                <View style={styles.tapHint}>
                  <Text style={styles.tapHintText}>Tap to view details</Text>
                  <Ionicons name="chevron-forward" size={12} color="#9BA89B" />
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <Pressable style={styles.bottomNavItem} onPress={() => router.push('/home')}>
          <Ionicons name="home-outline" size={24} color="#fff" />
          <Text style={styles.bottomNavLabel}>Home</Text>
        </Pressable>
        <Pressable style={styles.bottomNavItem} onPress={() => router.push('/cart')}>
          <Feather name="shopping-cart" size={24} color="#fff" />
          <Text style={styles.bottomNavLabel}>Cart</Text>
        </Pressable>
        <Pressable style={styles.bottomNavItem}>
          <Ionicons name="receipt" size={24} color="#fff" />
          <Text style={[styles.bottomNavLabel, styles.bottomNavLabelActive]}>History</Text>
        </Pressable>
      </View>

      <OrderDetailModal
        order={selectedOrder}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
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
  title: { fontSize: 28, fontWeight: '700', color: '#324D3E', marginBottom: 24 },
  emptyState: { alignItems: 'center', paddingVertical: 80, gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#324D3E', marginTop: 16 },
  emptySubtitle: { fontSize: 13, color: '#5F5E5B', textAlign: 'center' },
  shopButton: { marginTop: 16, backgroundColor: '#324D3E', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 999 },
  shopButtonText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  ordersList: { gap: 12 },
  orderCard: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', ...shadowStyle },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
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
  tapHint: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4, paddingHorizontal: 14, paddingBottom: 10 },
  tapHintText: { fontSize: 11, color: '#9BA89B' },
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

const modal = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 20, paddingBottom: 32, paddingTop: 12,
    maxHeight: '90%',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.12, shadowRadius: 16 },
      android: { elevation: 20 },
      default: { boxShadow: '0 -4px 32px rgba(0,0,0,0.12)' },
    }),
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E5E7E5', alignSelf: 'center', marginBottom: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  orderIdText: { fontSize: 18, fontWeight: '700', color: '#1F3A2E' },
  orderIdSub: { fontSize: 12, color: '#7A8A7A', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  statusCompleted: { backgroundColor: '#E5EDFF' },
  statusCancelled: { backgroundColor: '#FFE5E5' },
  statusText: { fontSize: 11, fontWeight: '700' },
  statusTextCompleted: { color: '#1D4ED8' },
  statusTextCancelled: { color: '#DC2626' },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#5F6B5F', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  itemImage: { width: 48, height: 48, borderRadius: 10 },
  itemName: { fontSize: 14, fontWeight: '600', color: '#1F3A2E' },
  itemQty: { fontSize: 12, color: '#7A8A7A', marginTop: 2 },
  itemPrice: { fontSize: 14, fontWeight: '700', color: '#324D3E' },
  readOnlyRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#F9FAF9', borderRadius: 12, padding: 14,
  },
  readOnlyIconBox: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#324D3E', alignItems: 'center', justifyContent: 'center',
  },
  readOnlyLabel: { fontSize: 14, fontWeight: '700', color: '#1F3A2E', flex: 1 },
  readOnlyDesc: { fontSize: 11, color: '#7A8A7A', marginTop: 2 },
  readOnlyFee: { fontSize: 12, fontWeight: '700', color: '#324D3E' },
  readOnlyFeeFree: { fontSize: 12, fontWeight: '700', color: '#065F46' },
  priceBreakdown: { backgroundColor: '#F9FAF9', borderRadius: 14, padding: 16, marginTop: 20, gap: 10 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceRowLabel: { fontSize: 13, color: '#5F6B5F' },
  priceRowValue: { fontSize: 13, fontWeight: '600', color: '#1F3A2E' },
  priceRowTotal: { paddingTop: 10, marginTop: 4, borderTopWidth: 1, borderTopColor: '#E5E7E5' },
  totalLabel: { fontSize: 15, fontWeight: '700', color: '#1F3A2E' },
  totalValue: { fontSize: 16, fontWeight: '800', color: '#324D3E' },
  reportRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16 },
  reportText: { fontSize: 12, color: '#9CA3AF', textDecorationLine: 'underline' },
  closeBtn: { marginTop: 16, backgroundColor: '#F3F4F3', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  closeBtnText: { fontSize: 14, fontWeight: '700', color: '#324D3E' },
});