<script setup lang="ts">
import { dialogType } from "~/types/formType";
import {
  type categoryFormType,
  type productSpecificationType,
  type optionHeaderFormType,
  type optionValueFormType,
  type transformedValueOptionsType,
  type ProductDiscountType,
  type ProductWholesaleType,
} from "~/types/productData";
import type { roleFormType, EmployeeInputType } from "~/types/employeeData";
import type { userAddressWithAvailableServicesType } from "~/types/addressData";
import type { BrandInputState } from "~/types/brandData";
import type {
  AddBrandWebsiteInputState,
  BrandWebsiteDetailDataState,
} from "../Brand/Website.vue";
import type { DomainStateType } from "~/types/websiteData";
import type { AgentLavelStateType } from "~/types/agentData";
import type { CommissionState } from "../Agent/ProductForm/Products.vue";
import type {
  BundleProductModels,
  BundleProductProps,
} from "../Form/BundleSelectProductItem.vue";

const dialogState = defineModel<boolean>("dialogState");
const categoryInputState = defineModel<categoryFormType>("categoryInputState");
const roleInputState = defineModel<roleFormType>("roleInputState");
const specificationInputState = defineModel<productSpecificationType>(
  "specificationInputState"
);
const optionHeaderInputState = defineModel<optionHeaderFormType>(
  "optionHeaderInputState"
);
const optionValueInputState = defineModel<optionValueFormType>(
  "optionValueInputState"
);
const addressInputState =
  defineModel<userAddressWithAvailableServicesType>("addressInputState");
const employeeInputState = defineModel<EmployeeInputType>("employeeInputState");
const brandInputState = defineModel<BrandInputState>("brandInputState");
const addBrandWebsiteInputState = defineModel<AddBrandWebsiteInputState>(
  "addBrandWebsiteInputState"
);
const brandWebsiteDetail =
  defineModel<BrandWebsiteDetailDataState>("brandWebsiteDetail");
const addDomainState = defineModel<DomainStateType | null>("addDomainState");
const agentLevelState = defineModel<AgentLavelStateType>("agentLevelState");
const productCommissionsState = defineModel<CommissionState>(
  "productCommissionsState"
);
const orderDetailState = defineModel<CommissionState>("orderDetailState");
const childRedistributionState = defineModel<Record<string, number>>(
  "childRedistributionState"
);
const productDiscountState = defineModel<ProductDiscountType>(
  "productDiscountState"
);
const bundleProductModels = defineModel<BundleProductModels>(
  "bundleProductModels"
);
const tierItemModel = defineModel<ProductWholesaleType>("tierItemModel");

const props = defineProps<{
  isLoading?: boolean;
  header: string;
  width?: number;
  isFullWidth?: boolean;
  type: dialogType;
  description?: string;
  cancelButtonText?: string;
  cancelButtonColor?: string;
  cancelButtonAction?: (opt?: any) => void;
  successButtonText?: string;
  successButtonColor?: string;
  successButtonAction?: (opt?: any) => void;

  // custom
  parentOption?: transformedValueOptionsType | null;
  bundleProductProps?: BundleProductProps;
}>();
</script>

