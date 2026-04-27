import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

const iconMap = {
  home: { active: 'home', inactive: 'home-outline' },
  saved: { active: 'heart', inactive: 'heart-outline' },
  profile: { active: 'person', inactive: 'person-outline' },
} as const;

export const FloatingTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View pointerEvents="box-none" style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.row}>
        <View style={styles.pill}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const routeName = route.name as keyof typeof iconMap;
            const icon = iconMap[routeName] ?? iconMap.home;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                onLongPress={onLongPress}
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={descriptors[route.key]?.options?.tabBarAccessibilityLabel}
                testID={descriptors[route.key]?.options?.tabBarButtonTestID}
                style={[styles.tabButton, isFocused && styles.tabButtonFocused]}
              >
                <Ionicons
                  name={isFocused ? icon.active : icon.inactive}
                  size={30}
                  color={isFocused ? colors.ui.primary : colors.ui.textPrimary}
                />
              </Pressable>
            );
          })}
        </View>

        <Pressable
          style={styles.addPostButton}
          onPress={() => navigation.getParent()?.navigate('createListing' as never)}
          accessibilityRole="button"
          accessibilityLabel="Create listing"
        >
          <Ionicons name="bag-add-outline" size={30} color={colors.ui.onPrimary} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    pointerEvents: 'box-none',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#F6F5F2',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 14,
    minWidth: 250,
    shadowColor: '#9BA4A9',
    shadowOpacity: 0.24,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 8,
  },
  tabButton: {
    width: 58,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonFocused: {
    backgroundColor: colors.ui.surfaceMuted,
  },
  addPostButton: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#3D6F5E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6A847A',
    shadowOpacity: 0.34,
    shadowOffset: { width: 0, height: 7 },
    shadowRadius: 14,
    elevation: 10,
  },
});
