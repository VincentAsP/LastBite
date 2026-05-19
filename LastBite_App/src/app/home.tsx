import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';

const PROFILE_IMG = 'https://api.builder.io/api/v1/image/assets/TEMP/75f84b2a05c559a065a8ab0e8645c12f2bce924b?width=110';
const GIFT_ICON = 'https://api.builder.io/api/v1/image/assets/TEMP/5917e7ec8d23a54a5ebb1c97985e7dc666be04c5?width=80';
const FOOD_ICON = 'https://api.builder.io/api/v1/image/assets/TEMP/0f608006e6a12a99de99f92c674b7a418e74269e?width=80';
const CHART_ICON = 'https://api.builder.io/api/v1/image/assets/TEMP/d81f259d225ee70c0f4161d6fbf62412d4edcea6?width=80';

export default function Homepage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  return (
    <LinearGradient
      colors={['#DAE6D8', '#92AF8C']}
      style={styles.container}
    >
      {/* ─── MAIN CONTENT ─── */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => setSidebarOpen(true)}
            style={styles.hamburgerButton}
          >
            <Ionicons name="menu" size={24} color="#324D3E" />
          </Pressable>

          <Image
            source={{ uri: PROFILE_IMG }}
            style={styles.profileImage}
          />
        </View>

        {/* Search bar */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#92AF8C" />
            <TextInput
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search..."
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <Pressable style={styles.filterButton}>
            <Ionicons name="options-outline" size={20} color="#324D3E" />
          </Pressable>
        </View>

        {/* Banner card */}
        <View style={styles.bannerWrapper}>
          <View style={styles.bannerCard}>
            <Text style={styles.bannerText}>Featured Banner</Text>
          </View>

          {/* Carousel dots */}
          <View style={styles.dotsRow}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesRow}>
          <Link href="/mystery" asChild>
            <Pressable style={styles.categoryItem}>
              <View style={styles.categoryIconBox}>
                <Image source={{ uri: GIFT_ICON }} style={styles.categoryIcon} />
              </View>
              <Text style={styles.categoryLabel}>Mystery Box</Text>
            </Pressable>
          </Link>

          <Link href="/food" asChild>
            <Pressable style={styles.categoryItem}>
              <View style={styles.categoryIconBox}>
                <Image source={{ uri: FOOD_ICON }} style={styles.categoryIcon} />
              </View>
              <Text style={styles.categoryLabel}>Food</Text>
            </Pressable>
          </Link>

          <Link href="/chart" asChild>
            <Pressable style={styles.categoryItem}>
              <View style={styles.categoryIconBox}>
                <Image source={{ uri: CHART_ICON }} style={styles.categoryIcon} />
              </View>
              <Text style={styles.categoryLabel}>Chart</Text>
            </Pressable>
          </Link>
        </View>

        {/* Best Deals Today */}
        <View style={styles.dealsWrapper}>
          <View style={styles.dealsHeader}>
            <Text style={styles.dealsTitle}>Best Deals Today</Text>
            <Pressable>
              <Text style={styles.dealsSeeAll}>See all</Text>
            </Pressable>
          </View>

          <View style={styles.dealsRow}>
            <View style={styles.dealCard}>
              <Text style={styles.dealPlaceholder}>Deal 1</Text>
            </View>
            <View style={styles.dealCard}>
              <Text style={styles.dealPlaceholder}>Deal 2</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ─── SIDEBAR OVERLAY ─── */}
      {sidebarOpen && (
        <Pressable
          style={styles.sidebarOverlay}
          onPress={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── SIDEBAR DRAWER ─── */}
      {sidebarOpen && (
        <View style={styles.sidebarDrawer}>
          {/* Sidebar header */}
          <View style={styles.sidebarHeader}>
            <Pressable
              onPress={() => setSidebarOpen(false)}
              style={styles.hamburgerButton}
            >
              <Ionicons name="menu" size={24} color="#324D3E" />
            </Pressable>
          </View>

          {/* Nav items */}
          <View style={styles.navList}>
             <Pressable
                  style={[styles.navItem, styles.navItemActive]}
                  onPress={() => {
                    setSidebarOpen(false);
                    router.push('/');
                  }}
                >
              <MaterialCommunityIcons name="storefront-outline" size={20} color="#065F46" />
              <Text style={[styles.navItemText, styles.navItemTextActive]}>
                Switch to Seller
              </Text>
            </Pressable>

            <Pressable style={styles.navItem}>
              <Ionicons name="person-outline" size={18} color="#57534E" />
              <Text style={styles.navItemText}>Profile</Text>
            </Pressable>

            <Pressable style={styles.navItem}>
              <Ionicons name="help-circle-outline" size={20} color="#57534E" />
              <Text style={styles.navItemText}>Help & Support</Text>
            </Pressable>

            <Pressable style={styles.navItem}>
              <Ionicons name="settings-outline" size={20} color="#57534E" />
              <Text style={styles.navItemText}>Settings</Text>
            </Pressable>
          </View>

          {/* Logout */}
          <View style={styles.logoutWrapper}>
            <Pressable
              style={styles.logoutButton}
              onPress={() => {
                setSidebarOpen(false);
                router.push('/');
              }}
            >
              <Ionicons name="log-out-outline" size={20} color="#DC2626" />
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </View>
        </View>
      )}
    </LinearGradient>
  );
}

