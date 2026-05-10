interface storageNameType {
  builderToken: string;
  sellerToken: string;
  tempSellerToken: string;
  productDigitalToken: string;
  cvr: string;
  domainExtenions: string;
  merchantCode: string;
  authRedirect: string;
}

interface builderStorageNameType {
  userToken: string;
  // seller
  sellerToken: string;
  // Undo / Redo
  changingTrackers: string;
  templateHistory: string;
  selectedWebsite: string;
  // template
  myTemplates: string;
  editCounter: string;
  syncedEditCounter: string;
  cartPreview: string;
  screenType: string;
  authSuccessRedirect: string;
  domainPurchaseConfirmation: string;
}

interface dStoreStorageNameType {
  dStoreOnboarding: string;
}

export const storageNames: storageNameType = {
  // builder user
  builderToken: "BUILDER_TOKEN",
  // seller
  sellerToken: "SELLER_TOKEN",
  tempSellerToken: "TEMP_SELLER_TOKEN",
  cvr: "CVR_GUEST",
  domainExtenions: "DOMAIN_EXTENSIONS",
  merchantCode: "MERCHANT_CODE",
  productDigitalToken: "PRODUCT_DIGITAL_TOKEN",
  restoToken: "RESTO_TOKEN",
  authRedirect: "AUTH_REDIRECT",
};

export const dStoreStorageNames: dStoreStorageNameType = {
  dStoreOnboarding: "DSTORE_ONBOARDING_ACTION",
};

export const builderStorageNames: builderStorageNameType = {
  // builder user
  userToken: "BUILDER_TOKEN",
  // seller
  sellerToken: "data_auth",
  // Undo / Redo
  changingTrackers: "CHANGING_TRACKERS",
  templateHistory: "TEMPLATE_HISTORY",
  // changing trackers structure
  // websiteName,
  // pages: [
  //   {
  //     path,
  //     undo: [
  //       {
  //         lastUpdated,
  //         template
  //       }
  //     ],
  //     redo: [
  //       {
  //         lastUpdated,
  //         template
  //       }
  //     ]
  //   }
  // ]
  // website
  selectedWebsite: "SELECTED_WEBSITE",
  // template
  myTemplates: "MY_TEMPLATES",
  editCounter: "EDIT_COUNTER",
  syncedEditCounter: "SYNCED_EDIT_COUNTER",
  cartPreview: "CART_PREVIEW",
  screenType: "SCREEN_TYPE", // lg, md, sm
  authSuccessRedirect: "AUTH_SUCCESS_REDIRECT",
  domainPurchaseConfirmation: "DOMAIN_PURCHASE_CONFIRMATION",
};

export const restoStorageNames: restoStorageNameType = {
  brandAndBranches: "RESTO_BRAND_AND_BRANCHES",
  timeout: "RESTO_TIMEOUT_TIMESTAMP",
};
