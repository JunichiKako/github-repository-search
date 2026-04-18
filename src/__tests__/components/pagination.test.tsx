import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SearchPagination } from "@/components/search-pagination";

const baseProps = {
  currentPage: 1,
  totalCount: 100,
  perPage: 30,
  query: "react",
};

describe("SearchPagination", () => {
  it("1ページのみの場合は表示しない", () => {
    const { container } = render(
      <SearchPagination {...baseProps} totalCount={20} />,
    );
    expect(container.querySelector("nav")).toBeNull();
  });

  it("現在ページがアクティブになる", () => {
    render(<SearchPagination {...baseProps} currentPage={2} />);

    const currentLink = screen.getByText("2").closest("a");
    expect(currentLink?.getAttribute("data-active")).toBe("true");
  });

  it("前へ・次へのリンクが正しいhrefを持つ", () => {
    render(<SearchPagination {...baseProps} currentPage={2} />);

    const prev = screen.getByText("前へ").closest("a");
    const next = screen.getByText("次へ").closest("a");
    expect(prev?.getAttribute("href")).toBe("/?q=react&page=1");
    expect(next?.getAttribute("href")).toBe("/?q=react&page=3");
  });

  it("最初のページでは「前へ」が表示されない", () => {
    render(<SearchPagination {...baseProps} currentPage={1} />);

    expect(screen.queryByText("前へ")).toBeNull();
    expect(screen.getByText("次へ")).toBeDefined();
  });

  it("最後のページでは「次へ」が表示されない", () => {
    render(<SearchPagination {...baseProps} currentPage={4} />);

    expect(screen.getByText("前へ")).toBeDefined();
    expect(screen.queryByText("次へ")).toBeNull();
  });
});
