import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// ─── Constants ───
const CATEGORIES = [
  "Homemade",
  "Bakery",
  "Today's Leftover",
  "Snack",
  "Drinks",
  "Other",
];
const SALES_DATA = [
  { day: "M", value: 7 },
  { day: "T", value: 11 },
  { day: "W", value: 6 },
  { day: "T", value: 15 },
  { day: "F", value: 7 },
  { day: "S", value: 10 },
  { day: "S", value: 18 },
];
const MAX_SALES = Math.max(...SALES_DATA.map((d) => d.value));
const MAX_BAR_HEIGHT = 100;

type SoldItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  soldQty: number;
  totalQty: number;
  date: string;
  image: string;
  status: "sold_out" | "active" | "expired";
};

const SOLD_HISTORY: SoldItem[] = [
  {
    id: "FD-001",
    name: "Special Fried Rice",
    category: "Today's Leftover",
    price: 15000,
    soldQty: 3,
    totalQty: 3,
    date: "28-05-2026",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200",
    status: "sold_out",
  },
  {
    id: "FD-002",
    name: "Homemade Pull-Apart Bread",
    category: "Bakery",
    price: 25000,
    soldQty: 2,
    totalQty: 5,
    date: "28-05-2026",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200",
    status: "active",
  },
  {
    id: "FD-003",
    name: "Potato Donuts",
    category: "Bakery",
    price: 10000,
    soldQty: 6,
    totalQty: 6,
    date: "27-05-2026",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200",
    status: "sold_out",
  },
  {
    id: "FD-004",
    name: "Corn Chicken Soup",
    category: "Homemade",
    price: 18000,
    soldQty: 0,
    totalQty: 4,
    date: "26-05-2026",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=200",
    status: "expired",
  },
  {
    id: "FD-005",
    name: "Lemon Iced Tea",
    category: "Drinks",
    price: 8000,
    soldQty: 5,
    totalQty: 8,
    date: "25-05-2026",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200",
    status: "active",
  },
  {
    id: "FD-006",
    name: "Cassava Chips",
    category: "Snack",
    price: 7000,
    soldQty: 10,
    totalQty: 10,
    date: "24-05-2026",
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200",
    status: "sold_out",
  },
  {
    id: "FD-007",
    name: "Mixed Fruit Salad",
    category: "Other",
    price: 12000,
    soldQty: 1,
    totalQty: 4,
    date: "23-05-2026",
    image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=200",
    status: "expired",
  },
];

const STATUS_CONFIG = {
  sold_out: { label: "Sold Out", bg: "#D1FAE5", color: "#065F46" },
  active: { label: "Active", bg: "#FEF3C7", color: "#92400E" },
  expired: { label: "Expired", bg: "#FEE2E2", color: "#B91C1C" },
};

const formatPrice = (n: number) => n.toLocaleString("id-ID");

type Tab = "add" | "overview";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const generateTimeOptions = () => {
  const times = [];
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, "0");
    times.push(`${hour}:00`);
  }
  return times;
};
const TIME_OPTIONS = generateTimeOptions();

