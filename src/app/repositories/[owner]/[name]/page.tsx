import Image from "next/image";
import Link from "next/link";
import { getRepository } from "@/data/github-repositories";

type RepositoryDetailPageProps = {
  params: Promise<{ owner: string; name: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
};

export default async function RepositoryDetailPage({
  params,
  searchParams,
}: RepositoryDetailPageProps) {
  const { owner, name } = await params;
  const { q, page } = await searchParams;
  const repository = await getRepository(owner, name);

  const backHref = q ? `/?q=${encodeURIComponent(q)}&page=${page ?? "1"}` : "/";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link
        href={backHref}
        className="text-sm text-muted-foreground hover:underline"
      >
        ← 検索結果に戻る
      </Link>

      <div className="mt-6 flex items-start gap-4">
        <Image
          src={repository.owner.avatar_url}
          alt={`${repository.owner.login} avatar`}
          width={80}
          height={80}
          className="rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold">{repository.full_name}</h1>
          {repository.description && (
            <p className="mt-2 text-muted-foreground">
              {repository.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Language" value={repository.language ?? "N/A"} />
        <StatCard
          label="Stars"
          value={repository.stargazers_count.toLocaleString()}
        />
        <StatCard
          label="Watchers"
          value={repository.watchers_count.toLocaleString()}
        />
        <StatCard
          label="Forks"
          value={repository.forks_count.toLocaleString()}
        />
        <StatCard
          label="Issues"
          value={repository.open_issues_count.toLocaleString()}
        />
      </div>

      <div className="mt-8">
        <a
          href={repository.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-primary hover:underline"
        >
          GitHubで見る →
        </a>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}
