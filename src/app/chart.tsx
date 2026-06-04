import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

const CHART_DATA = [
  { day: 'Mon', value: 2 },
  { day: 'Tue', value: 5 },
  { day: 'Wed', value: 1 },
  { day: 'Thu', value: 7 },
  { day: 'Fri', value: 2 },
  { day: 'Sat', value: 5 },
  { day: 'Sun', value: 7 },
];

const HISTORY = [
  { id: 1, name: 'Ayam Geprek',  time: 'Today - 09:15', restaurant: 'Geprek Gepruk' },
  { id: 2, name: 'Ayam Penyet',  time: 'Today - 09:15', restaurant: 'Ayam Penyet Lala' },
  { id: 3, name: 'Mie Ayam',     time: 'Today - 09:15', restaurant: 'Mie Ayam Nih' },
];

const MAX_VALUE = Math.max(...CHART_DATA.map((d) => d.value));
const MAX_BAR_HEIGHT = 120;

export default function ChartPage() {
  return (
    <LinearGradient colors={['#DAE6D8', '#92AF8C']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.push('/home')}>
            <Ionicons name="chevron-back" size={20} color="#1F3A2E" />
          </Pressable>
          <Pressable
            style={styles.profileCircle}
            onPress={() => router.push('/profile')}
          >
            <Ionicons name="person" size={26} color="#fff" />
          </Pressable>
        </View>

        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <Text style={styles.heroTitle}>Food Hero 🌱</Text>
          <Text style={styles.heroSubtitle}>You've rescued 29 portions of food</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>29</Text>
              <Text style={styles.statLabel}>MEALS RESCUED</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>Rp355K</Text>
              <Text style={styles.statLabel}>Total Saved</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>14 kg</Text>
              <Text style={styles.statLabel}>CO₂ Prevented</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
        </View>

        {/* Bar Chart */}
        <View style={styles.chartBox}>
          <Text style={styles.chartTitle}>Meals Rescued — Last 7 Days</Text>
          <View style={styles.chartContainer}>
            {CHART_DATA.map((item) => {
              const barHeight = (item.value / MAX_VALUE) * MAX_BAR_HEIGHT;
              return (
                <View key={item.day} style={styles.barColumn}>
                  <Text style={styles.barValue}>{item.value}</Text>
                  <View style={[styles.bar, { height: barHeight }]} />
                  <Text style={styles.barLabel}>{item.day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Recent History */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Recent Activity</Text>
          {HISTORY.map((item) => (
            <View key={item.id} style={styles.historyCard}>
              <View style={styles.historyInfo}>
                <Text style={styles.historyName}>{item.name}</Text>
                <Text style={styles.historyMeta}>{item.time} · {item.restaurant}</Text>
              </View>
              <View style={styles.rescuedBadge}>
                <Text style={styles.rescuedBadgeText}>+1 rescued</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Nav — matches home */}
      <View style={styles.bottomNav}>
        <Pressable style={styles.bottomNavItem} onPress={() => router.push('/home')}>
          <Ionicons name="home-outline" size={24} color="#fff" />
          <Text style={styles.bottomNavLabel}>Home</Text>
        </Pressable>
        <Pressable style={styles.bottomNavItem} onPress={() => router.push('/cart')}>
          <Feather name="shopping-cart" size={24} color="#fff" />
          <Text style={styles.bottomNavLabel}>Cart</Text>
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
  scrollContent: { paddingBottom: 110 },

  /* Header */
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 28,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    ...shadowStyle,
  },
  profileCircle: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: '#324D3E', alignItems: 'center', justifyContent: 'center',
    ...shadowStyle,
  },

  /* Hero */
  heroBanner: {
    marginHorizontal: 16, marginTop: 24,
    backgroundColor: '#324D3E', borderRadius: 18,
    paddingHorizontal: 20, paddingVertical: 18,
    ...shadowStyle,
  },
  heroTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 4 },
  heroSubtitle: { color: '#DAE6D8', fontSize: 13 },

  /* Stats */
  statsGrid: { marginTop: 20, paddingHorizontal: 16, gap: 12 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 16, borderRadius: 16, ...shadowStyle },
  statValue: { fontSize: 22, fontWeight: '700', color: '#324D3E', marginBottom: 6 },
  statLabel: { fontSize: 10, color: '#5F6B5F', letterSpacing: 0.3 },

  /* Chart */
  chartBox: { marginHorizontal: 16, marginTop: 20, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 20, ...shadowStyle },
  chartTitle: { fontSize: 14, fontWeight: '700', color: '#324D3E', marginBottom: 16 },
  chartContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 160 },
  barColumn: { alignItems: 'center', gap: 4, flex: 1 },
  barValue: { fontSize: 12, fontWeight: '700', color: '#324D3E' },
  bar: { width: 18, backgroundColor: '#324D3E', borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  barLabel: { fontSize: 11, color: '#5F6B5F', marginTop: 4 },

  /* History */
  historySection: { marginHorizontal: 16, marginTop: 20 },
  historyTitle: { fontSize: 15, fontWeight: '700', color: '#324D3E', marginBottom: 12 },
  historyCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', borderRadius: 16,
    paddingHorizontal: 16, paddingVertical: 12, marginBottom: 10,
    ...shadowStyle,
  },
  historyInfo: { flex: 1 },
  historyName: { fontSize: 14, fontWeight: '700', color: '#324D3E', marginBottom: 4 },
  historyMeta: { fontSize: 11, color: '#7A8A7A' },
  rescuedBadge: { backgroundColor: '#DAE6D8', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6 },
  rescuedBadgeText: { fontSize: 11, fontWeight: '600', color: '#324D3E' },

  /* Bottom Nav */
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
});