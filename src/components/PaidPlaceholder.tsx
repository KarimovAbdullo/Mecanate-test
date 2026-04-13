import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/tokens';

interface Props {
  onSubscribe?: () => void;
}

export function PaidPlaceholder({ onSubscribe }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="lock-closed" size={20} color="#FFFFFF" />
      </View>
      <Text style={styles.text}>
        Контент скрыт владельцем. Доступен открытым после оплаты.
      </Text>
      <Pressable
        onPress={onSubscribe}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
        <Text style={styles.buttonText}>Отправить</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...typography.caption,
    color: colors.textSecondary,
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
  },
  buttonText: {
    ...typography.h2,
    color: '#FFFFFF',
  },
});
