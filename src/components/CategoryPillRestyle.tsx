import { Pressable } from 'react-native';
import { Box, Text } from '../theme/restyle';

interface CategoryPillRestyleProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export const CategoryPillRestyle = ({
  label,
  selected,
  onPress,
}: CategoryPillRestyleProps) => {
  return (
    <Pressable onPress={onPress}>
      <Box
        borderRadius="pill"
        borderWidth={1}
        borderColor={selected ? 'brandDark' : 'border'}
        backgroundColor={selected ? 'brand' : 'card'}
        marginRight="s"
        marginTop="xs"
        marginBottom="m"
        paddingVertical="s"
        paddingHorizontal="m"
      >
        <Text
          color={selected ? 'onPrimary' : 'textSecondary'}
          fontSize={12}
          fontWeight={selected ? '800' : '700'}
          letterSpacing={0.2}
        >
          {label}
        </Text>
      </Box>
    </Pressable>
  );
};
