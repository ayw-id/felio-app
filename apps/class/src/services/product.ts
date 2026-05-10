export const getProducts = async ({ token, baseUrl }) => {
  const response = await fetch(`${baseUrl}product`, {
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

export const getProductById = async ({ token, baseUrl, idProduct }) => {
  const response = await fetch(`${baseUrl}product/getProduct`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      idProduct,
    }),
  });

  if (!response.ok) {
    throw new Error("Request Failed");
  }

  return await response.json();
};

export const saveProduct = async ({ token, baseUrl, stateValues }) => {
  const response = await fetch(`${baseUrl}product/saveProduct`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      idProduct: stateValues.id,
      title: stateValues.title,
      description: stateValues.description,
      type: stateValues.type,
      price: parseInt(stateValues.price + ""),
      images: JSON.stringify(stateValues.images),
      useQty: false,
      qty: 0,
      fileProduct: JSON.stringify(stateValues.fileProduct),
      deletedImages: JSON.stringify(stateValues.deletedImages),
    }),
  });

  if (!response.ok) {
    throw new Error("Request Failed");
  }

  return await response.json();
};

export const deleteProduct = async ({ token, baseUrl, idProduct }) => {
  const response = await fetch(`${baseUrl}product/deleteProduct`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      idProduct,
    }),
  });

  if (!response.ok) {
    throw new Error("Request Failed");
  }

  return await response.json();
};
