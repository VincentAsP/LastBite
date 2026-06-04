import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router, usePathname } from "expo-router";
import { useRef, useState } from "react";
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const PROFILE_IMG =
  "https://api.builder.io/api/v1/image/assets/TEMP/75f84b2a05c559a065a8ab0e8645c12f2bce924b?width=110";
const GIFT_ICON =
  "https://api.builder.io/api/v1/image/assets/TEMP/5917e7ec8d23a54a5ebb1c97985e7dc666be04c5?width=80";
const FOOD_ICON =
  "https://api.builder.io/api/v1/image/assets/TEMP/0f608006e6a12a99de99f92c674b7a418e74269e?width=80";
const CHART_ICON =
  "https://api.builder.io/api/v1/image/assets/TEMP/d81f259d225ee70c0f4161d6fbf62412d4edcea6?width=80";

// Mystery box food images (deal cards)
const DEAL_IMG_1 =
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80";
const DEAL_IMG_2 =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80";

type Slide = {
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  bgColor: string;
  emoji: string;
};

const SLIDES: Slide[] = [
  {
    badge: "LIMITED OFFER",
    badgeColor: "#FCD34D",
    title: "Save up to 70%",
    subtitle: "Rescue surplus food from your favorite restaurants today",
    bgColor: "#324D3E",
    emoji: "🥡",
  },
  {
    badge: "ECO IMPACT",
    badgeColor: "#A7F3D0",
    title: "Save Food, Save Planet",
    subtitle: "Every box you rescue helps reduce food waste and CO₂ emissions",
    bgColor: "#3F6750",
    emoji: "🌱",
  },
  {
    badge: "NEW PARTNER",
    badgeColor: "#FED7AA",
    title: "Fresh Bakeries Joined",
    subtitle: "Discover surprise pastry boxes from local bakeries near you",
    bgColor: "#2D4538",
    emoji: "🥐",
  },
];

export default function Homepage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [carouselWidth, setCarouselWidth] = useState(0);
  const carouselRef = useRef<ScrollView>(null);
  const pathname = usePathname();

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (carouselWidth === 0) return;
    const index = Math.round(e.nativeEvent.contentOffset.x / carouselWidth);
    if (index !== activeSlide) setActiveSlide(index);
  };

  return (
    <LinearGradient colors={["#DAE6D8", "#92AF8C"]} style={styles.container}>
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

          <Link href="/profile" asChild>
            <Pressable>
              <Image
                source={{ uri: PROFILE_IMG }}
                style={styles.profileImage}
              />
            </Pressable>
          </Link>
        </View>

        {/* Promo banner carousel */}
        <View
          style={styles.bannerWrapper}
          onLayout={(e) => setCarouselWidth(e.nativeEvent.layout.width)}
        >
          <ScrollView
            ref={carouselRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            decelerationRate="fast"
          >
            {SLIDES.map((slide, i) => (
              <View
                key={i}
                style={[
                  styles.bannerCard,
                  { width: carouselWidth, backgroundColor: slide.bgColor },
                ]}
              >
                <View style={styles.bannerTextWrap}>
                  <View
                    style={[
                      styles.bannerBadge,
                      { backgroundColor: slide.badgeColor },
                    ]}
                  >
                    <Text style={styles.bannerBadgeText}>{slide.badge}</Text>
                  </View>
                  <Text style={styles.bannerTitle}>{slide.title}</Text>
                  <Text style={styles.bannerSubtitle}>{slide.subtitle}</Text>
                </View>
                <View style={styles.bannerDecor}>
                  <Text style={styles.bannerEmoji}>{slide.emoji}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Carousel dots */}
          <View style={styles.dotsRow}>
            {SLIDES.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, activeSlide === i && styles.dotActive]}
              />
            ))}
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesRow}>
          <Link href="/mystery" asChild>
            <Pressable style={styles.categoryItem}>
              <View style={styles.categoryIconBox}>
                <Image
                  source={{ uri: GIFT_ICON }}
                  style={styles.categoryIcon}
                />
              </View>
              <Text style={styles.categoryLabel}>Mystery Box</Text>
            </Pressable>
          </Link>

          <Link href="/food" asChild>
            <Pressable style={styles.categoryItem}>
              <View style={styles.categoryIconBox}>
                <Image
                  source={{ uri: FOOD_ICON }}
                  style={styles.categoryIcon}
                />
              </View>
              <Text style={styles.categoryLabel}>Food</Text>
            </Pressable>
          </Link>

          <Link href="/chart" asChild>
            <Pressable style={styles.categoryItem}>
              <View style={styles.categoryIconBox}>
                <Image
                  source={{ uri: CHART_ICON }}
                  style={styles.categoryIcon}
                />
              </View>
              <Text style={styles.categoryLabel}>Chart</Text>
            </Pressable>
          </Link>
        </View>

        {/* Best Deals Today */}
        <View style={styles.dealsWrapper}>
          <View style={styles.dealsHeader}>
            <Text style={styles.dealsTitle}>Best Deals Today</Text>
            <Link href="/mystery" asChild>
              <Pressable>
                <Text style={styles.dealsSeeAll}>See all</Text>
              </Pressable>
            </Link>
          </View>

          <View style={styles.dealsRow}>
            <Link href="/mystery" asChild>
              <Pressable style={styles.dealCard}>
                <Image source={{ uri: DEAL_IMG_1 }} style={styles.dealImage} />
                <View style={styles.dealDiscountBadge}>
                  <Text style={styles.dealDiscountText}>-60%</Text>
                </View>
                <View style={styles.dealInfo}>
                  <Text style={styles.dealTitle}>Mystery Box</Text>
                  <Text style={styles.dealRestaurant}>Warung Sederhana</Text>
                  <View style={styles.dealPriceRow}>
                    <Text style={styles.dealPrice}>Rp 25.000</Text>
                    <Text style={styles.dealOldPrice}>Rp 62.000</Text>
                  </View>
                </View>
              </Pressable>
            </Link>

            <Link href="/mystery" asChild>
              <Pressable style={styles.dealCard}>
                <Image source={{ uri: DEAL_IMG_2 }} style={styles.dealImage} />
                <View style={styles.dealDiscountBadge}>
                  <Text style={styles.dealDiscountText}>-50%</Text>
                </View>
                <View style={styles.dealInfo}>
                  <Text style={styles.dealTitle}>Mystery Box</Text>
                  <Text style={styles.dealRestaurant}>Bakery Co.</Text>
                  <View style={styles.dealPriceRow}>
                    <Text style={styles.dealPrice}>Rp 30.000</Text>
                    <Text style={styles.dealOldPrice}>Rp 60.000</Text>
                  </View>
                </View>
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>

      {/* ─── BOTTOM NAVIGATION BAR ─── */}
      <View style={styles.bottomNav}>
        <Link href="/" asChild>
          <Pressable style={styles.bottomNavItem}>
            <Ionicons
              name={pathname === "/" ? "home" : "home-outline"}
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
                router.push("/");
              }}
            >
              <MaterialCommunityIcons
                name="storefront-outline"
                size={20}
                color="#065F46"
              />
              <Text style={[styles.navItemText, styles.navItemTextActive]}>
                Switch to Seller
              </Text>
            </Pressable>

            <Pressable
              style={styles.navItem}
              onPress={() => {
                setSidebarOpen(false);
                router.push("/profile");
              }}
            >
              <Ionicons name="person-outline" size={18} color="#57534E" />
              <Text style={styles.navItemText}>Profile</Text>
            </Pressable>
          </View>

          {/* Logout */}
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
    </LinearGradient>
  );
}

