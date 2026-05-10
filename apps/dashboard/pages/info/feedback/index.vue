<script setup lang="ts">
import { storageNames } from "~/utils/constants";
import type { authType } from "~/types/authData";
import { showCustomToast } from "~/utils/utilsFunction";
import type { FetchGetFeedbackType } from "~/types/fetchData";
import type { DataTablePageEvent } from "primevue/datatable";
import type { FeedbackType } from "~/types/feedbackData";
import { useFeedbackFormStore } from "~/stores/feedbackForm";

const runtimeConfig = useRuntimeConfig();
const toast = useToast();
const router = useRouter();
const feedbackStore = useFeedbackFormStore();

const dataAuth = ref<authType | null>(null);
const isLoading = ref<boolean>(true);
const feedbacks = ref<FeedbackType[]>([]);
const page = ref<number>(0);
const tableLoading = ref<boolean>(false);

const getFeedbacks = async (): Promise<void> => {
  const response = await $fetch(`${runtimeConfig.public.sellerApi}feedback`, {
    method: "post",
    headers: {
      Authorization: `Bearer ${dataAuth.value?.token}`,
    },
  });

  isLoading.value = false;
  tableLoading.value = false;

  if (!response) {
    showCustomToast(toast);
  } else {
    const dataBind: FetchGetFeedbackType | null = JSON.parse(
      response as string
    );

    if (dataBind) {
      if (!dataBind.success) {
        showCustomToast(toast, dataBind.msg);
      } else {
        feedbacks.value = dataBind.data.feedbacks;
      }
    } else {
      showCustomToast(toast);
    }
  }
};

const onPage = async (event: DataTablePageEvent): Promise<void> => {
  page.value = event.page;
  tableLoading.value = true;
  await getFeedbacks();
};

const openForm = (feedback?: FeedbackType): void => {
  feedbackStore.setFeedback(feedback || null);
  router.push({
    path: "/info/feedback/form",
    query: {
      id: feedback?.id || "",
    },
  });
};

onMounted(async () => {
  const dataAuth_ = localStorage.getItem(storageNames.sellerToken as string);
  if (dataAuth_) {
    const parsedDataAuth = JSON.parse(dataAuth_);
    if (parsedDataAuth) {
      dataAuth.value = parsedDataAuth;

      await getFeedbacks();
    }
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
        <Toolbar class="mb-4 w-full">
          <template #start>
            <Button
              @click="openForm()"
              label="New"
              icon="pi pi-plus"
              severity="success"
            ></Button>
          </template>
        </Toolbar>
        <DataTable
          :value="feedbacks"
          :loading="tableLoading"
          lazy
          paginator
          :rows="10"
          ref="dt"
          dataKey="id"
          :totalRecords="feedbacks.length"
          @page="onPage($event)"
          tableStyle="min-width: 75rem"
        >
          <template #header>
            <div
              class="flex flex-wrap gap-2 align-items-center justify-content-between"
            >
              <h4 class="m-0">Manage Feedbacks</h4>
            </div>
          </template>
          <Column field="message" header="Message">
            <template #body="{ data }">
              <div class="flex align-items-center">
                <a class="underline" @click="openForm(data)">{{
                  data.message.substring(0, 10)
                }}</a>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
  <Toast />
</template>
