import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@shopify/restyle';
import { Box, Text } from '../theme/restyle';
import type { Theme } from '../theme/theme';
import type { CreateListingStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<CreateListingStackParamList, 'camera'>;

export const CameraScreen = () => {
  const navigation = useNavigation<Nav>();
  const parentNavigation = useNavigation();
  const theme = useTheme<Theme>();
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'front' | 'back'>('back');

  const handleClose = useCallback(() => {
    parentNavigation.goBack();
  }, [parentNavigation]);

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.9 });
      if (photo?.base64) {
        navigation.navigate('review', {
          imageUri: photo.uri,
          imageBase64: photo.base64,
        });
      }
    } catch {
      Alert.alert('Error', 'Failed to capture photo.');
    }
  }, [navigation]);

  const handlePickFromLibrary = useCallback(async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Please allow gallery permissions.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.9,
      base64: true,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    if (asset.base64) {
      navigation.navigate('review', {
        imageUri: asset.uri,
        imageBase64: asset.base64,
      });
    }
  }, [navigation]);

  const toggleFacing = useCallback(() => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  }, []);

  if (!permission) {
    return (
      <Box flex={1} backgroundColor="background" alignItems="center" justifyContent="center">
        <ActivityIndicator size="large" color={theme.colors.brandDark} />
      </Box>
    );
  }

  if (!permission.granted) {
    return (
      <Box flex={1} backgroundColor="background" alignItems="center" justifyContent="center" padding="xl">
        <Text color="textPrimary" fontSize={18} fontWeight="800" textAlign="center">
          Camera access needed
        </Text>
        <Text marginTop="s" color="textSecondary" fontSize={13} textAlign="center" lineHeight={19}>
          Allow camera access to snap a photo of your item for AI listing generation.
        </Text>
        <Pressable onPress={requestPermission} style={styles.mt16}>
          <Box backgroundColor="brandDark" borderRadius="m" paddingHorizontal="xl" paddingVertical="m">
            <Text color="onPrimary" fontWeight="800" fontSize={14}>
              Grant Permission
            </Text>
          </Box>
        </Pressable>
      </Box>
    );
  }

  return (
    <Box flex={1} backgroundColor="background">
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <Box
          style={{ paddingTop: insets.top + 8 }}
          paddingHorizontal="m"
          paddingBottom="s"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Pressable onPress={handleClose}>
            <Box
              width={34}
              height={34}
              borderRadius="pill"
              backgroundColor="card"
              borderWidth={1}
              borderColor="border"
              alignItems="center"
              justifyContent="center"
            >
              <Ionicons name="close" size={20} color={theme.colors.textPrimary} />
            </Box>
          </Pressable>

          <Text color="onPrimary" fontWeight="800" fontSize={14}>
            Snap Your Item
          </Text>

          <Box width={34} />
        </Box>

        <Box
          style={{ paddingBottom: insets.bottom + 20 }}
          paddingHorizontal="xl"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Pressable onPress={handlePickFromLibrary}>
            <Box
              width={44}
              height={44}
              borderRadius="m"
              backgroundColor="card"
              borderWidth={2}
              borderColor="border"
              alignItems="center"
              justifyContent="center"
              overflow="hidden"
            >
              <Ionicons name="images-outline" size={22} color={theme.colors.textPrimary} />
            </Box>
          </Pressable>

          <Pressable onPress={handleCapture}>
            <Box
              width={72}
              height={72}
              borderRadius="pill"
              borderWidth={4}
              borderColor="onPrimary"
              alignItems="center"
              justifyContent="center"
            >
              <Box width={58} height={58} borderRadius="pill" backgroundColor="onPrimary" />
            </Box>
          </Pressable>

          <Pressable onPress={toggleFacing}>
            <Box
              width={44}
              height={44}
              borderRadius="pill"
              backgroundColor="card"
              borderWidth={1}
              borderColor="border"
              alignItems="center"
              justifyContent="center"
            >
              <Ionicons name="sync-outline" size={20} color={theme.colors.textPrimary} />
            </Box>
          </Pressable>
        </Box>
      </CameraView>
    </Box>
  );
};

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  mt16: {
    marginTop: 16,
  },
});
