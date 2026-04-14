export function RepositoryListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: スケルトンのプレースホルダーで並び替えが発生しないため
          key={i}
          className="h-20 rounded-lg border border-border bg-muted animate-pulse"
        />
      ))}
    </div>
  );
}
