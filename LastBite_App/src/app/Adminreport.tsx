import { useState, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

// === Types ===
type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';
type TargetType = 'seller' | 'order' | 'item' | 'review';

interface Report {
  id: string;
  reporterName: string;
  reporterEmail: string;
  targetType: TargetType;
  targetName: string;    // nama seller / nama item dilaporkan
  targetId: string;
  description: string;
  photos: string[];      // URL foto
  status: ReportStatus;
  createdAt: string;     // ISO atau dd-mm-yyyy
}

// === Dummy data (nanti diganti fetch dari Supabase) ===
const INITIAL_REPORTS: Report[] = [
  {
    id: 'RPT-001',
    reporterName: 'Andi Pratama',
    reporterEmail: 'andi.p@gmail.com',
    targetType: 'seller',
    targetName: 'Warung Bu Lala',
    targetId: 'SLR-9821',
    description:
      'Pesanan saya tidak sesuai. Saya pesan ayam penyet 2 porsi, tapi yang datang cuma 1 porsi dan nasinya sudah dingin. Ketika saya komplain di chat, seller tidak merespons sama sekali selama 2 jam.',
    photos: [
      'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300',
    ],
    status: 'pending',
    createdAt: '28-05-2026',
  },
  {
    id: 'RPT-002',
    reporterName: 'Sinta Dewi',
    reporterEmail: 'sinta.d@gmail.com',
    targetType: 'item',
    targetName: 'Bakso Special Mantap',
    targetId: 'ITM-4421',
    description:
      'Foto di menu sama sekali tidak sesuai dengan aslinya. Di foto kelihatan bakso besar dan banyak, tapi aslinya bakso kecil cuma 3 biji. Menyesatkan.',
    photos: [
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=300',
    ],
    status: 'pending',
    createdAt: '27-05-2026',
  },
  {
    id: 'RPT-003',
    reporterName: 'Budi Santoso',
    reporterEmail: 'budi.s@gmail.com',
    targetType: 'seller',
    targetName: 'Nasi Goreng Pak Eko',
    targetId: 'SLR-7712',
    description:
      'Seller ini sudah 3 kali batalin order saya sepihak tanpa alasan jelas. Tolong ditindak.',
    photos: [],
    status: 'reviewed',
    createdAt: '25-05-2026',
  },
  {
    id: 'RPT-004',
    reporterName: 'Maya Lestari',
    reporterEmail: 'maya.l@gmail.com',
    targetType: 'review',
    targetName: 'Review on Sate Madura Cak Mat',
    targetId: 'REV-1023',
    description: 'Review ini fake, kayaknya spam dari kompetitor.',
    photos: [],
    status: 'resolved',
    createdAt: '22-05-2026',
  },
];

const STATUS_CONFIG: Record<
  ReportStatus,
  { label: string; bg: string; color: string; dot: string }
> = {
  pending: { label: 'Pending', bg: '#FEF3C7', color: '#92400E', dot: '#B45309' },
  reviewed: { label: 'Reviewed', bg: '#DBEAFE', color: '#1E40AF', dot: '#2563EB' },
  resolved: { label: 'Resolved', bg: '#D1FAE5', color: '#065F46', dot: '#059669' },
  dismissed: { label: 'Dismissed', bg: '#E5E7EB', color: '#4B5563', dot: '#6B7280' },
};

const FILTERS: { key: ReportStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'reviewed', label: 'Reviewed' },
  { key: 'resolved', label: 'Resolved' },
];

