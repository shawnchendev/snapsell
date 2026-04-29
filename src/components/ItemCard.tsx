import Animated from 'react-native-reanimated';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import type { MarketplaceItem } from '../types/models';

const SharedTransitionImage = Animated.createAnimatedComponent(Image) as any;

interface ItemCardProps {
  item: MarketplaceItem;
  onPress?: () => void;
  sharedImageTag?: string;
}

export const ItemCard = ({ item, onPress, sharedImageTag }: ItemCardProps) => {
  return (
    <Pressable style={styles.outerCard} onPress={onPress}>
      <SharedTransitionImage
        source={{ uri: item.imageUrl }}
        style={styles.heroImage}
        sharedTransitionTag={sharedImageTag}
      />

      <View style={styles.contentShell}>
        <View style={styles.rowA}>
          <Text style={styles.itemTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.viewsBubble}>
            <Text style={styles.viewsText}>{item.views}</Text>
          </View>
        </View>

        <Text style={styles.priceText}>${item.price}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>{item.location}</Text>
          <Text style={styles.separatorDot}>•</Text>
          <Text style={styles.metaLabel}>{item.postedAt}</Text>
        </View>

        <View style={styles.badgeRow}>
          {item.badges.map((badge, index) => (
            <View
              key={`${item.id}-${badge}-${index}`}
              style={[styles.badgeBase, index % 2 === 0 ? styles.badgeBlue : styles.badgePink]}
            >
              <Text style={[styles.badgeText, index % 2 === 0 ? styles.badgeTextBlue : styles.badgeTextPink]}>
                {badge}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.sellerText} numberOfLines={1}>
          Seller: {item.sellerName}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  outerCard: {
    flex: 1,
    borderRadius: 13,
    marginBottom: 14,
    marginHorizontal: 2,
    backgroundColor: colors.ui.surface,
    borderWidth: 1,
    borderColor: colors.ui.border,
    overflow: 'hidden',
    shadowColor: colors.ui.primary,
    shadowOpacity: 0.14,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 8,
    elevation: 3,
  },
  heroImage: {
    width: '100%',
    height: 145,
    backgroundColor: colors.ui.surfaceStrong,
  },
  contentShell: {
    paddingHorizontal: 9,
    paddingTop: 8,
    paddingBottom: 9,
  },
  rowA: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 6,
  },
  itemTitle: {
    flex: 1,
    fontSize: 13,
    lineHeight: 16,
    color: colors.ui.textPrimary,
    fontWeight: '700',
    marginRight: 4,
  },
  viewsBubble: {
    minWidth: 33,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.status.successBg,
    borderWidth: 1,
    borderColor: colors.status.successBorder,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginTop: -1,
  },
  viewsText: {
    color: colors.status.successText,
    fontSize: 10,
    fontWeight: '800',
  },
  priceText: {
    color: colors.status.dangerText,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 5,
    marginBottom: 5,
    letterSpacing: 0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },
  metaLabel: {
    color: colors.ui.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
  separatorDot: {
    color: colors.ui.textMuted,
    marginHorizontal: 5,
    fontSize: 12,
    marginTop: -1,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 7,
  },
  badgeBase: {
    borderRadius: 7,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderWidth: 1,
  },
  badgeBlue: {
    backgroundColor: colors.status.infoBg,
    borderColor: colors.status.infoBorder,
  },
  badgePink: {
    backgroundColor: colors.status.errorBg,
    borderColor: colors.status.errorBorder,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
  badgeTextBlue: {
    color: colors.status.infoText,
  },
  badgeTextPink: {
    color: colors.status.errorText,
  },
  sellerText: {
    color: colors.ui.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
});
