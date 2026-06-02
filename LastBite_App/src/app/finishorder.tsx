import { useMemo, useEffect, useState } from 'react';
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
import { router, useLocalSearchParams } from 'expo-router';
import { useCart, OrderType, OrderStatus } from '../context/CartContext';
import {confirmPayment, getInvoice} from '../api/orderApi';




// === Konfigurasi step delivery (3 step) ===
const DELIVERY_STEPS: {
  key: OrderStatus;
  title: string;
  desc: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}[] = [
  {
    key: 'preparing',
    title: 'Preparing your order',
    desc: 'The restaurant is preparing your food',
    icon: 'chef-hat',
  },
  {
    key: 'on_the_way',
    title: 'On the way',
    desc: 'Your courier is heading to your address',
    icon: 'moped',
  },
  {
    key: 'delivered',
    title: 'Delivered',
    desc: 'Enjoy your meal!',
    icon: 'check-circle',
  },
];

// === Konfigurasi step pickup (2 step saja) ===
const PICKUP_STEPS: {
  key: OrderStatus;
  title: string;
  desc: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}[] = [
  {
    key: 'preparing',
    title: 'Preparing your order',
    desc: 'The restaurant is preparing your food',
    icon: 'chef-hat',
  },
  {
    key: 'ready',
    title: 'Ready to pickup',
    desc: 'Your order is ready at the counter',
    icon: 'shopping-outline',
  },
];

