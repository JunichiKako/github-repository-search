import { Suspense } from "react";
import { PopularRepositoryList } from "@/components/popular-repository-list";
import { RepositoryList } from "@/components/repository-list";
import { RepositoryListSkeleton } from "@/components/repository-list-skeleton";
import { SearchForm } from "@/components/search-form";

type HomePageProps = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const { q: query, page } = await searchParams;
  const currentPage = Number(page) || 1;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <p className="mt-2 text-muted-foreground">
        キーワードを入力してGitHubリポジトリを検索できます。
      </p>

      <div className="mt-6">
        <SearchForm query={query} />
      </div>

      <div className="mt-6">
        <Suspense
          key={query ? `${query}-${currentPage}` : "popular"}
          fallback={<RepositoryListSkeleton />}
        >
          {query ? (
            <RepositoryList query={query} page={currentPage} />
          ) : (
            <PopularRepositoryList />
          )}
        </Suspense>
      </div>
    </div>
  );
}
