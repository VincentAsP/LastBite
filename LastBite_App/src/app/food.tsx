import { useState, useEffect, useRef, useCallback } from 'react';
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
import { useCart } from '../context/CartContext';
import { useToast } from './Toastprovider'; // ← import toast
import { useProductStock } from '../api/hooks';

const FOOD_ITEMS = [
  {
    id: 1,
    name: 'Ayam Penyet',
    restaurant: 'Ayam penyet lala',
    distance: '0.2 km',
    category: 'Main Dish',
    price: 'Rp15.000',
    originalPrice: 'Rp25.000',
    initialTime: 45 * 60 + 12,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/940e3b8ddc7d48419316730ba418c6cab7e85e10?width=636',
  },
  {
    id: 2,
    name: 'Ayam Geprek + Nasi',
    restaurant: 'Geprek Gepruk',
    distance: '0.4 km',
    category: 'Main Dish',
    price: 'Rp20.000',
    originalPrice: 'Rp30.000',
    initialTime: 12 * 60 + 5,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/52e52f30ee10837cf7802e05aa6f64e7620b2fdb?width=636',
  },
  {
    id: 3,
    name: 'Mie Ayam',
    restaurant: 'Mie Ayam Nih',
    distance: '1.3 km',
    category: 'Main Dish',
    price: 'Rp10.000',
    originalPrice: 'Rp15.000',
    initialTime: 5 * 60 + 44,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/1e09ddfed9a948c80c35ff0116e30bb30063539e?width=636',
  },
  {
    id: 4,
    name: 'Donat Kacang',
    restaurant: "It's Donuts Time",
    distance: '0.1 km',
    category: 'Snack',
    price: 'Rp50.000',
    originalPrice: 'Rp80.000',
    initialTime: 38 * 60 + 19,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/faf72ac6975c44aeb0d097736c3da20529c32ce2?width=636',
  },
];

const CATEGORIES = ['All', 'Main Dish', 'Snack'];

const PROFILE_IMG = 'https://api.builder.io/api/v1/image/assets/TEMP/75f84b2a05c559a065a8ab0e8645c12f2bce924b?width=110';
const HOME_NAV_ICON = 'https://api.builder.io/api/v1/image/assets/TEMP/bed9da29344886f2e34a5b3e19c35277006023da?width=60';
const CART_NAV_ICON = 'https://api.builder.io/api/v1/image/assets/TEMP/e89e2d602d11a2de8ff32895a3552e5d9987bf68?width=60';
const HISTORY_NAV_ICON = 'https://api.builder.io/api/v1/image/assets/TEMP/8c990238ba69088582be0114e07ca52e0eb6de07?width=60';

function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

interface FoodCardProps {
  item: (typeof FOOD_ITEMS)[number];
}

