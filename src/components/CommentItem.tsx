import { Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { commentsUiStore } from '../store';
import {
  colors,
  iconSize,
  layout,
  opacity,
  spacing,
  touch,
  typography,
} from '../theme/tokens';
import type { Comment } from '../types/api';
import { Avatar } from './Avatar';

interface Props {
  comment: Comment;
}

export const CommentItem = observer(function CommentItem({ comment }: Props) {
  const liked = commentsUiStore.isLiked(comment.id);

  return (
    <View style={styles.row}>
      <Avatar uri={comment.author.avatarUrl} size={layout.avatarMd} />
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {comment.author.displayName}
        </Text>
        <Text style={styles.text}>{comment.text}</Text>
      </View>
      <Pressable
        hitSlop={touch.hitSlop}
        onPress={() => commentsUiStore.toggleLike(comment.id)}
        style={({ pressed }) => [styles.like, pressed && styles.pressed]}>
        <Ionicons
          name={liked ? 'heart' : 'heart-outline'}
          size={iconSize.sm}
          color={liked ? colors.like : colors.textTertiary}
        />
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  body: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    ...typography.meta,
    color: colors.textPrimary,
  },
  text: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  like: {
    paddingTop: spacing.xs,
  },
  pressed: {
    opacity: opacity.pressed,
  },
});
