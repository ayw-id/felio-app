import type { userAddressWithAvailableServicesType } from "~/types/addressData";
import type { FormType } from "~/types/brandData";

export interface InitFormType {
  data: string;
  callingCode: countryCodeType | null;
  formType: FormType;
  titleInput?: string;
  titleDialog: string;
  addressInputState?: userAddressWithAvailableServicesType;
}
