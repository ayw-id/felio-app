<script setup lang="ts">
import { storageNames } from "~/utils/constants";
import type { authType, builderAuthType } from "~/types/authData";
import { getBuilderAuthData, showCustomToast } from "~/utils/utilsFunction";
import type {
  fetchGetBuilderTokenType,
  fetchGetWebsitesType,
} from "~/types/fetchData";
import type { websiteType } from "~/types/websiteData";
import { toastSeverity, toastSummary } from "~/types/systemNotification";
import type { WebsiteType } from "../brand/index.vue";

const runtimeConfig = useRuntimeConfig();
const toast = useToast();

const dataAuth = ref<authType | null>(null);
const builderAuth = ref<builderAuthType | null>(null);
const isLoading = ref<boolean>(true);
const websites = ref<websiteType[]>([]);
const optionDialog = ref<boolean>(false);
const selectedWebsite = ref<WebsiteType | null>(null);
const deleteDialog = ref<boolean>(false);

const getWebsites = async (): Promise<void> => {
  const response = await $fetch(
    `${runtimeConfig.public.builderApi}build/getWebsites`,
    {
      method: "post",
      headers: {
        Authorization: `Bearer ${builderAuth.value?.token}`,
      },
    }
  );

  isLoading.value = false;

  if (!response) {
    showCustomToast(toast);
  } else {
    const dataBind: fetchGetWebsitesType | null = JSON.parse(
      response as string
    );

    if (dataBind) {
      if (!dataBind.success) {
        showCustomToast(toast, dataBind.msg);
      } else {
        websites.value = dataBind.data.websites;
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

          await getWebsites();
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

const activateBuilderAccount = async (param: {
  redirectUrl?: string;
  isDelete?: boolean;
}): Promise<void> => {
  if (!builderAuth.value) {
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

            onBuilderAuthenticate(param);
          }
        }
      } else {
        showCustomToast(toast);
      }
    }
  } else {
    onBuilderAuthenticate(param);
  }
};

const onBuilderAuthenticate = (param: {
  redirectUrl?: string;
  isDelete?: boolean;
}): void => {
  if (param.redirectUrl) {
    const anchor = document.createElement("a");
    anchor.href = param.redirectUrl;
    anchor.target = "_blank";
    anchor.click();
  } else if (param.isDelete) {
    optionDialog.value = false;
    deleteDialog.value = true;
  }
};

const editWebsite = async (): Promise<void> => {
  await activateBuilderAccount({
    redirectUrl: `${runtimeConfig.public.webBuilderUrl}build/?id=${selectedWebsite.value?.id}`,
  });

  optionDialog.value = false;
  selectedWebsite.value = null;
};

const websiteClicked = (website: websiteType): void => {
  selectedWebsite.value = website;
  optionDialog.value = true;
};

const deleteWebsite = async (): Promise<void> => {
  if (selectedWebsite.value?.id) {
    deleteDialog.value = false;

    const body = new FormData();
    body.append("webId", selectedWebsite.value.id as string);
    const response = await $fetch(
      `${runtimeConfig.public.builderApi}build/deleteWebsite`,
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
      const dataBind: fetchGetBuilderTokenType | null = JSON.parse(
        response as string
      );

      if (dataBind) {
        if (!dataBind.success) {
          showCustomToast(toast, dataBind.msg);
        } else {
          toast.add({
            severity: toastSeverity.success,
            summary: toastSummary.success,
            detail: "Website telah dihapus",
            life: 3000,
          });

          websites.value = websites.value.filter(
            (web) => web.id !== selectedWebsite.value?.id
          );
        }
      } else {
        showCustomToast(toast);
      }
    }
  }

  selectedWebsite.value = null;
};

const cancelDeleteWebsite = (): void => {
  selectedWebsite.value = null;
  deleteDialog.value = false;
};

