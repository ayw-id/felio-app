import type { dropdownOptionsType } from "./formType";

export interface AgentLavelStateType {
  showDialog: boolean;
  error: string;
  data: AgentLevel;
  isLoading: boolean;
}

export enum AgentLevelStatus {
  ACTIVE = "ACTIVE",
  NOT_ACTIVE = "NOT-ACTIVE",
  DELETED = "DELETED",
}

export interface AgentLevel {
  id: string;
  title: string;
  commission: number;
  status: AgentLevelStatus;
  agentTotal: number;
}

export enum AgentRegistrationPageStatus {
  ACTIVE = "ACTIVE",
  NOT_ACTIVE = "NOT-ACTIVE",
}

export interface AgentRegistrationType {
  isChanged?: boolean;
  idAgentLevel: string;
  title: string;
  requirements: string;
  registrationFee: number;
  hasExpiredDate: boolean;
  expiredDate: string | null;
  status: AgentRegistrationPageStatus;
}

export interface AgentBrand {
  name: string;
  logo: string;
  code: string;
  merchantCode: string;
}

export interface AgentMember {
  id: string;
}

export enum CommissionType {
  FLAT = "FLAT",
  PERCENTAGE = "PERCENTAGE",
}

export enum CommissionStatus {
  ACTIVE = "ACTIVE",
  NOT_ACTIVE = "NOT_ACTIVE",
  DELETED = "DELETED",
}

export interface AgentCommissionProduct {
  id: string;
  commission: number;
  commissionType: CommissionType;
  commissionTypeDropDown?: dropdownOptionsType;
  title: string;
  status: CommissionStatus;
}

export interface AgentProductType {
  idProduct: string;
  price: number;
  thumbImage: string;
  name: string;
  dateAdded: string;
  commissions: AgentCommissionProduct[];
}

export interface ProductCategory {
  id: string;
  code: string;
  name: string;
  imageThumb?: string;
  page: number;
  loadMore: boolean;
  products: AgentProductType[];
}

export interface SearchProductResult {
  id: string;
  code: string;
  name: string;
  image: string;
  price: number;
  stock: number;
  createdAt: string;
  commissions?: AgentCommissionProduct[];
}

export enum ProductFormOrderBy {
  id = "id",
  product = "product",
  category = "category",
}
