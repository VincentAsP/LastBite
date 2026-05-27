import { useState } from 'react';
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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const ITEM_IMG = 'https://api.builder.io/api/v1/image/assets/TEMP/f45a1f3e410b2e223c9db4f023260a0c0790d250?width=140';

const formatPrice = (amount: number) => amount.toLocaleString('id-ID');

type OrderType = 'delivery' | 'pickup';

export default function OrderSum() {
  const [orderType, setOrderType] = useState<OrderType>('delivery');

  const subtotal = 60000;
  const tax = Math.round(subtotal * 0.1);
  const deliveryFee = orderType === 'delivery' ? 10000 : 0;
  const total = subtotal + tax + deliveryFee;

  return (
    <LinearGradient
      colors={['#DAE6D8', '#92AF8C']}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header with back button */}
        <View style={styles.topHeader}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.push('/cart')}
          >
            <Ionicons name="chevron-back" size={20} color="#1F3A2E" />
          </Pressable>
          <Text style={styles.headerTitle}>Order Summary</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Restaurant Card */}
        <View style={styles.restaurantCard}>
          <View style={styles.restaurantIconBox}>
            <MaterialCommunityIcons
              name="storefront"
              size={22}
              color="#fff"
            />
          </View>
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantLabel}>Ordering from</Text>
            <Text style={styles.restaurantName}>Ayam Penyet Lala</Text>
          </View>
        </View>

        {/* Order Type Toggle */}
        <View style={styles.orderTypeToggle}>
          <Pressable
            style={[
              styles.toggleOption,
              orderType === 'delivery' && styles.toggleOptionActive,
            ]}
            onPress={() => setOrderType('delivery')}
          >
            <MaterialCommunityIcons
              name="moped"
              size={18}
              color={orderType === 'delivery' ? '#fff' : '#324D3E'}
            />
            <Text
              style={[
                styles.toggleText,
                orderType === 'delivery' && styles.toggleTextActive,
              ]}
            >
              Delivery
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.toggleOption,
              orderType === 'pickup' && styles.toggleOptionActive,
            ]}
            onPress={() => setOrderType('pickup')}
          >
            <MaterialCommunityIcons
              name="shopping-outline"
              size={18}
              color={orderType === 'pickup' ? '#fff' : '#324D3E'}
            />
            <Text
              style={[
                styles.toggleText,
                orderType === 'pickup' && styles.toggleTextActive,
              ]}
            >
              Self Pickup
            </Text>
          </Pressable>
        </View>

        {/* Section Header: Your Order */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Order</Text>
          <Pressable style={styles.addButton}>
            <Ionicons name="add" size={14} color="#324D3E" />
            <Text style={styles.addButtonText}>Add items</Text>
          </Pressable>
        </View>

        {/* Order Item */}
        <View style={styles.itemCard}>
          <Image source={{ uri: ITEM_IMG }} style={styles.itemImage} />

          <View style={styles.itemDetails}>
            <Text style={styles.itemName}>Ayam Penyet</Text>
            <Text style={styles.itemRestaurant}>Ayam Penyet Lala</Text>
          </View>

          <View style={styles.itemRight}>
            <Text style={styles.itemPrice}>Rp{formatPrice(30000)}</Text>
            <View style={styles.qtyBadge}>
              <Text style={styles.qtyBadgeText}>×2</Text>
            </View>
          </View>
        </View>

        {/* Price Breakdown Card */}
        <View style={styles.priceCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>Rp{formatPrice(subtotal)}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tax (10%)</Text>
            <Text style={styles.priceValue}>Rp{formatPrice(tax)}</Text>
          </View>

          {orderType === 'delivery' && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Delivery Fee</Text>
              <Text style={styles.priceValue}>Rp{formatPrice(deliveryFee)}</Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total Price</Text>
            <Text style={styles.totalValue}>Rp{formatPrice(total)}</Text>
          </View>
        </View>

        {/* Address Card / Pickup Info — conditional */}
        {orderType === 'delivery' ? (
          <View style={styles.addressCard}>
            <View style={styles.addressIconBox}>
              <Ionicons name="location" size={18} color="#fff" />
            </View>
            <View style={styles.addressInfo}>
              <Text style={styles.addressLabel}>Delivery Address</Text>
              <Text style={styles.addressValue}>Slateford Road, Edinburgh</Text>
            </View>
            <Pressable onPress={() => router.push('/adresses')}>
              <Text style={styles.changeText}>Change</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.addressCard}>
            <View style={[styles.addressIconBox, { backgroundColor: '#324D3E' }]}>
              <MaterialCommunityIcons name="storefront-outline" size={18} color="#fff" />
            </View>
            <View style={styles.addressInfo}>
              <Text style={styles.addressLabel}>Pickup at</Text>
              <Text style={styles.addressValue}>Ayam Penyet Lala — Main Branch</Text>
            </View>
            <Pressable>
              <Text style={styles.changeText}>Details</Text>
            </Pressable>
          </View>
        )}

        {/* Payment Detail Card */}
        <View style={styles.paymentCard}>
          <View style={styles.paymentHeader}>
            <Text style={styles.paymentTitle}>Payment Method</Text>
            <Pressable>
              <Text style={styles.changeText}>See all</Text>
            </Pressable>
          </View>

          <View style={styles.paymentMethodRow}>
            <View style={styles.cardLogoBox}>
              <MaterialCommunityIcons
                name="credit-card-outline"
                size={20}
                color="#fff"
              />
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.cardNumber}>•••• •••• •••• 2143</Text>
              <Text style={styles.cardType}>Debit Card</Text>
            </View>
          </View>
        </View>

        {/* Proceed Order Button */}
        <Pressable
          style={styles.proceedButton}
          onPress={() =>
            router.push({
              pathname: '/finishorder' as any,
              params: { orderType },
            })
          }
        >
          <Text style={styles.proceedText}>Proceed Order</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
}

