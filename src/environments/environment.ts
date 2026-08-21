export const environment = {
  production: false,
  /** OCC(バックエンド)の向き先。ハードコードせず必ずここで管理する */
  occBaseUrl: 'https://40.76.109.9:9002',
  /** 全CMSコンポーネントに型名バッジを表示する(custom/all-components/) */
  labelCmsComponents: true,

  /**
   * カスタマイズ3シナリオの ON/OFF(custom/scenarios/)。
   * 個別に切り替えて、素の状態との差分を確認できる。
   */
  scenarios: {
    /** ① JSP製の独自部品を CMSFlexComponent として移植 */
    storeNotice: true,
    /** ② 標準 Banner を継承してモダンなデザインに */
    modernBanner: true,
    /** ③ 画像バナーの上にキャンペーン帯を Outlet で重ねる */
    campaignOverlay: true,
  },
};
