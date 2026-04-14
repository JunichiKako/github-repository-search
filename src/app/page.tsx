import { Suspense } from "react";
import { RepositoryList } from "@/components/repository-list";
import { RepositoryListSkeleton } from "@/components/repository-list-skeleton";
import { SearchForm } from "@/components/search-form";

type HomePageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const { q: query } = await searchParams;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <p className="mt-2 text-muted-foreground">
        キーワードを入力してGitHubリポジトリを検索できます。
      </p>

      <div className="mt-6">
        <SearchForm defaultValue={query} />
      </div>

      {query && (
        <div className="mt-6">
          <Suspense key={query} fallback={<RepositoryListSkeleton />}>
            <RepositoryList query={query} />
          </Suspense>
        </div>
      )}
    </div>
  );
}
