import { apiRequest } from "~/services/APIService";
import type {
  fetchGetProductFormType,
  fetchSaveUserAddressType,
  fetchSaveProductDataType,
} from "~/types/fetchData";
import type { authType } from "~/types/authData";
import type {
  userAddressType,
  userAddressWithAvailableServicesType,
} from "~/types/addressData";
import type {
  productType,
  formReferencesType,
  transformedHeaderOptionsType,
  transformedValueOptionsType,
  productOptionType,
  productOptionValueType,
  productImage,
  ProductPreOrder,
} from "~/types/productData";
import sanitizeHtml from "sanitize-html";

interface GetInitProductFormResult {
  success: boolean;
  message?: string;
  data?: {
    formReferences: formReferencesType;
    product: productType | null;
    transformedOpt: transformedHeaderOptionsType[] | null;
  };
}

const getInitProductForm = async (
  payload: {
    idProduct: string;
    idBrand: string;
  },
  dataAuth: authType | undefined
): Promise<GetInitProductFormResult> => {
  const { idProduct, idBrand } = payload;
  const runtimeConfig = useRuntimeConfig();

  const body = new FormData();
  body.append("idProduct", idProduct);
  body.append("idBrand", idBrand);

  const response = await apiRequest<fetchGetProductFormType>(
    `${runtimeConfig.public.sellerApi}product/getInitForm`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${dataAuth?.token}`,
      },
      body,
    }
  );

  if (!response.success) {
    return {
      success: false,
      message: response.msg,
    };
  }

  const responseData: GetInitProductFormResult = {
    success: true,
  };

  if (response.data) {
    const formReferences = response.data.references;

    let product: productType | null = null;
    let transformedOpt: transformedHeaderOptionsType[] | null = null;
    if (response.data?.product) {
      product = response.data.product;
      transformedOpt = transformOpt(product);
      // expandAll();

      if (product.shippingServices) {
        formReferences.shippingServices = formReferences.shippingServices.map(
          (service) => {
            return {
              ...service,
              isSelected: !!product?.shippingServices?.find(
                (selectedShipping) => selectedShipping === service.service
              ),
            };
          }
        );
      }
    }

    responseData.data = {
      formReferences,
      product,
      transformedOpt,
    };
  }

  return responseData;
};

const saveAddress = async (
  dataAuth: authType | undefined,
  formReferences: formReferencesType,
  product: productType,
  idBrand: string,
  addressInputState: userAddressWithAvailableServicesType
): Promise<{
  success: boolean;
  message?: string;
  data?: {
    formReferences: formReferencesType;
    product: productType;
  };
}> => {
  if (!addressInputState.address || !addressInputState.idDistrict) {
    return {
      success: false,
      message: `${
        addressInputState.idDistrict
          ? "Provinsi / Kota / Kecamatan"
          : "Alamat lengkap"
      } masih kosong`,
    };
  }

  const runtimeConfig = useRuntimeConfig();

  const body = new FormData();
  body.append("idAddress", addressInputState.id as string);
  body.append("idDistrict", addressInputState.idDistrict as string);
  body.append("completeAddress", addressInputState.address as string);
  body.append("idBrand", idBrand);
  body.append("shippingServices", addressInputState.shippingServices as string);

  const response = await apiRequest<fetchSaveUserAddressType>(
    `${runtimeConfig.public.sellerApi}address/save`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${dataAuth?.token}`,
      },
      body,
    }
  );

  if (!response.success) {
    return {
      success: false,
      message: response.msg,
    };
  }

  if (addressInputState.id) {
    formReferences.addresses = formReferences.addresses.map((address) => {
      return {
        ...address,
        ...(response.data?.address.id === address.id
          ? {
              idDistrict: response.data?.address.idDistrict,
              address: response.data?.address.address,
              province: response.data?.address.province,
              city: response.data?.address.city,
              district: response.data?.address.district,
              shippingServices: response.data?.address.shippingServices,
            }
          : null),
      };
    });
  } else if (response.data) {
    formReferences.addresses = [
      ...[response.data.address],
      ...formReferences.addresses,
    ];
  }
  product.idAddress = response.data?.address.id;

  return {
    success: true,
    data: {
      formReferences,
      product,
    },
  };
};

