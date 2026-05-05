import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@shopify/restyle';
import { Dropdown } from '../components/Dropdown';
import { TextField, TextArea } from '../components/FormFields';
import { Box, Text } from '../theme/restyle';
import type { Theme } from '../theme/theme';
import { generateListingFromImage } from '../services/llmService';
import type { CreateListingStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<CreateListingStackParamList, 'review'>;

const CATEGORIES = [
  'Outdoor',
  'Home Improvement',
  'Automotive',
  'Furniture',
  'Clothing',
  'Electronics',
  'Appliances',
  'Sports',
  'Tools',
  'Gaming',
  'Computers',
  'Photography',
  'Kids',
  'Music',
  'Fitness',
];

export const ReviewListingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<Props['route']>();
  const theme = useTheme<Theme>();
  const insets = useSafeAreaInsets();

  const { imageUri, imageBase64 } = route.params;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const runGeneration = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await generateListingFromImage(imageBase64);
      setTitle(response.title);
      setCategory(response.category);
      setDescription(response.description);
      setPrice(String(response.price));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [imageBase64]);

  useEffect(() => {
    void runGeneration();
  }, [runGeneration]);

  return (
    <Box flex={1} backgroundColor="background">
      {/* Header */}
      <Box
        style={{ paddingTop: insets.top + 8 }}
        paddingHorizontal="m"
        paddingBottom="s"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Pressable onPress={() => navigation.goBack()}>
          <Box flexDirection="row" alignItems="center" gap="xs">
            <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
            <Text color="textPrimary" fontSize={13} fontWeight="700">Retake</Text>
          </Box>
        </Pressable>

        <Text color="textPrimary" fontWeight="800" fontSize={16}>
          Review Details
        </Text>

        <Pressable onPress={() => navigation.getParent()?.goBack()}>
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
      </Box>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Status banner */}
        {loading && (
          <Box
            marginHorizontal="m"
            marginBottom="m"
            borderRadius="m"
            backgroundColor="chipBlueBg"
            padding="m"
            flexDirection="row"
            alignItems="center"
            gap="s"
          >
            <ActivityIndicator size="small" color={theme.colors.brandDark} />
            <Box flex={1}>
              <Text color="textPrimary" fontSize={12} fontWeight="700">AI Processing...</Text>
              <Text color="textSecondary" fontSize={11} marginTop="xs">
                Analyzing your photo and generating listing details.
              </Text>
            </Box>
          </Box>
        )}

        {!loading && !error && title !== '' && (
          <Box
            marginHorizontal="m"
            marginBottom="m"
            borderRadius="m"
            backgroundColor="warmBg"
            padding="m"
            flexDirection="row"
            alignItems="center"
            gap="s"
          >
            <Ionicons name="checkmark-circle" size={22} color={theme.colors.warmText} />
            <Box flex={1}>
              <Text color="warmText" fontSize={12} fontWeight="700">AI Processing Complete</Text>
              <Text color="textSecondary" fontSize={11} marginTop="xs">
                Review and edit the details below before publishing.
              </Text>
            </Box>
          </Box>
        )}

        {!loading && error && (
          <Box
            marginHorizontal="m"
            marginBottom="m"
            borderRadius="m"
            backgroundColor="chipPinkBg"
            padding="m"
            flexDirection="row"
            alignItems="center"
            gap="s"
          >
            <Ionicons name="alert-circle" size={22} color={theme.colors.chipPinkText} />
            <Box flex={1}>
              <Text color="chipPinkText" fontSize={12} fontWeight="700">Generation Failed</Text>
              <Text color="textSecondary" fontSize={11} marginTop="xs">{error}</Text>
            </Box>
            <Pressable onPress={runGeneration}>
              <Box
                backgroundColor="chipPinkBg"
                borderRadius="pill"
                borderWidth={1}
                borderColor="chipPinkText"
                paddingHorizontal="s"
                paddingVertical="xs"
              >
                <Text color="chipPinkText" fontSize={11} fontWeight="700">Retry</Text>
              </Box>
            </Pressable>
          </Box>
        )}

        {/* Image preview */}
        <Box marginHorizontal="m" borderRadius="l" overflow="hidden">
          <Image source={{ uri: imageUri }} style={styles.image} />
        </Box>

        {/* Editable form */}
        <Box paddingHorizontal="m" marginTop="l" gap="m">
          <TextField
            label="Listing Title"
            value={loading ? '' : title}
            onChangeText={setTitle}
            placeholder={loading ? 'Generating...' : 'Enter a title'}
          />

          <Dropdown
            label="Category"
            value={loading ? '' : category}
            options={CATEGORIES}
            onSelect={setCategory}
            placeholder={loading ? 'Generating...' : 'Select a category'}
          />

          <TextArea
            label="Description"
            value={loading ? '' : description}
            onChangeText={setDescription}
            placeholder={loading ? 'Generating...' : 'Describe your item'}
          />

          <TextField
            label="Price ($)"
            value={loading ? '' : price}
            onChangeText={setPrice}
            placeholder={loading ? 'Generating...' : 'Enter price'}
          />
        </Box>

        {/* Actions */}
        <Box paddingHorizontal="m" marginTop="xl">
          <Pressable
            onPress={() => Alert.alert('Published', 'Your listing has been published!')}
            disabled={loading}
          >
            <Box
              backgroundColor="brand"
              borderRadius="m"
              paddingVertical="m"
              alignItems="center"
              flexDirection="row"
              justifyContent="center"
              gap="s"
              opacity={loading ? 0.5 : 1}
            >
              <Ionicons name="paper-plane" size={16} color={theme.colors.onPrimary} />
              <Text color="onPrimary" fontWeight="800" fontSize={14}>Publish Listing</Text>
            </Box>
          </Pressable>

          <Pressable
            onPress={() => Alert.alert('Saved', 'Draft saved for later.')}
            style={styles.mt12}
          >
            <Box
              backgroundColor="card"
              borderRadius="m"
              borderWidth={1}
              borderColor="border"
              paddingVertical="m"
              alignItems="center"
            >
              <Text color="textPrimary" fontWeight="700" fontSize={14}>Save as Draft</Text>
            </Box>
          </Pressable>
        </Box>
      </ScrollView>
      </KeyboardAvoidingView>
    </Box>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingTop: 4,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  mt12: {
    marginTop: 12,
  },
});
