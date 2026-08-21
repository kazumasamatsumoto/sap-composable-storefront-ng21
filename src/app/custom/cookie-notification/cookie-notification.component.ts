import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { WindowRef } from '@spartacus/core';
import { CmsComponentData } from '@spartacus/storefront';
import { CmsCookieNotificationComponent } from './cookie-notification.model';

/** 同意状態を保存する localStorage のキー */
const STORAGE_KEY = 'cookie-notice-accepted';

/**
 * Cookie 通知バナー(Accelerator の JspIncludeComponent からの移植)。
 *
 * - CMS データは CmsComponentData 経由。値が無い場合に備えて既定文言を持つ
 *   (元が JspIncludeComponent = 属性を持たないため、多くの場合 undefined になる)
 * - localStorage への読み書きは WindowRef 経由。SSR で document を直接触らない
 */
@Component({
  selector: 'app-cookie-notification',
  templateUrl: './cookie-notification.component.html',
  styleUrl: './cookie-notification.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookieNotificationComponent {
  private componentData: CmsComponentData<CmsCookieNotificationComponent> =
    inject(CmsComponentData);
  private windowRef = inject(WindowRef);

  /** CMS データ(到着前は undefined) */
  private data = toSignal(this.componentData.data$);

  /** 同意済みかどうか。初期値は localStorage から読む(SSR では常に false) */
  private accepted = signal(this.readAccepted());

  /** CMS に値があればそれを、無ければ既定文言を使う */
  title = computed(() => this.data()?.title ?? 'Cookie の使用について');
  message = computed(
    () =>
      this.data()?.message ??
      '当サイトでは、サービス向上のために Cookie を使用しています。'
  );
  acceptLabel = computed(() => this.data()?.acceptLabel ?? '同意する');
  linkUrl = computed(() => this.data()?.linkUrl);
  linkLabel = computed(() => this.data()?.linkLabel ?? '詳細');

  /** 未同意のときだけ表示する */
  visible = computed(() => !this.accepted());

  onAccept(): void {
    this.accepted.set(true);
    // localStorage は WindowRef 経由(SSR では undefined が返るのでガードされる)
    this.windowRef.localStorage?.setItem(STORAGE_KEY, 'true');
  }

  private readAccepted(): boolean {
    return this.windowRef.localStorage?.getItem(STORAGE_KEY) === 'true';
  }
}
