import { memo, type ReactNode } from 'react';
import { Dimensions } from 'react-native';
import Animated, { Easing, FadeInLeft } from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface Props {
  index: number;
  children: ReactNode;
  pageSize?: number;
  stepMs?: number;
  durationMs?: number;
}

export const AnimatedListItem = memo(function AnimatedListItem({
  index,
  children,
  pageSize = 10,
  stepMs = 130,
  durationMs = 820,
}: Props) {
  const delay = (index % pageSize) * stepMs;

  return (
    <Animated.View
      entering={FadeInLeft.delay(delay)
        .duration(durationMs)
        .easing(Easing.bezier(0.22, 1, 0.36, 1))
        .withInitialValues({
          opacity: 0,
          transform: [{ translateX: -SCREEN_WIDTH }],
        })}>
      {children}
    </Animated.View>
  );
});
