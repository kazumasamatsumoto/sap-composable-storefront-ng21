import { EnvironmentProviders, Provider } from '@angular/core';
import {
  checkoutTranslationChunksConfig,
  checkoutTranslationsEn,
  checkoutTranslationsJa,
} from '@spartacus/checkout/base/assets';
import { CHECKOUT_FEATURE } from '@spartacus/checkout/base/root';
import { CmsConfig, I18nConfig, provideConfig } from '@spartacus/core';

/** チェックアウト機能(lazy) */
export const checkoutFeature: (Provider | EnvironmentProviders)[] = [
  provideConfig(<CmsConfig>{
    featureModules: {
      [CHECKOUT_FEATURE]: {
        module: () => import('@spartacus/checkout/base').then((m) => m.CheckoutModule),
      },
    },
  }),
  provideConfig(<I18nConfig>{
    i18n: {
      resources: { en: checkoutTranslationsEn, ja: checkoutTranslationsJa },
      chunks: checkoutTranslationChunksConfig,
    },
  }),
];
