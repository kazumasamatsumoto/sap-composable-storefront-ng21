import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StorefrontComponent } from '@spartacus/storefront';

/**
 * ルートコンポーネント。
 * テンプレートは <cx-storefront> 1つだけ ―― ページの中身は CMS が決めるので
 * 自分でルートやレイアウトを書かない(CMS駆動)。
 */
@Component({
  selector: 'app-root',
  imports: [StorefrontComponent],
  template: '<cx-storefront></cx-storefront>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
