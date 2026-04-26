import { FlashList } from '@shopify/flashlist';
import { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CategoryPill } from '../components/CategoryPill';
import { colors } from '../theme/colors';
import { ItemCard } from '../components/ItemCard';
import { marketplaceCategories, marketplaceItems } from '../data/mockItems';
import type { MarketplaceItem } from '../types/models';

export const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredItems = useMemo((): MarketplaceItem[] => {
    if (selectedCategory === 'All') {
      return marketplaceItems;
    }

    return marketplaceItems.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <View style={styles.container}>
      <FlashList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        numColumns={2}
        estimatedItemSize={310}
        renderItem={({ item, index }) => {
          return (
            <View style={[styles.itemCell, index % 2 === 0 ? styles.leftCell : styles.rightCell]}>
              <ItemCard item={item} />
            </View>
          );
        }}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerShell}>
            <Text style={styles.heading}>Marketplace Feed</Text>
            <Text style={styles.subheading}>
              100+ listings around Newfoundland. Scroll and explore local finds.
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.pillRow}>
                {marketplaceCategories.map((category) => (
                  <CategoryPill
                    key={category}
                    label={category}
                    selected={selectedCategory === category}
                    onPress={() => setSelectedCategory(category)}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        }
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
    paddingBottom: 30,
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
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 1,
  },
});
