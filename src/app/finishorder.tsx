import { useMemo, useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
  Animated,
  Clipboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCart, OrderType, OrderStatus } from '../context/CartContext';

const DELIVERY_STEPS: {
  key: OrderStatus;
  title: string;
  desc: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}[] = [
  { key: 'preparing', title: 'Preparing your order', desc: 'The restaurant is preparing your food', icon: 'chef-hat' },
  { key: 'on_the_way', title: 'On the way', desc: 'Your courier is heading to your address', icon: 'moped' },
  { key: 'delivered', title: 'Delivered', desc: 'Enjoy your meal!', icon: 'check-circle' },
];

const PICKUP_STEPS: {
  key: OrderStatus;
  title: string;
  desc: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}[] = [
  { key: 'preparing', title: 'Preparing your order', desc: 'The restaurant is preparing your food', icon: 'chef-hat' },
  { key: 'ready', title: 'Ready to pickup', desc: 'Your order is ready at the counter', icon: 'shopping-outline' },
];

// Generate a random 16-digit BCA VA number (simulate Midtrans response)
function generateBcaVA(): string {
  const prefix = '70012'; // BCA VA prefix (Midtrans BCA typically uses 70012/70013)
  const suffix = Math.floor(10000000000 + Math.random() * 90000000000).toString();
  return `${prefix}${suffix}`.slice(0, 16);
}

// Simulate expiry — replaced by live countdown, kept as unused reference
// function getExpiryTime(): string { ... }

// ── Toast notification component ──
function Toast({ visible, message, type }: { visible: boolean; message: string; type: 'success' | 'info' }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 80, friction: 10 }),
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, { toValue: -20, duration: 200, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  return (
    <Animated.View style={[toast.container, { opacity, transform: [{ translateY }] },
      type === 'success' ? toast.success : toast.info,
    ]}>
      <Ionicons
        name={type === 'success' ? 'checkmark-circle' : 'information-circle'}
        size={18}
        color="#fff"
      />
      <Text style={toast.text}>{message}</Text>
    </Animated.View>
  );
}

const toast = StyleSheet.create({
  container: {
    position: 'absolute', top: 16, left: 24, right: 24,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 12,
    borderRadius: 12, zIndex: 999,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
      android: { elevation: 8 },
      default: { boxShadow: '0 4px 8px rgba(0,0,0,0.2)' },
    }),
  },
  success: { backgroundColor: '#065F46' },
  info: { backgroundColor: '#1D4ED8' },
  text: { fontSize: 13, fontWeight: '600', color: '#fff', flex: 1 },
});

