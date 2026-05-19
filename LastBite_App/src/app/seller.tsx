import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Image,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const CATEGORIES = ['Vegan', 'Bakery', 'Halal', 'Groceries'];

const SALES_DATA = [
  { day: 'M', value: 7 },
  { day: 'T', value: 11 },
  { day: 'W', value: 6 },
  { day: 'T', value: 15 },
  { day: 'F', value: 7 },
  { day: 'S', value: 10 },
  { day: 'S', value: 18 },
];

const MAX_SALES = Math.max(...SALES_DATA.map((d) => d.value));
const MAX_BAR_HEIGHT = 100;

const DONUT_IMG = 'https://api.builder.io/api/v1/image/assets/TEMP/faf72ac6975c44aeb0d097736c3da20529c32ce2?width=636';

type Tab = 'add' | 'overview';

export default function SellerHomepage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('add');
  const [activeCategory, setActiveCategory] = useState('Vegan');
  const [stockQty, setStockQty] = useState('');
  const [price, setPrice] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('');
  const [favorited, setFavorited] = useState(false);

  const handleLaunch = () => {
    if (!stockQty || !price) {
      Alert.alert('Incomplete', 'Please fill in stock quantity and price.');
      return;
    }
    Alert.alert(
      'Flash Rescue Launched! 🚀',
      `Category: ${activeCategory}\nStock: ${stockQty}\nPrice: Rp${price}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <LinearGradient colors={['#DAE6D8', '#92AF8C']} style={styles.container}>

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
            <Pressable onPress={() => setSidebarOpen(false)} style={styles.hamburgerButton}>
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
              <MaterialCommunityIcons name="storefront-outline" size={20} color="#065F46" />
              <Text style={[styles.navItemText, styles.navItemTextActive]}>Switch to Buyer</Text>
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

          <View style={styles.logoutWrapper}>
            <Pressable
              style={styles.logoutButton}
              onPress={() => { setSidebarOpen(false); router.push('/'); }}
            >
              <Ionicons name="log-out-outline" size={20} color="#DC2626" />
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </View>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ─── HEADER ─── */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.push('/home')}>
            <Ionicons name="chevron-back" size={20} color="#1F3A2E" />
          </Pressable>
          <Pressable style={styles.hamburgerButton} onPress={() => setSidebarOpen(true)}>
            <Ionicons name="menu" size={26} color="#1F3A2E" />
          </Pressable>
        </View>

        {/* ─── STORE NAME ─── */}
        <View style={styles.storeRow}>
          <View style={styles.storeIconBox}>
            <MaterialCommunityIcons name="storefront" size={20} color="#324D3E" />
          </View>
          <Text style={styles.storeName}>Lumière Pâtisserie</Text>
        </View>

        {/* ─── TAB BUTTONS ─── */}
        <View style={styles.tabsRow}>
          <Pressable
            style={[styles.tabButton, activeTab === 'add' && styles.tabButtonActive]}
            onPress={() => setActiveTab('add')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'add' && styles.tabButtonTextActive]}>
              Add Mystery Box
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabButton, activeTab === 'overview' && styles.tabButtonActive]}
            onPress={() => setActiveTab('overview')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'overview' && styles.tabButtonTextActive]}>
              Store Overview
            </Text>
          </Pressable>
        </View>

        {/* ─── ADD MYSTERY BOX FORM ─── */}
        {activeTab === 'add' && (
          <View style={styles.formCard}>
            <View style={styles.formTitleRow}>
              <View style={styles.plusIconBox}>
                <Ionicons name="add" size={16} color="#fff" />
              </View>
              <Text style={styles.formTitle}>Create New Mystery Box</Text>
            </View>

            <Text style={styles.fieldLabel}>Category</Text>
            <View style={styles.categoryRow}>
              {CATEGORIES.map((cat) => (
                <Pressable
                  key={cat}
                  style={[styles.categoryChip, activeCategory === cat && styles.categoryChipActive]}
                  onPress={() => setActiveCategory(cat)}
                >
                  <Text style={[styles.categoryChipText, activeCategory === cat && styles.categoryChipTextActive]}>
                    {cat}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>Stock Quantity</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#A8A29E"
                  keyboardType="numeric"
                  value={stockQty}
                  onChangeText={setStockQty}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>Price (Rp)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor="#A8A29E"
                  keyboardType="numeric"
                  value={price}
                  onChangeText={setPrice}
                />
              </View>
            </View>

            <Text style={styles.fieldLabel}>Estimated Value</Text>
            <TextInput
              style={[styles.input, styles.inputFull]}
              placeholder="Typical retail value"
              placeholderTextColor="#A8A29E"
              keyboardType="numeric"
              value={estimatedValue}
              onChangeText={setEstimatedValue}
            />

            <Pressable style={styles.launchButton} onPress={handleLaunch}>
              <Text style={styles.launchButtonText}>Launch Flash Rescue</Text>
            </Pressable>
          </View>
        )}

        {/* ─── STORE OVERVIEW ─── */}
        {activeTab === 'overview' && (
          <View style={styles.overviewContainer}>

            {/* Sales Chart Card */}
            <View style={styles.overviewCard}>
              <View style={styles.salesHeaderRow}>
                <Text style={styles.salesTitle}>Sales {'>'} last 7 days</Text>
                <View style={styles.growthBadge}>
                  <Ionicons name="trending-up" size={11} color="#065F46" />
                  <Text style={styles.growthText}>+12%</Text>
                </View>
              </View>

              <View style={styles.chartContainer}>
                {SALES_DATA.map((item, index) => {
                  const barH = (item.value / MAX_SALES) * MAX_BAR_HEIGHT;
                  return (
                    <View key={index} style={styles.barColumn}>
                      <Text style={styles.barValue}>{item.value}</Text>
                      <View style={[styles.bar, { height: barH }]} />
                      <Text style={styles.barLabel}>{item.day}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Kategori + Visitor row */}
            <View style={styles.infoRow}>
              <View style={[styles.infoCard, { flex: 1 }]}>
                <View style={styles.infoCardHeader}>
                  <MaterialCommunityIcons name="tag-outline" size={14} color="#5F6B5F" />
                  <Text style={styles.infoCardLabel}>Kategori</Text>
                </View>
                <Text style={styles.infoCardValue}>Patisserie</Text>
              </View>

              <View style={[styles.infoCard, { flex: 1 }]}>
                <View style={styles.infoCardHeader}>
                  <MaterialCommunityIcons name="walk" size={14} color="#5F6B5F" />
                  <Text style={styles.infoCardLabel}>Visitor</Text>
                </View>
                <Text style={styles.infoCardValue}>3 <Text style={styles.infoCardToday}>Today</Text></Text>
              </View>
            </View>

            {/* Most Favorite Card */}
            <View style={styles.favoriteCard}>
              <Image source={{ uri: DONUT_IMG }} style={styles.favoriteImage} />
              <View style={styles.favoriteInfo}>
                <Text style={styles.favoriteLabelSmall}>Most Favorite</Text>
                <Text style={styles.favoriteName}>Donut</Text>
              </View>
              <Pressable onPress={() => setFavorited(!favorited)}>
                <Ionicons
                  name={favorited ? 'heart' : 'heart-outline'}
                  size={22}
                  color={favorited ? '#974135' : '#D6D3D1'}
                />
              </Pressable>
            </View>

          </View>
        )}
      </ScrollView>
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
  scrollContent: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 48 },

  /* Header */
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', ...shadowStyle },
  hamburgerButton: { width: 41, height: 41, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },

  /* Store */
  storeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  storeIconBox: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', ...shadowStyle },
  storeName: { fontSize: 18, fontWeight: '700', color: '#1F3A2E' },

  /* Tabs */
  tabsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  tabButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, backgroundColor: '#fff', ...shadowStyle },
  tabButtonActive: { backgroundColor: '#324D3E' },
  tabButtonText: { fontSize: 13, fontWeight: '600', color: '#324D3E' },
  tabButtonTextActive: { color: '#fff' },

  /* Form */
  formCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, ...shadowStyle },
  formTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  plusIconBox: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#324D3E', alignItems: 'center', justifyContent: 'center' },
  formTitle: { fontSize: 15, fontWeight: '700', color: '#1F3A2E' },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#5F6B5F', marginBottom: 8 },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, backgroundColor: '#F3F4F3' },
  categoryChipActive: { backgroundColor: '#324D3E' },
  categoryChipText: { fontSize: 13, fontWeight: '600', color: '#5F6B5F' },
  categoryChipTextActive: { color: '#fff' },
  inputRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  inputGroup: { flex: 1 },
  input: { backgroundColor: '#F9FAF9', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#1F3A2E', borderWidth: 1, borderColor: '#E5E7E5' },
  inputFull: { marginBottom: 24 },
  launchButton: { backgroundColor: '#324D3E', borderRadius: 12, paddingVertical: 16, alignItems: 'center',
    ...Platform.select({ ios: { shadowColor: '#324D3E', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10 }, android: { elevation: 6 }, default: { boxShadow: '0 6px 12px 0 rgba(50,77,62,0.3)' } })
  },
  launchButtonText: { fontSize: 15, fontWeight: '700', color: '#fff' },

  /* Overview */
  overviewContainer: { gap: 14 },
  overviewCard: { backgroundColor: '#fff', borderRadius: 20, padding: 18, ...shadowStyle },
  salesHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  salesTitle: { fontSize: 14, fontWeight: '700', color: '#1F3A2E' },
  growthBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  growthText: { fontSize: 11, fontWeight: '700', color: '#065F46' },
  chartContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 140 },
  barColumn: { alignItems: 'center', gap: 4, flex: 1 },
  barValue: { fontSize: 10, fontWeight: '700', color: '#324D3E' },
  bar: { width: 20, backgroundColor: '#324D3E', borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  barLabel: { fontSize: 10, color: '#7A8A7A', marginTop: 4 },

  /* Info cards */
  infoRow: { flexDirection: 'row', gap: 12 },
  infoCard: { backgroundColor: '#fff', borderRadius: 16, padding: 14, ...shadowStyle },
  infoCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  infoCardLabel: { fontSize: 12, color: '#7A8A7A' },
  infoCardValue: { fontSize: 16, fontWeight: '700', color: '#1F3A2E' },
  infoCardToday: { fontSize: 13, fontWeight: '400', color: '#7A8A7A' },

  /* Favorite */
  favoriteCard: { backgroundColor: '#fff', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 14, ...shadowStyle },
  favoriteImage: { width: 52, height: 52, borderRadius: 12 },
  favoriteInfo: { flex: 1 },
  favoriteLabelSmall: { fontSize: 11, color: '#7A8A7A', marginBottom: 2 },
  favoriteName: { fontSize: 15, fontWeight: '700', color: '#1F3A2E' },

  /* Sidebar */
  sidebarOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.2)', zIndex: 10 },
  sidebarDrawer: { position: 'absolute', top: 0, left: 0, bottom: 0, width: 280, backgroundColor: '#fff', zIndex: 20,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 4, height: 0 }, shadowOpacity: 0.25, shadowRadius: 50 }, android: { elevation: 10 }, default: { boxShadow: '4px 0 50px 0 rgba(0,0,0,0.25)' } })
  },
  sidebarHeader: { paddingTop: 28, paddingHorizontal: 20 },
  navList: { flex: 1, paddingHorizontal: 16, marginTop: 24, gap: 4 },
  navItem: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8 },
  navItemActive: { backgroundColor: '#ECFDF5' },
  navItemText: { fontSize: 14, color: '#57534E' },
  navItemTextActive: { color: '#065F46', fontWeight: '700' },
  logoutWrapper: { marginHorizontal: 14, marginBottom: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F5F5F4' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8 },
  logoutText: { fontSize: 14, fontWeight: '600', color: '#DC2626' },
});