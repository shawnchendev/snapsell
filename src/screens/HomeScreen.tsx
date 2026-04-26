import { useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CategoryPill } from '../components/CategoryPill';
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
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => <ItemCard item={item} />}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrap}
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
  columnWrap: {
    gap: 9,
  },
  headerShell: {
    marginBottom: 5,
  },
  heading: {
    color: '#091E42',
    fontWeight: '900',
    fontSize: 22,
    marginBottom: 4,
  },
  subheading: {
    color: '#6B778C',
    fontSize: 12,
    marginBottom: 11,
  },
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 1,
  },
});