function FoodCard({ item }: FoodCardProps) {
  const [liked, setLiked] = useState(false);
  const timeLeft = useCountdown(item.initialTime);
  const { addItem } = useCart();
  const toast = useToast(); // ← pakai toast hook
  const { canBuy, status, loading: stockLoading } = useProductStock(item.id);
  const handleAddToCart = () => {
    if (!canBuy) {
      toast.error('Stok habis', `${item.name} sudah tidak tersedia`);
      return;
    }
    try {
      addItem({
        id: item.id,
        name: item.name,
        restaurant: item.restaurant,
        price: parseInt(item.price.replace(/\D/g, ''), 10),
        image: item.image,
      });
      // ✅ Toast success
      toast.success('Added to cart', `${item.name} added successfully`);
    } catch (e) {
      // ❌ Toast error
      toast.error('Failed to add', 'Please try again');
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardImageWrapper}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />

        <View style={styles.timerBadge}>
          <Ionicons name="time-outline" size={12} color="#fff" />
          <Text style={styles.timerText}>{timeLeft}</Text>
        </View>

        {/* ── BARU: badge "Habis" muncul saat stok = 0 ── */}
        {!canBuy && !stockLoading && (
          <View style={styles.habitsBadge}>
            <Text style={styles.habisText}>inactive</Text>
          </View>
        )}

        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>{item.price}</Text>
          <Text style={styles.originalPriceText}>{item.originalPrice}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Pressable onPress={() => setLiked(!liked)}>
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={19}
              color={liked ? '#974135' : '#D6D3D1'}
            />
          </Pressable>
        </View>

        <View style={styles.cardRow}>
          <MaterialCommunityIcons name="storefront-outline" size={12} color="#5F5E5B" />
          <Text style={styles.cardRestaurant}>{item.restaurant}</Text>
          <Pressable
           style={[
            styles.addToCartBtn,
            !canBuy && styles.addToCartBtnDisabled,
            ]} 
            onPress={handleAddToCart}
            disabled = {!canBuy || stockLoading}
            >
            <Ionicons name="add" size={16} color="#fff" />
          </Pressable>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.cardRow}>
            <Ionicons name="location-outline" size={12} color="#5F5E5B" />
            <Text style={styles.cardDistance}>{item.distance}</Text>
          </View>
          <View style={styles.categoryChip}>
            <Text style={styles.categoryChipText}>{item.category}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function FoodPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredItems =
    activeCategory === 'All'
      ? FOOD_ITEMS
      : FOOD_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <LinearGradient colors={['#DAE6D8', '#92AF8C']} style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.push('/home')}>
          <Ionicons name="chevron-back" size={20} color="#1F3A2E" />
        </Pressable>
        <Image source={{ uri: PROFILE_IMG }} style={styles.profileImage} />
      </View>

      <View style={styles.tabsRow}>
        <Pressable style={styles.tabButton} onPress={() => router.push('/mystery')}>
          <Text style={styles.tabButtonText}>Mystery Boxes</Text>
        </Pressable>
        <Pressable style={[styles.tabButton, styles.tabButtonActive]}>
          <Text style={[styles.tabButtonText, styles.tabButtonTextActive]}>
            Food Pages
          </Text>
        </Pressable>
      </View>

      <View style={styles.tabsRow}>
        {CATEGORIES.map((cat) => (
          <Pressable
            key={cat}
            style={[
              styles.filterChip,
              activeCategory === cat && styles.filterChipActive,
            ]}
            onPress={() => setActiveCategory(cat)}
          >
            <Text
              style={[
                styles.filterChipText,
                activeCategory === cat && styles.filterChipTextActive,
              ]}
            >
              {cat}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Flash Rescues Near You</Text>
            <Text style={styles.sectionSubtitle}>
              Available for a limited time only
            </Text>
          </View>
          <Pressable style={styles.viewAll}>
            <Text style={styles.viewAllText}>View all</Text>
            <Ionicons name="chevron-forward" size={14} color="#4F6144" />
          </Pressable>
        </View>

        <View style={styles.cardsList}>
          {filteredItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No items available for this filter.
              </Text>
            </View>
          ) : (
            filteredItems.map((item) => <FoodCard key={item.id} item={item} />)
          )}
        </View>
      </ScrollView>

      <LinearGradient colors={['#DAE6D8', '#92AF8C']} style={styles.bottomNav}>
        <Pressable style={styles.bottomNavItem} onPress={() => router.push('/home')}>
          <Image source={{ uri: HOME_NAV_ICON }} style={styles.bottomNavIcon} />
          <Text style={styles.bottomNavLabel}>Home</Text>
        </Pressable>
        <Pressable style={styles.bottomNavItem} onPress={() => router.push('/cart' as any)}>
          <Image source={{ uri: CART_NAV_ICON }} style={styles.bottomNavIcon} />
          <Text style={styles.bottomNavLabel}>Cart</Text>
        </Pressable>
        <Pressable style={styles.bottomNavItem} onPress={() => router.push('/history')}>
          <Image source={{ uri: HISTORY_NAV_ICON }} style={styles.bottomNavIcon} />
          <Text style={styles.bottomNavLabel}>History</Text>
        </Pressable>
      </LinearGradient>
    </LinearGradient>
  );
}

