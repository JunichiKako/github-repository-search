import { RepositoryCard } from "@/components/repository-card";
import { searchRepositories } from "@/data/github-repositories";

type RepositoryListProps = {
  query: string;
};

export async function RepositoryList({ query }: RepositoryListProps) {
  const result = await searchRepositories({ q: query });

  if (result.items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        該当するリポジトリが見つかりませんでした。
      </p>
    );
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground">
        {result.total_count.toLocaleString()}件ヒット
      </p>
      <div className="mt-4 flex flex-col gap-3">
        {result.items.map((repository) => (
          <RepositoryCard key={repository.id} repository={repository} />
        ))}
      </div>
    </div>
  );
}
