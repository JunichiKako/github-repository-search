# GitHub Repository Search

GitHub API（search/repositories）を使用してリポジトリを検索し、検索結果一覧と詳細ページを提供するWebアプリケーション。

## 技術スタック

- **フレームワーク**: Next.js 16（App Router）
- **言語**: TypeScript
- **パッケージマネージャ**: pnpm
- **UIコンポーネント**: shadcn/ui
- **スタイリング**: Tailwind CSS v4
- **テスト**: Vitest + React Testing Library + jsdom / Playwright（E2E）
- **リンター/フォーマッター**: Biome
- **Git フック**: Husky + lint-staged
- **CI**: GitHub Actions

## セットアップ手順

### 必要な環境

- Node.js 24以上（LTS）
- pnpm

### 手順

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev
```

ブラウザで http://localhost:3000 を開く。

### コマンド一覧

| コマンド | 説明 |
| --- | --- |
| `pnpm dev` | 開発サーバー起動 |
| `pnpm build` | プロダクションビルド |
| `pnpm start` | プロダクションサーバー起動 |
| `pnpm test` | ユニットテスト実行（Vitest） |
| `pnpm e2e` | E2Eテスト実行（Playwright） |
| `pnpm check` | Biomeでlint/formatチェック |
| `pnpm format` | Biomeで自動整形 |

## 工夫した点・こだわり

### Data Access Layer

- Next.js公式のセキュリティブログで新規プロジェクトに推奨されているパターン
- GitHub APIへのアクセスを `data/` 配下に集約し、コンポーネントから通信ロジックを分離
- ref: https://nextjs.org/blog/security-nextjs-server-components-actions

### `server-only` の導入

- `data/` 層に `import "server-only"` を入れてクライアントからの誤インポートをビルドエラーで防止
- Vitestでのテスト時は `vi.mock("server-only", () => ({}))` で無効化
- ref: https://github.com/vercel/next.js/issues/60038

### Server Component / Client Component の境界

- `"use client"` はユーザー操作が必要なコンポーネントにのみ付与し、クライアントバンドルを最小限に保つ
- データフェッチはServer Componentに寄せる
- 検索フォームはNext.jsの `<Form>` コンポーネントを使用し、Server Componentのまま維持

### URL駆動の検索状態管理

- 検索クエリ・ページ番号をURL（`?q=&page=`）で保持
- 詳細ページへのリンクに `?q=&page=` を引き継ぎ、戻るリンクで検索コンテキストを復元
- ブックマーク・URL共有に対応、Server Componentと相性が良い

### キャッシュ戦略とAPI呼び出しの最適化

- GitHub APIのRate Limit（Core API: 認証なし60 req/hour）を考慮し、fetchに `revalidate: 3600`（1時間）を設定
- リポジトリ情報にリアルタイム性は不要と判断
- E2EテストでのAPI呼び出し：キャッシュなし6回 → キャッシュあり3回（50%削減）
- 1時間以内の2回目以降のCI実行では0回（キャッシュから返る）

### スケルトンUIによるローディング表示

- SuspenseのフォールバックにスケルトンUIを表示
- 検索中も検索フォームは残したまま、結果部分だけ更新されるUX

### 初期表示

- 検索前の初期画面に人気リポジトリ（Star数降順）を表示
- 使い始めのイメージを掴みやすくする

### テスト戦略（Vitest / Playwright の使い分け）

- async Server ComponentはVitestで描画できない制約がある
- data層 + Client Componentはユニットテスト（Vitest + RTL）
- ページ全体のフローはE2E（Playwright）でカバー

### 階層的な品質保証（commit → push → PR）

開発の各タイミングで必要な粒度のチェックを自動実行し、手元で早く気づける + リモートで確実に止める構成。

| タイミング | 実行される内容 | 手段 |
| --- | --- | --- |
| commit時 | lint/format（Biome） | Husky + lint-staged |
| push時 | ユニットテスト（Vitest） | Husky pre-push |
| PR作成・更新時 | lint + ユニットテスト + E2Eテスト | GitHub Actions |

- 早いチェックほど手元で走らせてフィードバックを速く
- 重い処理（E2Eなど）はCIに寄せて開発体験を損なわない
- GitHubのブランチ保護ルールでCIパスをマージ条件にできる

### Biome設定の判断

- インデント：create-next-app生成コードに合わせてスペース2つ
- CSSパーサー：Tailwind CSS v4の `@theme inline` 構文にBiomeが未対応のため設定で回避

## AI利用レポート

### 使用ツール

- Claude（claude.ai）：設計・方針の壁打ち、ドキュメント調査
- Claude Code：実装、テスト作成

### 利用方法

- CLAUDE.md に方針（アーキテクチャ・コーディング規約・テスト戦略）を定義
- PRごとに関心事を絞ってタスクを依頼
- 設計判断は自分で行い、Claudeと壁打ちして精査
- 実装はClaude Codeに依頼しつつ、コードレビューは自分で実施

