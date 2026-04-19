import { RepositoryCard } from "@/components/repository-card";
import { searchRepositories } from "@/data/github-repositories";

export async function PopularRepositoryList() {
  const result = await searchRepositories({
    q: "stars:>10000",
    sort: "stars",
    order: "desc",
    perPage: 10,
  });

  return (
    <div>
      <h2 className="text-lg font-semibold">人気のリポジトリ</h2>
      <div className="mt-4 flex flex-col gap-3">
        {result.items.map((repository) => (
          <RepositoryCard
            key={repository.id}
            repository={repository}
            query=""
            page={1}
          />
        ))}
      </div>
    </div>
  );
}
