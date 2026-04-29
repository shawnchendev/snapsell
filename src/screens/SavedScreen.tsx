import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlashList } from '@shopify/flash-list';
import { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ItemCard } from '../components/ItemCard';
import { ItemCardRestyle } from '../components/ItemCardRestyle';
import { marketplaceItems } from '../data/mockItems';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import type { MarketplaceItem } from '../types/models';
import {
  USE_FLASHLIST_MASONRY,
  USE_RESTYLE_COMPONENTS,
  USE_SHARED_IMAGE_TRANSITION,
} from '../workshop/toggles';

export const SavedScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const CardComponent = USE_RESTYLE_COMPONENTS ? ItemCardRestyle : ItemCard;

  const getImageTransitionTag = (itemId: string): string | undefined => {
    return USE_SHARED_IMAGE_TRANSITION ? `listing-image-${itemId}` : undefined;
  };

  const savedItems = useMemo<MarketplaceItem[]>(() => {
    return [...marketplaceItems]
      .sort((a, b) => b.saved - a.saved)
      .slice(0, 30);
  }, []);

  const header = (
    <View style={styles.headerShell}>
      <Text style={styles.heading}>Saved Listings</Text>
      <Text style={styles.subheading}>
        Your bookmarked items from around Newfoundland.
      </Text>
    </View>
  );

  if (USE_FLASHLIST_MASONRY) {
    return (
      <View style={styles.container}>
        <FlashList
          data={savedItems}
          keyExtractor={(item) => item.id}
          masonry
          optimizeItemArrangement
          numColumns={2}
          renderItem={({ item, index }) => (
            <View style={[styles.itemCell, index % 2 === 0 ? styles.leftCell : styles.rightCell]}>
              <CardComponent
                item={item}
                sharedImageTag={getImageTransitionTag(item.id)}
                onPress={() => navigation.navigate('listingDetails', { itemId: item.id })}
              />
            </View>
          )}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={header}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={savedItems}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <CardComponent
            item={item}
            sharedImageTag={getImageTransitionTag(item.id)}
            onPress={() => navigation.navigate('listingDetails', { itemId: item.id })}
          />
        )}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrap}
        ListHeaderComponent={header}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 140,
  },
  columnWrap: {
    gap: 9,
  },
  itemCell: {
    flex: 1,
  },
  leftCell: {
    paddingRight: 5,
  },
  rightCell: {
    paddingLeft: 5,
  },
  headerShell: {
    marginBottom: 5,
  },
  heading: {
    color: colors.ui.primary,
    fontWeight: '900',
    fontSize: 22,
    marginBottom: 4,
  },
  subheading: {
    color: colors.ui.textSecondary,
    fontSize: 12,
    marginBottom: 11,
  },
});
