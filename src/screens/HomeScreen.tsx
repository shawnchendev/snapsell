import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlashList } from '@shopify/flash-list';
import { useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CategoryPill } from '../components/CategoryPill';
import { CategoryPillRestyle } from '../components/CategoryPillRestyle';
import { ItemCard } from '../components/ItemCard';
import { ItemCardRestyle } from '../components/ItemCardRestyle';
import { marketplaceCategories, marketplaceItems } from '../data/mockItems';
import type { RootStackParamList } from '../navigation/types';
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

  const header = (
    <View style={styles.headerShell}>
      <Text style={styles.heading}>Marketplace Feed</Text>
      <Text style={styles.subheading}>
        100+ listings around Newfoundland. Scroll and explore local finds.
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.pillRow}>
          {marketplaceCategories.map((category) => (
            <PillComponent
              key={category}
              label={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );

  if (USE_FLASHLIST_MASONRY) {
    return (
      <View style={styles.container}>
        <FlashList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          masonry
          optimizeItemArrangement
          numColumns={2}
          renderItem={({ item, index }) => (
            <View style={[styles.itemCell, index % 2 === 0 ? styles.leftCell : styles.rightCell]}>
              <CardComponent
                item={item}
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
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 1,
  },
});