const shadowStyle = Platform.select({
  ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4 },
  android: { elevation: 3 },
  default: { boxShadow: '0 2px 4px 0 rgba(0,0,0,0.15)' },
});

const styles = StyleSheet.create({
  container: { flex: 1, maxWidth: 402, alignSelf: 'center', width: '100%' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  backButton: {
    width: 44, height: 44, borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    ...shadowStyle,
  },
  profileImage: { width: 56, height: 56, borderRadius: 28 },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  tabButton: {
    paddingHorizontal: 20, paddingVertical: 8, borderRadius: 999,
    backgroundColor: '#fff', ...shadowStyle,
  },
  tabButtonActive: { backgroundColor: '#4F6144' },
  tabButtonText: { fontSize: 12, fontWeight: '700', color: '#000' },
  tabButtonTextActive: { color: '#fff' },
  filterChip: {
    paddingHorizontal: 20, paddingVertical: 8, borderRadius: 999,
    backgroundColor: '#fff', ...shadowStyle,
  },
  filterChipActive: { backgroundColor: '#4F6144' },
  filterChipText: { fontSize: 14, color: '#000' },
  filterChipTextActive: { color: '#fff' },
  scrollArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 96 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#161D1F' },
  sectionSubtitle: { fontSize: 13, color: '#5F5E5B' },
  viewAll: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewAllText: { fontSize: 13, color: '#4F6144' },
  cardsList: { gap: 16 },
  emptyState: { alignItems: 'center', paddingVertical: 48 },
  emptyStateText: { fontSize: 14, color: '#4F6144' },
  card: {
    borderRadius: 12,
    borderWidth: 1, borderColor: '#F5F5F4',
    backgroundColor: '#fff',
    overflow: 'hidden',
    ...shadowStyle,
  },
  cardImageWrapper: { height: 176, position: 'relative' },
  cardImage: { width: '100%', height: '100%' },
  timerBadge: {
    position: 'absolute', top: 12, left: 12,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#974135',
    borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6,
  },
  timerText: { color: '#fff', fontSize: 13 },
  priceBadge: {
    position: 'absolute', bottom: 12, right: 12,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
  },
  priceText: { fontSize: 11, fontWeight: '700', color: '#4F6144' },
  originalPriceText: {
    fontSize: 8, fontWeight: '700', color: '#A8A29E', textDecorationLine: 'line-through',
  },
  cardBody: { padding: 16, gap: 6 },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: { fontSize: 16, color: '#161D1F', flex: 1, marginRight: 8 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardRestaurant: { fontSize: 13, color: '#5F5E5B', flex: 1 },
  cardDistance: { fontSize: 13, color: '#5F5E5B' },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1, borderTopColor: '#FAFAF9',
  },
  categoryChip: {
    backgroundColor: 'rgba(79, 97, 68, 0.1)',
    borderRadius: 999,
    paddingHorizontal: 12, paddingVertical: 4,
  },
  categoryChipText: { fontSize: 13, color: '#4F6144' },
  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
  },
  bottomNavItem: { alignItems: 'center', gap: 2 },
  bottomNavIcon: { width: 28, height: 28 },
  bottomNavLabel: { fontSize: 10, color: '#fff' },
  addToCartBtn: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#324D3E',
    alignItems: 'center', justifyContent: 'center',
  },
addToCartBtnDisabled: {
  backgroundColor: '#B4B2A9',
  opacity: 0.6,
},

habitsBadge: {
  position: 'absolute',
  bottom: 12,
  left: 12,
  backgroundColor: '#A32D2D',
  borderRadius: 999,
  paddingHorizontal: 10,
  paddingVertical: 4,
},

habisText: {
  color: '#fff',
  fontSize: 11,
  fontWeight: '700',
},

});