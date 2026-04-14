"use client";

import { Button } from "@/components/ui/button";

type ErrorProps = {
  error: Error;
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h2 className="text-lg font-semibold">エラーが発生しました</h2>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      <div className="mt-4">
        <Button onClick={reset}>再試行</Button>
      </div>
    </div>
  );
}
