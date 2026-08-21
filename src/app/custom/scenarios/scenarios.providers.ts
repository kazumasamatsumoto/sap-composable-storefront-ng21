import { EnvironmentProviders, Provider } from '@angular/core';
import { CmsConfig, provideConfig } from '@spartacus/core';
import { OutletPosition, provideOutlet } from '@spartacus/storefront';
import { CampaignOverlayComponent } from './campaign-overlay/campaign-overlay.component';
import { ModernBannerComponent } from './modern-banner/modern-banner.component';
import { StoreNoticeComponent } from './store-notice/store-notice.component';

/**
 * 3つの代表的なカスタマイズシナリオ。
 * 学習サイトの「カスタマイズ3シナリオ」と対応している。
 *
 *  ① 独自部品の追加   : JSP 製の独自部品を CMSFlexComponent として移植(store-notice)
 *  ② 既存部品の改修   : 標準 Banner を継承してモダンなデザインに(modern-banner)
 *  ③ Outlet で重ねる  : 画像バナーの上にキャンペーン帯を差し込む(campaign-overlay)
 *
 * ON/OFF は environment.scenarios で個別に切り替えられる。
 */
export interface ScenarioFlags {
  storeNotice: boolean;
  modernBanner: boolean;
  campaignOverlay: boolean;
}

export const provideScenarios = (
  flags: ScenarioFlags
): (Provider | EnvironmentProviders)[] => {
  const providers: (Provider | EnvironmentProviders)[] = [];

  // ── ① 独自部品の追加(CMSFlexComponent) ─────────────────────
  if (flags.storeNotice) {
    providers.push(
      provideConfig(<CmsConfig>{
        cmsComponents: {
          // キーは CMSFlexComponent の flexType の値。
          // JspIncludeComponent のままなら uid をキーにする(非推奨)。
          StoreNoticeComponent: { component: StoreNoticeComponent },
        },
      }),
      // CMS 側に部品を用意できるまでのフォールバック。
      // SAP デモの powertools-spa には該当部品が無いため、
      // Outlet で本文最上部に差し込んで表示を確認できるようにしておく。
      provideOutlet({
        id: 'Section1',
        position: OutletPosition.BEFORE,
        component: StoreNoticeComponent,
      })
    );
  }

  // ── ② 既存部品の改修(継承 + 同型名で再登録) ─────────────────
  if (flags.modernBanner) {
    providers.push(
      provideConfig(<CmsConfig>{
        cmsComponents: {
          BannerComponent: { component: ModernBannerComponent },
          SimpleBannerComponent: { component: ModernBannerComponent },
          SimpleResponsiveBannerComponent: { component: ModernBannerComponent },
        },
      })
    );
  }

  // ── ③ Outlet で重ねる ────────────────────────────────────
  if (flags.campaignOverlay) {
    // バナー型の直前(BEFORE)に差し込み、CSS で次要素の上に重ねる。
    // 標準コンポーネントには一切触れない。
    for (const type of [
      'SimpleResponsiveBannerComponent',
      'SimpleBannerComponent',
      'BannerComponent',
    ]) {
      providers.push(
        provideOutlet({
          id: type,
          position: OutletPosition.BEFORE,
          component: CampaignOverlayComponent,
        })
      );
    }
  }

  return providers;
};
