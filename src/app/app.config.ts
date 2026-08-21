import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';

import { provideCookieNotification } from './custom/cookie-notification/cookie-notification.providers';
import { provideSpartacus } from './spartacus/spartacus.providers';

/**
 * アプリの構成。Angular 21 の standalone 構成では
 * NgModule ではなくこの ApplicationConfig が設定の入口になる。
 *
 * ⚠ 順序が重要: カスタマイズの provideConfig は provideSpartacus() より
 *   「後」に置くこと。Spartacus の設定は deep-merge の後勝ちのため。
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Spartacus 本体(ルーティングは BaseStorefrontModule が提供するため
    // provideRouter は呼ばない)
    ...provideSpartacus(),

    // ── ここから後にカスタマイズを並べる(後勝ち) ──────────
    // Cookie 通知(Accelerator の JspIncludeComponent からの移植。キーは uid)
    ...provideCookieNotification(),
  ],
};
