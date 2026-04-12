@AGENTS.md

# CLAUDE.md

## プロジェクト概要

GitHub リポジトリ検索 Web アプリケーション。
GitHub API（search/repositories）を使用してリポジトリを検索し、検索結果一覧と詳細ページを提供する。

## 技術スタック

- **フレ-ムワーク**: Next.js 16（App Router）
- **言語**: TypeScript
- **パッケージマネージャ**: pnpm
- **UIコンポーネント**: shadcn/ui（Radix UI ベース）
- **スタイリング**: Tailwind CSS v4
- **テスト**: Vitest + React Testing Library + jsdom / Playwright（E2E）
- **リンター/フォーマッター**: Biome
- **Git フック**: Husky + lint-staged
- **CI**: GitHub Actions

## プロジェクト構成

```
src/
├── app/                  # ルーティン��（App Router）
├── components/           # UIコンポーネント
│   └── ui/               # shadcn/ui（自動生成）
├── data/                 # Data Access Layer（API通信）
├── types/                # 型定義
├── lib/                  # ユーティリティ
└── __tests__/            # テスト
```

## アーキテクチャ方針

### データフェッチ

GitHub APIへのアクセスは `data/` 配下に集約。
コンポーネント��API呼び出しをベタ書きせず、通信の層を分離する。
複数のServer Componentから共通で呼び出せる。
`app/api/` はRoute Handlerの役割を持つため、データアクセスの配置先としては使わない。
検索状態はURL（`?q=keyword&page=2`）で管理。

### Server Component / Client Component の境界

`"use client"` はユーザー操作（state、イベントハンドラ）が必要なコンポーネントにのみ付与し、クライアントバンドルを最小限に保つ。
データフェッチはServer Componentに寄せる。

ref: https://nextjs.org/docs/app/getting-started/server-and-client-components

### エラーハンドリング

- GitHub API のエラーは `data/` 層でキャッチし、カスタムエラークラスでラップ
- Rate Limit（403）、Not Found（404）は個別にハンドリング
- UIは `error.tsx` と `notFound()` で対応

## 開発フロー

PRは関心事ごとに分離する。各PRにテストを含める。

## コーディング規約

### TypeScript

- `type` ���優先（`interface` より）
- `any` 禁止、`unknown` を使用
- `export type` で型をエクスポート

### React / Next.js

- `export default function` で関��コンポーネントを定義
- ファイル名はケバブケース（`search-form.tsx`）、コンポーネント名はPascalCase（`SearchForm`）

### スタイリング

- shadcn/ui を活用、カスタムスタイルは Tailwind

### テスト方針

テストは3層で構成する。

**ユニットテスト（Vitest）**
- data層: `vi.stubGlobal("fetch")` でfetchをモックし、正常系/エラー系を検証
- Client Component: RTL の `render` + `userEvent` でユーザー操作ベースの検証
- `server-only` モジュールは `vi.mock("server-only", () => ({}))` で無効化

**E2Eテスト（Playwright）**
- async Server ComponentはVitestで描画できないため、Playwrightで正常系の主要フローをカバー
- 特定のデータに依存せず、構造や振る舞い（要素の表示・遷移）を検���

**バリデーション**
- zodスキーマで定義し、Server Actionで `safeParse` を使用