export default function AdminReports() {
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [filter, setFilter] = useState<ReportStatus | 'all'>('all');
  const [selected, setSelected] = useState<Report | null>(null);
  const [suspendModal, setSuspendModal] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');

  // Filtered list
  const filtered = useMemo(() => {
    if (filter === 'all') return reports;
    return reports.filter((r) => r.status === filter);
  }, [reports, filter]);

  // Stats
  const stats = useMemo(() => ({
    pending: reports.filter((r) => r.status === 'pending').length,
    reviewed: reports.filter((r) => r.status === 'reviewed').length,
    resolved: reports.filter((r) => r.status === 'resolved').length,
  }), [reports]);

  // Mark sebagai reviewed
  const handleMarkReviewed = () => {
    if (!selected) return;
    setReports((prev) =>
      prev.map((r) => (r.id === selected.id ? { ...r, status: 'reviewed' } : r))
    );
    setSelected(null);
  };

  // Dismiss laporan
  const handleDismiss = () => {
    if (!selected) return;
    Alert.alert(
      'Dismiss report?',
      'This report will be marked as dismissed and the target will not be penalized.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Dismiss',
          style: 'destructive',
          onPress: () => {
            setReports((prev) =>
              prev.map((r) =>
                r.id === selected.id ? { ...r, status: 'dismissed' } : r
              )
            );
            setSelected(null);
          },
        },
      ]
    );
  };

  // Buka modal suspend
  const handleOpenSuspend = () => {
    setSuspendReason('');
    setSuspendModal(true);
  };

  // Confirm suspend
  const handleConfirmSuspend = () => {
    if (!selected || suspendReason.trim().length < 10) return;

    // TODO: backend call untuk suspend seller/item
    console.log('Suspend:', {
      targetType: selected.targetType,
      targetId: selected.targetId,
      reason: suspendReason,
    });

    setReports((prev) =>
      prev.map((r) =>
        r.id === selected.id ? { ...r, status: 'resolved' } : r
      )
    );
    setSuspendModal(false);
    setSelected(null);
  };

  return (
    <LinearGradient colors={['#DAE6D8', '#92AF8C']} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.iconButton} onPress={() => router.push('/')}>
            <Ionicons name="chevron-back" size={20} color="#1F3A2E" />
          </Pressable>
          <Text style={styles.headerTitle}>Admin · Reports</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderLeftColor: '#B45309' }]}>
            <Text style={styles.statValue}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#2563EB' }]}>
            <Text style={styles.statValue}>{stats.reviewed}</Text>
            <Text style={styles.statLabel}>Reviewed</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#059669' }]}>
            <Text style={styles.statValue}>{stats.resolved}</Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
        </View>

        {/* Filter pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTERS.map((f) => (
            <Pressable
              key={f.key}
              style={[
                styles.filterPill,
                filter === f.key && styles.filterPillActive,
              ]}
              onPress={() => setFilter(f.key)}
            >
              <Text
                style={[
                  styles.filterPillText,
                  filter === f.key && styles.filterPillTextActive,
                ]}
              >
                {f.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Report list */}
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="clipboard-check-outline"
              size={42}
              color="#92AF8C"
            />
            <Text style={styles.emptyText}>No reports in this category</Text>
          </View>
        ) : (
          <View style={styles.reportList}>
            {filtered.map((report) => {
              const cfg = STATUS_CONFIG[report.status];
              return (
                <Pressable
                  key={report.id}
                  style={styles.reportCard}
                  onPress={() => setSelected(report)}
                >
                  <View style={styles.reportHeader}>
                    <Text style={styles.reportId}>{report.id}</Text>
                    <View
                      style={[styles.statusBadge, { backgroundColor: cfg.bg }]}
                    >
                      <View style={[styles.statusDot, { backgroundColor: cfg.dot }]} />
                      <Text style={[styles.statusText, { color: cfg.color }]}>
                        {cfg.label}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.targetRow}>
                    <MaterialCommunityIcons
                      name={
                        report.targetType === 'seller'
                          ? 'storefront-outline'
                          : report.targetType === 'item'
                          ? 'food-outline'
                          : report.targetType === 'order'
                          ? 'receipt'
                          : 'comment-text-outline'
                      }
                      size={14}
                      color="#7A8A7A"
                    />
                    <Text style={styles.targetType}>
                      {report.targetType.toUpperCase()}
                    </Text>
                    <Text style={styles.targetName} numberOfLines={1}>
                      {report.targetName}
                    </Text>
                  </View>

                  <Text style={styles.reportDesc} numberOfLines={2}>
                    {report.description}
                  </Text>

                  <View style={styles.reportFooter}>
                    <Text style={styles.reporterText}>
                      by {report.reporterName}
                    </Text>
                    <Text style={styles.dateText}>{report.createdAt}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* === Detail Modal === */}
      <Modal
        visible={selected !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setSelected(null)}
      >
        {selected && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>{selected.id}</Text>
                  <Text style={styles.modalSubtitle}>{selected.createdAt}</Text>
                </View>
                <Pressable
                  onPress={() => setSelected(null)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={20} color="#324D3E" />
                </Pressable>
              </View>

              <ScrollView
                style={styles.modalBody}
                showsVerticalScrollIndicator={false}
              >
                {/* Status badge */}
                <View
                  style={[
                    styles.modalStatusBadge,
                    { backgroundColor: STATUS_CONFIG[selected.status].bg },
                  ]}
                >
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: STATUS_CONFIG[selected.status].dot },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      { color: STATUS_CONFIG[selected.status].color },
                    ]}
                  >
                    {STATUS_CONFIG[selected.status].label}
                  </Text>
                </View>

                {/* Reporter */}
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Reported by</Text>
                  <Text style={styles.detailValue}>{selected.reporterName}</Text>
                  <Text style={styles.detailSubvalue}>{selected.reporterEmail}</Text>
                </View>

                {/* Target */}
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Target</Text>
                  <Text style={styles.detailValue}>{selected.targetName}</Text>
                  <Text style={styles.detailSubvalue}>
                    {selected.targetType.toUpperCase()} · {selected.targetId}
                  </Text>
                </View>

                {/* Description */}
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Description</Text>
                  <Text style={styles.descriptionText}>{selected.description}</Text>
                </View>

                {/* Photos */}
                {selected.photos.length > 0 && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>
                      Photos ({selected.photos.length})
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
                    >
                      {selected.photos.map((uri, idx) => (
                        <Image
                          key={idx}
                          source={{ uri }}
                          style={styles.evidencePhoto}
                        />
                      ))}
                    </ScrollView>
                  </View>
                )}
              </ScrollView>

              {/* Action Buttons */}
              {selected.status !== 'resolved' &&
              selected.status !== 'dismissed' ? (
                <View style={styles.actionRow}>
                  <Pressable
                    style={styles.dismissButton}
                    onPress={handleDismiss}
                  >
                    <Text style={styles.dismissButtonText}>Dismiss</Text>
                  </Pressable>

                  {selected.status === 'pending' && (
                    <Pressable
                      style={styles.reviewButton}
                      onPress={handleMarkReviewed}
                    >
                      <Text style={styles.reviewButtonText}>Mark Reviewed</Text>
                    </Pressable>
                  )}

                  <Pressable
                    style={styles.suspendButton}
                    onPress={handleOpenSuspend}
                  >
                    <MaterialCommunityIcons
                      name="cancel"
                      size={16}
                      color="#fff"
                    />
                    <Text style={styles.suspendButtonText}>Suspend</Text>
                  </Pressable>
                </View>
              ) : (
                <View style={styles.closedNotice}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color="#065F46"
                  />
                  <Text style={styles.closedNoticeText}>
                    This report has been {selected.status}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </Modal>

      {/* === Suspend Confirmation Modal === */}
      <Modal
        visible={suspendModal}
        animationType="fade"
        transparent
        onRequestClose={() => setSuspendModal(false)}
      >
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmModal}>
            <View style={styles.confirmIconBox}>
              <MaterialCommunityIcons
                name="cancel"
                size={28}
                color="#DC2626"
              />
            </View>

            <Text style={styles.confirmTitle}>Suspend this {selected?.targetType}?</Text>
            <Text style={styles.confirmDesc}>
              {selected?.targetName} will be hidden from the marketplace and
              cannot accept new orders until reinstated.
            </Text>

            <View style={styles.reasonWrap}>
              <Text style={styles.reasonLabel}>Internal reason</Text>
              <TextInput
                style={styles.reasonInput}
                value={suspendReason}
                onChangeText={setSuspendReason}
                placeholder="e.g., Multiple verified complaints about food quality..."
                placeholderTextColor="#9BA89B"
                multiline
                textAlignVertical="top"
              />
              {suspendReason.length > 0 && suspendReason.trim().length < 10 && (
                <Text style={styles.reasonHint}>
                  Please provide at least 10 characters
                </Text>
              )}
            </View>

            <View style={styles.confirmActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setSuspendModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.confirmSuspendButton,
                  suspendReason.trim().length < 10 &&
                    styles.confirmSuspendButtonDisabled,
                ]}
                onPress={handleConfirmSuspend}
                disabled={suspendReason.trim().length < 10}
              >
                <Text style={styles.confirmSuspendText}>Confirm Suspend</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  android: { elevation: 3 },
  default: { boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)' },
});

