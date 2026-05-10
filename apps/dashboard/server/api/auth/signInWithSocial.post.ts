import { z } from "zod";

const bodySchema = z.object({
  provider: z.string(),
  code: z.string().optional(),
  guestToken: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { provider, code, guestToken } = await readValidatedBody(
    event,
    bodySchema.parse
  );

  let url = "";
  let data = {};
  if (provider === "google") {
    // url = `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${response.code}`
    const formData = new FormData();
    formData.append("grant_type", "authorization_code");
    formData.append("code", code as string);
    formData.append("client_id", runtimeConfig.public.googleClientId as string);
    formData.append(
      "client_secret",
      runtimeConfig.public.googleClientSecret as string
    );
    formData.append(
      "redirect_uri",
      runtimeConfig.public.googleRedirectUrl as string
    );

    url = `https://accounts.google.com/o/oauth2/token`;
    data = {
      method: "POST",
      body: formData,
    };
  } else {
    url = `https://graph.facebook.com/oauth/access_token?client_id=${
      runtimeConfig.public.facebookClientId
    }&redirect_uri=${encodeURI(
      runtimeConfig.public.facebookRedirectUrl as string
    )}&client_secret=${runtimeConfig.public.facebookClientSecret}&code=${code}`;

    data = {
      method: "get",
    };
  }

  try {
    let response = await $fetch(url, data);

    let dataBind: any | null = response;
    if (dataBind) {
      const accessToken = dataBind?.access_token as string;
      const id = (
        provider === "google" ? dataBind?.id_token : dataBind?.id
      ) as string;

      let url = "";
      if (provider === "facebook") {
        const data = {
          fields: "id,email,last_name,first_name",
          access_token: accessToken.toString(),
        };
        url = `https://graph.facebook.com/v4.0/me?${qs.stringify(data)}`;
      } else {
        url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`;
      }

      response = await $fetch(url, {
        method: "get",
      });

      dataBind = response;
      if (dataBind) {
        const userProfile = id
          ? {
              ...dataBind,
              id,
            }
          : dataBind;

        const formData = new FormData();
        formData.append("userProfile", JSON.stringify(userProfile));
        formData.append("guest", guestToken as string);
        // formData.append(
        //   "guest",
        //   dataGuest.value === null ? "" : (dataGuest.value.token as string)
        // );
        const response = await $fetch(
          `${runtimeConfig.public.sellerApi}auth/signInWithSocial/${provider}`,
          {
            method: "post",
            body: formData,
          }
        );

        dataBind = JSON.parse(response as string);
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
      } else {
        throw createError({
          statusCode: 500,
          message: "Bad response",
        });
      }
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
