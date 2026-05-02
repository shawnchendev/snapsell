import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlashList } from '@shopify/flash-list';
import { useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text as RNText,
  View as RNView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoryPill } from '../components/CategoryPill';
import { CategoryPillRestyle } from '../components/CategoryPillRestyle';
import { ItemCard } from '../components/ItemCard';
import { ItemCardRestyle } from '../components/ItemCardRestyle';
import { marketplaceCategories, marketplaceItems } from '../data/mockItems';
import type { RootStackParamList } from '../navigation/types';
import { Box, Text } from '../theme/restyle';
import { colors } from '../theme/colors';
import type { MarketplaceItem } from '../types/models';
import { USE_FLASHLIST_MASONRY, USE_RESTYLE_COMPONENTS } from '../workshop/toggles';

export const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const CardComponent = USE_RESTYLE_COMPONENTS ? ItemCardRestyle : ItemCard;
  const PillComponent = USE_RESTYLE_COMPONENTS ? CategoryPillRestyle : CategoryPill;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredItems = useMemo((): MarketplaceItem[] => {
    if (selectedCategory === 'All') {
      return marketplaceItems;
    }

    return marketplaceItems.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const header = USE_RESTYLE_COMPONENTS ? (
    <Box marginBottom="xs" paddingHorizontal={USE_FLASHLIST_MASONRY ? 'm' : 'none'}>
      <Text color="brandDark" fontWeight="900" fontSize={22} marginBottom="xs">
        Marketplace Feed
      </Text>
      <Text color="textSecondary" fontSize={12} marginBottom="m">
        {marketplaceItems.length}+ listings around Newfoundland. Scroll and explore local finds.
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Box flexDirection="row" alignItems="center">
          {marketplaceCategories.map((category) => (
            <PillComponent
              key={category}
              label={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
            />
          ))}
        </Box>
      </ScrollView>
    </Box>
  ) : (
    <RNView style={[styles.headerShell, USE_FLASHLIST_MASONRY && styles.headerShellMasonry]}>
      <RNText style={styles.heading}>Marketplace Feed</RNText>
      <RNText style={styles.subheading}>
        {marketplaceItems.length}+ listings around Newfoundland. Scroll and explore local finds.
      </RNText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <RNView style={styles.pillRow}>
          {marketplaceCategories.map((category) => (
            <PillComponent
              key={category}
              label={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
            />
          ))}
        </RNView>
      </ScrollView>
    </RNView>
  );

  if (USE_FLASHLIST_MASONRY) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Box flex={1}>
          <FlashList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          masonry
          optimizeItemArrangement
          numColumns={2}
          renderItem={({ item }) => (
            <RNView style={styles.itemCell}>
              <CardComponent
                item={item}
                flush
                onPress={() => navigation.navigate('listingDetails', { itemId: item.id })}
              />
            </RNView>
          )}
          contentContainerStyle={styles.masonryListContent}
          ListHeaderComponent={header}
        />
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Box flex={1}>
        <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <CardComponent item={item} onPress={() => navigation.navigate('listingDetails', { itemId: item.id })} />
        )}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrap}
        ListHeaderComponent={header}
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
  masonryListContent: {
    paddingTop: 12,
    paddingBottom: 140,
  },
  columnWrap: {
    gap: 9,
  },
  itemCell: {
    flex: 1,
  },
  headerShell: {
    marginBottom: 5,
  },
  headerShellMasonry: {
    paddingHorizontal: 12,
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
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 1,
  },
});
