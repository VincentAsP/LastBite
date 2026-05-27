import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const MAX_PHOTOS = 4;
const MAX_DESC_LENGTH = 500;

export default function ReportPage() {
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  const handlePickImage = async () => {
    if (photos.length >= MAX_PHOTOS) {
      Alert.alert('Limit reached', `You can only upload up to ${MAX_PHOTOS} photos.`);
      return;
    }

    // minta permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'We need access to your photos to attach images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: MAX_PHOTOS - photos.length,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newUris = result.assets.map((a) => a.uri);
      setPhotos((prev) => [...prev, ...newUris].slice(0, MAX_PHOTOS));
    }
  };

  const handleRemovePhoto = (uri: string) => {
    setPhotos((prev) => prev.filter((p) => p !== uri));
  };

  const handleSubmit = () => {
    if (description.trim().length < 10) return;

    // TODO: kirim ke backend (description + photos via FormData)
    console.log('Submit report:', { description, photos });
    router.push('/finishreport');
  };

  const isValid = description.trim().length >= 10;

  return (
    <LinearGradient colors={['#DAE6D8', '#92AF8C']} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={20} color="#1F3A2E" />
          </Pressable>
          <Pressable style={styles.iconButton}>
            <Ionicons name="settings-outline" size={20} color="#1F3A2E" />
          </Pressable>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Help us understand{'\n'}your report</Text>
          <Text style={styles.subtitle}>
            Tell us what happened. Add photos if it helps explain the issue.
          </Text>
        </View>

        {/* Description input */}
        <View style={styles.fieldGroup}>
          <View style={styles.fieldHeader}>
            <Text style={styles.fieldLabel}>Description</Text>
            <Text style={styles.fieldCounter}>
              {description.length}/{MAX_DESC_LENGTH}
            </Text>
          </View>
          <View style={styles.textAreaWrap}>
            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={(t) => setDescription(t.slice(0, MAX_DESC_LENGTH))}
              placeholder="Describe what went wrong with your order, the item, or the seller..."
              placeholderTextColor="#9BA89B"
              multiline
              textAlignVertical="top"
            />
          </View>
          {description.length > 0 && description.trim().length < 10 && (
            <Text style={styles.errorHint}>
              Please provide at least 10 characters
            </Text>
          )}
        </View>

        {/* Photo upload */}
        <View style={styles.fieldGroup}>
          <View style={styles.fieldHeader}>
            <Text style={styles.fieldLabel}>Photos (optional)</Text>
            <Text style={styles.fieldCounter}>
              {photos.length}/{MAX_PHOTOS}
            </Text>
          </View>

          <View style={styles.photoGrid}>
            {photos.map((uri) => (
              <View key={uri} style={styles.photoItem}>
                <Image source={{ uri }} style={styles.photoImage} />
                <Pressable
                  style={styles.photoRemove}
                  onPress={() => handleRemovePhoto(uri)}
                >
                  <Ionicons name="close" size={14} color="#fff" />
                </Pressable>
              </View>
            ))}

            {photos.length < MAX_PHOTOS && (
              <Pressable style={styles.photoAddButton} onPress={handlePickImage}>
                <MaterialCommunityIcons
                  name="camera-plus-outline"
                  size={24}
                  color="#324D3E"
                />
                <Text style={styles.photoAddText}>Add</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Submit */}
        <Pressable
          style={[styles.submitButton, !isValid && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!isValid}
        >
          <Text style={styles.submitButtonText}>Submit Report</Text>
        </Pressable>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
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

  /* Title */
  titleSection: { marginBottom: 24 },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F3A2E',
    lineHeight: 32,
    marginBottom: 8,
  },
  subtitle: { fontSize: 13, color: '#5F5E5B', lineHeight: 18 },

  /* Field group */
  fieldGroup: { marginBottom: 24 },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#324D3E',
  },
  fieldCounter: {
    fontSize: 11,
    color: '#7A8A7A',
  },

  /* Text area */
  textAreaWrap: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    ...shadowStyle,
  },
  textArea: {
    minHeight: 130,
    fontSize: 14,
    color: '#1F3A2E',
    lineHeight: 20,
    padding: 0,
  },
  errorHint: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 6,
    paddingHorizontal: 2,
  },

  /* Photo grid */
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  photoItem: {
    width: 78,
    height: 78,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    ...shadowStyle,
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoRemove: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoAddButton: {
    width: 78,
    height: 78,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1.5,
    borderColor: '#92AF8C',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  photoAddText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#324D3E',
  },

  /* Submit */
  submitButton: {
    backgroundColor: '#324D3E',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#324D3E',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: { elevation: 6 },
      default: { boxShadow: '0 6px 12px 0 rgba(50,77,62,0.3)' },
    }),
  },
  submitButtonDisabled: { opacity: 0.4 },
  submitButtonText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});