import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  colors,
  iconSize,
  layout,
  opacity,
  radius,
  spacing,
  typography,
} from '../theme/tokens';

interface Props {
  coverUrl?: string;
  onDonate?: () => void;
}

export function PaidPlaceholder({ coverUrl, onDonate }: Props) {
  return (
    <View style={styles.container}>
      {coverUrl ? (
        <Image
          source={{ uri: coverUrl }}
          style={styles.backdrop}
          contentFit="cover"
          blurRadius={28}
        />
      ) : null}
      <View style={styles.scrim} />
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Ionicons name="logo-usd" size={iconSize.md} color={colors.onAccent} />
        </View>
        <Text style={styles.text}>
          Контент скрыт пользователем.{'\n'}Доступ откроется после доната
        </Text>
        <Pressable
          onPress={onDonate}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
          <Text style={styles.buttonText}>Отправить донат</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    aspectRatio: layout.coverAspectRatio,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.accent,
    opacity: opacity.pressed,
  },
  content: {
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  iconWrap: {
    width: layout.iconWrapSm,
    height: layout.iconWrapSm,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...typography.caption,
    color: colors.onAccent,
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },
  buttonPressed: {
    backgroundColor: colors.accentPressed,
  },
  buttonText: {
    ...typography.meta,
    color: colors.onAccent,
  },
});
