import { useLocalSearchParams } from 'expo-router';
import { PostDetailScreen } from '../../src/screens/PostDetailScreen';

export default function PostDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PostDetailScreen id={id ?? ''} />;
}
