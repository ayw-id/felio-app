<script setup lang="ts">
import { storageNames } from "~/utils/constants";
import type { authType } from "~/types/authData";
import { showCustomToast } from "~/utils/utilsFunction";
import type { FetchSaveFeedbackType } from "~/types/fetchData";
import type { FeedbackType } from "~/types/feedbackData";
import { useFeedbackFormStore } from "~/stores/feedbackForm";
import { formType } from "~/types/formType";

interface MessageType {
  message: string;
  isAnswer: boolean;
}

const runtimeConfig = useRuntimeConfig();
const toast = useToast();
const router = useRouter();
const route = useRoute();
const feedbackStore = useFeedbackFormStore();

const dataAuth = ref<authType | null>(null);
const isLoading = ref<boolean>(false);
const feedback = ref<FeedbackType | null>(null);
const messages = ref<MessageType[]>([]);
const message = ref<string>("");

const submitFeedback = async (): Promise<void> => {
  if (message.value) {
    isLoading.value = true;
    const body = new FormData();
    body.append("message", message.value as string);
    body.append("idFeedback", (feedback.value?.id || "") as string);

    const response = await $fetch(
      `${runtimeConfig.public.sellerApi}feedback/saveFeedback`,
      {
        method: "post",
        headers: {
          Authorization: `Bearer ${dataAuth.value?.token}`,
        },
        body,
      }
    );

    isLoading.value = false;

    if (!response) {
      showCustomToast(toast);
    } else {
      const dataBind: FetchSaveFeedbackType | null = JSON.parse(
        response as string
      );

      if (dataBind) {
        if (!dataBind.success) {
          showCustomToast(toast, dataBind.msg);
        } else {
          if (feedback.value) {
            feedback.value.messages.unshift({
              message: dataBind.data.newFeedback.message,
              answer: dataBind.data.newFeedback.answer,
            });
          } else {
            feedback.value = {
              id: dataBind.data.newFeedback.id,
              message: dataBind.data.newFeedback.message,
              messages: [
                {
                  message: dataBind.data.newFeedback.message,
                  answer: "",
                },
              ],
            };
          }

          messages.value.unshift({
            message: dataBind.data.newFeedback.message,
            isAnswer: false,
          });

          message.value = "";
        }
      } else {
        showCustomToast(toast);
      }
    }
  }
};

onMounted(async () => {
  if (feedbackStore.feedback) {
    feedback.value = feedbackStore.feedback;

    feedback.value.messages.forEach((message) => {
      messages.value.push({
        message: message.message,
        isAnswer: false,
      });

      if (message.answer) {
        messages.value.push({
          message: message.answer,
          isAnswer: true,
        });
      }
    });
  }

  if (route.query.id && !feedback.value) {
    router.back();
  }

  const dataAuth_ = localStorage.getItem(storageNames.sellerToken as string);
  if (dataAuth_) {
    const parsedDataAuth = JSON.parse(dataAuth_);
    if (parsedDataAuth) {
      dataAuth.value = parsedDataAuth;
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
      <div class="card grid">
        <Toolbar class="mb-4 w-full">
          <template #start>
            <Button
              @click="router.back()"
              label="Back"
              severity="info"
              icon="pi pi-arrow-left"
              class="mr-2 bg-gray-400"
            ></Button>
          </template>
        </Toolbar>

        <div class="col-12 sm:col-12 lg:col-4 justify-center">
          <CustomForm
            :type="formType.inputField"
            id="message"
            label="Message"
            v-model:modelData="message"
          ></CustomForm>
          <Button
            @click="submitFeedback()"
            :label="isLoading ? 'Loading' : 'Kirim'"
            class="w-full"
            icon="pi pi-pencil"
          ></Button>
        </div>

        <div class="col-12 sm:col-12 lg:col-8 card">
          <div v-for="(message, i) in messages" :key="i" class="col-12">
            <div
              :style="message.isAnswer ? 'justify-content: right' : ''"
              class="col-12 flex"
            >
              <div
                :class="`card grid lg:col-8 col-12 py-4 ${
                  message.isAnswer ? '' : 'bg-green-300'
                }`"
              >
                <p :class="message.isAnswer ? 'text-right w-full' : ''">
                  {{ message.message }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Toast />
</template>
