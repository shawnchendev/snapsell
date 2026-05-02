import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@shopify/restyle';
import { useEffect, useRef } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Box } from '../theme/restyle';
import type { Theme } from '../theme/theme';
import { colors } from '../theme/colors';

const TAB_CONFIG = {
  home: { inactive: 'home-outline', label: 'Home' },
  saved: { inactive: 'heart-outline', label: 'Saved' },
  profile: { inactive: 'person-outline', label: 'Profile' },
} as const;

const TAB_WIDTH = 70;
const TAB_HEIGHT = 46;
const DOT_SIZE = 8;
const SPRING_CONFIG = { damping: 25, stiffness: 140 };

interface AnimatedTabProps {
  icon: string;
  label: string;
  activeColor: string;
  inactiveColor: string;
  tabIndex: number;
  activeIndex: SharedValue<number>;
}

const AnimatedTab = ({ icon, label, activeColor, inactiveColor, tabIndex, activeIndex }: AnimatedTabProps) => {
  const iconStyle = useAnimatedStyle(() => {
    const dist = Math.abs(activeIndex.value - tabIndex);
    const t = Math.min(Math.max(dist, 0), 1);
    const opacity = t < 0.5 ? 0 : (t - 0.5) * 2;
    return { opacity };
  });

  const labelStyle = useAnimatedStyle(() => {
    const dist = Math.abs(activeIndex.value - tabIndex);
    const t = 1 - Math.min(Math.max(dist, 0), 1);
    const opacity = t < 0.5 ? 0 : (t - 0.5) * 2;
    return {
      opacity,
      transform: [{ scale: 0.6 + t * 0.4 }],
    };
  });

  return (
    <View style={styles.tabContent}>
      <Animated.View style={[styles.iconLayer, iconStyle]}>
        <Ionicons name={icon as any} size={24} color={inactiveColor} />
      </Animated.View>
      <Animated.View style={[styles.labelLayer, labelStyle]}>
        <Text style={[styles.labelText, { color: activeColor }]}>{label}</Text>
      </Animated.View>
    </View>
  );
};

export const FloatingTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme<Theme>();
  const bottomPadding = Math.max(insets.bottom, 12);

  const tabCount = state.routes.length;
  const activeIndex = useSharedValue(state.index);
  const dotLeft = useSharedValue(0);
  const dotScaleX = useSharedValue(1);
  const isFirstRender = useRef(true);
  const tabXPositions = useRef<number[]>(new Array(tabCount).fill(0));

  const getDotLeft = (index: number) => {
    const tabX = tabXPositions.current[index] ?? 0;
    return tabX + (TAB_WIDTH - DOT_SIZE) / 2;
  };

  useEffect(() => {
    activeIndex.value = withSpring(state.index, SPRING_CONFIG);

    const targetLeft = getDotLeft(state.index);

    if (isFirstRender.current) {
      isFirstRender.current = false;
      dotLeft.value = targetLeft;
      return;
    }

    dotScaleX.value = withSequence(
      withTiming(8, { duration: 150, easing: Easing.out(Easing.cubic) }),
      withSpring(1, { damping: 30, stiffness: 200 }),
    );
    dotLeft.value = withSpring(targetLeft, {
      damping: 18,
      stiffness: 160,
      mass: 0.8,
    });
  }, [state.index, activeIndex, dotLeft, dotScaleX]);

  const dotAnimStyle = useAnimatedStyle(() => ({
    left: dotLeft.value,
    transform: [{ scaleX: dotScaleX.value }],
  }));

  const onTabLayout = (index: number) => (e: LayoutChangeEvent) => {
    tabXPositions.current[index] = e.nativeEvent.layout.x;
    if (index === state.index) {
      dotLeft.value = e.nativeEvent.layout.x + (TAB_WIDTH - DOT_SIZE) / 2;
    }
  };

  const onCreateListing = () => navigation.getParent()?.navigate('createListing' as never);

  return (
    <Box pointerEvents="box-none" style={[styles.wrapper, { paddingBottom: bottomPadding }]}>
      <Box style={styles.row}>
        <Box
          style={[styles.pill, styles.pillShadow]}
          backgroundColor="card"
          borderRadius="pill"
          borderWidth={1}
          borderColor="border"
          paddingHorizontal="l"
          paddingVertical="xs"
        >
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const routeName = route.name as keyof typeof TAB_CONFIG;
            const config = TAB_CONFIG[routeName] ?? TAB_CONFIG.home;

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

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
                onLayout={onTabLayout(index)}
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={descriptors[route.key]?.options?.tabBarAccessibilityLabel}
                testID={descriptors[route.key]?.options?.tabBarButtonTestID}
                style={styles.tabButton}
              >
                <AnimatedTab
                  icon={config.inactive}
                  label={config.label}
                  activeColor={theme.colors.brandDark}
                  inactiveColor={theme.colors.textPrimary}
                  tabIndex={index}
                  activeIndex={activeIndex}
                />
              </Pressable>
            );
          })}

          <Animated.View
            style={[styles.dot, { backgroundColor: theme.colors.brandDark }, dotAnimStyle]}
          />
        </Box>

        <Pressable
          style={styles.addButtonPressable}
          onPress={onCreateListing}
          accessibilityRole="button"
          accessibilityLabel="Create listing"
        >
          <Box
            style={[styles.addButton, styles.addButtonShadow]}
            borderRadius="pill"
            backgroundColor="brandDark"
            borderWidth={1}
            borderColor="brand"
            alignItems="center"
            justifyContent="center"
          >
            <Ionicons name="bag-add-outline" size={30} color={theme.colors.onPrimary} />
          </Box>
        </Pressable>
      </Box>
    </Box>
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
    minWidth: 250,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderRadius: 999,
  },
  pillShadow: {
    shadowColor: colors.ui.primary,
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 8,
  },
  tabButton: {
    width: TAB_WIDTH,
    height: TAB_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    width: TAB_WIDTH,
    height: TAB_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLayer: {
    position: 'absolute',
  },
  labelLayer: {
    position: 'absolute',
  },
  labelText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  dot: {
    position: 'absolute',
    bottom: 6,
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonPressable: {
    borderRadius: 999,
  },
  addButtonShadow: {
    shadowColor: colors.ui.secondary,
    shadowOpacity: 0.34,
    shadowOffset: { width: 0, height: 7 },
    shadowRadius: 14,
    elevation: 10,
  },
});
