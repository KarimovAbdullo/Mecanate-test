import { Image } from 'expo-image';
import { router } from 'expo-router';
import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, layout, radius, spacing, typography } from '../theme/tokens';
import type { Post } from '../types/api';
import { formatCount } from '../utils/format';
import { Avatar } from './Avatar';
import { IconLabel } from './IconLabel';
import { PaidPlaceholder } from './PaidPlaceholder';

interface Props {
  post: Post;
  onToggleLike: (postId: string) => void;
  onPress?: (postId: string) => void;
}

export const PostCard = memo(function PostCard({ post, onToggleLike, onPress }: Props) {
  const handleLike = useCallback(() => onToggleLike(post.id), [onToggleLike, post.id]);
  const handlePress = useCallback(() => {
    if (onPress) {
      onPress(post.id);
      return;
    }
    router.push(`/post/${post.id}`);
  }, [onPress, post.id]);
  const isPaid = post.tier === 'paid';

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.header}>
        <Avatar uri={post.author.avatarUrl} size={layout.avatarMd} />
        <Text style={styles.displayName} numberOfLines={1}>
          {post.author.displayName}
        </Text>
      </View>

      {isPaid ? (
        <PaidPlaceholder coverUrl={post.coverUrl} />
      ) : post.coverUrl ? (
        <Image
          source={{ uri: post.coverUrl }}
          style={styles.cover}
          contentFit="cover"
          transition={200}
        />
      ) : null}

      {post.title ? <Text style={styles.title}>{post.title}</Text> : null}

      {!isPaid && (post.preview || post.body) ? (
        <Text style={styles.preview} numberOfLines={4}>
          {post.preview || post.body}
        </Text>
      ) : null}

      <View style={styles.footer}>
        <IconLabel
          icon={post.isLiked ? 'heart' : 'heart-outline'}
          label={formatCount(post.likesCount)}
          active={post.isLiked}
          activeColor={colors.like}
          onPress={handleLike}
        />
        <IconLabel
          icon="chatbubble-outline"
          label={formatCount(post.commentsCount)}
          onPress={handlePress}
        />
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  pressed: {
    backgroundColor: colors.overlay,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  displayName: {
    ...typography.h2,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  preview: {
    ...typography.body,
    color: colors.textSecondary,
  },
  cover: {
    width: '100%',
    aspectRatio: layout.coverAspectRatio,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
    paddingTop: spacing.xs,
  },
});
