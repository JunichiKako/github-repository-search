import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center px-4">
        <Link href="/" className="text-lg font-semibold">
          GitHub Repository Search
        </Link>
      </div>
    </header>
  );
}