onMounted(async () => {
  const auth = getAuthData();

  if (auth) {
    dataAuth.value = auth;
  }

  const builderAuthData = getBuilderAuthData();
  if (builderAuthData) {
    builderAuth.value = builderAuthData;
  }

  if (builderAuth.value?.token) {
    await getWebsites();
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
      <div class="card grid">
        <div
          v-for="(website, i) in websites"
          :key="i"
          class="col-6 md:col-4 xl:col-3 mb-2 px-2"
        >
          <Image
            v-if="website.thumbnail"
            :alt="website.websiteName"
            @click="websiteClicked(website)"
          >
            <template #image>
              <img
                :src="website.thumbnail"
                style="width: 100%; border-radius: 12px"
              />
            </template>
          </Image>
          <Card
            v-else
            @click="websiteClicked(website)"
            :style="`background-color: ${website.colorDisplay || '#FFFFFF'}`"
            style="
              height: 100%;
              width: 100%;
              border-radius: 8px;
              justify-content: center;
              align-items: center;
            "
          >
            <template #content>
              <div
                :style="
                  websites.length
                    ? ''
                    : 'height: 100px; display: flex; justify-content: center; align-items: center;'
                "
              >
                <Avatar
                  v-if="website.logo"
                  :image="website.logo"
                  class="mr-2"
                  size="xlarge"
                  shape="circle"
                />
                <Icon v-else class="pi pi-globe" style="font-size: 32px"></Icon>
              </div>
            </template>
          </Card>
        </div>
        <div class="col-6 md:col-4 xl:col-3 mb-2 px-3 flex">
          <Card
            @click="
              activateBuilderAccount({
                redirectUrl: runtimeConfig.public.webBuilderUrl,
              })
            "
            style="
              height: 100%;
              width: 100%;
              min-height: 160px;
              border-radius: 8px;
              justify-content: center;
              align-items: center;
              background-color: rgb(226, 232, 240);
            "
          >
            <template #content>
              <div
                :style="
                  websites.length
                    ? ''
                    : 'height: 100px; display: flex; justify-content: center; align-items: center;'
                "
              >
                <Icon class="pi pi-plus" style="font-size: 32px"></Icon>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
  <Dialog v-model:visible="optionDialog" header="" :style="{ width: '42rem' }">
    <div class="col-12 px-3">
      <Image :alt="selectedWebsite?.websiteName">
        <template #image>
          <img
            :src="selectedWebsite?.thumbnail"
            style="width: 100%; border-radius: 12px"
          />
        </template>
      </Image>
      <div class="flex justify-content-between mt-4">
        <h4>{{ selectedWebsite?.websiteName }}</h4>
        <p class="text-right text-sm">
          {{
            selectedWebsite?.lastPublishedUpdate || selectedWebsite?.lastUpdate
          }}
        </p>
      </div>

      <a
        :href="selectedWebsite?.websiteDomain"
        target="_blank"
        style="text-decoration: underline"
        class="color text-blue-500"
        >{{ selectedWebsite?.websiteDomainMask }}</a
      >
    </div>
    <div class="flex justify-content-center gap-2 mt-4">
      <Button
        type="button"
        label="Edit Website"
        severity="info"
        @click="editWebsite()"
      ></Button>
      <Button
        type="button"
        label="Delete Website"
        severity="danger"
        @click="
          activateBuilderAccount({
            isDelete: true,
          })
        "
      ></Button>
    </div>
  </Dialog>

  <Dialog
    v-model:visible="deleteDialog"
    header="Delete Website"
    :style="{ width: '25rem' }"
  >
    <span class="p-text-secondary block mb-5"
      >Anda yakin ingin menghapus website ini ?.</span
    >
    <div class="flex justify-content-center gap-2">
      <Button
        type="button"
        label="Tidak"
        severity="secondary"
        @click="cancelDeleteWebsite()"
      ></Button>
      <Button
        type="button"
        label="Ya"
        severity="danger"
        @click="deleteWebsite()"
      ></Button>
    </div>
  </Dialog>
  <Toast />
</template>
