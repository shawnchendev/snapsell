import { Image, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { Box, Text } from '../theme/restyle';
import type { MarketplaceItem } from '../types/models';

interface ItemCardRestyleProps {
  item: MarketplaceItem;
  onPress?: () => void;
  flush?: boolean;
}

export const ItemCardRestyle = ({ item, onPress, flush = false }: ItemCardRestyleProps) => {
  return (
    <Pressable onPress={onPress}>
      <Box
        flex={1}
        borderRadius="m"
        marginBottom={flush ? 'xs' : 'm'}
        marginHorizontal={flush ? 'xs' : 'xs'}
        backgroundColor="card"
        overflow="hidden"
      >
        <Image source={{ uri: item.imageUrl }} style={[styles.heroImage, { aspectRatio: item.imageAspectRatio }]} />

        <Box paddingHorizontal="s" paddingTop="s" paddingBottom="m">
          <Text variant="title" numberOfLines={2}>
            {item.title}
          </Text>

          <Text variant="meta" marginTop="xs" numberOfLines={1}>
            {item.location}
          </Text>

          <Text variant="price" marginTop="xs">
            ${item.price}
          </Text>
        </Box>
      </Box>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  heroImage: {
    width: '100%',
    backgroundColor: colors.ui.surfaceStrong,
  },
});
