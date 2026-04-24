import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';
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
  onSubmit: (text: string) => Promise<void> | void;
  submitting?: boolean;
  placeholder?: string;
  maxLength?: number;
  bottomInset?: number;
}

const MAX_LENGTH = 500;

export function CommentInput({
  onSubmit,
  submitting,
  placeholder = 'Ваш комментарий',
  maxLength = MAX_LENGTH,
  bottomInset = 0,
}: Props) {
  const [text, setText] = useState('');
  const trimmed = text.trim();
  const disabled = submitting || trimmed.length === 0;

  const handleSend = useCallback(async () => {
    if (disabled) return;
    const value = trimmed;
    setText('');
    try {
      await onSubmit(value);
    } catch {
      setText(value);
    }
  }, [disabled, onSubmit, trimmed]);

  return (
    <View style={[styles.container, { paddingBottom: bottomInset + spacing.sm }]}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        style={styles.input}
        multiline
        maxLength={maxLength}
        editable={!submitting}
      />
      <Pressable
        onPress={handleSend}
        disabled={disabled}
        style={({ pressed }) => [
          styles.send,
          disabled && styles.sendDisabled,
          pressed && !disabled && styles.sendPressed,
        ]}>
        {submitting ? (
          <ActivityIndicator color={colors.accent} />
        ) : (
          <Ionicons
            name="send"
            size={iconSize.md}
            color={disabled ? colors.textTertiary : colors.accent}
          />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    maxHeight: layout.inputMaxHeight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.screen,
    ...typography.body,
    color: colors.textPrimary,
  },
  send: {
    width: layout.touchTarget,
    height: layout.touchTarget,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: {
    opacity: opacity.disabled,
  },
  sendPressed: {
    opacity: opacity.pressed,
  },
});
