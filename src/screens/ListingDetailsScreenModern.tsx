import Ionicons from '@expo/vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@shopify/restyle';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Share, StyleSheet } from 'react-native';
import MapView, { Circle } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedHeartButton } from '../components/AnimatedHeartButton';
import { getLocationCoordinates } from '../data/locationCoordinates';
import { marketplaceItems } from '../data/mockItems';
import type { RootStackParamList } from '../navigation/types';
import { isListingSaved, toggleSavedListing } from '../storage/savedListings';
import { Box, Text } from '../theme/restyle';
import type { Theme } from '../theme/theme';
import { USE_ANIMATED_HEART } from '../workshop/toggles';

type Props = NativeStackScreenProps<RootStackParamList, 'listingDetails'>;

export const ListingDetailsScreenModern = ({ navigation, route }: Props) => {
  const theme = useTheme<Theme>();
  const itemId = route.params.itemId;
  const insets = useSafeAreaInsets();
  const listing = marketplaceItems.find((item) => item.id === itemId);
  const [isSaved, setIsSaved] = useState(false);

  const coordinates = useMemo(
    () => (listing ? getLocationCoordinates(listing.location) : null),
    [listing],
  );

  useEffect(() => {
    let active = true;

    void isListingSaved(itemId).then((saved) => {
      if (active) {
        setIsSaved(saved);
      }
    });

    return () => {
      active = false;
    };
  }, [itemId]);

  const handleToggleSaved = useCallback(async () => {
    try {
      await toggleSavedListing(itemId);
      setIsSaved((prev) => !prev);
    } catch {
      Alert.alert('Error', 'Unable to update saved listings right now.');
    }
  }, [itemId]);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `Check out ${listing?.title} for $${listing?.price} on SnapSell!`,
      });
    } catch {
      // user cancelled or error — ignore
    }
  }, [listing]);

  if (!listing) {
    return (
      <Box flex={1} alignItems="center" justifyContent="center" padding="l" backgroundColor="background">
        <Text color="textPrimary" fontSize={22} fontWeight="900">
          Listing not found
        </Text>
        <Text marginTop="s" color="textSecondary" textAlign="center" fontSize={14} lineHeight={20}>
          This listing may have been removed. Go back to the marketplace feed.
        </Text>
        <Pressable onPress={() => navigation.goBack()} style={styles.fallbackButtonPressable}>
          <Box backgroundColor="brandDark" borderRadius="m" paddingHorizontal="l" paddingVertical="s">
            <Text color="onPrimary" fontWeight="800">
              Back to Feed
            </Text>
          </Box>
        </Pressable>
      </Box>
    );
  }

  return (
    <Box flex={1} backgroundColor="background">
      {/* Top action bar - sits in the safe area */}
      <Box
        style={[styles.topActionBar, { paddingTop: insets.top + 8 }]}
        position="absolute"
        left={0}
        right={0}
        zIndex={10}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal="m"
        paddingBottom="s"
      >
        <Pressable style={styles.iconPressable} onPress={() => navigation.goBack()}>
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
            <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
          </Box>
        </Pressable>

        <Box flexDirection="row" gap="s">
          {USE_ANIMATED_HEART ? (
            <AnimatedHeartButton
              isSaved={isSaved}
              onToggle={handleToggleSaved}
              size={34}
              iconSize={20}
              color={theme.colors.textPrimary}
              savedColor="#E8475F"
              backgroundColor={theme.colors.card}
              borderColor={theme.colors.border}
            />
          ) : (
            <Pressable style={styles.iconPressable} onPress={handleToggleSaved}>
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
                <Ionicons name={isSaved ? 'heart' : 'heart-outline'} size={20} color={theme.colors.textPrimary} />
              </Box>
            </Pressable>
          )}

          <Pressable style={styles.iconPressable} onPress={handleShare}>
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
              <Ionicons name="share-social-outline" size={20} color={theme.colors.textPrimary} />
            </Box>
          </Pressable>
        </Box>
      </Box>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
      >
        <Box overflow="hidden">
          <Image source={{ uri: listing.imageUrl }} style={styles.heroImage} />
        </Box>

        <Box
          marginTop="s"
          backgroundColor="card"
          padding="m"
        >
          <Box flexDirection="row" flexWrap="wrap" gap="s" marginBottom="s">
            <Box backgroundColor="warmBg" borderRadius="pill" paddingHorizontal="m" paddingVertical="xs">
              <Text color="warmText" fontSize={11} fontWeight="700">
                {listing.category}
              </Text>
            </Box>
            {listing.badges.map((badge, index) => (
              <Box
                key={`${listing.id}-${badge}-${index}`}
                backgroundColor={index % 2 === 0 ? 'chipBlueBg' : 'chipPinkBg'}
                borderRadius="pill"
                paddingHorizontal="m"
                paddingVertical="xs"
              >
                <Text color={index % 2 === 0 ? 'chipBlueText' : 'chipPinkText'} fontSize={11} fontWeight="700">
                  {badge}
                </Text>
              </Box>
            ))}
          </Box>

          <Text color="textPrimary" fontSize={40} lineHeight={44} fontWeight="700" letterSpacing={-0.8}>
            {listing.title}
          </Text>
          <Text marginTop="s" color="danger" fontSize={36} fontWeight="700" letterSpacing={-0.4}>
            ${listing.price}
          </Text>

          <Box marginTop="s" flexDirection="row" alignItems="center">
            <Text color="textSecondary" fontSize={12} fontWeight="600">
              {listing.location}
            </Text>
            <Text marginHorizontal="s" color="textSecondary" fontSize={12}>
              •
            </Text>
            <Text color="textSecondary" fontSize={12} fontWeight="600">
              {listing.postedAt}
            </Text>
          </Box>

          <Box marginTop="l" gap="s">
            <Box flexDirection="row" justifyContent="space-between">
              <Box style={styles.infoCard} backgroundColor="background" borderColor="border">
                <Box flexDirection="row" alignItems="center" gap="xs">
                  <Ionicons name="pricetag-outline" size={15} color={theme.colors.textSecondary} />
                  <Text color="textSecondary" fontSize={11} fontWeight="600">Category</Text>
                </Box>
                <Text marginTop="xs" color="textPrimary" fontSize={18} fontWeight="600">
                  {listing.category}
                </Text>
              </Box>
              <Box style={styles.infoCard} backgroundColor="background" borderColor="border">
                <Box flexDirection="row" alignItems="center" gap="xs">
                  <Ionicons name="sparkles-outline" size={15} color={theme.colors.textSecondary} />
                  <Text color="textSecondary" fontSize={11} fontWeight="600">Condition</Text>
                </Box>
                <Text marginTop="xs" color="textPrimary" fontSize={18} fontWeight="600">
                  {listing.condition}
                </Text>
              </Box>
            </Box>

            <Box flexDirection="row" justifyContent="space-between">
              <Box style={styles.infoCard} backgroundColor="background" borderColor="border">
                <Box flexDirection="row" alignItems="center" gap="xs">
                  <Ionicons name="eye-outline" size={15} color={theme.colors.textSecondary} />
                  <Text color="textSecondary" fontSize={11} fontWeight="600">Views</Text>
                </Box>
                <Text marginTop="xs" color="textPrimary" fontSize={18} fontWeight="600">
                  {listing.views}
                </Text>
              </Box>
              <Box style={styles.infoCard} backgroundColor="background" borderColor="border">
                <Box flexDirection="row" alignItems="center" gap="xs">
                  <Ionicons name="bookmark-outline" size={15} color={theme.colors.textSecondary} />
                  <Text color="textSecondary" fontSize={11} fontWeight="600">Saved</Text>
                </Box>
                <Text marginTop="xs" color="textPrimary" fontSize={18} fontWeight="600">
                  {listing.saved}
                </Text>
              </Box>
            </Box>
          </Box>

          <Box marginTop="xl" borderTopWidth={1} borderTopColor="border" />

          <Text marginTop="l" color="textSecondary" fontSize={11} fontWeight="700" textTransform="uppercase">
            Description
          </Text>
          <Text marginTop="s" color="textPrimary" fontSize={24} lineHeight={34}>
            {listing.description}
          </Text>

          <Text marginTop="l" color="textSecondary" fontSize={11} fontWeight="700" textTransform="uppercase">
            Seller
          </Text>
          <Text marginTop="xs" color="brandDark" fontSize={22} fontWeight="800">
            {listing.sellerName}
          </Text>

          {coordinates && (
            <>
              <Box marginTop="xl" borderTopWidth={1} borderTopColor="border" />

              <Text marginTop="l" color="textSecondary" fontSize={11} fontWeight="700" textTransform="uppercase">
                Estimated Location
              </Text>
              <Text marginTop="xs" color="textPrimary" fontSize={12} fontWeight="600">
                {listing.location}
              </Text>

              <Pressable
                onPress={() =>
                  navigation.navigate('fullMap', {
                    title: listing.title,
                    location: listing.location,
                    latitude: coordinates.latitude,
                    longitude: coordinates.longitude,
                  })
                }
              >
                <Box marginTop="s" borderRadius="m" overflow="hidden" borderWidth={1} borderColor="border">
                  <MapView
                    style={styles.map}
                    initialRegion={{
                      latitude: coordinates.latitude,
                      longitude: coordinates.longitude,
                      latitudeDelta: 0.04,
                      longitudeDelta: 0.04,
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    rotateEnabled={false}
                    pitchEnabled={false}
                    liteMode
                  >
                    <Circle
                      center={coordinates}
                      radius={1500}
                      fillColor="rgba(102, 143, 128, 0.2)"
                      strokeColor="rgba(74, 102, 112, 0.5)"
                      strokeWidth={2}
                    />
                  </MapView>
                </Box>
              </Pressable>
            </>
          )}
        </Box>
      </ScrollView>

      <Box style={[styles.bottomActionRow, { bottom: insets.bottom + 10 }]}>
        <Pressable
          style={styles.messagePressable}
          onPress={() => Alert.alert('Message Sent', `You contacted ${listing.sellerName}.`)}
        >
          <Box
            height={42}
            borderRadius="pill"
            borderWidth={1}
            borderColor="border"
            backgroundColor="chipBlueBg"
            alignItems="center"
            justifyContent="center"
            flexDirection="row"
            gap="xs"
          >
            <Ionicons name="chatbubble-outline" size={14} color={theme.colors.brandDark} />
            <Text color="brandDark" fontSize={12} fontWeight="700">
              Message Seller
            </Text>
          </Box>
        </Pressable>

        <Pressable style={styles.buyPressable} onPress={handleToggleSaved}>
          <Box
            height={42}
            borderRadius="pill"
            borderWidth={1}
            borderColor="brandDark"
            backgroundColor="brand"
            alignItems="center"
            justifyContent="center"
            flexDirection="row"
            gap="xs"
          >
            <Ionicons name={isSaved ? 'heart-dislike-outline' : 'heart-outline'} size={14} color={theme.colors.onPrimary} />
            <Text color="onPrimary" fontSize={12} fontWeight="700">
              {isSaved ? 'Remove Saved' : 'Save Listing'}
            </Text>
          </Box>
        </Pressable>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: 96,
  },
  heroImage: {
    width: '100%',
    aspectRatio: 1,
  },
  iconPressable: {
    borderRadius: 999,
  },
  topActionBar: {
    position: 'absolute',
  },
  infoCard: {
    width: '48%',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  map: {
    width: '100%',
    height: 180,
  },
  fallbackButtonPressable: {
    marginTop: 14,
  },
  bottomActionRow: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 10,
  },
  messagePressable: {
    flex: 1,
  },
  buyPressable: {
    flex: 1.2,
  },
});
