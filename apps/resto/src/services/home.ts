export const onBoarding = async ({ token, baseUrl }) => {
  const response = await fetch(`${baseUrl}onboarding`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Request Failed");
  }

  return await response.json();
};