export default function FinishOrder() {
  const { items, orders, addOrder, clearCart } = useCart();
  const [timeLeft, setTimeLeft] = useState(120);
   const [alertMessage, setAlertMessage] = useState('');
  const showAlert = (title, message) => {
    setAlertMessage(`${title}: ${message}`);
  };

  // Baca orderType dari params yang dikirim OrderSum saat checkout
  const params = useLocalSearchParams<{ 
    orderType?: OrderType;
    orderID?: string;
   }>();
  const orderID = params.orderID; 
  const orderType: OrderType = params.orderType === 'pickup' ? 'pickup' : 'delivery';

  // Status awal saat order baru di-place
  // Nanti backend yang update via updateOrderStatus()
  const currentStatus: OrderStatus = 'preparing';

  const orderId = useMemo(
    () => `LBT-${Math.floor(100000 + Math.random() * 900000)}`,
    []
  );

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2, '0')}-${String(
    today.getMonth() + 1
  ).padStart(2, '0')}-${today.getFullYear()}`;

  useEffect(() => {
    const alreadySaved = orders.some((o) => o.orderId === orderId);
    if (!alreadySaved && items.length > 0) {
      addOrder({
        orderId,
        date: dateStr,
        items: [...items],
        total,
        status: currentStatus,
        orderType,
      });
      clearCart();
    }
  }, []);

  useEffect(() => {
  const timer = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        clearInterval(timer);
        return 0;
      }

      return prev - 1;
    });
  }, 1000);
  return () => clearInterval(timer);
}, []);

  const handleConfirmPayment = async () => {
  try {
    if (!orderID) {
      Alert.alert('Error', 'Order ID tidak ditemukan');
      return;
    }

    const paymentResult =
      await confirmPayment(orderID);

    console.log(paymentResult);

    const invoice =
      await getInvoice(orderID);

    console.log(invoice);

    Alert.alert(
      'Success',
      'Pembayaran berhasil'
    );

  } catch (error) {
    console.error(error);

    Alert.alert(
      'Error',
      'Gagal memproses pembayaran'
    );
  }
};

  return () => clearInterval(timer);
}, []);

useEffect(() => {
  if (timeLeft === 0) {
    showAlert(
      'Payment Expired',
      'Order otomatis dibatalkan'
    );

    setTimeout(() => {
      router.push('/home');
    }, 2000);
  }
}, [timeLeft]);

  // Pilih step sesuai order type
  const steps = orderType === 'delivery' ? DELIVERY_STEPS : PICKUP_STEPS;
  const currentIndex = steps.findIndex((s) => s.key === currentStatus);
  const isCompleted = currentIndex === steps.length - 1;

  return (
    <LinearGradient
      colors={['#DAE6D8', '#92AF8C']}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.successCard}>
          <View style={styles.iconOuter}>
            <View style={styles.iconInner}>
              <Ionicons
                name={isCompleted ? 'checkmark' : 'time-outline'}
                size={44}
                color="#fff"
              />
            </View>
          </View>

          <Text style={styles.successTitle}>
            {isCompleted ? 'Order Completed!' : 'Order Placed!'}
          </Text>
          <Text style={styles.successSubtitle}>
            {orderType === 'delivery'
              ? 'Your order is being prepared.\nWe\'ll keep you posted on its progress 🚀'
              : 'Your order is being prepared.\nWe\'ll let you know when it\'s ready 🌱'}
          </Text>
          {alertMessage !== '' && (
           <Text
            style={{
              marginTop: 10,
              color: 'red',
              textAlign: 'center',
              fontWeight: 'bold'
            }}
          >
            {alertMessage}
            </Text>
        )}
          
          {/* Progress Timeline */}
          <View style={styles.timelineBox}>
            <Text style={styles.timelineHeading}>
              {orderType === 'delivery' ? 'Delivery Progress' : 'Pickup Progress'}
            </Text>

            {steps.map((step, index) => {
              const isActive = index === currentIndex;
              const isDone = index < currentIndex;
              const isPending = index > currentIndex;

              return (
                <View key={step.key} style={styles.stepRow}>
                  <View style={styles.stepLeft}>
                    <View
                      style={[
                        styles.stepIconBox,
                        isDone && styles.stepIconBoxDone,
                        isActive && styles.stepIconBoxActive,
                        isPending && styles.stepIconBoxPending,
                      ]}
                    >
                      {isDone ? (
                        <Ionicons name="checkmark" size={16} color="#fff" />
                      ) : (
                        <MaterialCommunityIcons
                          name={step.icon}
                          size={16}
                          color={isActive ? '#fff' : '#A3B5A3'}
                        />
                      )}
                    </View>

                    {index < steps.length - 1 && (
                      <View
                        style={[
                          styles.connector,
                          (isDone || isActive) && styles.connectorActive,
                        ]}
                      />
                    )}
                  </View>

                  <View style={styles.stepContent}>
                    <Text
                      style={[
                        styles.stepTitle,
                        isPending && styles.stepTitlePending,
                      ]}
                    >
                      {step.title}
                    </Text>
                    <Text
                      style={[
                        styles.stepDesc,
                        isPending && styles.stepDescPending,
                      ]}
                    >
                      {step.desc}
                    </Text>
                    {isActive && (
                      <View style={styles.activeBadge}>
                        <View style={styles.activeDot} />
                        <Text style={styles.activeBadgeText}>In Progress</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          {/* Order details */}
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
                <Ionicons
                  name={orderType === 'delivery' ? 'bicycle-outline' : 'bag-handle-outline'}
                  size={14}
                  color="#7A8A7A"
                />
                <Text style={styles.detailLabel}>
                  {orderType === 'delivery' ? 'Delivery' : 'Pickup'}
                </Text>
              </View>
              <Text style={styles.detailValue}>
                {orderType === 'delivery' ? 'Home Delivery' : 'Self-Pickup'}
              </Text>
            </View>
          </View>
        </View>

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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    minHeight: '100%',
    justifyContent: 'space-between',
  },
  successCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    ...shadowStyle,
  },
  iconOuter: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInner: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#065F46',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: { shadowColor: '#065F46', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 10 },
      android: { elevation: 8 },
      default: { boxShadow: '0 6px 10px 0 rgba(6,95,70,0.4)' },
    }),
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#324D3E',
    marginTop: 18,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 13,
    color: '#5F6B5F',
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 19,
  },

  timelineBox: {
    width: '100%',
    backgroundColor: '#F9FAF9',
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
  },
  timelineHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#324D3E',
    marginBottom: 14,
  },
  stepRow: { flexDirection: 'row', gap: 12 },
  stepLeft: { alignItems: 'center', width: 28 },
  stepIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIconBoxDone: { backgroundColor: '#065F46' },
  stepIconBoxActive: {
    backgroundColor: '#324D3E',
    ...Platform.select({
      ios: { shadowColor: '#324D3E', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6 },
      android: { elevation: 4 },
      default: { boxShadow: '0 3px 6px 0 rgba(50,77,62,0.3)' },
    }),
  },
  stepIconBoxPending: { backgroundColor: '#E5E7E5' },
  connector: {
    width: 2,
    flex: 1,
    minHeight: 22,
    backgroundColor: '#E5E7E5',
    marginTop: 2,
    marginBottom: 2,
  },
  connectorActive: { backgroundColor: '#065F46' },
  stepContent: { flex: 1, paddingBottom: 16 },
  stepTitle: { fontSize: 13, fontWeight: '700', color: '#324D3E', marginBottom: 2 },
  stepTitlePending: { color: '#A3B5A3', fontWeight: '600' },
  stepDesc: { fontSize: 11, color: '#7A8A7A', lineHeight: 15 },
  stepDescPending: { color: '#B5C4B5' },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    marginTop: 6,
  },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#B45309' },
  activeBadgeText: { fontSize: 10, fontWeight: '700', color: '#92400E', letterSpacing: 0.3 },

  detailsBox: {
    width: '100%',
    backgroundColor: '#F9FAF9',
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    gap: 12,
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailLabel: { fontSize: 12, color: '#7A8A7A' },
  detailValue: { fontSize: 13, fontWeight: '600', color: '#324D3E' },
  orderIdValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#324D3E',
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
    letterSpacing: 0.5,
  },
  dashedDivider: {
    height: 1,
    borderTopWidth: 1,
    borderTopColor: '#E5E7E5',
    borderStyle: 'dashed',
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  paidDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#065F46' },
  paidText: { fontSize: 10, fontWeight: '700', color: '#065F46', letterSpacing: 0.5 },

  actionButtons: { gap: 10, marginTop: 24 },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#324D3E',
    borderRadius: 14,
    paddingVertical: 16,
    ...Platform.select({
      ios: { shadowColor: '#324D3E', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12 },
      android: { elevation: 6 },
      default: { boxShadow: '0 8px 16px 0 rgba(50,77,62,0.3)' },
    }),
  },
  primaryButtonText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 14,
    paddingVertical: 14,
  },
  secondaryButtonText: { fontSize: 14, fontWeight: '600', color: '#324D3E' },
});