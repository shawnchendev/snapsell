import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { generateListingFromImage } from '../services/llmService';
import { colors } from '../theme/colors';
import type { GeneratedListing } from '../types/models';

export const CreateListingScreen = () => {
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [generatedListing, setGeneratedListing] = useState<GeneratedListing | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
  };

  const handleGenerate = async (): Promise<void> => {
    if (!selectedImageBase64) {
      Alert.alert('Upload photo first', 'Please select or capture a photo to generate AI listing.');
      return;
    }

    setLoading(true);

    const response = await generateListingFromImage(selectedImageBase64);

    setGeneratedListing(response);
    setLoading(false);
  };

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
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>Generating AI listing...</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: colors.ui.onPrimary,
    marginTop: 12,
    fontWeight: '700',
    fontSize: 13,
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
    marginTop: 6,
  },
  outputValue: {
    color: colors.ui.textPrimary,
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
