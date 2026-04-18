import Form from "next/form";
import { Button } from "@/components/ui/button";

type SearchFormProps = {
  query?: string;
};

export function SearchForm({ query }: SearchFormProps) {
  return (
    <Form action="/" className="flex gap-2">
      <input
        type="search"
        name="q"
        defaultValue={query}
        placeholder="リポジトリを検索..."
        className="w-full max-w-md rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        aria-label="検索キーワード"
        required
      />
      <Button type="submit" size="lg" className="cursor-pointer">
        検索
      </Button>
    </Form>
  );
}
