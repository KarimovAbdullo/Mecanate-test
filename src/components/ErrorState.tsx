import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, iconSize, layout, opacity, radius, spacing, typography } from '../theme/tokens';

interface Props {
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  message = 'Не удалось загрузить публикации',
  onRetry,
  retryLabel = 'Повторить',
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="cloud-offline-outline" size={iconSize.xl} color={colors.accent} />
      </View>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <Pressable
          onPress={onRetry}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
          <Text style={styles.buttonText}>{retryLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.xxl,
    gap: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    margin: spacing.lg,
  },
  iconWrap: {
    width: layout.iconWrapLg,
    height: layout.iconWrapLg,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  button: {
    alignSelf: 'stretch',
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: colors.accentPressed,
    opacity: opacity.subtle,
  },
  buttonText: {
    ...typography.h2,
    color: colors.onAccent,
  },
});
