import { StyleSheet, View } from 'react-native';
import { colors, layout, radius, spacing } from '../theme/tokens';

export function PostCardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar} />
        <View style={styles.headerText}>
          <View style={[styles.line, { width: '45%' }]} />
          <View style={[styles.line, { width: '30%', height: 10 }]} />
        </View>
      </View>
      <View style={[styles.line, { width: '80%', height: 18 }]} />
      <View style={[styles.line, { width: '100%' }]} />
      <View style={[styles.line, { width: '90%' }]} />
      <View style={styles.cover} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    gap: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.background,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  avatar: {
    width: layout.avatarMd,
    height: layout.avatarMd,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  headerText: {
    flex: 1,
    gap: spacing.xs,
  },
  line: {
    height: 14,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
  },
  cover: {
    width: '100%',
    aspectRatio: layout.coverAspectRatio,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
});
