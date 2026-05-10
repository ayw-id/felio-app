import type { chatRoomMessageType, chatRoomType, chatTokenType } from "./chat";
import type { authType } from "./authData";
import type { availableServicesType } from "./navigation";
import type {
  DomainDataType,
  ExtensionDataType,
  websiteType,
} from "./websiteData";
import type {
  productType,
  formReferencesType,
  categoryType,
  productImage,
  ProductStock,
  StockHistoryType,
} from "./productData";
import type { addressType, userAddressType } from "./addressData";
import type { BrandType } from "./brandData";
import type { ProfileBrandType } from "./userData";
import type { ToastServiceMethods } from "primevue/toastservice";
import type { CategoryType } from "~/types/categoryData";
import type { FeedbackType } from "./feedbackData";
import type {
  AgentBrand,
  ProductCategory,
  AgentLevel,
  AgentMember,
  AgentProductType,
  AgentRegistrationType,
  SearchProductResult,
} from "./agentData";
import type { OrderType } from "./orderData";
import type {
  RoleMaster,
  AvailablePermissionGroup,
  EmployeeListItem,
  EmployeeDetail,
} from "./employeeData";

export interface FetchInputDataType {
  url?: string;
  token: string;
  body?: FormData;
  toast?: ToastServiceMethods;
  searchQuery?: string;
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: string;
}

export interface fetchDataType {
  success: number;
  msg: string;
}

export interface fetchAvailableServiceType extends fetchDataType {
  data: availableServicesType;
}

export interface fetchMerchantAccountType extends fetchDataType {
  data?: {
    newMerchantToken: string;
  };
}

export interface fetchMessagesType extends fetchDataType {
  data: {
    replace_messages: boolean;
    messages: chatRoomMessageType[];
  };
}

export interface fetchSyncMessagesType extends fetchDataType {
  data: {
    rooms: chatRoomType[];
    messages: chatRoomMessageType[];
  };
}

export interface fetchRoomChatType extends fetchDataType {
  data: {
    clear_data_chat: number;
    chatToken: chatTokenType | null;
    chat_rooms: chatRoomType[];
  };
}

export interface fetchSendMessageType extends fetchDataType {
  data: {
    new_idRoom: number;
    replace_messages: boolean;
    message: chatRoomMessageType[];
    room_last_message: chatRoomMessageType | null;
  };
}

export interface fetchAuthType extends fetchDataType {
  data: {
    token: authType;
    token_guest: authType;
    lastAccessedService: string;
  };
}

export interface fetchDashboardGetActionType extends fetchDataType {
  data: {
    waitingOrders: number;
    invoicePayment: number;
  };
}

export interface fieldObj {
  field: string;
  email?: string;
  phone?: string;
  callingCode?: string;
  name?: string;
}

export interface serviceOnboardingObjType {
  label: string;
  status: boolean;
  msg: string;
  fields?: fieldObj[];
  step3CheckStatus?: number;
  step3Tab?: string;
}

export interface fetchDashboardGetServiceOnboardingStepsType
  extends fetchDataType {
  data: {
    store: serviceOnboardingObjType[];
    site: serviceOnboardingObjType[];
  };
}

interface storeOverviewOptType {
  yearly: number;
  monthly: number;
}

export interface storeOverview {
  revenue: storeOverviewOptType;
  totalInvoice: storeOverviewOptType;
  totalCustomers: storeOverviewOptType;
  totalRatings: {
    yearly: string;
    monthly: string;
  };
}

export interface fetchDashboardGetStoreOverviewType extends fetchDataType {
  data: storeOverview;
}

export interface recentSalesType {
  idInvoice: string;
  idInvoiceDetail: string;
  image: string;
  name: string;
  status: string;
}

export interface fetchDashboardGetRecentSalesType extends fetchDataType {
  data: {
    recentSales: recentSalesType[];
  };
}

export interface salesOverviewDatasetType {
  label: string;
  data: number[];
  fill: boolean;
  backgroundColor: string;
  borderColor: string;
  tension: number;
}

export interface bestSellingProductType {
  idProduct: string;
  productName: string;
  categoryName: string;
  totalQty: number;
}

export interface fetchDashboardGetSalesOverviewType extends fetchDataType {
  data: {
    datasets: salesOverviewDatasetType[];
    bestSellingProduct: bestSellingProductType[];
  };
}

