import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated from 'react-native-reanimated';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { marketplaceItems } from '../data/mockItems';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { USE_SHARED_IMAGE_TRANSITION } from '../workshop/toggles';

const SharedTransitionImage = Animated.createAnimatedComponent(Image) as any;

type Props = NativeStackScreenProps<RootStackParamList, 'listingDetails'>;

export const ListingDetailsScreen = ({ navigation, route }: Props) => {
  const listing = marketplaceItems.find((item) => item.id === route.params.itemId);
  const sharedImageTag = USE_SHARED_IMAGE_TRANSITION ? `listing-image-${route.params.itemId}` : undefined;

  if (!listing) {
    return (
      <View style={styles.missingWrap}>
        <Text style={styles.missingTitle}>Listing not found</Text>
        <Text style={styles.missingBody}>
          This listing may have been removed. Go back to the marketplace feed.
        </Text>
        <Pressable style={styles.primaryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.primaryButtonText}>Back to Feed</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </Pressable>

      <SharedTransitionImage
        source={{ uri: listing.imageUrl }}
        style={styles.heroImage}
        sharedTransitionTag={sharedImageTag}
      />

      <View style={styles.card}>
        <Text style={styles.title}>{listing.title}</Text>
        <Text style={styles.price}>${listing.price}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{listing.location}</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaText}>{listing.postedAt}</Text>
        </View>

        <View style={styles.badgeRow}>
          {listing.badges.map((badge, index) => (
            <View
              key={`${listing.id}-${badge}-${index}`}
              style={[styles.badge, index % 2 === 0 ? styles.badgeInfo : styles.badgeAlert]}
            >
              <Text style={[styles.badgeText, index % 2 === 0 ? styles.badgeInfoText : styles.badgeAlertText]}>
                {badge}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.grid}>
          <View style={styles.gridCell}>
            <Text style={styles.gridLabel}>Category</Text>
            <Text style={styles.gridValue}>{listing.category}</Text>
          </View>
          <View style={styles.gridCell}>
            <Text style={styles.gridLabel}>Condition</Text>
            <Text style={styles.gridValue}>{listing.condition}</Text>
          </View>
          <View style={styles.gridCell}>
            <Text style={styles.gridLabel}>Views</Text>
            <Text style={styles.gridValue}>{listing.views}</Text>
          </View>
          <View style={styles.gridCell}>
            <Text style={styles.gridLabel}>Saved</Text>
            <Text style={styles.gridValue}>{listing.saved}</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Description</Text>
        <Text style={styles.description}>{listing.description}</Text>

        <Text style={styles.sectionLabel}>Seller</Text>
        <Text style={styles.seller}>{listing.sellerName}</Text>

        <View style={styles.actionRow}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => Alert.alert('Message Sent', `You contacted ${listing.sellerName}.`)}
          >
            <Text style={styles.primaryButtonText}>Message Seller</Text>
          </Pressable>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => Alert.alert('Saved', 'Listing added to your saved items.')}
          >
            <Text style={styles.secondaryButtonText}>Save Listing</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 14,
    paddingBottom: 28,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.ui.border,
    backgroundColor: colors.ui.surface,
  },
  backButtonText: {
    color: colors.ui.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  heroImage: {
    width: '100%',
    height: 280,
    borderRadius: 14,
    backgroundColor: colors.ui.surfaceStrong,
  },
  card: {
    marginTop: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.ui.border,
    backgroundColor: colors.ui.surface,
    padding: 12,
  },
  title: {
    color: colors.ui.textPrimary,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
  },
  price: {
    marginTop: 8,
    color: colors.status.dangerText,
    fontSize: 36,
    fontWeight: '900',
  },
  metaRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: colors.ui.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  metaDot: {
    color: colors.ui.textMuted,
    marginHorizontal: 8,
    fontSize: 14,
  },
  badgeRow: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeInfo: {
    backgroundColor: colors.status.infoBg,
    borderColor: colors.status.infoBorder,
  },
  badgeAlert: {
    backgroundColor: colors.status.errorBg,
    borderColor: colors.status.errorBorder,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  badgeInfoText: {
    color: colors.status.infoText,
  },
  badgeAlertText: {
    color: colors.status.errorText,
  },
  grid: {
    marginTop: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridCell: {
    width: '47%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.ui.border,
    backgroundColor: colors.ui.surfaceMuted,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  gridLabel: {
    color: colors.ui.textMuted,
    textTransform: 'uppercase',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  gridValue: {
    marginTop: 4,
    color: colors.ui.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  sectionLabel: {
    marginTop: 16,
    color: colors.ui.textMuted,
    textTransform: 'uppercase',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  description: {
    marginTop: 6,
    color: colors.ui.textPrimary,
    fontSize: 15,
    lineHeight: 22,
  },
  seller: {
    marginTop: 4,
    color: colors.ui.primary,
    fontSize: 17,
    fontWeight: '800',
  },
  actionRow: {
    marginTop: 18,
    flexDirection: 'row',
    gap: 9,
  },
  primaryButton: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: colors.ui.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: colors.ui.onPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.ui.border,
    backgroundColor: colors.ui.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: colors.ui.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  missingWrap: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  missingTitle: {
    color: colors.ui.primary,
    fontSize: 22,
    fontWeight: '900',
  },
  missingBody: {
    color: colors.ui.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
