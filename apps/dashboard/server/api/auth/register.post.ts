import { z } from "zod";
import type { fetchAuthType } from "~/types/fetchData";

const bodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  callingCode: z.string(),
  phone: z.string(),
  password: z.string().min(8),
  guestToken: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const inputRegisterState = await readValidatedBody(event, bodySchema.parse);

  try {
    const formData = new FormData();
    formData.append("name", inputRegisterState.name as string);
    formData.append("email", inputRegisterState.email as string);
    formData.append("callingCode", inputRegisterState.callingCode as string);
    formData.append("phone", inputRegisterState.phone as string);
    formData.append("password", inputRegisterState.password as string);
    formData.append("guest", inputRegisterState.guestToken as string);
    const response = await $fetch(`${runtimeConfig.public.api}auth/register`, {
      method: "post",
      body: formData,
    });

    const dataBind: fetchAuthType | null = JSON.parse(response as string);

    if (dataBind) {
      if (dataBind.success) {
        await setUserSession(event, {
          user: dataBind.data.token,
        });
      }

      return dataBind;
    } else {
      throw createError({
        statusCode: 500,
        message: "Bad response",
      });
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Server Error",
    });
  }
});
