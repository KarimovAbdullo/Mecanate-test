export function formatCount(value: number): string {
  if (value < 1000) return String(value);
  if (value < 10_000) return `${(value / 1000).toFixed(1)}K`;
  if (value < 1_000_000) return `${Math.round(value / 1000)}K`;
  return `${(value / 1_000_000).toFixed(1)}M`;
}

export function formatRelativeTime(iso: string, now: number = Date.now()): string {
  const date = new Date(iso).getTime();
  const diffSec = Math.max(0, Math.round((now - date) / 1000));

  if (diffSec < 60) return 'только что';
  const min = Math.round(diffSec / 60);
  if (min < 60) return `${min} мин назад`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} ч назад`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d} д назад`;
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  });
}
