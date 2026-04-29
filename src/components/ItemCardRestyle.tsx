import { Image, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { Box, Text } from '../theme/restyle';
import type { MarketplaceItem } from '../types/models';

interface ItemCardRestyleProps {
  item: MarketplaceItem;
  onPress?: () => void;
}

export const ItemCardRestyle = ({ item, onPress }: ItemCardRestyleProps) => {
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
        <Image source={{ uri: item.imageUrl }} style={styles.heroImage} />

        <Box paddingHorizontal="s" paddingTop="s" paddingBottom="s">
          <Box flexDirection="row" alignItems="flex-start" justifyContent="space-between" gap="xs">
            <Text variant="title" flex={1} marginRight="xs" numberOfLines={2}>
              {item.title}
            </Text>

            <Box
              minWidth={33}
              height={20}
              borderRadius="pill"
              backgroundColor="warmBg"
              borderWidth={1}
              borderColor="warmBorder"
              alignItems="center"
              justifyContent="center"
              paddingHorizontal="s"
            >
              <Text color="warmText" fontSize={10} fontWeight="800">
                {item.views}
              </Text>
            </Box>
          </Box>

          <Text variant="price" marginTop="xs" marginBottom="xs">
            ${item.price}
          </Text>

          <Box flexDirection="row" alignItems="center" marginBottom="s">
            <Text variant="meta">{item.location}</Text>
            <Text variant="meta" marginHorizontal="xs">
              •
            </Text>
            <Text variant="meta">{item.postedAt}</Text>
          </Box>

          <Box flexDirection="row" flexWrap="wrap" gap="xs" marginBottom="s">
            {item.badges.map((badge, index) => {
              const blueTone = index % 2 === 0;
              return (
                <Box
                  key={`${item.id}-${badge}-${index}`}
                  borderRadius="s"
                  paddingHorizontal="s"
                  paddingVertical="xs"
                  borderWidth={1}
                  backgroundColor={blueTone ? 'chipBlueBg' : 'chipPinkBg'}
                  borderColor={blueTone ? 'brandDark' : 'chipPinkText'}
                >
                  <Text variant="badge" color={blueTone ? 'chipBlueText' : 'chipPinkText'}>
                    {badge}
                  </Text>
                </Box>
              );
            })}
          </Box>

          <Text variant="meta" numberOfLines={1}>
            Seller: {item.sellerName}
          </Text>
        </Box>
      </Box>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  heroImage: {
    width: '100%',
    height: 145,
    backgroundColor: colors.ui.surfaceStrong,
  },
});