<template>
  <Dialog
    v-model:visible="dialogState"
    modal
    :header="header"
    :style="width && { width: `${width}rem` }"
    :class="`mx-4 ${isFullWidth ? 'w-full' : ''}`"
  >
    <div :class="`grid pt-4`">
      <span v-if="description" class="mb-2 mx-2">{{ description }}</span>

      <FormCategory
        v-if="props.type === dialogType.form && categoryInputState"
        v-model:categoryName="categoryInputState.categoryName"
      ></FormCategory>
      <FormRole
        v-if="props.type === dialogType.form && roleInputState"
        v-model:roleName="roleInputState.roleName"
      ></FormRole>
      <FormSpecification
        v-if="props.type === dialogType.form && specificationInputState"
        v-model:specTitle="specificationInputState.title"
        v-model:specDetail="specificationInputState.description"
      ></FormSpecification>
      <FormOptionHeader
        v-if="props.type === dialogType.form && optionHeaderInputState"
        v-model:headerOpt="optionHeaderInputState.title"
      ></FormOptionHeader>
      <FormOptionValue
        v-if="props.type === dialogType.form && optionValueInputState"
        v-model:optTitle="optionValueInputState.option"
        v-model:optPrice="optionValueInputState.price"
        v-model:optWeight="optionValueInputState.weight"
        v-model:optStock="optionValueInputState.stock"
      ></FormOptionValue>
      <FormAddress
        v-if="props.type === dialogType.form && addressInputState"
        v-model:idDistrict="addressInputState.idDistrict"
        v-model:address="addressInputState.address"
        v-model:province="addressInputState.province"
        v-model:city="addressInputState.city"
        v-model:district="addressInputState.district"
        v-model:shipping-services="addressInputState.shippingServices"
        :availableShippingAddress="addressInputState.availableServices"
        :showShippingInput="addressInputState.showShippingInput"
      ></FormAddress>
      <FormEmployee
        v-if="props.type === dialogType.form && employeeInputState"
        v-model:name="employeeInputState.name"
        v-model:email="employeeInputState.email"
        v-model:phone="employeeInputState.phone"
        v-model:address="employeeInputState.address"
      ></FormEmployee>
      <FormBrand
        v-if="props.type === dialogType.form && brandInputState"
        v-model:data="brandInputState.data"
        v-model:countryCode="brandInputState.countryCode"
        v-model:titleData="brandInputState.title"
        :brandFormType="brandInputState.type"
        :title="header"
      ></FormBrand>
      <FormWebsiteOption
        v-if="
          props.type === dialogType.form && addBrandWebsiteInputState?.websites
        "
        :websites="addBrandWebsiteInputState.websites"
        v-model:addBrandWebsiteInputState="addBrandWebsiteInputState"
      ></FormWebsiteOption>
      <FormBrandWebsiteDetail
        v-if="props.type === dialogType.form && brandWebsiteDetail?.website"
        :website="brandWebsiteDetail.website"
        :is-loading="brandWebsiteDetail.isLoading"
        :remove-website="brandWebsiteDetail.removeWebsite"
      ></FormBrandWebsiteDetail>
      <FormAddNewDomain
        v-if="props.type === dialogType.form && addDomainState"
        v-model:host-name="addDomainState.hostName"
        :extensionList="addDomainState.extensionList"
        :subdomain-price="addDomainState.subdomainPrice"
        :is-loading="addDomainState.isLoading"
        :addDomain="addDomainState.addDomain"
      ></FormAddNewDomain>
      <FormAgentLevel
        v-if="props.type === dialogType.form && agentLevelState"
        v-model:title="agentLevelState.data.title"
        v-model:commission="agentLevelState.data.commission"
        :error="agentLevelState.error"
      ></FormAgentLevel>
      <FormAgentProductCommissions
        v-if="props.type === dialogType.form && productCommissionsState"
        v-model:productCommissionsState="productCommissionsState"
      ></FormAgentProductCommissions>
      <FormOrderDetail
        v-if="props.type === dialogType.form && orderDetailState"
        :selectedOrder="orderDetailState.selectedOrder"
      ></FormOrderDetail>
      <FormProductOptionRedistributionStock
        v-if="
          props.type === dialogType.form &&
          parentOption &&
          childRedistributionState
        "
        :productOptionRedistributionStockProps="parentOption"
        v-model:childRedistributionState="childRedistributionState"
      />
      <FormProductDiscount
        v-if="props.type === dialogType.form && productDiscountState"
        v-model:productDiscountState="productDiscountState"
      />
      <FormBundleSelectProductItem
        v-if="
          props.type === dialogType.form &&
          bundleProductModels &&
          bundleProductProps
        "
        v-model:bundleSelectProductItemModel="bundleProductModels"
        :bundleProductProps="bundleProductProps"
      />
      <FormWholesaleTierItem
        v-if="props.type === dialogType.form && tierItemModel"
        v-model:tier-item-model="tierItemModel"
      />

      <div class="col-12 mt-4 flex" style="justify-content: center">
        <Button
          v-if="cancelButtonAction"
          type="button"
          :loading="isLoading"
          :label="cancelButtonText || 'Batal'"
          :severity="cancelButtonColor || 'secondary'"
          class="w-3"
          @click="cancelButtonAction"
        ></Button>
        <Button
          v-if="successButtonAction"
          type="button"
          :loading="isLoading"
          :label="successButtonText || 'Simpan'"
          :severity="successButtonColor || 'primary'"
          class="w-3"
          @click="successButtonAction"
        ></Button>
      </div>
    </div>
  </Dialog>
</template>
