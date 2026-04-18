import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SearchForm } from "@/components/search-form";

describe("SearchForm", () => {
  it("検索入力欄と送信ボタンを表示する", () => {
    render(<SearchForm />);

    expect(
      screen.getByRole("searchbox", { name: "検索キーワード" }),
    ).toBeDefined();
    expect(screen.getByRole("button", { name: "検索" })).toBeDefined();
  });

  it("queryが入力欄に反映される", () => {
    render(<SearchForm query="react" />);

    const input = screen.getByRole("searchbox", {
      name: "検索キーワード",
    }) as HTMLInputElement;
    expect(input.value).toBe("react");
  });

  it("入力するとvalueが更新される", () => {
    render(<SearchForm />);

    const input = screen.getByRole("searchbox", {
      name: "検索キーワード",
    }) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "vue" } });
    expect(input.value).toBe("vue");
  });
});
