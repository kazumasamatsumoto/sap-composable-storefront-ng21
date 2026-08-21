import { EnvironmentProviders, Provider } from '@angular/core';
import { CmsConfig, I18nConfig, provideConfig } from '@spartacus/core';
import {
  userAccountTranslationChunksConfig,
  userAccountTranslationsEn,
  userAccountTranslationsJa,
} from '@spartacus/user/account/assets';
import { USER_ACCOUNT_FEATURE } from '@spartacus/user/account/root';
import {
  userProfileTranslationChunksConfig,
  userProfileTranslationsEn,
  userProfileTranslationsJa,
} from '@spartacus/user/profile/assets';
import { USER_PROFILE_FEATURE } from '@spartacus/user/profile/root';

/** ユーザー(アカウント/プロフィール)機能(lazy) */
export const userFeature: (Provider | EnvironmentProviders)[] = [
  provideConfig(<CmsConfig>{
    featureModules: {
      [USER_ACCOUNT_FEATURE]: {
        module: () => import('@spartacus/user/account').then((m) => m.UserAccountModule),
      },
      [USER_PROFILE_FEATURE]: {
        module: () => import('@spartacus/user/profile').then((m) => m.UserProfileModule),
      },
    },
  }),
  provideConfig(<I18nConfig>{
    i18n: {
      resources: { en: userAccountTranslationsEn, ja: userAccountTranslationsJa },
      chunks: userAccountTranslationChunksConfig,
    },
  }),
  provideConfig(<I18nConfig>{
    i18n: {
      resources: { en: userProfileTranslationsEn, ja: userProfileTranslationsJa },
      chunks: userProfileTranslationChunksConfig,
    },
  }),
];
