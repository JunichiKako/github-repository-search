import "server-only";
import type {
  GitHubRepository,
  GitHubSearchRepositoriesResponse,
} from "@/types/github";

export type SearchRepositoriesParams = {
  q: string;
  page?: number;
  perPage?: number;
  sort?: "stars" | "forks" | "help-wanted-issues" | "updated";
  order?: "asc" | "desc";
};

export async function searchRepositories({
  q,
  page = 1,
  perPage = 30,
  sort,
  order,
}: SearchRepositoriesParams): Promise<GitHubSearchRepositoriesResponse> {
  const params = new URLSearchParams({
    q,
    page: String(page),
    per_page: String(perPage),
  });
  if (sort) params.set("sort", sort);
  if (order) params.set("order", order);

  const response = await fetch(
    `https://api.github.com/search/repositories?${params}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2026-03-10",
      },
      next: { revalidate: 3600 },
    },
  );

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("GitHub APIのレート制限に達しました");
    }
    if (response.status === 422) {
      throw new Error("検索クエリが不正です");
    }
    throw new Error(`GitHub APIエラー: ${response.statusText}`);
  }

  return response.json();
}

export async function getRepository(
  owner: string,
  name: string,
): Promise<GitHubRepository> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${name}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2026-03-10",
      },
      next: { revalidate: 3600 },
    },
  );

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("GitHub APIのレート制限に達しました");
    }
    if (response.status === 404) {
      throw new Error("リポジトリが見つかりませんでした");
    }
    throw new Error(`GitHub APIエラー: ${response.statusText}`);
  }

  return response.json();
}
