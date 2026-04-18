import { RepositoryCard } from "@/components/repository-card";
import { SearchPagination } from "@/components/search-pagination";
import { searchRepositories } from "@/data/github-repositories";

const PER_PAGE = 30;

type RepositoryListProps = {
  query: string;
  page: number;
};

export async function RepositoryList({ query, page }: RepositoryListProps) {
  const result = await searchRepositories({
    q: query,
    page,
    perPage: PER_PAGE,
  });

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
      <SearchPagination
        currentPage={page}
        totalCount={result.total_count}
        perPage={PER_PAGE}
        query={query}
      />
    </div>
  );
}