export interface fetchGetBuilderTokenType extends fetchDataType {
  data: {
    builderToken: string;
  };
}

export interface fetchGetWebsitesType extends fetchDataType {
  data: {
    websites: websiteType[];
  };
}

export interface fetchGetProductsType extends fetchDataType {
  products: productType[];
  totalRecords: number;
}

export interface fetchGetProductFormType extends fetchDataType {
  product: productType | null;
  references: formReferencesType;
}

export interface fetchSaveCategoryType extends fetchDataType {
  category: categoryType;
}

export interface fetchAddressListType extends fetchDataType {
  data: {
    address: addressType[];
  };
}

export interface fetchSaveUserAddressType extends fetchDataType {
  address: userAddressType;
}

export interface fetchSaveProductDataType extends fetchDataType {
  idProduct: string;
}

export interface fetchSaveProductImagesType extends fetchDataType {
  data: {
    images: productImage[];
  };
}

export interface fetchDataBrandType extends fetchDataType {
  brands: BrandType[];
  profile: ProfileBrandType;
}

export interface SaveDataBrandType extends fetchDataType {
  data: {
    idBrand?: string;
  };
}

export interface FetchSaveDataBrandType extends fetchDataType {
  data: {
    idBrand: string;
  };
}

export interface FetchDataCategoriesType extends fetchDataType {
  data: {
    categories: CategoryType[];
    totalRecords: number;
  };
}

export interface FetchDataCategoryType extends fetchDataType {
  data: {
    category: CategoryType;
  };
}

export interface FetchGetFeedbackType extends fetchDataType {
  data: {
    feedbacks: FeedbackType[];
  };
}

export interface FetchSaveFeedbackType extends fetchDataType {
  data: {
    isReply: boolean;
    newFeedback: {
      id: string;
      message: string;
      answer: string;
    };
  };
}

export interface FetchGetDomainsType extends fetchDataType {
  data: {
    domains: DomainDataType[];
  };
}

export interface SubdomainPriceType {
  maxChars: number;
  price: number;
}

export interface FetchExtensionListType extends fetchDataType {
  data: {
    selectedExtensions: ExtensionDataType[];
    subdomainPrice: SubdomainPriceType;
  };
}

export interface CreateInvoiceResponseType extends fetchDataType {
  data: {
    invoice: string;
    authCode: string;
  };
}

export interface FetchAgentLevelType extends fetchDataType {
  agentLevels: AgentLevel[];
}

export interface SaveAgentLevelType extends fetchDataType {
  data: {
    idAgentLevel?: string;
  };
}

export interface FetchAgentRegistrationPage extends fetchDataType {
  agentRegistrationPage: AgentRegistrationType | null;
  brand: AgentBrand | null;
}

export interface FetchAgents extends fetchDataType {
  agentMembers?: AgentMember[];
  agentRegistrationPage?: AgentRegistrationType;
  agentLevels?: AgentLevel[];
  brand?: AgentBrand;
  requirement?: string;
}

export interface FetchProductsAndCategories extends fetchDataType {
  data: {
    products: SearchProductResult[];
    categories: ProductCategory[];
    totalProduct: number;
  };
}

export interface FetchAgentProductAndCategory extends fetchDataType {
  products: AgentProductType[];
  totalProduct: number;
  agentLevels: AgentLevel[];
}

export interface VerifyServiceAccount extends fetchDataType {
  serviceToken: {
    token: string;
    idSeller: string;
  };
  isStoreUser: boolean;
}

export interface FetchAddress extends fetchDataType {
  data: addressType[];
}

export interface FetchOrders extends fetchDataType {
  data: {
    orders: OrderType[];
  };
}

export interface FetchEmployeesResponse extends fetchDataType {
  employees: EmployeeListItem[];
}

export interface FetchEmployeeDetailResponse extends fetchDataType {
  employee: EmployeeDetail;
}

export interface FetchRoles extends fetchDataType {
  predefinedRoles: RoleMaster[];
  availablePermissions: AvailablePermissionGroup[];
}

export interface FetchEmployeePermissions extends fetchDataType {
  permissions: string[];
}

export interface FetchProductStocks extends fetchDataType {
  productStock: ProductStock;
}

export interface FetchStockHistory extends fetchDataType {
  stockHistories: StockHistoryType[];
  totalRecords: number;
}
