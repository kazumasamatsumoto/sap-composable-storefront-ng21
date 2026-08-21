# mystore21 — Angular 21 の standalone 構成で Spartacus を組み込んだ検証アプリ

`mystore`(NgModule 構成)と**同じ機能を、Angular 21 の作法で書き直した**もの。
どちらも動くが、新規プロジェクトはこちらの形で始めるのが公式の方向性。

## mystore との違い

| | mystore(NgModule 版) | **mystore21(standalone 版)** |
|---|---|---|
| ブート | `platformBrowser().bootstrapModule(AppModule)` | **`bootstrapApplication(App, appConfig)`** |
| 設定の入口 | `app-module.ts` の `@NgModule` | **`app.config.ts` の `ApplicationConfig`** |
| Spartacus の配線 | `spartacus.module.ts`(NgModule 3枚) | **`spartacus.providers.ts`(provider 配列)** |
| 設定 | `spartacus-configuration.module.ts` | **`spartacus.config.ts`** |
| lazy 機能 | `features/*-feature.module.ts`(NgModule) | **`features/*.feature.ts`(provider 配列)** |
| ルートコンポーネント | `standalone: false` + `declarations` | **standalone(既定)** |
| NgRx | `StoreModule.forRoot({})` を imports | **`provideStore({})`** |
| カスタム部品の登録 | モジュールを AppModule に import | **provider を `app.config.ts` に足すだけ** |

**共通点**: `@spartacus/*` のバージョン(221121.15.1)、baseSite(`powertools-spa`)、
OCC の向き先、スタイルの読み込み順は同じ。

## ★詰まりやすい2点(実機で踏んだ)

### 1. `AppRoutingModule` が必須

`BaseStorefrontModule` だけではルーターが設定されず、**URL が `/` のまま止まる**。
baseSite/言語/通貨へのリダイレクト(`/powertools-spa/en/USD/`)が起きず、
ページ解決が `cx-pending` のまま完了しない(画面が白いまま)。

```ts
importProvidersFrom(
  AppRoutingModule,        // ← これが無いと動かない。provideRouter() では代替できない
  BaseStorefrontModule,
  ...
)
```

### 2. NgRx は NgModule 版を使う

`provideStore()` / `provideEffects()` だけだと起動時に
**`NG0201: No provider found for _EffectsRootModule`** で落ちる。
Spartacus 内部が `EffectsFeatureModule` を使っているため。

```ts
importProvidersFrom(
  StoreModule.forRoot({}),      // provideStore() ではダメ
  EffectsModule.forRoot([]),    // provideEffects() ではダメ
  ...
)
```

## なぜ NgModule が完全には消えないのか

`@spartacus/*` のライブラリ自体がまだ NgModule で提供されているため、
`importProvidersFrom(...)` でラップしている(`spartacus.providers.ts`)。

公式も **「NgModule は引き続き機能の組織化単位として残る」**
(UpdatingComposableStorefront p71)としており、
「**コンポーネントは standalone、機能のまとまりは NgModule**」が現在の標準形。
将来ライブラリ側が provider 関数を提供すれば、そのまま置き換えられる構造にしてある。

## 起動

```bash
npm install --legacy-peer-deps   # feature-lib が @spartacus/schematics を peer 要求するため
npm start                        # http://localhost:4200
```

初回はバックエンドが自己署名証明書のため、先にブラウザで
`https://40.76.109.9:9002/occ/v2/basesites?fields=FULL` を開いて例外を許可すること。

## ファイル構成

```
src/
├── main.ts                          bootstrapApplication(App, appConfig)
├── styles.scss                      core → Bootstrap → styles の順(順序厳守)
├── environments/environment.ts      OCC の向き先・検証フラグ
└── app/
    ├── app.component.ts             <cx-storefront> 1行だけ(CMS駆動)
    ├── app.config.ts                ★設定の入口。カスタマイズはここに足す
    ├── spartacus/
    │   ├── spartacus.providers.ts   Spartacus 一式(eager モジュール + lazy 宣言)
    │   ├── spartacus.config.ts      OCC / baseSite / i18n / レイアウト
    │   └── features/
    │       ├── cart-base.feature.ts lazy: カート
    │       ├── checkout.feature.ts  lazy: チェックアウト
    │       ├── order.feature.ts     lazy: 注文
    │       └── user.feature.ts      lazy: ユーザー
    └── custom/                      自作コンポーネント置き場
```

## カスタマイズの足し方

**NgModule を作らずに `app.config.ts` へ直接足せる**のが standalone 版の利点。

```ts
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    ...provideSpartacus(),

    // ↓ ここから後が「後勝ち」で標準を上書きする
    provideConfig(<CmsConfig>{
      cmsComponents: {
        BreadcrumbComponent: { component: CustomBreadcrumbComponent },
      },
    }),
  ],
};
```

⚠ **順序が重要**: カスタマイズは必ず `...provideSpartacus()` より**後**に置く。
Spartacus の設定は deep-merge の後勝ちのため、前に置くと標準が勝つ。

### lazy 領域の差し替えは別扱い

cart / checkout / order / user の中の部品(MiniCart 等)は、
`app.config.ts` に書いても機能ロード時に戻される場合がある。
その場合は `features/*.feature.ts` の dynamic import 先を
「標準モジュールを import したラッパーモジュール」に差し替える。

## 制約(既知)

- SSR は未構成(`--ssr=false` で作成)。必要になったら
  `ng generate @spartacus/schematics:add-ssr` 相当の設定を足す
- B2C 構成のみ(B2B は `checkout/b2b` 等の root モジュール追加が必要)
- MSW は未導入(mystore 側にある。必要なら移植する)
- バンドル予算を initial 3MB/5MB に緩和済み(Spartacus 導入時の標準対応)

## 実プロジェクトとの違い

実案件では `.npmrc` + RBSC から `@spartacus/*` を取得するが、ここでは
OSS clone からビルドした tarball(`../spartacus-dist/*.tgz`)を `file:` 参照している。
