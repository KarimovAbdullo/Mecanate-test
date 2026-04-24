import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ListRenderItem,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../components/Avatar';
import { CommentInput } from '../components/CommentInput';
import { CommentItem } from '../components/CommentItem';
import { ErrorState } from '../components/ErrorState';
import { IconLabel } from '../components/IconLabel';
import { LikeButton } from '../components/LikeButton';
import { PaidPlaceholder } from '../components/PaidPlaceholder';
import { useComments } from '../hooks/useComments';
import { useCreateComment } from '../hooks/useCreateComment';
import { usePostDetail } from '../hooks/usePostDetail';
import { useToggleLike } from '../hooks/useToggleLike';
import { useWsCacheSync } from '../hooks/useWsCacheSync';
import { commentsUiStore } from '../store';
import {
  colors,
  iconSize,
  layout,
  opacity,
  radius,
  spacing,
  touch,
  typography,
} from '../theme/tokens';
import type { Comment } from '../types/api';
import { formatCount } from '../utils/format';

interface Props {
  id: string;
}

export const PostDetailScreen = observer(function PostDetailScreen({ id }: Props) {
  useWsCacheSync();

  const insets = useSafeAreaInsets();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hide = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const detail = usePostDetail(id);
  const comments = useComments(id);
  const likeMutation = useToggleLike();
  const createComment = useCreateComment(id);

  const post = detail.data?.post;
  const rawComments = useMemo<Comment[]>(
    () => comments.data?.pages.flatMap((page) => page.comments) ?? [],
    [comments.data],
  );
  const sortedComments = commentsUiStore.sortedComments(rawComments);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }, []);

  const handleLike = useCallback(() => {
    likeMutation.mutate({ postId: id });
  }, [id, likeMutation]);

  const handleSubmitComment = useCallback(
    async (text: string) => {
      await createComment.mutateAsync({ text });
    },
    [createComment],
  );

  const onEndReached = useCallback(() => {
    if (comments.hasNextPage && !comments.isFetchingNextPage) {
      comments.fetchNextPage();
    }
  }, [comments]);

  const renderComment = useCallback<ListRenderItem<Comment>>(
    ({ item }) => <CommentItem comment={item} />,
    [],
  );

  if (detail.isLoading) {
    return (
      <SafeAreaView style={styles.flex} edges={['top']}>
        <DetailTopBar onBack={handleBack} />
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (detail.isError || !post) {
    return (
      <SafeAreaView style={styles.flex} edges={['top']}>
        <DetailTopBar onBack={handleBack} />
        <ErrorState onRetry={() => detail.refetch()} />
      </SafeAreaView>
    );
  }

  const isPaid = post.tier === 'paid';

  const header = (
    <View>
      <View style={styles.authorRow}>
        <Avatar uri={post.author.avatarUrl} size={layout.avatarMd} />
        <Text style={styles.authorName} numberOfLines={1}>
          {post.author.displayName}
        </Text>
      </View>

      <View style={styles.postCard}>
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
        {!isPaid && post.body ? <Text style={styles.body}>{post.body}</Text> : null}

        <View style={styles.meta}>
          <LikeButton
            liked={post.isLiked}
            count={post.likesCount}
            onPress={handleLike}
          />
          <IconLabel
            icon="chatbubble-outline"
            label={formatCount(post.commentsCount)}
          />
        </View>
      </View>

      <View style={styles.commentsHeader}>
        <Text style={styles.commentsTitle}>
          {post.commentsCount} {pluralizeComments(post.commentsCount)}
        </Text>
        <Pressable
          onPress={() => commentsUiStore.toggleSort()}
          hitSlop={touch.hitSlop}
          style={({ pressed }) => [pressed && styles.pressed]}>
          <Text style={styles.sortLabel}>{commentsUiStore.sortLabel}</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.flex} edges={['top']}>
      <DetailTopBar onBack={handleBack} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}>
        <FlatList
          data={sortedComments}
          renderItem={renderComment}
          keyExtractor={keyExtractor}
          ListHeaderComponent={header}
          ListFooterComponent={
            comments.isFetchingNextPage ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator color={colors.accent} />
              </View>
            ) : null
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
        />
        <CommentInput
          onSubmit={handleSubmitComment}
          submitting={createComment.isPending}
          bottomInset={keyboardVisible ? 0 : insets.bottom}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

function DetailTopBar({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.topBar}>
      <Pressable
        onPress={onBack}
        hitSlop={touch.hitSlop}
        style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}>
        <Ionicons name="chevron-back" size={iconSize.lg} color={colors.textPrimary} />
      </Pressable>
    </View>
  );
}

function keyExtractor(item: Comment) {
  return item.id;
}

function pluralizeComments(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return 'комментарий';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'комментария';
  return 'комментариев';
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.screen,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBar: {
    height: layout.iconWrapSm,
    paddingHorizontal: spacing.sm,
    justifyContent: 'center',
    backgroundColor: colors.screen,
  },
  backBtn: {
    width: layout.touchTarget,
    height: layout.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: opacity.pressed,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    marginHorizontal: spacing.md,
  },
  authorName: {
    ...typography.h2,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  postCard: {
    backgroundColor: colors.background,
    marginHorizontal: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  cover: {
    width: '100%',
    aspectRatio: layout.coverAspectRatio,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
  },
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.md,
    backgroundColor: colors.background,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    marginBottom: spacing.md,
  },
  commentsTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  sortLabel: {
    ...typography.meta,
    color: colors.accent,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  footerLoader: {
    paddingVertical: spacing.lg,
  },
});