// ─── Mini Calendar Component ───
function CalendarPicker({
  visible,
  selectedDate,
  onSelect,
  onClose,
}: {
  visible: boolean;
  selectedDate: Date;
  onSelect: (d: Date) => void;
  onClose: () => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(selectedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isSel = (d: number) =>
    selectedDate.getDate() === d &&
    selectedDate.getMonth() === viewMonth &&
    selectedDate.getFullYear() === viewYear;

  const isPast = (d: number) => {
    const cell = new Date(viewYear, viewMonth, d);
    cell.setHours(0, 0, 0, 0);
    return cell < today;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={cal.overlay} onPress={onClose}>
        <Pressable style={cal.card} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={cal.header}>
            <Pressable style={cal.navBtn} onPress={prevMonth}>
              <Ionicons name="chevron-back" size={18} color="#1F3A2E" />
            </Pressable>
            <Text style={cal.monthLabel}>
              {MONTHS[viewMonth]} {viewYear}
            </Text>
            <Pressable style={cal.navBtn} onPress={nextMonth}>
              <Ionicons name="chevron-forward" size={18} color="#1F3A2E" />
            </Pressable>
          </View>

          {/* Weekday labels */}
          <View style={cal.weekRow}>
            {WEEKDAYS.map((w) => (
              <Text key={w} style={cal.weekLabel}>
                {w}
              </Text>
            ))}
          </View>

          {/* Days grid */}
          <View style={cal.grid}>
            {cells.map((d, i) => {
              if (!d) return <View key={`e-${i}`} style={cal.cell} />;
              const past = isPast(d);
              const sel = isSel(d);
              return (
                <Pressable
                  key={`d-${d}`}
                  style={[cal.cell, sel && cal.cellSel, past && cal.cellPast]}
                  onPress={() => {
                    if (!past) {
                      onSelect(new Date(viewYear, viewMonth, d));
                      onClose();
                    }
                  }}
                  disabled={past}
                >
                  <Text
                    style={[
                      cal.cellText,
                      sel && cal.cellTextSel,
                      past && cal.cellTextPast,
                    ]}
                  >
                    {d}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable style={cal.cancelBtn} onPress={onClose}>
            <Text style={cal.cancelText}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const cal = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    maxWidth: 340,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 24,
      },
      android: { elevation: 12 },
      default: { boxShadow: "0 8px 32px rgba(0,0,0,0.18)" },
    }),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F3F4F3",
    alignItems: "center",
    justifyContent: "center",
  },
  monthLabel: { fontSize: 16, fontWeight: "700", color: "#1F3A2E" },
  weekRow: { flexDirection: "row", marginBottom: 8 },
  weekLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "600",
    color: "#9BA89B",
  },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  cellSel: { backgroundColor: "#324D3E" },
  cellPast: { opacity: 0.3 },
  cellText: { fontSize: 14, color: "#1F3A2E", fontWeight: "500" },
  cellTextSel: { color: "#fff", fontWeight: "700" },
  cellTextPast: { color: "#9BA89B" },
  cancelBtn: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F3",
  },
  cancelText: { fontSize: 14, color: "#B91C1C", fontWeight: "600" },
});