const shadowStyle = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  android: {
    elevation: 4,
  },
  default: {
    boxShadow: '0 4px 4px 0 rgba(0,0,0,0.25)',
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
    paddingBottom: 32,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  hamburgerButton: {
    width: 41,
    height: 41,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },

  /* Search */
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 17,
    marginHorizontal: 22,
    marginTop: 30,
  },
  searchBar: {
    flex: 1,
    height: 44,
    borderRadius: 50,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadowStyle,
  },

  /* Banner */
  bannerWrapper: {
    marginHorizontal: 22,
    marginTop: 20,
  },
  bannerCard: {
    width: '100%',
    height: 159,
    borderRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92AF8C',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  dot: {
    width: 5,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#324D3E',
  },
  dotActive: {
    width: 17,
  },

  /* Categories */
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    marginHorizontal: 52,
    marginTop: 28,
  },
  categoryItem: {
    alignItems: 'center',
    gap: 5,
  },
  categoryIconBox: {
    width: 74,
    height: 73,
    borderRadius: 25,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIcon: {
    width: 40,
    height: 40,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#324D3E',
    textAlign: 'center',
  },

  /* Deals */
  dealsWrapper: {
    marginHorizontal: 22,
    marginTop: 24,
  },
  dealsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  dealsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#324D3E',
  },
  dealsSeeAll: {
    fontSize: 14,
    fontWeight: '700',
    color: '#324D3E',
    textDecorationLine: 'underline',
  },
  dealsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dealCard: {
    flex: 1,
    height: 218,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 16,
  },
  dealPlaceholder: {
    fontSize: 12,
    color: '#D1D5DB',
  },

  /* Sidebar */
  sidebarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  sidebarDrawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 316,
    backgroundColor: '#fff',
    flexDirection: 'column',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 50,
      },
      android: { elevation: 10 },
      default: { boxShadow: '0 4px 50px 10px rgba(0,0,0,0.25)' },
    }),
  },
  sidebarHeader: {
    paddingTop: 28,
    paddingHorizontal: 20,
  },
  navList: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 24,
    gap: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  navItemActive: {
    backgroundColor: '#ECFDF5',
  },
  navItemText: {
    fontSize: 14,
    color: '#57534E',
  },
  navItemTextActive: {
    color: '#065F46',
    fontWeight: '700',
  },
  logoutWrapper: {
    marginHorizontal: 14,
    marginBottom: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F4',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
});