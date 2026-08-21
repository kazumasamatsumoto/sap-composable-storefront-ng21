import { EnvironmentProviders, Provider } from '@angular/core';
import {
  cartBaseTranslationChunksConfig,
  cartBaseTranslationsEn,
  cartBaseTranslationsJa,
} from '@spartacus/cart/base/assets';
import {
  ADD_TO_CART_FEATURE,
  CART_BASE_FEATURE,
  MINI_CART_FEATURE,
} from '@spartacus/cart/base/root';
import { CmsConfig, I18nConfig, provideConfig } from '@spartacus/core';

/**
 * カート機能(lazy)。
 * featureModules の dynamic import で、実際に必要になるまでロードされない。
 * 標準コンポーネントを差し替えるときは、ここの import 先を
 * 「ラッパーモジュール」に向ける(custom/overrides/mini-cart/ を参照)。
 */
export const cartBaseFeature: (Provider | EnvironmentProviders)[] = [
  provideConfig(<CmsConfig>{
    featureModules: {
      [CART_BASE_FEATURE]: {
        module: () => import('@spartacus/cart/base').then((m) => m.CartBaseModule),
      },
      [MINI_CART_FEATURE]: {
        module: () =>
          import('@spartacus/cart/base/components/mini-cart').then(
            (m) => m.MiniCartModule
          ),
      },
      [ADD_TO_CART_FEATURE]: {
        module: () =>
          import('@spartacus/cart/base/components/add-to-cart').then(
            (m) => m.AddToCartModule
          ),
      },
    },
  }),
  provideConfig(<I18nConfig>{
    i18n: {
      resources: { en: cartBaseTranslationsEn, ja: cartBaseTranslationsJa },
      chunks: cartBaseTranslationChunksConfig,
    },
  }),
];
