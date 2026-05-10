<template>
  <div class="col-12=">
    <Avatar
      :image="logo"
      class="mr-2"
      style="width: 80px; height: 80px"
      shape="circle"
    />
  </div>
  <div class="mb-4">
    <p style="margin-top: 60px" class="text-3xl mb-0">
      <strong>{{ title }}</strong>
    </p>
    <p v-if="registrationFee">
      Registration Fee: <string>Rp {{ getAmount(registrationFee) }}</string>
    </p>

    <p class="mb-0 text-2xl" style="margin-top: 48px">
      <strong>Requirements</strong>
    </p>
    <p
      v-html="requirements.replace(/\n/g, '<br>')"
      class="whitespace-pre-line"
    ></p>
    <p v-if="hasExpiredDate" style="margin-top: 48px">
      <strong>Expired Date:</strong>
      {{ new Date(expiredDate).toLocaleDateString("en-CA") }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { AgentRegistrationType } from "~/types/agentData";

export interface AgentRegistrationPageStateData {
  agentRegistrationPageForm: AgentRegistrationType;
}

defineProps<{
  logo: string;
  title: string;
  expiredDate: string;
  hasExpiredDate: boolean;
  requirements: string;
  registrationFee: number;
}>();
</script>
