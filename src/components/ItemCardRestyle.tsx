import Animated from 'react-native-reanimated';
import { Image, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { Box, Text } from '../theme/restyle';
import type { MarketplaceItem } from '../types/models';

const SharedTransitionImage = Animated.createAnimatedComponent(Image) as any;

interface ItemCardRestyleProps {
  item: MarketplaceItem;
  onPress?: () => void;
  sharedImageTag?: string;
}

export const ItemCardRestyle = ({ item, onPress, sharedImageTag }: ItemCardRestyleProps) => {
  return (
    <Pressable onPress={onPress}>
      <Box
        flex={1}
        borderRadius="l"
        marginBottom="m"
        marginHorizontal="xs"
        backgroundColor="card"
        borderWidth={1}
        borderColor="border"
        overflow="hidden"
        shadowColor="textPrimary"
        shadowOpacity={0.14}
        shadowOffset={{ width: 0, height: 3 }}
        shadowRadius={8}
        elevation={3}
      >
        <SharedTransitionImage
          source={{ uri: item.imageUrl }}
          style={[styles.heroImage, { aspectRatio: item.imageAspectRatio }]}
          sharedTransitionTag={sharedImageTag}
        />

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