const shadowStyle = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  android: {
    elevation: 4,
  },
  default: {
    boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 402,
    alignSelf: "center",
    width: "100%",
  },
  scrollContent: {
    paddingBottom: 110, // space for bottom nav
  },

  /* Header */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  hamburgerButton: {
    width: 41,
    height: 41,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },

  /* Promo Banner Carousel */
  bannerWrapper: {
    marginHorizontal: 22,
    marginTop: 24,
  },
  bannerCard: {
    height: 159,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    overflow: "hidden",
    ...shadowStyle,
  },
  bannerTextWrap: {
    flex: 1,
    justifyContent: "center",
  },
  bannerBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 8,
  },
  bannerBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#324D3E",
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 6,
  },
  bannerSubtitle: {
    fontSize: 11,
    color: "#DAE6D8",
    lineHeight: 15,
    paddingRight: 8,
  },
  bannerDecor: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  bannerEmoji: {
    fontSize: 48,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(50, 77, 62, 0.3)",
  },
  dotActive: {
    width: 18,
    height: 6,
    backgroundColor: "#324D3E",
  },

  /* Categories */
  categoriesRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 30,
    marginHorizontal: 52,
    marginTop: 28,
  },
  categoryItem: {
    alignItems: "center",
    gap: 5,
  },
  categoryIconBox: {
    width: 74,
    height: 73,
    borderRadius: 25,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryIcon: {
    width: 40,
    height: 40,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#324D3E",
    textAlign: "center",
  },

  /* Deals */
  dealsWrapper: {
    marginHorizontal: 22,
    marginTop: 24,
  },
  dealsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  dealsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#324D3E",
  },
  dealsSeeAll: {
    fontSize: 14,
    fontWeight: "700",
    color: "#324D3E",
    textDecorationLine: "underline",
  },
  dealsRow: {
    flexDirection: "row",
    gap: 10,
  },
  dealCard: {
    flex: 1,
    height: 218,
    borderRadius: 20,
    backgroundColor: "#fff",
    overflow: "hidden",
    ...shadowStyle,
  },
  dealImage: {
    width: "100%",
    height: 130,
    resizeMode: "cover",
  },
  dealDiscountBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#DC2626",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  dealDiscountText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#fff",
  },
  dealInfo: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 10,
  },
  dealTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#324D3E",
  },
  dealRestaurant: {
    fontSize: 11,
    color: "#92AF8C",
    marginTop: 2,
  },
  dealPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  dealPrice: {
    fontSize: 13,
    fontWeight: "800",
    color: "#324D3E",
  },
  dealOldPrice: {
    fontSize: 10,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },

  /* Bottom Navigation */
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxWidth: 402,
    alignSelf: "center",
    width: "100%",
    height: 90,
    backgroundColor: "#92AF8C",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: Platform.OS === "ios" ? 20 : 12,
    paddingTop: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: { elevation: 12 },
      default: { boxShadow: "0 -4px 8px rgba(0,0,0,0.1)" },
    }),
  },
  bottomNavItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 6,
  },
  bottomNavLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },

  /* Sidebar */
  sidebarOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  sidebarDrawer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 316,
    backgroundColor: "#fff",
    flexDirection: "column",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 50,
      },
      android: { elevation: 10 },
      default: { boxShadow: "0 4px 50px 10px rgba(0,0,0,0.25)" },
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
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  navItemActive: {
    backgroundColor: "#ECFDF5",
  },
  navItemText: {
    fontSize: 14,
    color: "#57534E",
  },
  navItemTextActive: {
    color: "#065F46",
    fontWeight: "700",
  },
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
  logoutText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#DC2626",
  },
});
