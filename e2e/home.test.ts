import { expect, test } from "@playwright/test";

test("トップページが表示され、検索フォームが存在する", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/GitHub Repository Search/);
  await expect(
    page.getByRole("searchbox", { name: "検索キーワード" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "検索" })).toBeVisible();
});

test("検索を実行すると結果一覧が表示される", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("searchbox", { name: "検索キーワード" }).fill("react");
  await page.getByRole("button", { name: "検索" }).click();

  await expect(page).toHaveURL(/\?q=react/);
  await expect(page.getByText(/件ヒット/)).toBeVisible();
});

test("検索結果のページネーションが動作する", async ({ page }) => {
  await page.goto("/?q=react");
  await expect(page.getByText(/件ヒット/)).toBeVisible();
  await page.getByText("次へ").click();
  await expect(page).toHaveURL(/page=2/);
  await expect(page.getByText(/件ヒット/)).toBeVisible();
});
