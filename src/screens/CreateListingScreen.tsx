import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
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
import type { GeneratedListing } from '../types/models';

export const CreateListingScreen = () => {
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [generatedListing, setGeneratedListing] = useState<GeneratedListing | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fatalGenerationError, setFatalGenerationError] = useState<Error | null>(null);

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
    setGeneratedListing(null);
    setFatalGenerationError(null);
  };

  const openCamera = async (): Promise<void> => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow camera permissions to continue.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.9,
      base64: true,
      allowsEditing: true,
    });

    if (result.canceled) {
      return;
    }

    const selectedAsset = result.assets[0];
    setSelectedImageUri(selectedAsset.uri);
    setSelectedImageBase64(selectedAsset.base64 ?? null);
    setGeneratedListing(null);
    setFatalGenerationError(null);
  };

  const handleGenerate = async (): Promise<void> => {
    if (!selectedImageBase64) {
      Alert.alert('Upload photo first', 'Please select or capture a photo to generate AI listing.');
      return;
    }

    setLoading(true);
    setFatalGenerationError(null);

    try {
      const response = await generateListingFromImage(selectedImageBase64);
      setGeneratedListing(response);
    } catch (error) {
      setFatalGenerationError(error instanceof Error ? error : new Error('Unknown AI failure'));
    } finally {
      setLoading(false);
    }
  };

  if (fatalGenerationError) {
    throw fatalGenerationError;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create Listing</Text>
      <Text style={styles.subheading}>
        Snap a photo and let AI draft the listing details for you.
      </Text>

      <View style={styles.buttonRow}>
        <Pressable onPress={openCamera} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Use Camera</Text>
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

      {generatedListing ? (
        <View style={styles.outputCard}>
          <Text style={styles.outputHeading}>AI Draft</Text>
          <Text style={styles.outputLabel}>Title</Text>
          <Text style={styles.outputValue}>{generatedListing.title}</Text>

          <Text style={styles.outputLabel}>Description</Text>
          <Text style={styles.outputValue}>{generatedListing.description}</Text>

          <View style={styles.outputRow}>
            <View style={styles.outputBox}>
              <Text style={styles.outputLabel}>Category</Text>
              <Text style={styles.outputValue}>{generatedListing.category}</Text>
            </View>
            <View style={styles.outputBox}>
              <Text style={styles.outputLabel}>Price</Text>
              <Text style={styles.outputValue}>${generatedListing.price}</Text>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 13,
    paddingBottom: 20,
  },
  heading: {
    color: '#091E42',
    fontWeight: '900',
    fontSize: 22,
  },
  subheading: {
    marginTop: 4,
    marginBottom: 14,
    color: '#6B778C',
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#BEC8DA',
    backgroundColor: '#FFFFFF',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
  },
  secondaryButtonText: {
    color: '#172B4D',
    fontWeight: '700',
    fontSize: 12,
  },
  previewCard: {
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#111827',
    minHeight: 240,
    borderWidth: 1,
    borderColor: '#CBD5E1',
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
    backgroundColor: '#E5E7EB',
  },
  emptyImageTitle: {
    color: '#111827',
    fontWeight: '800',
    fontSize: 17,
  },
  emptyImageText: {
    color: '#374151',
    textAlign: 'center',
    marginTop: 6,
    fontSize: 13,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-start',
  },
  loadingText: {
    color: '#E5E7EB',
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
    backgroundColor: '#0052CC',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  outputCard: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#DBE1EB',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  outputHeading: {
    color: '#0052CC',
    fontWeight: '900',
    fontSize: 16,
    marginBottom: 8,
  },
  outputLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    color: '#6B7280',
    fontWeight: '700',
    marginTop: 6,
  },
  outputValue: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  outputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  outputBox: {
    flex: 1,
  },
});
