import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlashList } from '@shopify/flash-list';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text as RNText, View as RNView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ItemCard } from '../components/ItemCard';
import { ItemCardRestyle } from '../components/ItemCardRestyle';
import { marketplaceItems } from '../data/mockItems';
import type { RootStackParamList } from '../navigation/types';
import { getSavedListingIds } from '../storage/savedListings';
import { Box, Text } from '../theme/restyle';
import { colors } from '../theme/colors';
import type { MarketplaceItem } from '../types/models';
import { USE_FLASHLIST_MASONRY, USE_RESTYLE_COMPONENTS } from '../workshop/toggles';

export const SavedScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const CardComponent = USE_RESTYLE_COMPONENTS ? ItemCardRestyle : ItemCard;
  const [savedItemIds, setSavedItemIds] = useState<string[]>([]);

  const itemMap = useMemo(() => {
    return new Map(marketplaceItems.map((item) => [item.id, item]));
  }, []);

  const savedItems = useMemo<MarketplaceItem[]>(() => {
    return savedItemIds
      .map((itemId) => itemMap.get(itemId))
      .filter((item): item is MarketplaceItem => item !== undefined);
  }, [itemMap, savedItemIds]);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadSavedItems = async () => {
        const ids = await getSavedListingIds();
        if (active) {
          setSavedItemIds(ids);
        }
      };

      void loadSavedItems();

      return () => {
        active = false;
      };
    }, []),
  );

  const header = USE_RESTYLE_COMPONENTS ? (
    <Box marginBottom="xs">
      <Text color="brandDark" fontWeight="900" fontSize={22} marginBottom="xs">
        Saved Listings
      </Text>
      <Text color="textSecondary" fontSize={12} marginBottom="m">
        Your bookmarked items from around Newfoundland.
      </Text>
    </Box>
  ) : (
    <RNView style={styles.headerShell}>
      <RNText style={styles.heading}>Saved Listings</RNText>
      <RNText style={styles.subheading}>Your bookmarked items from around Newfoundland.</RNText>
    </RNView>
  );

  const emptyState = USE_RESTYLE_COMPONENTS ? (
    <Box marginTop="xl" alignItems="center" paddingHorizontal="xxl">
      <Text color="textPrimary" fontSize={18} fontWeight="800">
        No saved listings yet
      </Text>
      <Text marginTop="s" color="textSecondary" fontSize={13} lineHeight={19} textAlign="center">
        Tap the heart on a listing details screen to save an item.
      </Text>
    </Box>
  ) : (
    <RNView style={styles.emptyState}>
      <RNText style={styles.emptyTitle}>No saved listings yet</RNText>
      <RNText style={styles.emptyBody}>Tap the heart on a listing details screen to save an item.</RNText>
    </RNView>
  );

  if (USE_FLASHLIST_MASONRY) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Box flex={1}>
          <FlashList
          data={savedItems}
          keyExtractor={(item) => item.id}
          masonry
          optimizeItemArrangement
          numColumns={2}
          renderItem={({ item, index }) => (
            <RNView style={[styles.itemCell, index % 2 === 0 ? styles.leftCell : styles.rightCell]}>
              <CardComponent
                item={item}
                onPress={() => navigation.navigate('listingDetails', { itemId: item.id })}
              />
            </RNView>
          )}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={header}
          ListEmptyComponent={emptyState}
        />
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Box flex={1}>
        <FlatList
        data={savedItems}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <CardComponent item={item} onPress={() => navigation.navigate('listingDetails', { itemId: item.id })} />
        )}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrap}
        ListHeaderComponent={header}
        ListEmptyComponent={emptyState}
      />
      </Box>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.ui.canvas,
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
  emptyState: {
    marginTop: 30,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: colors.ui.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  emptyBody: {
    marginTop: 8,
    color: colors.ui.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
});