export default function FinishOrder() {
  const { items, orders, addOrder, clearCart } = useCart();

  const params = useLocalSearchParams<{ orderType?: OrderType; total?: string }>();
  const orderType: OrderType = params.orderType === 'pickup' ? 'pickup' : 'delivery';

  const currentStatus: OrderStatus = 'preparing';

  const orderId = useMemo(() => `LBT-${Math.floor(100000 + Math.random() * 900000)}`, []);
  const vaNumber = useMemo(() => generateBcaVA(), []);

  // Simulated payment state — false = unpaid, true = paid
  const [isPaid, setIsPaid] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'info'>('success');
  const [copied, setCopied] = useState(false);

  // 5-minute countdown (300 seconds)
  const [secondsLeft, setSecondsLeft] = useState(300);
  const timerExpired = secondsLeft === 0;

  useEffect(() => {
    if (isPaid || timerExpired) return;
    const interval = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) { clearInterval(interval); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaid, timerExpired]);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Total from ordersum params, fallback to cart items
  const cartTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = params.total ? parseInt(params.total, 10) : cartTotal;
  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2,'0')}-${String(today.getMonth()+1).padStart(2,'0')}-${today.getFullYear()}`;

  useEffect(() => {
    const alreadySaved = orders.some((o) => o.orderId === orderId);
    if (!alreadySaved && items.length > 0) {
      addOrder({ orderId, date: dateStr, items: [...items], total, status: currentStatus, orderType });
      clearCart();
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'info') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3500);
  };

  // Simulate payment confirmation (tap "I've Paid" button)
  const handleConfirmPayment = () => {
    setIsPaid(true);
    showToast('Payment confirmed! Your order is now being prepared 🎉', 'success');
  };

  const handleCopyVA = () => {
    Clipboard.setString(vaNumber);
    setCopied(true);
    showToast('VA number copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = orderType === 'delivery' ? DELIVERY_STEPS : PICKUP_STEPS;
  const currentIndex = steps.findIndex((s) => s.key === currentStatus);
  const isCompleted = currentIndex === steps.length - 1;

  return (
    <LinearGradient colors={['#DAE6D8', '#92AF8C']} style={styles.container}>
      {/* Toast */}
      <Toast visible={toastVisible} message={toastMessage} type={toastType} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.successCard}>
          {/* Icon */}
          <View style={styles.iconOuter}>
            <View style={[styles.iconInner, isPaid && styles.iconInnerPaid]}>
              <Ionicons
                name={isPaid ? 'checkmark' : 'time-outline'}
                size={44}
                color="#fff"
              />
            </View>
          </View>

          <Text style={styles.successTitle}>
            {isPaid ? 'Payment Confirmed!' : 'Order Placed!'}
          </Text>
          <Text style={styles.successSubtitle}>
            {isPaid
              ? (orderType === 'delivery'
                  ? 'Your order is being prepared.\nWe\'ll keep you posted on its progress 🚀'
                  : 'Your order is being prepared.\nWe\'ll let you know when it\'s ready 🌱')
              : 'Complete your payment below\nto confirm your order.'}
          </Text>

          {/* ── BCA Virtual Account Card ── */}
          <View style={styles.vaCard}>
            <View style={styles.vaHeader}>
              <View style={styles.bcaLogoBox}>
                <MaterialCommunityIcons name="bank" size={18} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.vaBank}>BCA Virtual Account</Text>
                <Text style={styles.vaPowered}>via Midtrans</Text>
              </View>
              {/* Payment status badge */}
              {isPaid ? (
                <View style={styles.paidBadge}>
                  <View style={styles.paidDot} />
                  <Text style={styles.paidText}>PAID</Text>
                </View>
              ) : (
                <View style={styles.unpaidBadge}>
                  <View style={styles.unpaidDot} />
                  <Text style={styles.unpaidText}>UNPAID</Text>
                </View>
              )}
            </View>

            <View style={styles.vaDivider} />

            {/* VA Number row */}
            <View style={styles.vaNumberRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.vaLabel}>Virtual Account Number</Text>
                <Text style={styles.vaNumber}>
                  {vaNumber.replace(/(\d{4})/g, '$1 ').trim()}
                </Text>
              </View>
              {!isPaid && (
                <Pressable style={[styles.copyBtn, copied && styles.copyBtnCopied]} onPress={handleCopyVA}>
                  <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={16} color={copied ? '#065F46' : '#324D3E'} />
                  <Text style={[styles.copyBtnText, copied && styles.copyBtnTextCopied]}>
                    {copied ? 'Copied' : 'Copy'}
                  </Text>
                </Pressable>
              )}
            </View>

            {/* Amount & expiry */}
            <View style={styles.vaInfoRow}>
              <View style={styles.vaInfoItem}>
                <Text style={styles.vaInfoLabel}>Total Amount</Text>
                <Text style={styles.vaInfoValue}>Rp{total.toLocaleString('id-ID')}</Text>
              </View>
              {!isPaid && (
                <View style={styles.vaInfoItem}>
                  <Text style={styles.vaInfoLabel}>Pay Before</Text>
                  {timerExpired ? (
                    <Text style={[styles.vaInfoValue, styles.vaExpiredText]}>Expired</Text>
                  ) : (
                    <View style={styles.countdownRow}>
                      <Ionicons name="time-outline" size={14} color={secondsLeft <= 30 ? '#DC2626' : '#B45309'} />
                      <Text style={[styles.vaInfoValue, styles.vaExpiry, secondsLeft <= 30 && styles.vaExpiryUrgent]}>
                        {formatCountdown(secondsLeft)}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* How to pay steps — only when unpaid */}
            {!isPaid && (
              <View style={styles.howToPayBox}>
                <Text style={styles.howToPayTitle}>How to pay</Text>
                {[
                  'Open your BCA mobile app or m-BCA',
                  'Select Transfer → BCA Virtual Account',
                  `Enter VA number: ${vaNumber}`,
                  `Confirm amount Rp${total.toLocaleString('id-ID')} and pay`,
                ].map((step, i) => (
                  <View key={i} style={styles.howToPayRow}>
                    <View style={styles.howToPayNum}>
                      <Text style={styles.howToPayNumText}>{i + 1}</Text>
                    </View>
                    <Text style={styles.howToPayStep}>{step}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Simulate payment button */}
            {!isPaid && (
              <Pressable
                style={[styles.confirmPayBtn, timerExpired && styles.confirmPayBtnDisabled]}
                onPress={timerExpired ? undefined : handleConfirmPayment}
                disabled={timerExpired}
              >
                <Ionicons name={timerExpired ? 'close-circle-outline' : 'shield-checkmark-outline'} size={16} color="#fff" />
                <Text style={styles.confirmPayBtnText}>
                  {timerExpired ? 'Payment Expired — Restart Order' : "I've Paid — Confirm Payment"}
                </Text>
              </Pressable>
            )}
          </View>

          {/* Progress Timeline — only show when paid */}
          {isPaid && (
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
                      <View style={[
                        styles.stepIconBox,
                        isDone && styles.stepIconBoxDone,
                        isActive && styles.stepIconBoxActive,
                        isPending && styles.stepIconBoxPending,
                      ]}>
                        {isDone ? (
                          <Ionicons name="checkmark" size={16} color="#fff" />
                        ) : (
                          <MaterialCommunityIcons name={step.icon} size={16} color={isActive ? '#fff' : '#A3B5A3'} />
                        )}
                      </View>
                      {index < steps.length - 1 && (
                        <View style={[styles.connector, (isDone || isActive) && styles.connectorActive]} />
                      )}
                    </View>
                    <View style={styles.stepContent}>
                      <Text style={[styles.stepTitle, isPending && styles.stepTitlePending]}>{step.title}</Text>
                      <Text style={[styles.stepDesc, isPending && styles.stepDescPending]}>{step.desc}</Text>
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
          )}

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
              {isPaid ? (
                <View style={styles.paidBadge}>
                  <View style={styles.paidDot} />
                  <Text style={styles.paidText}>PAID</Text>
                </View>
              ) : (
                <View style={styles.unpaidBadge}>
                  <View style={styles.unpaidDot} />
                  <Text style={styles.unpaidText}>UNPAID</Text>
                </View>
              )}
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
          <Pressable style={styles.primaryButton} onPress={() => router.push('/home')}>
            <Ionicons name="home" size={18} color="#fff" />
            <Text style={styles.primaryButtonText}>Back to Homepage</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => router.push('/history')}>
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
  scrollContent: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40, minHeight: '100%', justifyContent: 'space-between' },
  successCard: { backgroundColor: '#fff', borderRadius: 28, padding: 24, alignItems: 'center', ...shadowStyle },
  iconOuter: { width: 84, height: 84, borderRadius: 42, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center' },
  iconInner: {
    width: 66, height: 66, borderRadius: 33, backgroundColor: '#92400E',
    alignItems: 'center', justifyContent: 'center',
    ...Platform.select({
      ios: { shadowColor: '#92400E', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 10 },
      android: { elevation: 8 },
      default: { boxShadow: '0 6px 10px 0 rgba(146,64,14,0.4)' },
    }),
  },
  iconInnerPaid: {
    backgroundColor: '#065F46',
    ...Platform.select({
      ios: { shadowColor: '#065F46', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 10 },
      android: { elevation: 8 },
      default: { boxShadow: '0 6px 10px 0 rgba(6,95,70,0.4)' },
    }),
  },
  successTitle: { fontSize: 22, fontWeight: '700', color: '#324D3E', marginTop: 18, textAlign: 'center' },
  successSubtitle: { fontSize: 13, color: '#5F6B5F', marginTop: 6, textAlign: 'center', lineHeight: 19 },

  /* VA Card */
  vaCard: {
    width: '100%', backgroundColor: '#F9FAF9', borderRadius: 16,
    padding: 16, marginTop: 20,
    borderWidth: 1, borderColor: '#E5E7E5',
  },
  vaHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bcaLogoBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#005BB5', alignItems: 'center', justifyContent: 'center' },
  vaBank: { fontSize: 14, fontWeight: '700', color: '#1F3A2E' },
  vaPowered: { fontSize: 10, color: '#7A8A7A', marginTop: 1 },
  vaDivider: { height: 1, backgroundColor: '#E5E7E5', marginVertical: 12 },
  vaNumberRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  vaLabel: { fontSize: 11, color: '#7A8A7A', marginBottom: 4 },
  vaNumber: {
    fontSize: 18, fontWeight: '800', color: '#1F3A2E', letterSpacing: 1.5,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
  },
  copyBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#DAE6D8', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  copyBtnCopied: { backgroundColor: '#ECFDF5' },
  copyBtnText: { fontSize: 12, fontWeight: '700', color: '#324D3E' },
  copyBtnTextCopied: { color: '#065F46' },
  vaInfoRow: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  vaInfoItem: { flex: 1 },
  vaInfoLabel: { fontSize: 11, color: '#7A8A7A', marginBottom: 2 },
  vaInfoValue: { fontSize: 14, fontWeight: '700', color: '#1F3A2E' },
  vaExpiry: { color: '#B45309', fontSize: 12 },

  howToPayBox: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 14, gap: 8, borderWidth: 1, borderColor: '#E5E7E5' },
  howToPayTitle: { fontSize: 12, fontWeight: '700', color: '#5F6B5F', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.4 },
  howToPayRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  howToPayNum: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#324D3E', alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  howToPayNumText: { fontSize: 10, fontWeight: '800', color: '#fff' },
  howToPayStep: { flex: 1, fontSize: 12, color: '#5F6B5F', lineHeight: 18 },

  confirmPayBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: '#065F46', borderRadius: 10, paddingVertical: 13,
    ...Platform.select({
      ios: { shadowColor: '#065F46', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
      android: { elevation: 4 },
      default: { boxShadow: '0 4px 8px rgba(6,95,70,0.3)' },
    }),
  },
  confirmPayBtnDisabled: { backgroundColor: '#9CA3AF' },
  confirmPayBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  countdownRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  vaExpiredText: { color: '#DC2626', fontWeight: '700', fontSize: 13 },
  vaExpiryUrgent: { color: '#DC2626' },

  /* Payment badges */
  paidBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  paidDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#065F46' },
  paidText: { fontSize: 10, fontWeight: '700', color: '#065F46', letterSpacing: 0.5 },
  unpaidBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#FEF3C7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  unpaidDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#B45309' },
  unpaidText: { fontSize: 10, fontWeight: '700', color: '#92400E', letterSpacing: 0.5 },

  /* Timeline */
  timelineBox: { width: '100%', backgroundColor: '#F9FAF9', borderRadius: 16, padding: 16, marginTop: 16 },
  timelineHeading: { fontSize: 13, fontWeight: '700', color: '#324D3E', marginBottom: 14 },
  stepRow: { flexDirection: 'row', gap: 12 },
  stepLeft: { alignItems: 'center', width: 28 },
  stepIconBox: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
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
  connector: { width: 2, flex: 1, minHeight: 22, backgroundColor: '#E5E7E5', marginTop: 2, marginBottom: 2 },
  connectorActive: { backgroundColor: '#065F46' },
  stepContent: { flex: 1, paddingBottom: 16 },
  stepTitle: { fontSize: 13, fontWeight: '700', color: '#324D3E', marginBottom: 2 },
  stepTitlePending: { color: '#A3B5A3', fontWeight: '600' },
  stepDesc: { fontSize: 11, color: '#7A8A7A', lineHeight: 15 },
  stepDescPending: { color: '#B5C4B5' },
  activeBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start', backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, marginTop: 6 },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#B45309' },
  activeBadgeText: { fontSize: 10, fontWeight: '700', color: '#92400E', letterSpacing: 0.3 },

  /* Order details box */
  detailsBox: { width: '100%', backgroundColor: '#F9FAF9', borderRadius: 16, padding: 16, marginTop: 12, gap: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailLabel: { fontSize: 12, color: '#7A8A7A' },
  detailValue: { fontSize: 13, fontWeight: '600', color: '#324D3E' },
  orderIdValue: {
    fontSize: 13, fontWeight: '700', color: '#324D3E',
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
    letterSpacing: 0.5,
  },
  dashedDivider: { height: 1, borderTopWidth: 1, borderTopColor: '#E5E7E5', borderStyle: 'dashed' },

  actionButtons: { gap: 10, marginTop: 24 },
  primaryButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, backgroundColor: '#324D3E', borderRadius: 14, paddingVertical: 16,
    ...Platform.select({
      ios: { shadowColor: '#324D3E', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12 },
      android: { elevation: 6 },
      default: { boxShadow: '0 8px 16px 0 rgba(50,77,62,0.3)' },
    }),
  },
  primaryButtonText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  secondaryButton: { alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 14, paddingVertical: 14 },
  secondaryButtonText: { fontSize: 14, fontWeight: '600', color: '#324D3E' },
});