// ─── Main Component ───
export default function SellerHomepage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("add");
  const [showAllHistory, setShowAllHistory] = useState(false);

  // Form state
  const [foodName, setFoodName] = useState("");
  const [description, setDescription] = useState("");
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [stockQty, setStockQty] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState("18:00");
  const [photo, setPhoto] = useState<string | null>(null);

  // Picker modals
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePickerModal, setShowTimePickerModal] = useState(false);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need access to your photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const handleLaunch = () => {
    if (!foodName.trim() || !stockQty || !price || !photo) {
      Alert.alert(
        "Incomplete",
        "Please fill in food name, photo, stock quantity, and price.",
      );
      return;
    }
    console.log("Launch food:", {
      foodName,
      description,
      category: activeCategory,
      stockQty,
      price,
      originalPrice,
      availableUntil: `${formatDate(selectedDate)} ${selectedTime}`,
      photo,
    });
    Alert.alert(
      "Listed Successfully 🚀",
      `${foodName} is now available for buyers!`,
      [
        {
          text: "OK",
          onPress: () => {
            setFoodName("");
            setDescription("");
            setStockQty("");
            setPrice("");
            setOriginalPrice("");
            setSelectedDate(new Date());
            setSelectedTime("18:00");
            setPhoto(null);
          },
        },
      ],
    );
  };

  const totalRevenue = SOLD_HISTORY.reduce(
    (sum, item) => sum + item.price * item.soldQty,
    0,
  );
  const totalSold = SOLD_HISTORY.reduce((sum, item) => sum + item.soldQty, 0);
  const totalListed = SOLD_HISTORY.length;

  const displayedHistory = showAllHistory
    ? SOLD_HISTORY
    : SOLD_HISTORY.slice(0, 4);

  return (
    <LinearGradient colors={["#DAE6D8", "#92AF8C"]} style={styles.container}>
      {/* Sidebar */}
      {sidebarOpen && (
        <Pressable
          style={styles.sidebarOverlay}
          onPress={() => setSidebarOpen(false)}
        />
      )}
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
                router.push("/home");
              }}
            >
              <MaterialCommunityIcons
                name="storefront-outline"
                size={20}
                color="#065F46"
              />
              <Text style={[styles.navItemText, styles.navItemTextActive]}>
                Switch to Buyer
              </Text>
            </Pressable>
            <Pressable style={styles.navItem}>
              <Ionicons name="person-outline" size={18} color="#57534E" />
              <Text style={styles.navItemText}>Profile</Text>
            </Pressable>
          </View>
          <View style={styles.logoutWrapper}>
            <Pressable
              style={styles.logoutButton}
              onPress={() => {
                setSidebarOpen(false);
                router.push("/");
              }}
            >
              <Ionicons name="log-out-outline" size={20} color="#DC2626" />
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Calendar popup */}
      <CalendarPicker
        visible={showCalendar}
        selectedDate={selectedDate}
        onSelect={setSelectedDate}
        onClose={() => setShowCalendar(false)}
      />

      {/* Time picker modal */}
      <Modal
        visible={showTimePickerModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTimePickerModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowTimePickerModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Time</Text>
              <Pressable onPress={() => setShowTimePickerModal(false)}>
                <Ionicons name="close" size={24} color="#1F3A2E" />
              </Pressable>
            </View>
            <ScrollView style={styles.timeOptionsList}>
              {TIME_OPTIONS.map((time) => (
                <Pressable
                  key={time}
                  style={[
                    styles.timeOption,
                    selectedTime === time && styles.timeOptionActive,
                  ]}
                  onPress={() => {
                    setSelectedTime(time);
                    setShowTimePickerModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.timeOptionText,
                      selectedTime === time && styles.timeOptionTextActive,
                    ]}
                  >
                    {time}
                  </Text>
                  {selectedTime === time && (
                    <Ionicons name="checkmark" size={20} color="#fff" />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.push("/home")}
          >
            <Ionicons name="chevron-back" size={20} color="#1F3A2E" />
          </Pressable>
          <Pressable
            style={styles.hamburgerButton}
            onPress={() => setSidebarOpen(true)}
          >
            <Ionicons name="menu" size={26} color="#1F3A2E" />
          </Pressable>
        </View>

        {/* Greeting */}
        <View style={styles.greetingRow}>
          <View style={styles.storeIconBox}>
            <MaterialCommunityIcons name="food" size={20} color="#324D3E" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.greetingLabel}>Selling as</Text>
            <Text style={styles.greetingName}>Rangga's Kitchen</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          {(["add", "overview"] as Tab[]).map((tab) => (
            <Pressable
              key={tab}
              style={[
                styles.tabButton,
                activeTab === tab && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === tab && styles.tabButtonTextActive,
                ]}
              >
                {tab === "add" ? "Add Food" : "Overview"}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ── ADD FOOD ── */}
        {activeTab === "add" && (
          <View style={styles.formCard}>
            <View style={styles.formTitleRow}>
              <View style={styles.plusIconBox}>
                <Ionicons name="add" size={16} color="#fff" />
              </View>
              <Text style={styles.formTitle}>List Food For Rescue</Text>
            </View>

            {/* Photo */}
            <Text style={styles.fieldLabel}>Photo</Text>
            <Pressable style={styles.photoUploader} onPress={handlePickImage}>
              {photo ? (
                <>
                  <Image source={{ uri: photo }} style={styles.photoPreview} />
                  <View style={styles.photoOverlay}>
                    <Ionicons name="camera" size={18} color="#fff" />
                    <Text style={styles.photoOverlayText}>Change photo</Text>
                  </View>
                </>
              ) : (
                <View style={styles.photoPlaceholder}>
                  <MaterialCommunityIcons
                    name="camera-plus-outline"
                    size={32}
                    color="#7A8A7A"
                  />
                  <Text style={styles.photoPlaceholderText}>
                    Tap to upload photo
                  </Text>
                  <Text style={styles.photoPlaceholderHint}>
                    Help buyers see what they're getting
                  </Text>
                </View>
              )}
            </Pressable>

            {/* Food Name */}
            <Text style={styles.fieldLabel}>Food Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Special Fried Rice"
              placeholderTextColor="#A8A29E"
              value={foodName}
              onChangeText={setFoodName}
            />

            {/* Description */}
            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>
              Description <Text style={styles.optional}>(optional)</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Ingredients, taste, when it was made..."
              placeholderTextColor="#A8A29E"
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />

            {/* Category */}
            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Category</Text>
            <View style={styles.categoryRow}>
              {CATEGORIES.map((cat) => (
                <Pressable
                  key={cat}
                  style={[
                    styles.categoryChip,
                    activeCategory === cat && styles.categoryChipActive,
                  ]}
                  onPress={() => setActiveCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      activeCategory === cat && styles.categoryChipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Stock + Price */}
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>Stock</Text>
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
                <Text style={styles.fieldLabel}>Sale Price (Rp)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#A8A29E"
                  keyboardType="numeric"
                  value={price}
                  onChangeText={setPrice}
                />
              </View>
            </View>

            {/* Original Price */}
            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>
              Original Price{" "}
              <Text style={styles.optional}>
                (optional, shown as strikethrough)
              </Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 30000"
              placeholderTextColor="#A8A29E"
              keyboardType="numeric"
              value={originalPrice}
              onChangeText={setOriginalPrice}
            />

            {/* Available Until */}
            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>
              Available Until{" "}
              <Text style={styles.optional}>(pick date & time)</Text>
            </Text>
            <View style={styles.dateTimeRow}>
              <Pressable
                style={styles.datePickerButton}
                onPress={() => setShowCalendar(true)}
              >
                <Ionicons name="calendar-outline" size={20} color="#324D3E" />
                <Text style={styles.datePickerText}>
                  {formatDate(selectedDate)}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#7A8A7A" />
              </Pressable>
              <Pressable
                style={styles.timePickerButton}
                onPress={() => setShowTimePickerModal(true)}
              >
                <Ionicons name="time-outline" size={20} color="#324D3E" />
                <Text style={styles.timePickerText}>{selectedTime}</Text>
                <Ionicons name="chevron-down" size={16} color="#7A8A7A" />
              </Pressable>
            </View>

            <Pressable style={styles.launchButton} onPress={handleLaunch}>
              <Ionicons name="rocket-outline" size={18} color="#fff" />
              <Text style={styles.launchButtonText}>Publish Listing</Text>
            </Pressable>
          </View>
        )}

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <View style={styles.overviewContainer}>
            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{totalListed}</Text>
                <Text style={styles.statLabel}>Listings</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{totalSold}</Text>
                <Text style={styles.statLabel}>Sold</Text>
              </View>
              <View style={[styles.statCard, styles.statCardHighlight]}>
                <Text style={styles.statValueHighlight}>
                  Rp{formatPrice(totalRevenue)}
                </Text>
                <Text style={styles.statLabelHighlight}>Revenue</Text>
              </View>
            </View>

            {/* Chart */}
            <View style={styles.overviewCard}>
              <View style={styles.salesHeaderRow}>
                <Text style={styles.salesTitle}>Sales · last 7 days</Text>
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

            {/* History header */}
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>Recent Listings</Text>
              <Pressable onPress={() => setShowAllHistory((v) => !v)}>
                <Text style={styles.historyLink}>
                  {showAllHistory ? "Show less" : "View all"}
                </Text>
              </Pressable>
            </View>

            <View style={{ gap: 10 }}>
              {displayedHistory.map((item) => {
                const cfg = STATUS_CONFIG[item.status];
                return (
                  <View key={item.id} style={styles.historyCard}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.historyImage}
                    />
                    <View style={styles.historyInfo}>
                      <View style={styles.historyTopRow}>
                        <Text style={styles.historyName} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <View
                          style={[
                            styles.statusBadge,
                            { backgroundColor: cfg.bg },
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusBadgeText,
                              { color: cfg.color },
                            ]}
                          >
                            {cfg.label}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.historyMeta}>
                        <View style={styles.metaItem}>
                          <MaterialCommunityIcons
                            name="tag-outline"
                            size={11}
                            color="#7A8A7A"
                          />
                          <Text style={styles.metaText}>{item.category}</Text>
                        </View>
                        <View style={styles.metaItem}>
                          <Ionicons
                            name="calendar-outline"
                            size={11}
                            color="#7A8A7A"
                          />
                          <Text style={styles.metaText}>{item.date}</Text>
                        </View>
                      </View>
                      <View style={styles.historyFooter}>
                        <Text style={styles.historyPrice}>
                          Rp{formatPrice(item.price)}
                        </Text>
                        <Text style={styles.historyQty}>
                          {item.soldQty}/{item.totalQty} sold
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Show less button at bottom when expanded */}
            {showAllHistory && (
              <Pressable
                style={styles.showLessBtn}
                onPress={() => setShowAllHistory(false)}
              >
                <Ionicons name="chevron-up" size={16} color="#324D3E" />
                <Text style={styles.showLessBtnText}>Show less</Text>
              </Pressable>
            )}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const shadowStyle = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  android: { elevation: 3 },
  default: { boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)" },
});

const styles = StyleSheet.create({
  container: { flex: 1, maxWidth: 402, alignSelf: "center", width: "100%" },
  scrollContent: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 48 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    ...shadowStyle,
  },
  hamburgerButton: {
    width: 41,
    height: 41,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  storeIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    ...shadowStyle,
  },
  greetingLabel: { fontSize: 11, color: "#5F6B5F" },
  greetingName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F3A2E",
    marginTop: 1,
  },

  tabsRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#fff",
    ...shadowStyle,
  },
  tabButtonActive: { backgroundColor: "#324D3E" },
  tabButtonText: { fontSize: 13, fontWeight: "600", color: "#324D3E" },
  tabButtonTextActive: { color: "#fff" },

  formCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    ...shadowStyle,
  },
  formTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  plusIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#324D3E",
    alignItems: "center",
    justifyContent: "center",
  },
  formTitle: { fontSize: 15, fontWeight: "700", color: "#1F3A2E" },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#5F6B5F",
    marginBottom: 8,
  },
  optional: { fontSize: 11, fontWeight: "400", color: "#9BA89B" },

  photoUploader: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    backgroundColor: "#F9FAF9",
    borderWidth: 1.5,
    borderColor: "#E5E7E5",
    borderStyle: "dashed",
    overflow: "hidden",
    marginBottom: 16,
  },
  photoPreview: { width: "100%", height: "100%" },
  photoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  photoOverlayText: { fontSize: 12, color: "#fff", fontWeight: "600" },
  photoPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  photoPlaceholderText: { fontSize: 13, fontWeight: "700", color: "#324D3E" },
  photoPlaceholderHint: { fontSize: 11, color: "#7A8A7A" },

  input: {
    backgroundColor: "#F9FAF9",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1F3A2E",
    borderWidth: 1,
    borderColor: "#E5E7E5",
  },
  textarea: { minHeight: 80, paddingTop: 12 },

  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "#F3F4F3",
  },
  categoryChipActive: { backgroundColor: "#324D3E" },
  categoryChipText: { fontSize: 12, fontWeight: "600", color: "#5F6B5F" },
  categoryChipTextActive: { color: "#fff" },

  inputRow: { flexDirection: "row", gap: 12 },
  inputGroup: { flex: 1 },

  dateTimeRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  datePickerButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F9FAF9",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E7E5",
  },
  datePickerText: { fontSize: 14, color: "#1F3A2E", flex: 1 },
  timePickerButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F9FAF9",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E7E5",
  },
  timePickerText: { fontSize: 14, color: "#1F3A2E", flex: 1 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7E5",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#1F3A2E" },
  timeOptionsList: { paddingHorizontal: 20 },
  timeOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F3",
  },
  timeOptionActive: {
    backgroundColor: "#324D3E",
    paddingHorizontal: 16,
    marginHorizontal: -16,
    borderRadius: 8,
  },
  timeOptionText: { fontSize: 16, color: "#1F3A2E" },
  timeOptionTextActive: { color: "#fff", fontWeight: "600" },

  launchButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#324D3E",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#324D3E",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: { elevation: 6 },
      default: { boxShadow: "0 6px 12px 0 rgba(50,77,62,0.3)" },
    }),
  },
  launchButtonText: { fontSize: 15, fontWeight: "700", color: "#fff" },

  overviewContainer: { gap: 14 },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    ...shadowStyle,
  },
  statCardHighlight: { flex: 1.4, backgroundColor: "#324D3E" },
  statValue: { fontSize: 18, fontWeight: "700", color: "#1F3A2E" },
  statLabel: { fontSize: 11, color: "#7A8A7A", marginTop: 2 },
  statValueHighlight: { fontSize: 15, fontWeight: "700", color: "#fff" },
  statLabelHighlight: { fontSize: 11, color: "#DAE6D8", marginTop: 2 },

  overviewCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    ...shadowStyle,
  },
  salesHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  salesTitle: { fontSize: 14, fontWeight: "700", color: "#1F3A2E" },
  growthBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  growthText: { fontSize: 11, fontWeight: "700", color: "#065F46" },
  chartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 140,
  },
  barColumn: { alignItems: "center", gap: 4, flex: 1 },
  barValue: { fontSize: 10, fontWeight: "700", color: "#324D3E" },
  bar: {
    width: 20,
    backgroundColor: "#324D3E",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barLabel: { fontSize: 10, color: "#7A8A7A", marginTop: 4 },

  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 2,
  },
  historyTitle: { fontSize: 14, fontWeight: "700", color: "#1F3A2E" },
  historyLink: { fontSize: 12, fontWeight: "700", color: "#246DC1" },

  historyCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    gap: 12,
    ...shadowStyle,
  },
  historyImage: { width: 64, height: 64, borderRadius: 10 },
  historyInfo: { flex: 1, justifyContent: "space-between" },
  historyTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  historyName: { flex: 1, fontSize: 14, fontWeight: "700", color: "#1F3A2E" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  statusBadgeText: { fontSize: 10, fontWeight: "700", letterSpacing: 0.3 },
  historyMeta: { flexDirection: "row", gap: 12, marginTop: 4 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 11, color: "#7A8A7A" },
  historyFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  historyPrice: { fontSize: 13, fontWeight: "700", color: "#324D3E" },
  historyQty: { fontSize: 11, color: "#7A8A7A" },

  showLessBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 4,
    ...shadowStyle,
  },
  showLessBtnText: { fontSize: 13, fontWeight: "600", color: "#324D3E" },

  sidebarOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
    zIndex: 10,
  },
  sidebarDrawer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    backgroundColor: "#fff",
    zIndex: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 50,
      },
      android: { elevation: 10 },
      default: { boxShadow: "4px 0 50px 0 rgba(0,0,0,0.25)" },
    }),
  },
  sidebarHeader: { paddingTop: 28, paddingHorizontal: 20 },
  navList: { flex: 1, paddingHorizontal: 16, marginTop: 24, gap: 4 },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  navItemActive: { backgroundColor: "#ECFDF5" },
  navItemText: { fontSize: 14, color: "#57534E" },
  navItemTextActive: { color: "#065F46", fontWeight: "700" },
  logoutWrapper: {
    marginHorizontal: 14,
    marginBottom: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F4",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutText: { fontSize: 14, fontWeight: "600", color: "#DC2626" },
});