const styles = StyleSheet.create({
  container: { flex: 1, maxWidth: 402, alignSelf: 'center', width: '100%' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 48 },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadowStyle,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F3A2E',
  },

  /* Stats */
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderLeftWidth: 4,
    ...shadowStyle,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F3A2E',
  },
  statLabel: {
    fontSize: 11,
    color: '#7A8A7A',
    marginTop: 2,
  },

  /* Filter pills */
  filterRow: {
    gap: 8,
    paddingVertical: 8,
    marginBottom: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  filterPillActive: {
    backgroundColor: '#324D3E',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#324D3E',
  },
  filterPillTextActive: {
    color: '#fff',
  },

  /* Empty */
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: {
    fontSize: 13,
    color: '#5F6B5F',
  },

  /* Report cards */
  reportList: { gap: 10 },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    ...shadowStyle,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportId: {
    fontSize: 12,
    fontWeight: '700',
    color: '#324D3E',
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: 'monospace',
    }),
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  targetType: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7A8A7A',
    letterSpacing: 0.5,
  },
  targetName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#1F3A2E',
  },
  reportDesc: {
    fontSize: 12,
    color: '#5F6B5F',
    lineHeight: 17,
    marginBottom: 8,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reporterText: {
    fontSize: 11,
    color: '#7A8A7A',
  },
  dateText: {
    fontSize: 11,
    color: '#7A8A7A',
  },

  /* Modal Overlay */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 24,
    width: '100%',
    maxWidth: 402,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F3A2E',
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: 'monospace',
    }),
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#7A8A7A',
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DAE6D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  modalStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  detailSection: {
    marginBottom: 18,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7A8A7A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F3A2E',
  },
  detailSubvalue: {
    fontSize: 12,
    color: '#7A8A7A',
    marginTop: 2,
  },
  descriptionText: {
    fontSize: 13,
    color: '#324D3E',
    lineHeight: 19,
    backgroundColor: '#F9FAF9',
    padding: 12,
    borderRadius: 10,
  },
  evidencePhoto: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },

  /* Action row */
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  dismissButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  dismissButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
  reviewButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
  },
  reviewButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E40AF',
  },
  suspendButton: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#DC2626',
  },
  suspendButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  closedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  closedNoticeText: {
    fontSize: 13,
    color: '#5F6B5F',
  },

  /* Confirm modal */
  confirmOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  confirmModal: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  confirmIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  confirmTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F3A2E',
    marginBottom: 8,
    textAlign: 'center',
  },
  confirmDesc: {
    fontSize: 13,
    color: '#5F6B5F',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  reasonWrap: {
    width: '100%',
    marginBottom: 20,
  },
  reasonLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#324D3E',
    marginBottom: 6,
  },
  reasonInput: {
    minHeight: 80,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#F9FAF9',
    borderWidth: 1,
    borderColor: '#E5E7E5',
    fontSize: 13,
    color: '#1F3A2E',
  },
  reasonHint: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 6,
  },
  confirmActions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5563',
  },
  confirmSuspendButton: {
    flex: 1.2,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#DC2626',
    alignItems: 'center',
  },
  confirmSuspendButtonDisabled: {
    opacity: 0.5,
  },
  confirmSuspendText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
});