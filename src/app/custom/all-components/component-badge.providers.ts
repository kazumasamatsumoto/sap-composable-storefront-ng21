import { EnvironmentProviders, Provider } from '@angular/core';
import { OutletPosition, provideOutlet } from '@spartacus/storefront';
import { environment } from '../../../environments/environment';
import { ALL_CMS_COMPONENT_TYPES } from './all-cms-component-types';
import { ComponentBadgeComponent } from './component-badge.component';

/**
 * 【全コンポーネント一括カスタマイズ層】CMS型名バッジ。
 *
 * Spartacus は各CMSコンポーネントを「型名と同名の outlet」で包んで描画する
 * (`page-slot.component.html` の `[cxOutlet]="component.flexType"`)。
 * よって全228型の型名を outlet id にして provideOutlet すれば、
 * 個別実装ゼロで全コンポーネントの前に任意のUIを差し込める。
 *
 * - 対象型がページに現れたときだけ描画される(未導入ライブラリの型は何も起きない)
 * - lazy ロードされる機能(cart/checkout 等)のコンポーネントにも効く
 * - OCC のレスポンスだけでは見えない「ネストされた子部品」にもバッジが付く
 *
 * ## ON / OFF
 *
 * 既定は `environment.labelCmsComponents` に従う。実行時に切り替えたい場合は
 * ブラウザの DevTools Console で以下を実行してリロードする(第2引数の既定動作):
 *
 * ```js
 * localStorage.setItem('cx-label-components', 'on');   // 表示
 * localStorage.setItem('cx-label-components', 'off');  // 非表示
 * localStorage.removeItem('cx-label-components');      // environment の設定に戻す
 * ```
 *
 * OFF のときは providers 配列自体が空になるので実行時コストはゼロ。
 */
export const provideComponentBadges = (): (Provider | EnvironmentProviders)[] => {
  if (!isBadgeEnabled()) {
    return [];
  }
  return ALL_CMS_COMPONENT_TYPES.map((type) =>
    provideOutlet({
      id: type,
      position: OutletPosition.BEFORE,
      component: ComponentBadgeComponent,
    })
  );
};

/**
 * 有効判定。localStorage の指定が最優先、無ければ environment の値を使う。
 * SSR(localStorage が無い環境)では environment の値だけを見る。
 */
function isBadgeEnabled(): boolean {
  try {
    const override = globalThis.localStorage?.getItem('cx-label-components');
    if (override === 'on') return true;
    if (override === 'off') return false;
  } catch {
    // localStorage にアクセスできない環境(SSR 等)は environment に従う
  }
  return environment.labelCmsComponents;
}
