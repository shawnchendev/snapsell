import { Pressable, StyleSheet, Text } from 'react-native';

interface CategoryPillProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export const CategoryPill = ({ label, selected, onPress }: CategoryPillProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.basePill,
        selected ? styles.selectedPillColors : styles.unselectedPillColors,
        selected ? styles.selectedSpacing : styles.unselectedSpacing,
      ]}
    >
      <Text
        style={[
          styles.baseText,
          selected ? styles.selectedTextColor : styles.unselectedTextColor,
          selected ? styles.selectedTextShadowHack : styles.unselectedTextWeight,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  basePill: {
    borderRadius: 999,
    borderWidth: 1,
    marginRight: 9,
    marginTop: 2,
    marginBottom: 11,
    alignSelf: 'flex-start',
  },
  selectedPillColors: {
    backgroundColor: '#0052CC',
    borderColor: '#003f99',
  },
  unselectedPillColors: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D2D8E2',
  },
  selectedSpacing: {
    paddingHorizontal: 17,
    paddingVertical: 9,
  },
  unselectedSpacing: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  baseText: {
    fontSize: 12,
    letterSpacing: 0.2,
  },
  selectedTextColor: {
    color: '#FFFFFF',
  },
  unselectedTextColor: {
    color: '#42526E',
  },
  selectedTextShadowHack: {
    fontWeight: '800',
    textShadowColor: '#0A1931',
    textShadowOffset: {
      width: 0,
      height: 0,
    },
    textShadowRadius: 0.2,
  },
  unselectedTextWeight: {
    fontWeight: '700',
  },
});
