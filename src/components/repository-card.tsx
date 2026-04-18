import Image from "next/image";
import Link from "next/link";
import type { GitHubRepository } from "@/types/github";

type RepositoryCardProps = {
  repository: GitHubRepository;
};

export function RepositoryCard({ repository }: RepositoryCardProps) {
  return (
    <Link
      href={`/repositories/${repository.owner.login}/${repository.name}`}
      className="block rounded-lg border border-border p-4 transition-colors hover:bg-muted"
    >
      <div className="flex items-start gap-3">
        <Image
          src={repository.owner.avatar_url}
          alt={`${repository.owner.login} avatar`}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate">{repository.full_name}</div>
          {repository.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {repository.description}
            </p>
          )}
          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
            {repository.language && <span>{repository.language}</span>}
            <span>★ {repository.stargazers_count.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
