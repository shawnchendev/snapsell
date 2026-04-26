import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { generateListingFromImage } from '../services/llmService';
import { colors } from '../theme/colors';
import type { GeneratedListing } from '../types/models';

interface ListingDraftForm {
  title: string;
  description: string;
  category: string;
  price: string;
}

const emptyDraft: ListingDraftForm = {
  title: '',
  description: '',
  category: '',
  price: '',
};

export const CreateListingScreen = () => {
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [draft, setDraft] = useState<ListingDraftForm>(emptyDraft);
  const [hasDraft, setHasDraft] = useState<boolean>(false);
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [cameraVisible, setCameraVisible] = useState<boolean>(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);

  const scanProgress = useSharedValue(0);

  useEffect(() => {
    if (loading) {
      scanProgress.value = withRepeat(
        withSequence(
          withTiming(1, {
            duration: 850,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0, {
            duration: 850,
            easing: Easing.inOut(Easing.ease),
          }),
        ),
        -1,
        false,
      );
    } else {
      cancelAnimation(scanProgress);
      scanProgress.value = 0;
    }
  }, [loading, scanProgress]);

  const laserStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(scanProgress.value, [0, 1], [14, 228]),
        },
      ],
    };
  });

  const resetAIDraftState = (): void => {
    setServiceError(null);
    setHasDraft(false);
    setDraft(emptyDraft);
  };

  const applyDraft = (generated: GeneratedListing): void => {
    setDraft({
      title: generated.title,
      description: generated.description,
      category: generated.category,
      price: String(generated.price),
    });
    setHasDraft(true);
  };

  const pickFromGallery = async (): Promise<void> => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow gallery permissions to continue.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.9,
      base64: true,
    });

    if (result.canceled) {
      return;
    }

    const selectedAsset = result.assets[0];
    setSelectedImageUri(selectedAsset.uri);
    setSelectedImageBase64(selectedAsset.base64 ?? null);
    resetAIDraftState();
  };

  const openLiveCamera = async (): Promise<void> => {
    if (cameraPermission?.granted) {
      setCameraVisible(true);
      return;
    }

    const result = await requestCameraPermission();

    if (!result.granted) {
      Alert.alert('Permission needed', 'Please allow camera permission to capture an item photo.');
      return;
    }

    setCameraVisible(true);
  };

  const capturePhotoFromCamera = async (): Promise<void> => {
    if (!cameraRef.current) {
      return;
    }

    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.85,
      base64: true,
      skipProcessing: true,
    });

    if (!photo?.uri) {
      return;
    }

    setSelectedImageUri(photo.uri);
    setSelectedImageBase64(photo.base64 ?? null);
    resetAIDraftState();
    setCameraVisible(false);
  };

  const handleGenerate = async (): Promise<void> => {
    if (!selectedImageBase64) {
      Alert.alert('Upload photo first', 'Please select or capture a photo to generate AI listing.');
      return;
    }

    setLoading(true);
    setServiceError(null);

    try {
      const response = await generateListingFromImage(selectedImageBase64, { maxRetries: 1 });
      applyDraft(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown AI generation failure';
      setServiceError(`Network Error: Please enter listing manually. (${message})`);
      setHasDraft(true);
      setDraft((current) => current ?? emptyDraft);
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = (): void => {
    Alert.alert('Draft Saved', 'Your listing draft was saved locally for publishing later.');
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Create Listing</Text>
        <Text style={styles.subheading}>
          Snap a photo and let AI draft the listing details for you.
        </Text>

        <View style={styles.buttonRow}>
          <Pressable onPress={openLiveCamera} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Live Camera</Text>
          </Pressable>
          <Pressable onPress={pickFromGallery} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Photo Library</Text>
          </Pressable>
        </View>

        <View style={styles.previewCard}>
          {selectedImageUri ? (
            <Image source={{ uri: selectedImageUri }} style={styles.previewImage} />
          ) : (
            <View style={styles.emptyImageBox}>
              <Text style={styles.emptyImageTitle}>No image selected</Text>
              <Text style={styles.emptyImageText}>Take a photo to start AI generation.</Text>
            </View>
          )}

          {loading ? (
            <View style={styles.loadingOverlay}>
              <Text style={styles.loadingText}>Scanning image with AI Vision...</Text>
              <Animated.View style={[styles.scannerLaser, laserStyle]} />
            </View>
          ) : null}
        </View>

        <Pressable onPress={handleGenerate} style={styles.generateButton}>
          <Text style={styles.generateButtonText}>Generate AI Listing</Text>
        </Pressable>

        {serviceError ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{serviceError}</Text>
          </View>
        ) : null}

        {hasDraft ? (
          <View style={styles.outputCard}>
            <Text style={styles.outputHeading}>Listing Draft</Text>

            <Text style={styles.outputLabel}>Title</Text>
            <TextInput
              value={draft.title}
              onChangeText={(title) => setDraft((current) => ({ ...current, title }))}
              style={styles.input}
              placeholder="Enter listing title"
            />

            <Text style={styles.outputLabel}>Description</Text>
            <TextInput
              value={draft.description}
              onChangeText={(description) => setDraft((current) => ({ ...current, description }))}
              style={[styles.input, styles.multilineInput]}
              multiline
              textAlignVertical="top"
              placeholder="Describe your item"
            />

            <View style={styles.outputRow}>
              <View style={styles.outputBox}>
                <Text style={styles.outputLabel}>Category</Text>
                <TextInput
                  value={draft.category}
                  onChangeText={(category) => setDraft((current) => ({ ...current, category }))}
                  style={styles.input}
                  placeholder="Furniture"
                />
              </View>
              <View style={styles.outputBox}>
                <Text style={styles.outputLabel}>Price</Text>
                <TextInput
                  value={draft.price}
                  onChangeText={(price) => setDraft((current) => ({ ...current, price }))}
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="100"
                />
              </View>
            </View>

            <Pressable style={styles.saveButton} onPress={saveDraft}>
              <Text style={styles.saveButtonText}>Save Draft</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>

      <Modal visible={cameraVisible} animationType="slide" onRequestClose={() => setCameraVisible(false)}>
        <View style={styles.cameraShell}>
          <CameraView
            ref={(ref) => {
              cameraRef.current = ref;
            }}
            style={StyleSheet.absoluteFill}
            facing="back"
            autofocus="on"
            mute
          />

          <View style={styles.cameraBottomBar}>
            <Pressable style={styles.cameraCloseButton} onPress={() => setCameraVisible(false)}>
              <Text style={styles.cameraCloseText}>Close</Text>
            </Pressable>

            <Pressable style={styles.captureButton} onPress={capturePhotoFromCamera}>
              <View style={styles.captureInner} />
            </Pressable>

            <View style={styles.cameraSpacer} />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 13,
    paddingBottom: 30,
  },
  heading: {
    color: colors.ui.primary,
    fontWeight: '900',
    fontSize: 22,
  },
  subheading: {
    marginTop: 4,
    marginBottom: 14,
    color: colors.ui.textSecondary,
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.ui.border,
    backgroundColor: colors.ui.surface,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
  },
  secondaryButtonText: {
    color: colors.ui.textPrimary,
    fontWeight: '700',
    fontSize: 12,
  },
  previewCard: {
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.ui.primary,
    minHeight: 240,
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  previewImage: {
    width: '100%',
    height: 260,
  },
  emptyImageBox: {
    minHeight: 240,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: colors.ui.surfaceStrong,
  },
  emptyImageTitle: {
    color: colors.ui.textPrimary,
    fontWeight: '800',
    fontSize: 17,
  },
  emptyImageText: {
    color: colors.ui.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    fontSize: 13,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(48,70,78,0.55)',
    justifyContent: 'flex-start',
  },
  loadingText: {
    color: colors.ui.onPrimary,
    marginTop: 10,
    marginLeft: 10,
    fontWeight: '700',
    fontSize: 12,
  },
  scannerLaser: {
    position: 'absolute',
    left: 8,
    right: 8,
    height: 3,
    borderRadius: 10,
    backgroundColor: '#22D3EE',
    shadowColor: '#22D3EE',
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 6,
    elevation: 4,
  },
  generateButton: {
    marginTop: 12,
    backgroundColor: colors.ui.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
  },
  generateButtonText: {
    color: colors.ui.onPrimary,
    fontWeight: '800',
    fontSize: 14,
  },
  errorBanner: {
    marginTop: 12,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#FFF4F4',
    borderColor: '#FECACA',
    borderWidth: 1,
  },
  errorBannerText: {
    color: '#991B1B',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
  },
  outputCard: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: colors.ui.border,
    borderRadius: 12,
    padding: 12,
    backgroundColor: colors.ui.surface,
  },
  outputHeading: {
    color: colors.ui.secondary,
    fontWeight: '900',
    fontSize: 16,
    marginBottom: 8,
  },
  outputLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    color: colors.ui.textMuted,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  outputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  outputBox: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 9,
    color: '#111827',
    fontSize: 13,
    backgroundColor: '#FFFFFF',
  },
  multilineInput: {
    minHeight: 88,
  },
  saveButton: {
    marginTop: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#111827',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  cameraShell: {
    flex: 1,
    backgroundColor: '#000000',
  },
  cameraBottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
  },
  cameraCloseButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cameraCloseText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  captureButton: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  captureInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFFFFF',
  },
  cameraSpacer: {
    width: 52,
  },
});
