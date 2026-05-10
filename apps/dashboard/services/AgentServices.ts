import type { AgentBrand, AgentRegistrationType } from "~/types/agentData";
import type { FetchAgents } from "~/types/fetchData";
import { apiRequest } from "./APIService";

export const fetchAgentRegistrationPage = async (
  merchantPage: string
): Promise<{
  success: boolean;
  message?: string;
  agentBrand?: AgentBrand;
  agentRegistrationPage?: AgentRegistrationType;
}> => {
  const runtimeConfig = useRuntimeConfig();
  const body = new FormData();
  body.append("brandCode", merchantPage);

  const { success, msg, data } = await apiRequest<FetchAgents>(
    `${runtimeConfig.public.sellerApi}auth/verifyMerchant`,
    {
      method: "POST",
      body,
    }
  );

  return {
    success,
    message: msg,
    agentBrand: data?.brand,
    agentRegistrationPage: data?.agentRegistrationPage,
  };
};
