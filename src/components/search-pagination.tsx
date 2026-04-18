import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as PaginationRoot,
} from "@/components/ui/pagination";

type PaginationProps = {
  currentPage: number;
  totalCount: number;
  perPage: number;
  query: string;
};

export function SearchPagination({
  currentPage,
  totalCount,
  perPage,
  query,
}: PaginationProps) {
  const totalPages = Math.ceil(totalCount / perPage);

  if (totalPages <= 1) return null;

  function buildHref(page: number) {
    return `/?q=${encodeURIComponent(query)}&page=${page}`;
  }

  const pages = generatePageNumbers(currentPage, totalPages);

  return (
    <PaginationRoot className="mt-6">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={buildHref(currentPage - 1)} text="前へ" />
          </PaginationItem>
        )}

        {pages.map((page, i) =>
          page === "..." ? (
            // biome-ignore lint/suspicious/noArrayIndexKey: 省略記号のプレースホルダーで並び替えが発生しないため
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href={buildHref(page)}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext href={buildHref(currentPage + 1)} text="次へ" />
          </PaginationItem>
        )}
      </PaginationContent>
    </PaginationRoot>
  );
}

function generatePageNumbers(
  current: number,
  total: number,
): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  if (current > 3) {
    pages.push("...");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("...");
  }

  pages.push(total);

  return pages;
}
