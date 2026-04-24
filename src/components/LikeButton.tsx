import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors, iconSize, opacity, spacing, touch, typography } from '../theme/tokens';
import { formatCount } from '../utils/format';

interface Props {
  liked: boolean;
  count: number;
  onPress: () => void;
  disabled?: boolean;
}

const PRESS_DURATION = 160;

export function LikeButton({ liked, count, onPress, disabled }: Props) {
  const scale = useSharedValue(1);
  const previousLiked = useRef(liked);

  useEffect(() => {
    if (liked !== previousLiked.current && liked) {
      scale.value = withSequence(
        withTiming(1.35, { duration: PRESS_DURATION, easing: Easing.out(Easing.cubic) }),
        withTiming(1, { duration: PRESS_DURATION, easing: Easing.in(Easing.cubic) }),
      );
    }
    previousLiked.current = liked;
  }, [liked, scale]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${interpolate(scale.value, [1, 1.35], [0, 6])}deg` },
    ],
  }));

  const handlePress = useCallback(() => {
    if (disabled) return;
    Haptics.impactAsync(
      liked ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium,
    ).catch(() => {});
    onPress();
  }, [disabled, liked, onPress]);

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={touch.hitSlop}
      disabled={disabled}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <Animated.View style={iconStyle}>
        <Ionicons
          name={liked ? 'heart' : 'heart-outline'}
          size={iconSize.md}
          color={liked ? colors.like : colors.textSecondary}
        />
      </Animated.View>
      <View style={styles.countWrap}>
        <Animated.View
          key={count}
          entering={FadeIn.duration(180)}
          exiting={FadeOut.duration(120)}>
          <Text style={[styles.count, liked && styles.countActive]}>
            {formatCount(count)}
          </Text>
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pressed: {
    opacity: opacity.subtle,
  },
  countWrap: {
    minWidth: spacing.xxxl,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  count: {
    ...typography.meta,
    color: colors.textSecondary,
  },
  countActive: {
    color: colors.like,
  },
});
