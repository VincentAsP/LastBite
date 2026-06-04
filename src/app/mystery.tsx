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
  | 'Todays Leftover'
  | 'Snack'
  | 'Drinks'
  | 'Other';

type Box = {
  id: number;
  title: string;
  store: string;
  distance: string;
  category: Category;
  description?: string;
  price: string;
  originalPrice: string;
  timer: number;
  image: string;
};

const boxes: Box[] = [
  {
    id: 1,
    title: 'Artisan Sweet Box',
    store: 'Lumière Pâtisserie',
    distance: '0.8 km',
    category: 'Bakery',
    description: 'Mixed pastries, croissants, and sweet bread from this morning\'s batch.',
    price: 'Rp45.900',
    originalPrice: 'Rp90.000',
    timer: 45 * 60 + 12,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/73c16a1daeb8e8e38381d974a1914a831489157d?width=636',
  },
  {
    id: 2,
    title: 'Green Garden Surprise',
    store: 'The Sprout House',
    distance: '1.2 km',
    category: 'Homemade',
    description: 'Fresh homemade salad and vegan wraps prepared with locally sourced veggies.',
    price: 'Rp30.000',
    originalPrice: 'Rp60.000',
    timer: 12 * 60 + 5,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/52e52f30ee10837cf7802e05aa6f64e7620b2fdb?width=636',
  },
  {
    id: 3,
    title: 'Midnight Savory Kit',
    store: 'The Urban Grill',
    distance: '2.5 km',
    category: 'Todays Leftover',
    price: 'Rp50.000',
    originalPrice: 'Rp90.000',
    timer: 5 * 60 + 44,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/1e09ddfed9a948c80c35ff0116e30bb30063539e?width=636',
  },
  {
    id: 4,
    title: 'Crunchy Snack Combo',
    store: 'Snackology',
    distance: '1.7 km',
    category: 'Snack',
    description: 'Assorted chips, crackers, and cookies — perfect for movie nights.',
    price: 'Rp25.000',
    originalPrice: 'Rp50.000',
    timer: 32 * 60 + 10,
    image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=636&q=80',
  },
  {
    id: 5,
    title: 'Cold Brew Refresher',
    store: 'Brew & Co',
    distance: '0.5 km',
    category: 'Drinks',
    price: 'Rp20.000',
    originalPrice: 'Rp40.000',
    timer: 18 * 60 + 30,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=636&q=80',
  },
  {
    id: 6,
    title: 'Family Pantry Box',
    store: 'FreshCo Market',
    distance: '3.1 km',
    category: 'Other',
    description: 'Pantry staples — rice, eggs, and fresh produce close to best-before date.',
    price: 'Rp90.000',
    originalPrice: 'Rp150.000',
    timer: 38 * 60 + 19,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/faf72ac6975c44aeb0d097736c3da20529c32ce2?width=636',
  },
];

const FILTERS: Array<'All' | Category> = [
  'All',
  'Homemade',
  'Bakery',
  'Todays Leftover',
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

interface BoxCardProps {
  box: Box;
  favorited: boolean;
  onToggleFavorite: (id: number) => void;
}

function MysteryBoxCard({ box, favorited, onToggleFavorite }: BoxCardProps) {
  const timeLeft = useCountdown(box.timer);
  const { addItem } = useCart();
  const toast = useToast();

  const handleAddToCart = () => {
    try {
      addItem({
        id: box.id,
        name: box.title,
        restaurant: box.store,
        price: parseInt(box.price.replace(/\D/g, ''), 10),
        image: box.image,
      });
      toast.success('Added to cart', `${box.title} added successfully`);
    } catch (e) {
      toast.error('Failed to add', 'Please try again');
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardImageWrapper}>
        <Image source={{ uri: box.image }} style={styles.cardImage} />

        <View style={styles.timerBadge}>
          <Ionicons name="time-outline" size={12} color="#fff" />
          <Text style={styles.timerText}>{timeLeft}</Text>
        </View>

        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>{box.price}</Text>
          <Text style={styles.originalPriceText}>{box.originalPrice}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle}>{box.title}</Text>
          <Pressable onPress={() => onToggleFavorite(box.id)}>
            <Ionicons
              name={favorited ? 'heart' : 'heart-outline'}
              size={19}
              color={favorited ? '#974135' : '#D6D3D1'}
            />
          </Pressable>
        </View>

        {box.description && (
          <Text style={styles.cardDescription} numberOfLines={2}>
            {box.description}
          </Text>
        )}

        <View style={styles.cardRow}>
          <MaterialCommunityIcons name="storefront-outline" size={12} color="#5F5E5B" />
          <Text style={styles.cardStore}>{box.store}</Text>
          <Pressable style={styles.addToCartBtn} onPress={handleAddToCart}>
            <Ionicons name="add" size={16} color="#fff" />
          </Pressable>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.cardRow}>
            <Ionicons name="location-outline" size={12} color="#5F5E5B" />
            <Text style={styles.cardDistance}>{box.distance}</Text>
          </View>
          <View style={styles.categoryChip}>
            <Text style={styles.categoryChipText}>{box.category}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function MysteryBox() {
  const [activeFilter, setActiveFilter] = useState<'All' | Category>('All');
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [searchText, setSearchText] = useState('');
  const pathname = usePathname();

  const toggleFavorite = (id: number) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredBoxes = boxes.filter((box) => {
    const matchCategory = activeFilter === 'All' || box.category === activeFilter;
    const matchSearch =
      searchText.trim() === '' ||
      box.title.toLowerCase().includes(searchText.toLowerCase()) ||
      box.store.toLowerCase().includes(searchText.toLowerCase());
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
            placeholder="Search mystery boxes..."
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
        <Pressable style={[styles.tabButton, styles.tabButtonActive]}>
          <Text style={[styles.tabButtonText, styles.tabButtonTextActive]}>
            Mystery Boxes
          </Text>
        </Pressable>
        <Pressable style={styles.tabButton} onPress={() => router.push('/food')}>
          <Text style={styles.tabButtonText}>Food Pages</Text>
        </Pressable>
      </View>

      {/* Category label */}
      <Text style={styles.categoryLabel}>Category</Text>

      {/* Filter chips (horizontal scroll) — FIX: bungkus pakai View dengan height fix */}
      <View style={styles.filtersWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <Pressable
                key={filter}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && styles.filterChipTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Boxes list */}
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
          {filteredBoxes.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No boxes available for this filter.
              </Text>
            </View>
          ) : (
            filteredBoxes.map((box) => (
              <MysteryBoxCard
                key={box.id}
                box={box}
                favorited={favoriteIds.has(box.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))
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
    outlineWidth: 0, // remove web focus ring
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

  /* Filter chips — FIX: wrapper dengan height fix */
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
    borderWidth: 1,
    borderColor: '#F5F5F4',
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
    fontSize: 8, fontWeight: '700', color: '#4F6144', textDecorationLine: 'line-through',
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
  cardStore: { fontSize: 13, color: '#5F5E5B', flex: 1 },
  cardDistance: { fontSize: 13, color: '#5F5E5B' },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#FAFAF9',
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