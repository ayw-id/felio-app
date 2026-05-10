import type { authType, builderAuthType } from "~/types/authData";
import type { availableServicesType } from "~/types/navigation";

interface stateType {
  availableServices: availableServicesType | null;
  authData: authType | null;
  builderData: builderAuthType | null;
  userPermissions: string[];
}

const stateValue: stateType = {
  availableServices: null,
  authData: null,
  builderData: null,
  userPermissions: [],
};

export const useMainStore = defineStore("main", {
  state: () => stateValue,
  getters: {
    navMenus(): availableServicesType | null {
      return this.availableServices;
    },
  },
  actions: {
    setAvailableServices(availableServices: availableServicesType | null) {
      this.availableServices = availableServices;
    },
    setAuthData(authData: authType) {
      if (authData) {
        this.authData = authData;
      }
    },
    setBuilderData(builderData: builderAuthType) {
      if (builderData) {
        this.builderData = builderData;
      }
    },
    setUserPermissions(permissions: string[]) {
      this.userPermissions = permissions;
    },
  },
});
