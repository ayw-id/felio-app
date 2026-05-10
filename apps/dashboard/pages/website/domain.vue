<script setup lang="ts">
import { storageNames } from "~/utils/constants";
import type { authType, builderAuthType } from "~/types/authData";
import { showCustomToast } from "~/utils/utilsFunction";
import type {
  CreateInvoiceResponseType,
  FetchExtensionListType,
  fetchGetBuilderTokenType,
  FetchGetDomainsType,
  SubdomainPriceType,
} from "~/types/fetchData";
import {
  DomainStatusType,
  DomainType,
  type DomainDataType,
  type DomainStateType,
  type ExtensionDataType,
} from "~/types/websiteData";
import { dialogType } from "~/types/formType";
import moment from "moment";
import { useMainStore } from "~/stores/main";

interface TempExtension {
  lastFetched: string;
  extensionList: ExtensionDataType[];
  subdomainPrice: SubdomainPriceType;
}

const runtimeConfig = useRuntimeConfig();
const toast = useToast();
const mainStore = useMainStore();

const dataAuth = ref<authType | null>(null);
const builderAuth = ref<builderAuthType | null>(null);
const isLoading = ref<boolean>(true);
const tableLoading = ref<boolean>(false);
const domains = ref<DomainDataType[]>([]);
const addNewDomainDialog = ref<boolean>(false);

const addNewDomain = async (): Promise<void> => {
  // for now only for subdomain
  addDomainState.value.isLoading = true;

  const body = new FormData();
  body.append(
    "products",
    JSON.stringify([
      {
        discountPercent: 0,
        discountAmount: 0,
        type: "DOMAIN",
        qty: 0,
        unit: "year",
        detailProduct: {
          domainName: addDomainState.value.hostName,
          type: "registration",
        },
      },
    ])
  );

  const response = await $fetch(
    `${runtimeConfig.public.sellerApi}invoice/createInvoice`,
    {
      method: "post",
      headers: {
        Authorization: `Bearer ${builderAuth.value?.token}`,
      },
      body,
    }
  );

  isLoading.value = false;

  if (!response) {
    showCustomToast(toast);
  } else {
    const dataBind: CreateInvoiceResponseType | null = JSON.parse(
      response as string
    );

    if (dataBind) {
      if (!dataBind.success) {
        showCustomToast(toast, dataBind.msg);
      } else {
        window.location.href = `${runtimeConfig.public.invoiceUrl}?inv=${dataBind.data.invoice}&authCode=${dataBind.data.authCode}`;
      }
    } else {
      showCustomToast(toast);
    }
  }
};

const addDomainState = ref<DomainStateType>({
  domainName: "",
  hostName: "",
  domainExtension: "",
  domainType: DomainType.subDomain,
  extensionList: [],
  subdomainPrice: null,
  addDomain: addNewDomain,
  isLoading: false,
});

const getDomains = async (): Promise<void> => {
  isLoading.value = false;
  const response = await $fetch(`${runtimeConfig.public.builderApi}domain`, {
    method: "post",
    headers: {
      Authorization: `Bearer ${builderAuth.value?.token}`,
    },
  });

  isLoading.value = false;

  if (!response) {
    showCustomToast(toast);
  } else {
    const dataBind: FetchGetDomainsType | null = JSON.parse(response as string);

    if (dataBind) {
      if (!dataBind.success) {
        showCustomToast(toast, dataBind.msg);
      } else {
        domains.value = dataBind.data.domains.map((domain) => {
          return {
            ...domain,
            domainName:
              domain.domainType === DomainType.domain
                ? `${domain.hostName}.${domain.domainExtension}`
                : domain.domainType === DomainType.subDomain
                ? `${domain.hostName}.felio.id`
                : `felio.id/s?store=${domain.hostName}`,
          };
        });
      }
    } else {
      showCustomToast(toast);
    }
  }
};

