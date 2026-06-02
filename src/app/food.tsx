import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { Link, router, usePathname } from 'expo-router';
import { useCart } from '../context/CartContext';
import { useToast } from './Toastprovider';

/* ──────────────── DATA ──────────────── */

type Category =
  | 'Homemade'
  | 'Bakery'
  | 'Todays leftover'
  | 'Snack'
  | 'Drinks'
  | 'Other';

type FoodItem = {
  id: number;
  name: string;
  restaurant: string;
  distance: string;
  category: Category;
  description?: string;
  price: string;
  originalPrice: string;
  initialTime: number;
  image: string;
};

const FOOD_ITEMS: FoodItem[] = [
  {
    id: 1,
    name: 'Ayam Penyet',
    restaurant: 'Ayam penyet lala',
    distance: '0.2 km',
    category: 'Todays leftover',
    description: 'Ayam goreng penyet dengan sambal terasi pedas, sisa porsi siang ini.',
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
    category: 'Homemade',
    description: 'Ayam geprek pedas level 1–5 dibuat dengan resep rumahan, fresh setiap hari.',
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
    category: 'Homemade',
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
    category: 'Bakery',
    description: 'Donat lembut dengan topping kacang dan glaze, dibuat fresh tiap pagi.',
    price: 'Rp50.000',
    originalPrice: 'Rp80.000',
    initialTime: 38 * 60 + 19,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/faf72ac6975c44aeb0d097736c3da20529c32ce2?width=636',
  },
  {
    id: 5,
    name: 'Es Teh Manis',
    restaurant: 'Teh Segar Jaya',
    distance: '0.3 km',
    category: 'Drinks',
    description: 'Es teh manis segar dengan gula asli, cocok buat menemani makan siang.',
    price: 'Rp5.000',
    originalPrice: 'Rp8.000',
    initialTime: 25 * 60 + 0,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=636&q=80',
  },
  {
    id: 6,
    name: 'Kerupuk Mix',
    restaurant: 'Warung Bu Eni',
    distance: '0.6 km',
    category: 'Snack',
    price: 'Rp8.000',
    originalPrice: 'Rp12.000',
    initialTime: 50 * 60 + 0,
    image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=636&q=80',
  },
  {
    id: 7,
    name: 'Paket Lauk Pauk',
    restaurant: 'Dapur Mama',
    distance: '1.0 km',
    category: 'Other',
    description: 'Paket lauk siap saji: tempe, tahu, sayur, dan sambal. Tinggal panaskan!',
    price: 'Rp25.000',
    originalPrice: 'Rp40.000',
    initialTime: 28 * 60 + 15,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=636&q=80',
  },
];

const CATEGORIES: Array<'All' | Category> = [
  'All',
  'Homemade',
  'Bakery',
  'Todays leftover',
  'Snack',
  'Drinks',
  'Other',
];

const PROFILE_IMG = 'https://api.builder.io/api/v1/image/assets/TEMP/75f84b2a05c559a065a8ab0e8645c12f2bce924b?width=110';

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
  item: FoodItem;
}

