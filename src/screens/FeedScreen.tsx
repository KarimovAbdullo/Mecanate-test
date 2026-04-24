import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
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
import { colors, spacing, typography } from '../theme/tokens';
import type { Post } from '../types/api';

const SKELETON_ITEMS = [0, 1, 2];

export const FeedScreen = observer(function FeedScreen() {
  const tier = feedUiStore.tierFilter;
  const query = usePostsFeed({ tier });
  const likeMutation = useToggleLike();

  const rawPosts = useMemo<Post[]>(
    () => query.data?.pages.flatMap((p) => p.posts) ?? [],
    [query.data],
  );

  const posts = feedUiStore.applyClientFilters(rawPosts);

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

  if (query.isError && rawPosts.length === 0) {
    return (
      <SafeAreaView style={styles.flex} edges={['top']}>
        <FeedHeader />
        <ErrorState onRetry={() => query.refetch()} />
      </SafeAreaView>
    );
  }

  if (query.isLoading) {
    return (
      <SafeAreaView style={styles.flex} edges={['top']}>
        <FeedHeader />
        <View style={styles.skeletonList}>
          {SKELETON_ITEMS.map((key) => (
            <PostCardSkeleton key={key} />
          ))}
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
        ListHeaderComponent={FeedHeader}
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
        ListEmptyComponent={
          feedUiStore.isFiltered && rawPosts.length > 0 ? (
            <EmptyFiltered />
          ) : null
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

const EmptyFiltered = observer(function EmptyFiltered() {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>Ничего не найдено</Text>
      <Text style={styles.emptyText}>
        По текущим фильтрам ({feedUiStore.activeFiltersCount}) публикаций нет.
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.screen,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxxl,
    flexGrow: 1,
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
  empty: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  emptyText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
