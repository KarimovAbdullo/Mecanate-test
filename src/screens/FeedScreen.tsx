import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  type ListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedListItem } from '../components/AnimatedListItem';
import { ErrorState } from '../components/ErrorState';
import { FeedHeader } from '../components/FeedHeader';
import { PostCard } from '../components/PostCard';
import { PostCardSkeleton } from '../components/PostCardSkeleton';
import { usePostsFeed } from '../hooks/usePostsFeed';
import { useToggleLike } from '../hooks/useToggleLike';
import { feedUiStore } from '../store';
import { colors, spacing } from '../theme/tokens';
import type { Post } from '../types/api';

export const FeedScreen = observer(function FeedScreen() {
  const tier = feedUiStore.tierFilter;
  const query = usePostsFeed({ tier });
  const likeMutation = useToggleLike();

  const posts = useMemo<Post[]>(
    () => query.data?.pages.flatMap((p) => p.posts) ?? [],
    [query.data],
  );

  const handleLike = useCallback(
    (postId: string) => likeMutation.mutate({ postId }),
    [likeMutation],
  );

  const renderItem = useCallback<ListRenderItem<Post>>(
    ({ item, index }) => (
      <AnimatedListItem index={index}>
        <PostCard post={item} onToggleLike={handleLike} />
      </AnimatedListItem>
    ),
    [handleLike],
  );

  const keyExtractor = useCallback((item: Post) => item.id, []);

  const onEndReached = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [query]);

  const ListHeader = (
    <FeedHeader tier={tier} onChangeTier={(t) => feedUiStore.setTier(t)} />
  );

  if (query.isError && posts.length === 0) {
    return (
      <SafeAreaView style={styles.flex} edges={['top']}>
        {ListHeader}
        <ErrorState onRetry={() => query.refetch()} />
      </SafeAreaView>
    );
  }

  if (query.isLoading) {
    return (
      <SafeAreaView style={styles.flex} edges={['top']}>
        {ListHeader}
        <View style={styles.skeletonList}>
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.flex} edges={['top']}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={Separator}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={query.isRefetching && !query.isFetchingNextPage}
            onRefresh={() => query.refetch()}
            tintColor={colors.accent}
          />
        }
        ListFooterComponent={
          query.isFetchingNextPage ? (
            <View style={styles.footer}>
              <ActivityIndicator color={colors.accent} />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
});

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.screen,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  separator: {
    height: spacing.sm,
  },
  skeletonList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  footer: {
    paddingVertical: spacing.xl,
  },
});
