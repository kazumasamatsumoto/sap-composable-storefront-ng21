import { EnvironmentProviders, Provider } from '@angular/core';
import { CmsConfig, provideConfig } from '@spartacus/core';
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
  provideConfig(<CmsConfig>{
    cmsComponents: {
      CookieNotificationComponent: { component: CookieNotificationComponent },
    },
  }),
];
