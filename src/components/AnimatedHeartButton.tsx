import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const PARTICLE_COUNT = 8;
const BURST_RADIUS = 40;
const PARTICLE_COLORS = ['#E8475F', '#FF6B8A', '#D6A2AD', '#668F80', '#C3B59F', '#A0AF84', '#4A6670', '#955362'];

interface ParticleProps {
  endX: number;
  endY: number;
  color: string;
  progress: SharedValue<number>;
}

const Particle = ({ endX, endY, color, progress }: ParticleProps) => {
  const animStyle = useAnimatedStyle(() => {
    const t = progress.value;

    let x: number;
    let y: number;
    let scale: number;
    let opacity: number;

    if (t <= 0.5) {
      const outT = t / 0.5;
      x = endX * outT;
      y = endY * outT;
      scale = 0.3 + outT * 0.7;
      opacity = 0.2 + outT * 0.8;
    } else {
      const inT = (t - 0.5) / 0.5;
      x = endX * (1 - inT);
      y = endY * (1 - inT);
      scale = 1 - inT * 0.8;
      opacity = 1 - inT;
    }

    return {
      transform: [{ translateX: x }, { translateY: y }, { scale }],
      opacity,
    };
  });

  return <Animated.View style={[styles.particle, { backgroundColor: color }, animStyle]} />;
};

interface AnimatedHeartButtonProps {
  isSaved: boolean;
  onToggle: () => void;
  size?: number;
  iconSize?: number;
  color?: string;
  savedColor?: string;
  backgroundColor?: string;
  borderColor?: string;
}

export const AnimatedHeartButton = ({
  isSaved,
  onToggle,
  size = 34,
  iconSize = 20,
  color = '#30464E',
  savedColor = '#E8475F',
  backgroundColor = '#F7F2EA',
  borderColor = '#C6B8A2',
}: AnimatedHeartButtonProps) => {
  const mainScale = useSharedValue(1);
  const particleProgress = useSharedValue(0);

  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
      return {
        endX: Math.cos(angle) * BURST_RADIUS,
        endY: Math.sin(angle) * BURST_RADIUS,
        color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
      };
    });
  }, []);

  const handlePress = useCallback(() => {
    if (!isSaved) {
      particleProgress.value = 0;
      particleProgress.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });

      mainScale.value = withSequence(
        withTiming(0.6, { duration: 100 }),
        withDelay(500, withSpring(1, { damping: 30, stiffness: 300 })),
      );
    } else {
      mainScale.value = withSequence(
        withTiming(0.7, { duration: 120 }),
        withSpring(1, { damping: 20, stiffness: 400 }),
      );
    }

    runOnJS(onToggle)();
  }, [isSaved, mainScale, onToggle, particleProgress]);

  const mainAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: mainScale.value }],
  }));

  return (
    <Pressable onPress={handlePress} style={styles.pressable}>
      <View
        style={[
          styles.container,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor,
            borderColor,
          },
        ]}
      >
        {particles.map((p, i) => (
          <Particle key={i} endX={p.endX} endY={p.endY} color={p.color} progress={particleProgress} />
        ))}

        <Animated.View style={mainAnimStyle}>
          <Ionicons
            name={isSaved ? 'heart' : 'heart-outline'}
            size={iconSize}
            color={isSaved ? savedColor : color}
          />
        </Animated.View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 999,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    overflow: 'visible',
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0,
  },
});
