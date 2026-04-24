import { observer } from 'mobx-react-lite';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { feedUiStore } from '../store';
import { colors, opacity, radius, spacing, typography } from '../theme/tokens';
import type { Tier } from '../types/api';

const OPTIONS: { value: Tier | undefined; label: string }[] = [
  { value: undefined, label: 'Все' },
  { value: 'free', label: 'Бесплатные' },
  { value: 'paid', label: 'Платные' },
];

export const FeedHeader = observer(function FeedHeader() {
  const tier = feedUiStore.tierFilter;

  return (
    <View style={styles.container}>
      <View style={styles.segmented}>
        {OPTIONS.map((opt) => {
          const active = opt.value === tier;
          return (
            <Pressable
              key={opt.label}
              onPress={() => feedUiStore.setTier(opt.value)}
              style={({ pressed }) => [
                styles.segment,
                active && styles.segmentActive,
                pressed && !active && styles.pressed,
              ]}>
              <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.screen,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: radius.pill,
    padding: spacing.xs,
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  segmentActive: {
    backgroundColor: colors.accent,
  },
  pressed: {
    opacity: opacity.subtle,
  },
  segmentText: {
    ...typography.meta,
    color: colors.textSecondary,
  },
  segmentTextActive: {
    color: colors.onAccent,
  },
});
