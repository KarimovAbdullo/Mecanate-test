import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/tokens';
import type { Tier } from '../types/api';

interface Props {
  tier: Tier | undefined;
  onChangeTier: (tier: Tier | undefined) => void;
}

const OPTIONS: { value: Tier | undefined; label: string }[] = [
  { value: undefined, label: 'Все' },
  { value: 'free', label: 'Бесплатно' },
  { value: 'paid', label: 'Платно' },
];

export function FeedHeader({ tier, onChangeTier }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Лента</Text>
      <View style={styles.filters}>
        {OPTIONS.map((opt) => {
          const active = opt.value === tier;
          return (
            <Pressable
              key={opt.label}
              onPress={() => onChangeTier(opt.value)}
              style={({ pressed }) => [
                styles.chip,
                active && styles.chipActive,
                pressed && styles.pressed,
              ]}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.md,
    backgroundColor: colors.screen,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    fontSize: 28,
    lineHeight: 34,
  },
  filters: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: 'transparent',
  },
  chipActive: {
    backgroundColor: colors.accent,
  },
  pressed: {
    opacity: 0.7,
  },
  chipText: {
    ...typography.meta,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.background,
  },
});
