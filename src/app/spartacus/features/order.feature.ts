import { EnvironmentProviders, Provider } from '@angular/core';
import { CmsConfig, I18nConfig, provideConfig } from '@spartacus/core';
import {
  orderTranslationChunksConfig,
  orderTranslationsEn,
  orderTranslationsJa,
} from '@spartacus/order/assets';
import { ORDER_FEATURE } from '@spartacus/order/root';

/** 注文機能(lazy) */
export const orderFeature: (Provider | EnvironmentProviders)[] = [
  provideConfig(<CmsConfig>{
    featureModules: {
      [ORDER_FEATURE]: {
        module: () => import('@spartacus/order').then((m) => m.OrderModule),
      },
    },
  }),
  provideConfig(<I18nConfig>{
    i18n: {
      resources: { en: orderTranslationsEn, ja: orderTranslationsJa },
      chunks: orderTranslationChunksConfig,
    },
  }),
];