const shadowStyle = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  android: {
    elevation: 3,
  },
  default: {
    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 402,
    alignSelf: 'center',
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 32,
  },

  /* Top Header */
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadowStyle,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#324D3E',
  },

  /* Restaurant Card */
  restaurantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    gap: 14,
    marginBottom: 16,
    ...shadowStyle,
  },
  restaurantIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#324D3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantLabel: {
    fontSize: 11,
    color: '#7A8A7A',
    marginBottom: 2,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#324D3E',
  },

  /* Order Type Toggle */
  orderTypeToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
    gap: 4,
  },
  toggleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  toggleOptionActive: {
    backgroundColor: '#324D3E',
    ...Platform.select({
      ios: {
        shadowColor: '#324D3E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: { elevation: 3 },
      default: { boxShadow: '0 4px 6px 0 rgba(50,77,62,0.25)' },
    }),
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#324D3E',
  },
  toggleTextActive: {
    color: '#fff',
  },

  /* Section Header */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#324D3E',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#324D3E',
  },

  /* Item Card */
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    gap: 12,
    marginBottom: 16,
    ...shadowStyle,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 14,
  },
  itemDetails: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#161D1F',
  },
  itemRestaurant: {
    fontSize: 12,
    color: '#7A8A7A',
  },
  itemRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#324D3E',
  },
  qtyBadge: {
    backgroundColor: '#DAE6D8',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  qtyBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#324D3E',
  },

  /* Price Card */
  priceCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    gap: 10,
    ...shadowStyle,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 13,
    color: '#7A8A7A',
  },
  priceValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#324D3E',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7E5',
    marginVertical: 4,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#324D3E',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#324D3E',
  },

  /* Address Card */
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    marginBottom: 12,
    ...shadowStyle,
  },
  addressIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#92AF8C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 11,
    color: '#7A8A7A',
    marginBottom: 2,
  },
  addressValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#324D3E',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#246DC1',
  },

  /* Payment Card */
  paymentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 24,
    ...shadowStyle,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#324D3E',
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardLogoBox: {
    width: 44,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#324D3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentInfo: {
    flex: 1,
  },
  cardNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#324D3E',
    letterSpacing: 1,
  },
  cardType: {
    fontSize: 11,
    color: '#7A8A7A',
    marginTop: 2,
  },

  /* Proceed Button */
  proceedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#324D3E',
    borderRadius: 16,
    paddingVertical: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#324D3E',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
      default: { boxShadow: '0 8px 16px 0 rgba(50,77,62,0.3)' },
    }),
  },
  proceedText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});