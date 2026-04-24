import { Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { feedUiStore } from '../store';
import {
  colors,
  iconSize,
  opacity,
  radius,
  spacing,
  typography,
} from '../theme/tokens';
import type { Tier } from '../types/api';

const OPTIONS: { value: Tier | undefined; label: string }[] = [
  { value: undefined, label: 'Все' },
  { value: 'free', label: 'Бесплатно' },
  { value: 'paid', label: 'Платно' },
];

export const FeedHeader = observer(function FeedHeader() {
  const tier = feedUiStore.tierFilter;
  const likedOnly = feedUiStore.showLikedOnly;

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{feedUiStore.tierLabel}</Text>
        {feedUiStore.isFiltered ? (
          <Pressable
            onPress={() => feedUiStore.clearFilters()}
            hitSlop={spacing.sm}
            style={({ pressed }) => [styles.reset, pressed && styles.pressed]}>
            <Text style={styles.resetText}>
              Сбросить · {feedUiStore.activeFiltersCount}
            </Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.searchRow}>
        <Ionicons
          name="search"
          size={iconSize.sm}
          color={colors.textTertiary}
          style={styles.searchIcon}
        />
        <TextInput
          value={feedUiStore.searchQuery}
          onChangeText={(text) => feedUiStore.setSearchQuery(text)}
          placeholder="Поиск по ленте"
          placeholderTextColor={colors.textTertiary}
          style={styles.searchInput}
          autoCorrect={false}
          returnKeyType="search"
        />
        {feedUiStore.searchQuery.length > 0 ? (
          <Pressable
            onPress={() => feedUiStore.setSearchQuery('')}
            hitSlop={spacing.sm}>
            <Ionicons
              name="close-circle"
              size={iconSize.md}
              color={colors.textTertiary}
            />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.filters}>
        {OPTIONS.map((opt) => {
          const active = opt.value === tier;
          return (
            <Pressable
              key={opt.label}
              onPress={() => feedUiStore.setTier(opt.value)}
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
        <Pressable
          onPress={() => feedUiStore.toggleLikedOnly()}
          style={({ pressed }) => [
            styles.chip,
            likedOnly && styles.chipActive,
            pressed && styles.pressed,
          ]}>
          <Ionicons
            name={likedOnly ? 'heart' : 'heart-outline'}
            size={iconSize.sm}
            color={likedOnly ? colors.onAccent : colors.textSecondary}
          />
          <Text style={[styles.chipText, likedOnly && styles.chipTextActive]}>
            Избранное
          </Text>
        </Pressable>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.md,
    backgroundColor: colors.screen,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...typography.display,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  reset: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.accentMuted,
  },
  resetText: {
    ...typography.meta,
    color: colors.accent,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  searchIcon: {
    marginVertical: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.sm,
    ...typography.body,
    color: colors.textPrimary,
  },
  filters: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.transparent,
  },
  chipActive: {
    backgroundColor: colors.accent,
  },
  pressed: {
    opacity: opacity.subtle,
  },
  chipText: {
    ...typography.meta,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.onAccent,
  },
});
