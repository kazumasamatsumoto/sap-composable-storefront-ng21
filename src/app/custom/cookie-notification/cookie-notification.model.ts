import { CmsComponent } from '@spartacus/core';

/**
 * Cookie 通知コンポーネントのモデル。
 *
 * ⚠ 元は Accelerator の JspIncludeComponent(uid=CookieNotificationComponent)で、
 *   実体は page 属性が指す JSP だった。JSP は Angular からは読めないため、
 *   表示内容はこちら側で作り直す。
 *
 * CMS から追加の属性を渡したい場合は、バックエンドで CMSFlexComponent 化して
 * 属性を定義すると、ここに足すだけで受け取れるようになる。
 */
export interface CmsCookieNotificationComponent extends CmsComponent {
  /** 見出し(CMS 側で持たせる場合。無ければ既定文言を使う) */
  title?: string;
  /** 本文 */
  message?: string;
  /** 同意ボタンのラベル */
  acceptLabel?: string;
  /** 詳細ページへのリンク先(CMS の label / URL) */
  linkUrl?: string;
  linkLabel?: string;
}
