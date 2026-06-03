import { useState, useEffect} from 'react';
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

import { useEcoImpact } from '../api/hooks';
import { getCurrentUser } from '../api/authApi';

const HOME_NAV_ICON = 'https://api.builder.io/api/v1/image/assets/TEMP/bed9da29344886f2e34a5b3e19c35277006023da?width=60';
const CART_NAV_ICON = 'https://api.builder.io/api/v1/image/assets/TEMP/e89e2d602d11a2de8ff32895a3552e5d9987bf68?width=60';
const HISTORY_NAV_ICON = 'https://api.builder.io/api/v1/image/assets/TEMP/8c990238ba69088582be0114e07ca52e0eb6de07?width=60';

/* Data: 7 hari terakhir */
const CHART_DATA = [
  { day: 'Sen', value: 2 },
  { day: 'Sel', value: 5 },
  { day: 'Rab', value: 1 },
  { day: 'Kam', value: 7 },
  { day: 'Jum', value: 2 },
  { day: 'Sab', value: 5 },
  { day: 'Min', value: 7 },
];

export default function ChartPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

    useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

    const {
    metrics,
    weeklyChart,
    recentHistory,
    points,
    loading,
  } = useEcoImpact(user?.id);

    const MAX_VALUE =
    weeklyChart?.length > 0
      ? Math.max(...weeklyChart.map((d: any) => d.daily_saved))
      : 1;

    const MAX_BAR_HEIGHT = 120;

      if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text>Loading...</Text>
      </View>
    );
  }
  
  return (
    <LinearGradient
      colors={['#DAE6D8', '#92AF8C']}
      style={styles.container}
    >
      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.hamburgerButton}
            onPress={() => setSidebarOpen(true)}
          >
            <Ionicons name="menu" size={26} color="#1F3A2E" />
          </Pressable>

          <View style={styles.profileCircle}>
            <Ionicons name="person" size={28} color="#1F3A2E" />
          </View>
        </View>

        {/* Food Hero Banner */}
        <View style={styles.heroBanner}>
          <Text style={styles.heroTitle}>Food Hero</Text>
            <Text style={styles.heroSubtitle}>
              Kamu sudah menyelamatkan 29 porsi
            </Text>

            <Text
              style={{
                color: '#FFD700',
                marginTop: 6,
                fontWeight: '700',
              }}
            >
              🏆 {points?.total_points ?? 0} Poin
