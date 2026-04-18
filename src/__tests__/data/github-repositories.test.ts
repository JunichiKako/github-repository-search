import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { getRepository, searchRepositories } from "@/data/github-repositories";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("searchRepositories", () => {
  it("検索結果を取得できる", async () => {
    const mockResponse = {
      total_count: 1,
      incomplete_results: false,
      items: [],
    };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await searchRepositories({ q: "react" });

    expect(result).toEqual(mockResponse);
    const calledUrl = fetchMock.mock.calls[0][0];
    expect(calledUrl).toContain("q=react");
    expect(calledUrl).toContain("page=1");
    expect(calledUrl).toContain("per_page=30");
  });

  it("403のとき「レート制限」エラーを投げる", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        statusText: "Forbidden",
      }),
    );

    await expect(searchRepositories({ q: "react" })).rejects.toThrow(
      /レート制限/,
    );
  });

  it("422のとき「検索クエリが不正」エラーを投げる", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 422,
        statusText: "Unprocessable Entity",
      }),
    );

    await expect(searchRepositories({ q: "" })).rejects.toThrow(
      /検索クエリが不正/,
    );
  });

  it("その他のエラーは汎用メッセージを投げる", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      }),
    );

    await expect(searchRepositories({ q: "react" })).rejects.toThrow(
      /GitHub APIエラー/,
    );
  });
});

describe("getRepository", () => {
  it("リポジトリ情報を取得できる", async () => {
    const mockRepo = {
      id: 1,
      name: "react",
      full_name: "facebook/react",
      owner: {
        login: "facebook",
        avatar_url: "https://example.com/avatar.png",
      },
      description: "A JavaScript library",
      language: "JavaScript",
      stargazers_count: 230000,
      watchers_count: 230000,
      forks_count: 47000,
      open_issues_count: 1000,
      html_url: "https://github.com/facebook/react",
    };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockRepo,
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await getRepository("facebook", "react");

    expect(result).toEqual(mockRepo);
    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain("/repos/facebook/react");
  });

  it("404のとき「見つかりませんでした」エラーを投げる", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
      }),
    );

    await expect(getRepository("owner", "repo")).rejects.toThrow(
      /見つかりませんでした/,
    );
  });
});
