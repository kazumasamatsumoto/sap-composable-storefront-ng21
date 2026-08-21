import { EnvironmentProviders, Provider } from '@angular/core';
import { CmsConfig, provideConfig } from '@spartacus/core';
import { OutletPosition, provideOutlet } from '@spartacus/storefront';
import { CookieNotificationComponent } from './cookie-notification.component';

/**
 * Cookie 通知コンポーネントの登録。
 *
 * ★キーは typeCode ではなく uid。
 *   CMS のレスポンスが { uid: 'CookieNotificationComponent',
 *   typeCode: 'JspIncludeComponent' } のため、Spartacus は
 *   JspIncludeComponent の場合に限り uid でマッピングを引く。
 *   (StorefrontDevelopmentGuide p63 の後方互換経路)
 *
 * バックエンドを CMSFlexComponent に置換したら、flexType の値をキーにする。
 * その場合もキー名は同じ 'CookieNotificationComponent' にしておけば
 * このファイルは変更不要。
 */
export const provideCookieNotification = (): (Provider | EnvironmentProviders)[] => [
  // ① CMS 経由(バックエンドに CookieNotificationComponent がある場合)
  provideConfig(<CmsConfig>{
    cmsComponents: {
      CookieNotificationComponent: { component: CookieNotificationComponent },
    },
  }),

  // ② Outlet 経由のフォールバック。
  //    SAP デモの SPA 用サイト(powertools-spa 等)は SPA 化の過程で
  //    CookieNotificationComponent が削除されているため、CMS 経由では出せない。
  //    Outlet なら CMS にデータが無くても確実に差し込める。
  //    ※ CMS 側に部品を用意できたら、この provideOutlet は外してよい。
  provideOutlet({
    id: 'cx-header',
    position: OutletPosition.BEFORE,
    component: CookieNotificationComponent,
  }),
];
