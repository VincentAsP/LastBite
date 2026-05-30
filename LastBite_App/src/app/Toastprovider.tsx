import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
  useEffect,
} from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// === Types ===
export type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextType {
  show: (toast: Omit<ToastMessage, 'id'>) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const TOAST_DURATION = 3000; // 3 detik

// === Config style per type ===
const TYPE_CONFIG: Record<
  ToastType,
  { bg: string; border: string; iconColor: string; icon: any; titleColor: string }
> = {
  success: {
    bg: '#ECFDF5',
    border: '#065F46',
    iconColor: '#065F46',
    icon: 'checkmark-circle',
    titleColor: '#065F46',
  },
  error: {
    bg: '#FEE2E2',
    border: '#DC2626',
    iconColor: '#B91C1C',
    icon: 'alert-circle',
    titleColor: '#B91C1C',
  },
  info: {
    bg: '#DBEAFE',
    border: '#2563EB',
    iconColor: '#1E40AF',
    icon: 'information-circle',
    titleColor: '#1E40AF',
  },
};

// === Single Toast Item Component ===
function ToastItem({
  toast,
  onClose,
}: {
  toast: ToastMessage;
  onClose: (id: number) => void;
}) {
  const cfg = TYPE_CONFIG[toast.type];
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation slide-in + fade-in
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 60,
        friction: 10,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss
    const timer = setTimeout(() => handleClose(), TOAST_DURATION);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onClose(toast.id));
  };

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: cfg.bg,
          borderLeftColor: cfg.border,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <Ionicons name={cfg.icon} size={22} color={cfg.iconColor} />

      <View style={styles.toastContent}>
        <Text style={[styles.toastTitle, { color: cfg.titleColor }]}>
          {toast.title}
        </Text>
        {toast.description && (
          <Text style={styles.toastDesc}>{toast.description}</Text>
        )}
      </View>

      <Pressable onPress={handleClose} style={styles.closeBtn}>
        <Ionicons name="close" size={16} color="#6B7280" />
      </Pressable>
    </Animated.View>
  );
}

// === Provider Component ===
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const idCounter = useRef(0);

  const show = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = ++idCounter.current;
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback(
    (title: string, description?: string) => show({ type: 'success', title, description }),
    [show]
  );
  const error = useCallback(
    (title: string, description?: string) => show({ type: 'error', title, description }),
    [show]
  );
  const info = useCallback(
    (title: string, description?: string) => show({ type: 'info', title, description }),
    [show]
  );

  return (
    <ToastContext.Provider value={{ show, success, error, info }}>
      {children}

      {/* Toast container — fixed di atas */}
      <View pointerEvents="box-none" style={styles.toastContainer}>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

// === Hook ===
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    zIndex: 9999,
  },
  toast: {
    width: '100%',
    maxWidth: 380,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
      default: { boxShadow: '0 4px 12px 0 rgba(0,0,0,0.15)' },
    }),
  },
  toastContent: {
    flex: 1,
    gap: 2,
  },
  toastTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  toastDesc: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 16,
  },
  closeBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});