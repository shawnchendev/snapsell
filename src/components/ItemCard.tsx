import { Image, StyleSheet, Text, View } from 'react-native';
import type { MarketplaceItem } from '../types/models';

interface ItemCardProps {
  item: MarketplaceItem;
}

export const ItemCard = ({ item }: ItemCardProps) => {
  return (
    <View style={styles.outerCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.heroImage} />

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
    </View>
  );
};

const styles = StyleSheet.create({
  outerCard: {
    flex: 1,
    borderRadius: 13,
    marginBottom: 14,
    marginHorizontal: 2,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE3EF',
    overflow: 'hidden',
    shadowColor: '#091E42',
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
    backgroundColor: '#EAEEF5',
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
    color: '#111827',
    fontWeight: '700',
    marginRight: 4,
  },
  viewsBubble: {
    minWidth: 33,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF4DD',
    borderWidth: 1,
    borderColor: '#F6C04E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginTop: -1,
  },
  viewsText: {
    color: '#8A5A00',
    fontSize: 10,
    fontWeight: '800',
  },
  priceText: {
    color: '#FF0000',
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
    color: '#5E6C84',
    fontSize: 10,
    fontWeight: '600',
  },
  separatorDot: {
    color: '#A5ADBA',
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
    backgroundColor: '#DEEBFF',
    borderColor: '#4C9AFF',
  },
  badgePink: {
    backgroundColor: '#FFEBE6',
    borderColor: '#FF8F73',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
  badgeTextBlue: {
    color: '#0052CC',
  },
  badgeTextPink: {
    color: '#BF2600',
  },
  sellerText: {
    color: '#344563',
    fontSize: 10,
    fontWeight: '600',
  },
});
