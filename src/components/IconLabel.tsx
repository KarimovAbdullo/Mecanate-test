import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import { colors, spacing, typography } from '../theme/tokens';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface Props {
  icon: IoniconsName;
  label: string;
  active?: boolean;
  activeColor?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function IconLabel({ icon, label, active, activeColor, onPress, style }: Props) {
  const color = active ? activeColor ?? colors.accent : colors.textSecondary;
  const Wrapper = onPress ? Pressable : undefined;

  const content = (
    <>
      <Ionicons name={icon} size={18} color={color} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </>
  );

  if (Wrapper) {
    return (
      <Pressable
        onPress={onPress}
        hitSlop={8}
        style={({ pressed }) => [styles.row, style, pressed && styles.pressed]}>
        {content}
      </Pressable>
    );
  }

  return <>{content}</>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  label: {
    ...typography.meta,
  },
  pressed: {
    opacity: 0.6,
  },
});