const getBuilderToken = async (): Promise<void> => {
  const response = await $fetch(
    `${runtimeConfig.public.sellerApi}auth/getBuilderToken`,
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${dataAuth.value?.token}`,
      },
    }
  );

  if (!response) {
    isLoading.value = false;
    showCustomToast(toast);
  } else {
    const dataBind: fetchGetBuilderTokenType | null = JSON.parse(
      response as string
    );

    if (dataBind) {
      if (!dataBind.success) {
        isLoading.value = false;
        showCustomToast(toast, dataBind.msg);
      } else {
        if (dataBind.data.builderToken) {
          const token = {
            token: dataBind.data.builderToken,
          };
          localStorage.setItem(
            storageNames.builderToken as string,
            JSON.stringify(token)
          );

          builderAuth.value = token;

          await getDomains();
        } else {
          isLoading.value = false;
        }
      }
    } else {
      isLoading.value = false;
      showCustomToast(toast);
    }
  }
};

const getExtensionList = async (): Promise<void> => {
  const domainExtenions = localStorage.getItem(
    storageNames.domainExtenions as string
  );
  if (domainExtenions) {
    const parsedDomainExtensions = JSON.parse(domainExtenions) as TempExtension;

    const lastFetched = moment(parsedDomainExtensions.lastFetched);
    const duration = moment.duration(lastFetched.diff(moment()));

    if (duration.asHours() < 24) {
      addDomainState.value.extensionList = parsedDomainExtensions.extensionList;
      addDomainState.value.subdomainPrice =
        parsedDomainExtensions.subdomainPrice;
    }
  }

  if (!addDomainState.value.extensionList.length) {
    const response = await $fetch(
      `${runtimeConfig.public.builderApi}domain/getExtensionList`,
      {
        method: "get",
        headers: {
          Authorization: `Bearer ${builderAuth.value?.token}`,
        },
      }
    );

    isLoading.value = false;

    if (!response) {
      showCustomToast(toast);
    } else {
      const dataBind: FetchExtensionListType | null = JSON.parse(
        response as string
      );

      if (dataBind) {
        if (!dataBind.success) {
          showCustomToast(toast, dataBind.msg);
        } else {
          const tempExtensions: TempExtension = {
            lastFetched: moment().format("DD MMM Y hh:mm:ss"),
            extensionList: dataBind.data.selectedExtensions,
            subdomainPrice: dataBind.data.subdomainPrice,
          };
          localStorage.setItem(
            storageNames.domainExtenions as string,
            JSON.stringify(tempExtensions)
          );
          addDomainState.value.extensionList = dataBind.data.selectedExtensions;
          addDomainState.value.subdomainPrice = dataBind.data.subdomainPrice;
        }
      } else {
        showCustomToast(toast);
      }
    }
  }
};

const activateBuilderAccount = async (): Promise<void> => {
  const response = await $fetch(
    `${runtimeConfig.public.sellerApi}auth/activateBuilderAccount`,
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${dataAuth.value?.token}`,
      },
    }
  );

  isLoading.value = false;

  if (!response) {
    showCustomToast(toast);
  } else {
    const dataBind: fetchGetBuilderTokenType | null = JSON.parse(
      response as string
    );

    if (dataBind) {
      if (!dataBind.success) {
        showCustomToast(toast, dataBind.msg);
      } else {
        if (dataBind.data.builderToken) {
          const token = {
            token: dataBind.data.builderToken,
          };
          localStorage.setItem(
            storageNames.builderToken as string,
            JSON.stringify(token)
          );

          builderAuth.value = token;

          await getExtensionList();

          addNewDomainDialog.value = true;
        }
      }
    } else {
      showCustomToast(toast);
    }
  }
};

onMounted(async () => {
  const dataAuth_ = localStorage.getItem(storageNames.sellerToken as string);
  if (dataAuth_) {
    const parsedDataAuth = JSON.parse(dataAuth_);
    if (parsedDataAuth) {
      dataAuth.value = parsedDataAuth;
    }
  }

  const builderAuth_ = localStorage.getItem(
    storageNames.builderToken as string
  );
  if (builderAuth_) {
    const parsedBuilderAuth = JSON.parse(builderAuth_);
    if (parsedBuilderAuth) {
      builderAuth.value = parsedBuilderAuth;
    }
  }

  if (builderAuth.value?.token) {
    await getDomains();
  } else if (dataAuth.value?.token) {
    await getBuilderToken();
  }
});
</script>
<template>
  <div
    v-if="isLoading"
    class="text-center"
    style="height: 400px; align-content: center"
  >
    <ProgressSpinner />
  </div>
  <div v-else class="grid p-fluid">
    <div class="col-12">
      <div class="card">
        <Toolbar class="mb-4 col-12">
          <template #start>
            <Button
              v-if="
                mainStore.userPermissions?.some((perm) => perm === 'domain:add')
              "
              @click="activateBuilderAccount()"
              label="Tambah Domain Baru"
              icon="pi pi-plus"
              severity="success"
              class="mr-2"
            ></Button>
          </template>
        </Toolbar>
        <DataTable
          :value="domains"
          :loading="tableLoading"
          lazy
          paginator
          :rows="10"
          ref="dt"
          dataKey="id"
          :totalRecords="1"
          tableStyle="min-width: 75rem"
        >
          <template #header>
            <div
              class="flex flex-wrap gap-2 align-items-center justify-content-between"
            >
              <h4 class="m-0">Manage Domains</h4>
              <!-- <IconField class="col-4" iconPosition="left">
                <InputIcon>
                  <i class="pi pi-search"></i>
                </InputIcon>
                <InputText v-model="filterMutation" placeholder="Search..." />
              </IconField> -->
            </div>
          </template>
          <Column header="Host Name">
            <template #body="{ data }">
              <div class="flex align-items-center gap-2">
                <a :href="`https://${data.domainName}`" target="_blank">{{
                  data.domainName
                }}</a>
              </div>
            </template>
          </Column>
          <Column header="Status">
            <template #body="{ data }">
              <div class="flex align-items-center gap-2">
                <span>{{
                  data.status === DomainStatusType.active
                    ? "Active"
                    : data.status === DomainStatusType.pending
                    ? "Pending"
                    : "Expired"
                }}</span>
              </div>
            </template>
          </Column>
          <Column header="Expiration Date">
            <template #body="{ data }">
              <div class="flex align-items-center gap-2">
                <span>{{ moment(data.expiredDate).format("DD MMM Y") }}</span>
              </div>
            </template>
          </Column>
          <!-- <Column header="Actions">
            <template #body="{ data }">
              <div class="flex align-items-center gap-2">
                <Button
                  label="Renew"
                  raised
                  severity="info"
                  class="w-full"
                  @click="goToProductForm(data)"
                ></Button>
              </div>
            </template>
          </Column> -->
        </DataTable>
      </div>
    </div>
  </div>

  <CustomDialogUI
    v-model:dialogState="addNewDomainDialog"
    v-model:addDomainState="addDomainState"
    header="Tambah Domain"
    :width="80"
    :type="dialogType.form"
  ></CustomDialogUI>

  <Toast />
</template>
