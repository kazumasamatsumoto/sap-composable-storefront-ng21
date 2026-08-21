import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { OutletContextData } from '@spartacus/storefront';

/**
 * 全CMSコンポーネントの直前に差し込まれる「型名バッジ」。
 *
 * outlet 経由で描画されるため、OutletContextData から
 * 自分がどの outlet(= CMSコンポーネント型名)に居るかを取得できる。
 * 画面上の全部品に型名ラベルが付くので、移行の Gap 分析時に
 * 「この部品はどの CMS 型か」を実機で確認できる。
 */
@Component({
  selector: 'app-component-badge',
  template: `@if (type) {
    <span class="cms-type-badge">{{ type }}</span>
  }`,
  styleUrl: './component-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentBadgeComponent {
  private outlet = inject(OutletContextData, { optional: true });

  /** outlet の reference = provideOutlet した id = CMSコンポーネント型名 */
  protected type = this.outlet?.reference;
}
