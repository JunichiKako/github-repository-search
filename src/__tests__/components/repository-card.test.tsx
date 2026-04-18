import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RepositoryCard } from "@/components/repository-card";
import type { GitHubRepository } from "@/types/github";

const baseRepository: GitHubRepository = {
  id: 1,
  name: "react",
  full_name: "facebook/react",
  owner: {
    login: "facebook",
    avatar_url: "https://avatars.githubusercontent.com/u/69631?v=4",
  },
  description: "The library for web and native user interfaces.",
  language: "JavaScript",
  stargazers_count: 230000,
  watchers_count: 230000,
  forks_count: 47000,
  open_issues_count: 1000,
  html_url: "https://github.com/facebook/react",
};

describe("RepositoryCard", () => {
  it("リポジトリ名と説明、言語、スター数を表示する", () => {
    render(<RepositoryCard repository={baseRepository} />);

    expect(screen.getByText("facebook/react")).toBeDefined();
    expect(
      screen.getByText("The library for web and native user interfaces."),
    ).toBeDefined();
    expect(screen.getByText("JavaScript")).toBeDefined();
    expect(screen.getByText(/230,000/)).toBeDefined();
  });

  it("詳細ページへのリンクを持つ", () => {
    render(<RepositoryCard repository={baseRepository} />);

    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/repositories/facebook/react");
  });
});