</Text>
        </View>

        {/* Stat Cards Grid 2x2 */}
        <View style={styles.statsGrid}>
          {/* Row 1 */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>29</Text>
              <Text style={styles.statLabel}>MAKANAN DI SELAMATKAN</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>RP 355 K</Text>
              <Text style={styles.statLabel}>Total Hemat</Text>
            </View>
          </View>

          {/* Row 2 */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}> 14 kg</Text>
              <Text style={styles.statLabel}>CO2 Dicegah</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Streak Hari Ini</Text>
            </View>
          </View>
        </View>

        {/* Bar Chart */}
        <View style={styles.chartBox}>
          <Text style={styles.chartTitle}>
            Makanan Diselamatkan 7 hari terakhir
          </Text>

          <View style={styles.chartContainer}>
            {weeklyChart?.map((item: any) => {
              const barHeight = (item.daily_saved / MAX_VALUE) * MAX_BAR_HEIGHT;
              const dayLabel = new Date(item.date)
                .toLocaleDateString('id-ID', {
                  weekday: 'short',
                });
              return (
                <View key={item.date} style={styles.barColumn}>
                  <Text style={styles.barValue}>{item.daily_saved}</Text>
                  <View style={[styles.bar, { height: barHeight }]} />
                  <Text style={styles.barLabel}>{item.dayLabel}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Riwayat Terakhir */}
        <View style={styles.riwayatSection}>
          <Text style={styles.riwayatTitle}>Riwayat Terakhir</Text>

          {recentHistory?.map((item:any, idx: number) => (
            <View key={idx} style={styles.riwayatCard}>
              <View style={styles.riwayatInfo}>
                <Text style={styles.riwayatName}>{item.product_name}</Text>
                <Text style={styles.riwayatTime}>
                  {new Date(item.created_at).toLocaleString('id-ID')}
                  {' - '}
                  {item.merchant_name}
                </Text>
              </View>
              <View style={styles.riwayatBadge}>
                <Text style={styles.riwayatBadgeText}>+{item.quantity} selamat</Text>
              </View>
            </View>
          ))}
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
          <View style={styles.sidebarHeader}>
            <Pressable
              onPress={() => setSidebarOpen(false)}
              style={styles.hamburgerButton}
            >
              <Ionicons name="menu" size={26} color="#1F3A2E" />
            </Pressable>
          </View>

          <View style={styles.navList}>
            <Pressable
                style={[styles.navItem, styles.navItemActive]}
                onPress={() => {
                  setSidebarOpen(false);
                  router.push('/');
                }}
              >
              <Ionicons name="storefront-outline" size={20} color="#065F46" />
              <Text style={[styles.navItemText, styles.navItemTextActive]}>
                Switch to Seller
              </Text>
            </Pressable>

            <Pressable
                  style={styles.navItem}
                  onPress={() => {
                    setSidebarOpen(false);
                    router.push('/profile');
                  }}
                >
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
          onPress={() => router.push('/cart' as any)}
        >
          <Image source={{ uri: CART_NAV_ICON }} style={styles.bottomNavIcon} />
          <Text style={styles.bottomNavLabel}>Cart</Text>
        </Pressable>

        <Pressable style={styles.bottomNavItem}>
          <Image source={{ uri: HISTORY_NAV_ICON }} style={styles.bottomNavIcon} />
          <Text style={styles.bottomNavLabel}>History</Text>
        </Pressable>
      </LinearGradient>
    </LinearGradient>
  );
}

const shadowStyle = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  android: {
    elevation: 3,
  },
  default: {
    boxShadow: '0 2px 4px 0 rgba(0,0,0,0.15)',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 402,
    alignSelf: 'center',
    width: '100%',
  },

  /* Scroll */
  scrollContent: {
    paddingBottom: 96,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#324D3E',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Hero Banner */
  heroBanner: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: '#324D3E',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 18,
    ...shadowStyle,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  heroSubtitle: {
    color: '#DAE6D8',
    fontSize: 13,
  },

  /* Stats Grid */
  statsGrid: {
    marginTop: 20,
    paddingHorizontal: 16,
    gap: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    ...shadowStyle,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#324D3E',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 10,
    color: '#5F6B5F',
    letterSpacing: 0.3,
  },

  /* Chart */
  chartBox: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 20,
    ...shadowStyle,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#324D3E',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 160,
  },
  barColumn: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  barValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#324D3E',
  },
  bar: {
    width: 18,
    backgroundColor: '#324D3E',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barLabel: {
    fontSize: 11,
    color: '#5F6B5F',
    marginTop: 4,
  },

  /* Riwayat */
  riwayatSection: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  riwayatTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#324D3E',
    marginBottom: 12,
  },
  riwayatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 10,
    ...shadowStyle,
  },
  riwayatInfo: {
    flex: 1,
  },
  riwayatName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#324D3E',
    marginBottom: 4,
  },
  riwayatTime: {
    fontSize: 11,
    color: '#7A8A7A',
  },
  riwayatBadge: {
    backgroundColor: '#DAE6D8',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  riwayatBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#324D3E',
  },

  /* Sidebar */
  sidebarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  sidebarDrawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#fff',
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

  /* Bottom Nav */
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
  },
  bottomNavItem: {
    alignItems: 'center',
    gap: 2,
  },
  bottomNavIcon: {
    width: 28,
    height: 28,
  },
  bottomNavLabel: {
    fontSize: 10,
    color: '#fff',
  },
});