function FoodCard({ item }: FoodCardProps) {
  const [liked, setLiked] = useState(false);
  const timeLeft = useCountdown(item.initialTime);
  const { addItem } = useCart();
  const toast = useToast();

  const handleAddToCart = () => {
    try {
      addItem({
        id: item.id,
        name: item.name,
        restaurant: item.restaurant,
        price: parseInt(item.price.replace(/\D/g, ''), 10),
        image: item.image,
      });
      toast.success('Added to cart', `${item.name} added successfully`);
    } catch (e) {
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

        {item.description && (
          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        <View style={styles.cardRow}>
          <MaterialCommunityIcons name="storefront-outline" size={12} color="#5F5E5B" />
          <Text style={styles.cardRestaurant}>{item.restaurant}</Text>
          <Pressable style={styles.addToCartBtn} onPress={handleAddToCart}>
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
  const [activeCategory, setActiveCategory] = useState<'All' | Category>('All');
  const [searchText, setSearchText] = useState('');
  const pathname = usePathname();

  const filteredItems = FOOD_ITEMS.filter((item) => {
    const matchCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchSearch =
      searchText.trim() === '' ||
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.restaurant.toLowerCase().includes(searchText.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <LinearGradient colors={['#DAE6D8', '#92AF8C']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.push('/home')}>
          <Ionicons name="chevron-back" size={20} color="#1F3A2E" />
        </Pressable>

        <Link href="/profile" asChild>
          <Pressable>
            <Image source={{ uri: PROFILE_IMG }} style={styles.profileImage} />
          </Pressable>
        </Link>
      </View>

      {/* Search bar */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#92AF8C" />
          <TextInput
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search food..."
            placeholderTextColor="#9CA3AF"
          />
          {searchText !== '' && (
            <Pressable onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Page tabs */}
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

      {/* Category label */}
      <Text style={styles.categoryLabel}>Category</Text>

      {/* Filter chips (horizontal scroll) */}
      <View style={styles.filtersWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <Pressable
                key={cat}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && styles.filterChipTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Food list */}
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

      {/* ─── BOTTOM NAVIGATION BAR (matches Home) ─── */}
      <View style={styles.bottomNav}>
        <Link href="/home" asChild>
          <Pressable style={styles.bottomNavItem}>
            <Ionicons
              name={pathname === '/home' ? 'home' : 'home-outline'}
              size={24}
              color="#fff"
            />
            <Text style={styles.bottomNavLabel}>Home</Text>
          </Pressable>
        </Link>

        <Link href="/cart" asChild>
          <Pressable style={styles.bottomNavItem}>
            <Feather name="shopping-cart" size={24} color="#fff" />
            <Text style={styles.bottomNavLabel}>Cart</Text>
          </Pressable>
        </Link>

        <Link href="/history" asChild>
          <Pressable style={styles.bottomNavItem}>
            <Ionicons name="receipt-outline" size={24} color="#fff" />
            <Text style={styles.bottomNavLabel}>History</Text>
          </Pressable>
        </Link>
      </View>
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

  /* Header */
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

  /* Search */
  searchWrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  searchBar: {
    height: 44,
    borderRadius: 999,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
    ...shadowStyle,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    outlineWidth: 0,
  } as any,

  /* Tabs */
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

  /* Category label */
  categoryLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F3A2E',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },

  /* Filter chips */
  filtersWrapper: {
    height: 44,
    marginBottom: 4,
  },
  filtersContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    height: 32,
    borderRadius: 999,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadowStyle,
  },
  filterChipActive: { backgroundColor: '#1F3A2E' },
  filterChipText: { fontSize: 13, color: '#1F3A2E', fontWeight: '600' },
  filterChipTextActive: { color: '#fff', fontWeight: '700' },

  /* Scroll area */
  scrollArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 110 },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#161D1F' },
  sectionSubtitle: { fontSize: 13, color: '#5F5E5B' },

  /* Cards */
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
  cardTitle: { fontSize: 16, color: '#161D1F', flex: 1, marginRight: 8, fontWeight: '700' },
  cardDescription: {
    fontSize: 12,
    color: '#5F5E5B',
    lineHeight: 16,
    marginTop: -2,
    marginBottom: 2,
  },
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
  addToCartBtn: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#324D3E',
    alignItems: 'center', justifyContent: 'center',
  },

  /* Bottom Navigation (matches Home) */
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxWidth: 402,
    alignSelf: 'center',
    width: '100%',
    height: 90,
    backgroundColor: '#92AF8C',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 20 : 12,
    paddingTop: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: { elevation: 12 },
      default: { boxShadow: '0 -4px 8px rgba(0,0,0,0.1)' },
    }),
  },
  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 6,
  },
  bottomNavLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
});