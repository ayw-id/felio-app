import type { FeedbackType } from "~/types/feedbackData";

interface stateType {
  feedback: FeedbackType | null;
}

const stateValue: stateType = {
  feedback: null,
};

export const useFeedbackFormStore = defineStore("feedbackForm", {
  state: () => stateValue,
  // getters: {
  //   navMenus(): availableServicesType | null {
  //     return this.availableServices;
  //   },
  // },
  actions: {
    setFeedback(feedback: FeedbackType | null) {
      this.feedback = feedback;
    },
  },
});
