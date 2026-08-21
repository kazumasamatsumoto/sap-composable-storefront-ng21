import { Provider, EnvironmentProviders } from '@angular/core';
import {
  translationChunksConfig,
  translationsEn,
  translationsJa,
} from '@spartacus/assets';
import {
  FeaturesConfig,
  I18nConfig,
  OccConfig,
  SiteContextConfig,
  provideConfig,
  provideConfigFactory,
} from '@spartacus/core';
import { LayoutConfig } from '@spartacus/storefront';
import {
  defaultCmsContentProviders,
  layoutConfigFactory,
  mediaConfig,
} from '@spartacus/storefront';
import { environment } from '../../environments/environment';

/**
 * Spartacus の全設定。
 * NgModule 版の spartacus-configuration.module.ts に相当するが、
 * Angular 21 では ApplicationConfig の providers に直接並べる。
 */
export const spartacusConfig: (Provider | EnvironmentProviders)[] = [
  provideConfigFactory(layoutConfigFactory),
  provideConfig(mediaConfig),
  ...defaultCmsContentProviders,

  // OCC(バックエンド)の向き先
  provideConfig(<OccConfig>{
    backend: {
      occ: {
        baseUrl: environment.occBaseUrl,
      },
    },
  }),

  // サイトコンテキスト(baseSite / 言語 / 通貨)
  provideConfig(<SiteContextConfig>{
    context: {
      urlParameters: ['baseSite', 'language', 'currency'],
      // SPA 用サイト。非SPA サイト(electronics 等)は Composable 向けの
      // CMS 整備がされておらず、ページ解決が完了しないので使わない。
      baseSite: ['powertools-spa'],
      currency: ['USD'],
      language: ['en'],
    },
  }),

  // 多言語
  provideConfig(<I18nConfig>{
    i18n: {
      resources: {
        en: translationsEn,
        ja: translationsJa,
      },
      chunks: translationChunksConfig,
      fallbackLang: 'en',
    },
  }),

  // ★ヘッダーのスロット構成を上書きして TopHeaderSlot を追加する。
  //   標準の layoutSlots.header は
  //     slots    : ['PreHeader','SiteLogo','SearchBox','MiniCart']
  //     lg.slots : ['PreHeader','SiteContext','SiteLinks','SiteLogo',
  //                 'SearchBox','SiteLogin','MiniCart','NavigationBar']
  //   で、TopHeaderSlot を含まない。CMS が返してきても描画されないため、
  //   先頭に足したうえで「標準の並びを全部書き直す」必要がある
  //   (一部だけ書くと他のスロットが消える)。
  provideConfig(<LayoutConfig>{
    layoutSlots: {
      header: {
        lg: {
          slots: [
            'TopHeaderSlot',
            'PreHeader',
            'SiteContext',
            'SiteLinks',
            'SiteLogo',
            'SearchBox',
            'SiteLogin',
            'MiniCart',
            'NavigationBar',
          ],
        },
        slots: ['TopHeaderSlot', 'PreHeader', 'SiteLogo', 'SearchBox', 'MiniCart'],
      },
    },
  }),

  // 機能フラグのレベル('*' は全機能を有効化)
  provideConfig(<FeaturesConfig>{
    features: {
      level: '*',
    },
  }),
];