const saveProduct = async (
  dataAuth: authType | undefined,
  idBrand: string,
  selectedAddress: userAddressType | undefined | null,
  product: productType,
  deletedProductOptionIds: number[],
  deletedImages: string[],
  filterStatuses: {
    detailProductStatus: boolean;
    imagesStatus: boolean;
    addressShippingStatus: boolean;
  }
): Promise<{
  success: boolean;
  message?: string;
  scrollTo?: string;
  data?: {
    product: productType;
    newImages: productImage[];
  };
}> => {
  if (product.specifications?.length) {
    product.specifications.map((spec) => {
      return {
        ...spec,
        description: sanitizeHtml(spec.description as string),
      };
    });
  }

  let filteredProductOptions = null;
  if (product.productOptions) {
    filteredProductOptions = cleanEmptyChildrenImmutable(
      product.productOptions
    );
  }

  if (product.type === "bundle") {
    if ((product.bundle?.items?.length || 0) < 2) {
      return {
        success: false,
        message: "Item produk bundle minimal 2",
        scrollTo: "bundle",
      };
    } else if (product.bundle?.items.some((item) => !item.qty)) {
      return {
        success: false,
        message: "Qty produk bundle tidak boleh kosong",
        scrollTo: "bundle",
      };
    }
  }

  if (!filterStatuses.detailProductStatus) {
    return {
      success: false,
      message: "Detail produk belum lengkap",
      scrollTo: "productDetail",
    };
  }

  if (!filterStatuses.imagesStatus) {
    return {
      success: false,
      message: "Gambar produk belum ada",
      scrollTo: "productImages",
    };
  }

  let selectedShippingServices: string[] = [];

  if (selectedAddress) {
    if (!filterStatuses.addressShippingStatus) {
      return {
        success: false,
        message: "Alamat pengiriman produk belum ada",
        scrollTo: "addressAndShipping",
      };
    }

    if (selectedAddress) {
      selectedShippingServices = (
        selectedAddress?.shippingServices || ""
      ).split(",");
      selectedShippingServices = selectedShippingServices.map((service) =>
        service.trim()
      );

      if (!selectedShippingServices.length) {
        return {
          success: false,
          message: "Layanan pengiriman belum dipilih",
          scrollTo: "addressAndShipping",
        };
      }
    }
  }

  if (product.preOrder) {
    if (
      product.preOrder.isLimitingQtyEnabled &&
      (product.preOrder.limitQty ?? 0) <= 0
    ) {
      return {
        success: false,
        message: "Limit qty tidak boleh kosong",
        scrollTo: "preorder",
      };
    }

    if (product.preOrder.isInstallmentEnabled) {
      if ((product.preOrder.downPayment ?? 0) <= 0) {
        return {
          success: false,
          message: "Down payment tidak boleh kosong",
          scrollTo: "preorder",
        };
      }
      if (!product.preOrder.fulfillmentDate) {
        return {
          success: false,
          message: "Tanggal pelunasan tidak boleh kosong",
          scrollTo: "preorder",
        };
      }
    }
  }

  const runtimeConfig = useRuntimeConfig();

  const body = new FormData();
  body.append("idProduct", (product.id as string) || "");
  body.append("idBrand", idBrand);
  body.append("name", (product.productName.trim() as string) || "");
  body.append("idCategory", (product.idCategory || 0) + "");
  body.append("price", (product.price || 0) + "");
  body.append("weight", (product.weight || 0) + "");
  // body.append("stock", (product.stock || 0) + "");
  body.append("description", (product.description as string) || "");
  body.append(
    "deletedProductOptionIds",
    JSON.stringify(deletedProductOptionIds)
  );
  body.append(
    "specifications",
    !product.specifications?.length
      ? ""
      : JSON.stringify(product.specifications)
  );
  body.append(
    "options",
    !filteredProductOptions ? "" : JSON.stringify(filteredProductOptions)
  );
  body.append(
    "deletedImages",
    !deletedImages.length ? "" : JSON.stringify(deletedImages)
  );
  if (selectedAddress) {
    body.append("idAddress", (product.idAddress as string) || "");
    body.append("shippingServices", JSON.stringify(selectedShippingServices));
  }
  body.append("type", product.type as string);
  if (product.discounts?.length) {
    body.append("discounts", JSON.stringify(product.discounts));
  }
  if (product.discountsToDelete?.length) {
    body.append("discountsToDelete", JSON.stringify(product.discountsToDelete));
  }
  if (product.type === "bundle" && product.bundle) {
    body.append("bundle", JSON.stringify(product.bundle));
  }
  if (product.bundleItemsToDelete?.length) {
    body.append(
      "bundleItemsToDelete",
      JSON.stringify(product.bundleItemsToDelete)
    );
  }
  body.append("wholesaleTiers", JSON.stringify(product.wholesaleTiers));
  if (product.wholesaleTiersToDelete?.length) {
    body.append(
      "tiersToDelete",
      JSON.stringify(product.wholesaleTiersToDelete)
    );
  }
  if (product.preOrder) {
    const preOrder: ProductPreOrder = {
      isActive: true,
      availableFrom: product.preOrder.availableFrom,
      availableUntil: product.preOrder.availableUntil,
      shippingDate: product.preOrder.shippingDate,
    };
    if (product.preOrder.isInstallmentEnabled) {
      preOrder.limitQty = product.preOrder.limitQty;
      preOrder.fulfillmentDate = product.preOrder.fulfillmentDate;
    }
    if (product.preOrder.isLimitingQtyEnabled) {
      preOrder.limitQty = product.preOrder.limitQty;
    }
    if (product.preOrder.downPayment) {
      preOrder.downPayment = product.preOrder.downPayment;
    }
    body.append("preOrder", JSON.stringify(preOrder));
  }

  const response = await apiRequest<fetchSaveProductDataType>(
    `${runtimeConfig.public.sellerApi}product/saveProduct`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${dataAuth?.token}`,
      },
      body,
    }
  );

  if (!response.success) {
    return {
      success: false,
      message: response.msg,
    };
  }

  if (!product.id) {
    product.id = response.data?.idProduct ?? "";
  }
  const newImages: productImage[] = (product.images || []).filter(
    (image) => !image.id
  );

  return {
    success: true,
    data: {
      product,
      newImages: [],
    },
  };
};

const transformOpt = (
  product: productType
): transformedHeaderOptionsType[] | null => {
  if (!product.productOptions) {
    return null;
  }

  const opt1: transformedValueOptionsType[] = [];
  let key = 0;
  product.productOptions.options.forEach((option1, index0) => {
    const opt2: transformedHeaderOptionsType[] = [];
    let totalOpt1 = 0;
    let hasChildren2 = false;
    if (option1.children) {
      const opt3: transformedValueOptionsType[] = [];
      if (option1.children.options?.length) {
        hasChildren2 = true;
      }
      option1.children.options.forEach((option3, index3) => {
        const opt4: transformedHeaderOptionsType[] = [];
        let totalOpt3 = 0;
        let hasChildren4 = false;
        if (option3.children) {
          const opt5: transformedValueOptionsType[] = [];
          if (option3.children.options?.length) {
            hasChildren4 = true;
          }
          option3.children.options.forEach((option5, index5) => {
            // stock: option5.stock,
            opt5.push({
              key: `${key}`,
              label: option5.option,
              price: option5.price,
              weight: option5.weight,
              stock: option5.stock ?? 0,
              ...(option5.redistributedQty !== undefined
                ? {
                    redistributedQty: option5.redistributedQty,
                  }
                : null),
              i0: index0,
              i1: index3,
              i2: index5,
              isLast: true,
              children: null,
            });

            totalOpt3 += option5?.stock ?? 0;
            key++;
          });

          opt4.push({
            key: `${key}`,
            label: option3.children.title,
            children: opt5.length ? opt5 : null,
            i0: index0,
            i1: index3,
          });
          key++;
        }

        if (!hasChildren4) {
          totalOpt3 = option3?.stock ?? 0;
        }

        totalOpt1 += totalOpt3;

        opt3.push({
          key: `${key}`,
          label: option3.option,
          price: option3.price,
          weight: option3.weight,
          stock: option3.needRedistribute ? option3?.stock ?? 0 : totalOpt3,
          ...(option3.redistributedQty !== undefined
            ? {
                redistributedQty: option3.redistributedQty,
              }
            : null),
          children: opt4.length ? opt4 : null,
          needRedistribute: option3.needRedistribute,
          i0: index0,
          i1: index3,
        });
        key++;
      });

      opt2.push({
        key: `${key}`,
        label: option1.children.title,
        children: opt3.length ? opt3 : null,
        i0: index0,
      });
      key++;
    }

    if (!hasChildren2) {
      totalOpt1 = option1?.stock ?? 0;
    }

    opt1.push({
      key: `${key}`,
      label: option1.option,
      price: option1.price,
      weight: option1.weight,
      stock: option1.needRedistribute ? option1?.stock ?? 0 : totalOpt1,
      ...(option1.redistributedQty !== undefined
        ? {
            redistributedQty: option1.redistributedQty,
          }
        : null),
      children: opt2.length ? opt2 : null,
      needRedistribute: option1.needRedistribute,
      i0: index0,
    });
    key++;
  });

  return [
    {
      key: "0",
      label: product.productOptions.title,
      children: opt1.length ? opt1 : null,
    },
  ];
};

const cleanEmptyChildrenImmutable = (
  root: productOptionType
): productOptionType => {
  return {
    ...root,
    options: root?.options?.map(cleanOptionImmutable) || [],
  };
};

const cleanOptionImmutable = (
  opt: productOptionValueType
): productOptionValueType => {
  // if no children property => keep it as-is (normalize to null)
  if (!opt.children) {
    return { ...opt, children: null };
  }

  // if children exists but options isn't an array or is empty -> remove children
  if (
    !Array.isArray(opt.children.options) ||
    opt.children.options.length === 0
  ) {
    // remove children
    const clone = { ...opt };
    clone.children = null;
    return clone;
  }

  // otherwise, recurse
  return {
    ...opt,
    children: {
      ...opt.children,
      options: opt.children.options.map(cleanOptionImmutable),
    },
  };
};

export default {
  getInitProductForm,
  saveAddress,
  saveProduct,
  transformOpt,
};
