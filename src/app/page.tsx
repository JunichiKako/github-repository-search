import { Suspense } from "react";
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

      {query && (
        <div className="mt-6">
          <Suspense
            key={`${query}-${currentPage}`}
            fallback={<RepositoryListSkeleton />}
          >
            <RepositoryList query={query} page={currentPage} />
          </Suspense>
        </div>
      )}
    </div>
  );
}
