export const getWebsites = async ({ token, baseUrl }) => {
  const response = await fetch(`${baseUrl}website`, {
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

export const getAvailableDomains = async ({ baseUrl }) => {
  const response = await fetch(`${baseUrl}website/availableDomains`);

  if (!response.ok) {
    throw new Error("Failed to upload file");
  }

  return await response.json();
};

export const getTemplates = async ({ baseUrl }) => {
  const response = await fetch(`${baseUrl}build/getTemplates`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to upload file");
  }

  return await response.json();
};

export const addWebsite = async ({ token, baseUrl, stateValues }) => {
  // only bio templates
  const response = await fetch(`${baseUrl}website/addWebsite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      idTemplate: stateValues.idTemplate,
      websiteName: stateValues.websiteName,
      globalComponents: stateValues.globalComponents,
      idDomain: stateValues.idDomain,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to upload file");
  }

  return await response.json();
};

export const updateWebsite = async ({ token, baseUrl, stateValues }) => {
  // only bio templates
  const response = await fetch(`${baseUrl}website/updateWebsite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      idWebsite: stateValues.idWebsite,
      websiteName: stateValues.websiteName,
      idDomain: stateValues.idDomain,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to upload file");
  }

  return await response.json();
};

export const deleteWebsite = async ({ token, baseUrl, webId }) => {
  const response = await fetch(`${baseUrl}website/deleteWebsite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      webId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to upload file");
  }

  return await response.json();
};
