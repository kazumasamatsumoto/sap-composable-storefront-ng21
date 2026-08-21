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

  // 機能フラグのレベル('*' は全機能を有効化)
  provideConfig(<FeaturesConfig>{
    features: {
      level: '*',
    },
  }),
];
