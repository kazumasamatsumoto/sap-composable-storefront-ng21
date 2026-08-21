import { EnvironmentProviders, Provider, importProvidersFrom } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { CartBaseRootModule } from '@spartacus/cart/base/root';
import { CheckoutRootModule } from '@spartacus/checkout/base/root';
import {
  AnonymousConsentsModule,
  AuthModule,
  ExternalRoutesModule,
  ProductModule,
  ProductOccModule,
  UserModule,
  UserOccModule,
} from '@spartacus/core';
import { OrderRootModule } from '@spartacus/order/root';
import {
  AnonymousConsentManagementBannerModule,
  AnonymousConsentsDialogModule,
  BannerCarouselModule,
  BannerModule,
  BaseStorefrontModule,
  BreadcrumbModule,
  CategoryNavigationModule,
  CmsParagraphModule,
  ConsentManagementModule,
  FooterNavigationModule,
  HamburgerMenuModule,
  HomePageEventModule,
  JsonLdBuilderModule,
  LinkModule,
  LoginRouteModule,
  LogoutModule,
  MyCouponsModule,
  MyInterestsModule,
  NavigationEventModule,
  NavigationModule,
  NotificationPreferenceModule,
  PageTitleModule,
  PaymentMethodsModule,
  ProductCarouselModule,
  ProductDetailsPageModule,
  ProductFacetNavigationModule,
  ProductImagesModule,
  ProductIntroModule,
  ProductListModule,
  ProductListingPageModule,
  ProductPageEventModule,
  ProductReferencesModule,
  ProductSummaryModule,
  ProductTabsModule,
  ScrollToTopModule,
  SearchBoxModule,
  SiteContextSelectorModule,
  TabParagraphContainerModule,
  VideoModule,
} from '@spartacus/storefront';
import { UserAccountRootModule } from '@spartacus/user/account/root';
import { UserProfileRootModule } from '@spartacus/user/profile/root';

import { cartBaseFeature } from './features/cart-base.feature';
import { checkoutFeature } from './features/checkout.feature';
import { orderFeature } from './features/order.feature';
import { userFeature } from './features/user.feature';
import { spartacusConfig } from './spartacus.config';

/**
 * Spartacus をアプリに組み込むためのプロバイダー一式。
 *
 * Angular 21 の standalone 構成では NgModule でラップせず、
 * ApplicationConfig の providers にこの配列を展開する(app.config.ts)。
 *
 * importProvidersFrom を使っているのは、Spartacus のライブラリが
 * まだ NgModule で提供されているため。将来ライブラリ側が provider 関数を
 * 提供するようになれば、そのまま置き換えられる。
 */
export const provideSpartacus = (): (Provider | EnvironmentProviders)[] => [
  // NgRx(Spartacus の状態管理が依存している)
  provideStore({}),
  provideEffects([]),

  importProvidersFrom(
    // Spartacus の基盤(ルーティング・レイアウト・CMS解決)
    BaseStorefrontModule,

    // ── eager な機能(常時ロード) ──────────────────────
    AuthModule.forRoot(),
    LogoutModule,
    LoginRouteModule,

    HamburgerMenuModule,
    SiteContextSelectorModule,
    LinkModule,
    BannerModule,
    CmsParagraphModule,
    TabParagraphContainerModule,
    BannerCarouselModule,
    CategoryNavigationModule,
    NavigationModule,
    FooterNavigationModule,
    PageTitleModule,
    BreadcrumbModule,
    ScrollToTopModule,
    VideoModule,

    UserModule,
    UserOccModule,
    PaymentMethodsModule,
    NotificationPreferenceModule,
    MyInterestsModule,
    MyCouponsModule,
    ConsentManagementModule,

    AnonymousConsentsModule.forRoot(),
    AnonymousConsentsDialogModule,
    AnonymousConsentManagementBannerModule,

    ProductModule.forRoot(),
    ProductOccModule,
    ProductDetailsPageModule,
    ProductListingPageModule,
    ProductListModule,
    SearchBoxModule,
    ProductFacetNavigationModule,
    ProductTabsModule,
    ProductCarouselModule,
    ProductReferencesModule,
    ProductImagesModule,
    ProductSummaryModule,
    ProductIntroModule,

    ExternalRoutesModule.forRoot(),
    NavigationEventModule,
    HomePageEventModule,
    ProductPageEventModule,
    JsonLdBuilderModule,

    // ── lazy 機能の root モジュール ────────────────────
    // 本体は featureModules 経由で遅延ロードされるが、
    // root モジュールだけは常に読み込む必要がある
    UserAccountRootModule,
    UserProfileRootModule,
    CartBaseRootModule,
    OrderRootModule,
    CheckoutRootModule
  ),

  // ── lazy 機能の宣言 ───────────────────────────────
  ...userFeature,
  ...cartBaseFeature,
  ...orderFeature,
  ...checkoutFeature,

  // ── 全体設定(OCC / baseSite / i18n / レイアウト) ──
  ...spartacusConfig,
];
