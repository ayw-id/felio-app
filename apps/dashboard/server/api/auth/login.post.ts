import { z } from "zod";
import type { fetchAuthType } from "~/types/fetchData";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  guestToken: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { email, password, guestToken } = await readValidatedBody(
    event,
    bodySchema.parse
  );

  try {
    const formData = new FormData();
    formData.append("email", (email || "") as string);
    formData.append("password", (password || "") as string);
    formData.append("guest", (guestToken || "") as string);
    const response = await $fetch(
      `${runtimeConfig.public.sellerApi}auth/login`,
      {
        method: "post",
        body: formData,
      }
    );
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
