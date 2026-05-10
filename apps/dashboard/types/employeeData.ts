// Role Master
export interface EmployeeRole {
  idRoleMaster: string;
  roleName: string;
  permissions: string[];
}

// Brand assigned to employee
export interface EmployeeBrand {
  idBrand: string;
  name: string;
}

// Employee from list API
export interface EmployeeListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  role: {
    roleName: string;
  };
}

// Employee detail API
export interface EmployeeDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  role: EmployeeRole;
  brands: EmployeeBrand[];
}

export interface roleFormType {
  roleName: string;
}

// Enum for permission group types
export enum PermissionType {
  SalesMarketing = "sales-marketing",
  Inventory = "inventory",
  Transaction = "transaction",
  FinanceAccounting = "finance-accounting",
  HumanResource = "human-resource",
}

// Permission inside role master
export interface RolePermissionMaster {
  idRolePermissionMaster?: string;
  permissionName: string; // e.g. "order:view"
  type?: PermissionType; // now enum instead of string
}

// Predefined role
export interface RoleMaster {
  idRoleMaster: string;
  roleName: string;
  permissions: RolePermissionMaster[];
  originalPermissions?: RolePermissionMaster[];
}

// Available permission groups (for checkboxes)
export interface AvailablePermissionGroup {
  type: PermissionType;
  permissions: Array<{
    title: string; // e.g. "order"
    actions: string[]; // e.g. ["view", "process"]
  }>;
}

export interface EmployeeInputType {
  id: string;
  email: string;
  name: string;
  address: string;
  phone: string;
}
