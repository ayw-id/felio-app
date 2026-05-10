<script setup lang="ts">
import { storageNames } from "~/utils/constants";
import type { authType } from "~/types/authData";
import { showCustomToast } from "~/utils/utilsFunction";
import { useProductFormStore } from "~/stores/productForm";
import { dialogType, formType } from "~/types/formType";
import type {
  fetchSaveCategoryType,
  fetchSaveProductImagesType,
} from "~/types/fetchData";
import type {
  userAddressType,
  userAddressWithAvailableServicesType,
} from "~/types/addressData";
import type {
  productType,
  formReferencesType,
  categoryType,
  categoryFormType,
  productSpecificationType,
  productOptionsIndexesType,
  optionHeaderFormType,
  optionValueFormType,
  transformedHeaderOptionsType,
  transformedValueOptionsType,
  productImage,
  productOptionValueType,
  ProductBundleItemType,
  ProductWholesaleType,
  ProductDiscountType,
} from "~/types/productData";
import { useBrandStore } from "~/stores/Brand";
import { apiRequest } from "~/services/APIService";
import ProductServices from "~/services/ProductService";

// interface ProductOptionValueType {
//   price: number;
//   weight: number;
//   // stock: number;
// }

// Hooks
const runtimeConfig = useRuntimeConfig();
const toast = useToast();
const route = useRoute();
const router = useRouter();
const productStore = useProductFormStore();
const { scrollToAnchor } = useAnchorScroll({
  toTop: {
    scrollOptions: {
      behavior: "smooth",
      offsetTop: 0,
    },
  },
});
const brandStore = useBrandStore();
// End Hooks

// Refs
const dataAuth = ref<authType | null>(null);
const isLoading = ref<boolean>(true);

const addCategoryDialogState = ref<boolean>(false);
const newCategory = ref<categoryFormType>({
  categoryName: "",
});
const disabledDetail = ref<boolean>(false);

const dialogLoadingState = ref<boolean>(false);

const product = ref<productType>({
  id: "",
  productName: "",
  price: 0,
  weight: 0,
  description: "",
  productOptions: null,
  idCategory: 0,
  categoryName: "",
  type: "single",
  idAddress: "",
  shippingServices: [],
  isActive: 0,
  specifications: [],
  images: [],
  discounts: [],
  wholesaleTiers: [],
});
const formReferences = ref<formReferencesType>({
  categories: [],
  categoryNames: [],
  addresses: [],
  shippingServices: [],
});
const deletedProductOptionIds = ref<number[]>([]);

// const calculateProductOptionValues = () => {
//   if (!transformedOpt.value?.length) {
//     disabledDetail.value = false;
//     return;
//   }

//   let hasChildren = false;
//   transformedOpt.value.forEach((opt) => {
//     if (opt.children?.length) {
//       hasChildren = true;
//     }
//   });

//   if (!hasChildren) {
//     disabledDetail.value = false;
//   }

//   const calcValue = (
//     value: transformedValueOptionsType
//   ): transformedValueOptionsType => {
//     if (value.children?.length) {
//       let totalStock = 0;

//       const updatedChildren = value.children.map((header) => {
//         const updatedHeader = calcHeader(header);
//         // accumulate stock from child values
//         updatedHeader.children?.forEach((childValue) => {
//           totalStock += childValue.stock;
//         });
//         return updatedHeader;
//       });

//       return {
//         ...value,
//         stock: totalStock, // 👈 overwrite stock with sum of children
//         children: updatedChildren,
//       };
//     }

//     // leaf node → return as is
//     return { ...value };
//   };

//   const calcHeader = (
//     header: transformedHeaderOptionsType
//   ): transformedHeaderOptionsType => {
//     if (header.children?.length) {
//       const updatedChildren = header.children.map(calcValue);
//       return { ...header, children: updatedChildren };
//     }
//     return { ...header };
//   };

//   transformedOpt.value = transformedOpt.value.map(calcHeader);

//   let totalStock = 0;

//   transformedOpt.value.forEach((header) => {
//     header.children?.forEach((value) => {
//       totalStock += value.stock;
//     });
//   });

//   product.value.stock = totalStock;
// };

// spec
const specificationFormDialogState = ref<boolean>(false);
const selectedSpecification = ref<productSpecificationType>({
  id: "",
  title: "",
  description: "",
});
const selectedSpecificationIndex = ref<number | undefined>();

// opt
const transformedOpt = ref<transformedHeaderOptionsType[] | undefined>(
  undefined
);
const transformedKeys = ref<any>({});
const selectedOptKeyToDelete = ref<
  transformedHeaderOptionsType | transformedValueOptionsType | null
>(null);
const deleteOptDialogState = ref<boolean>(false);

const optionHeaderDialogState = ref<boolean>(false);
const selectedOptionHeader = ref<optionHeaderFormType>({
  title: "",
});

const optionValueDialogState = ref<boolean>(false);
const selectedOptionValue = ref<optionValueFormType>({
  option: "",
  price: 0,
  weight: 0,
  stock: 0,
});

const selectedOptionIndexes = ref<productOptionsIndexesType>({
  addNewData: false,
});

// img
const deletedImages = ref<string[]>([]);

// address
const isShippingActive = ref<boolean>(false);
const addAddressDialogState = ref<boolean>(false);
const addressInputState = ref<userAddressWithAvailableServicesType>({
  id: "",
  idDistrict: "",
  address: "",
  shippingServices: "",
  province: "",
  city: "",
  district: "",
  availableServices: [],
  showShippingInput: true,
});
// End Refs

// Computed
const priceMutation = computed({
  set(val: string) {
    if (val !== "") {
      product.value.price = parseInt(val.replaceAll(",", ""));
    }
  },
  get() {
    return (product.value.price || "") + "";
  },
});
const weightMutation = computed({
  set(val: string) {
    product.value.weight = parseInt(val.replaceAll(",", ""));
  },
  get() {
    return (product.value.weight || "") + "";
  },
});
const bundleDiscountTypeMutation = computed({
  set(val: "percent" | "amount") {
    if (product.value.bundle) {
      product.value.bundle.bundleDiscountType = val;
    } else {
      product.value.bundle = {
        bundleDiscountType: val,
        items: [],
        bundleDiscountValue: 0,
      };
    }
  },
  get() {
    return product.value.bundle?.bundleDiscountType ?? "percent";
  },
});
const bundleDiscountValueMutation = computed({
  set(val: number) {
    if (product.value.bundle) {
      product.value.bundle.bundleDiscountValue = val;
    } else {
      product.value.bundle = {
        bundleDiscountType: "percent",
        items: [],
        bundleDiscountValue: val,
      };
    }
  },
  get() {
    return product.value.bundle?.bundleDiscountValue ?? 0;
  },
});
const productTypeMutation = computed({
  set(val: "single" | "bundle") {
    product.value = {
      ...product.value,
      type: val,
    };
  },
  get() {
    return product.value.type;
  },
});

// const stockMutation = computed({
//   set(val: string) {
//     product.value.stock = parseInt(val.replaceAll(",", ""));
//   },
//   get() {
//     return (product.value.stock || "") + "";
//   },
// });
const detailProductStatus = computed(
  () =>
    product.value.productName &&
    product.value.idCategory &&
    product.value.price &&
    product.value.weight &&
    product.value.description
);
const specificationStatus = computed(
  () => product.value.specifications?.length
);
const optionsStatus = computed(
  () => product.value.productOptions?.options?.length
);
const imagesStatus = computed(() => product.value.images?.length);
const addressShippingStatus = computed(
  () => product.value.idAddress && product.value.shippingServices?.length
);
const discountStatus = computed(() => !!product.value.discounts.length);
const bundleStatus = computed(
  () => product.value.type === "bundle" && !!product.value.bundle?.items?.length
);
const wholesaleStatus = computed(() => !!product.value.wholesaleTiers?.length);
const preorderStatus = computed(() => !!product.value.preOrder?.isActive);
const categoryMutation = computed<categoryType | undefined>({
  set(category) {
    product.value = {
      ...product.value,
      idCategory: category ? ((category as categoryType).id as number) : 0,
      categoryName: category
        ? ((category as categoryType).id as number)
          ? (category as categoryType).name
          : ""
        : "",
    };

    if ((category as categoryType).id === 0) {
      showCategoryForm();
    }
  },
  get() {
    if (!formReferences.value?.categories?.length) {
      return undefined;
    }

    return (
      formReferences.value.categories.find(
        (category) => category.id === product.value.idCategory
      ) ?? undefined
    );
  },
});

const categoryReferenceMutation = computed(() => [
  ...[
    {
      id: 0,
      name: "Tambah Kategori",
    },
  ],
  ...(formReferences.value?.categories || []),
]);

const selectedAddress = computed(() => {
  if (!formReferences.value?.addresses.length || !product.value.idAddress) {
    return null;
  }

  return formReferences.value.addresses.find(
    (address) => address.id === product.value.idAddress
  );
});
// End Computed

// Functions
const selectAddress = (address: userAddressType): void => {
  product.value.idAddress = address.id;
  const shippingServices: string[] = [];
  if (address.shippingServices) {
    const shippingArray = address.shippingServices.split(",");
    shippingArray.forEach((shipping) => {
      shippingServices.push(shipping.trim() as string);
    });
  }
  product.value.shippingServices = shippingServices;
};

const showCategoryForm = (): void => {
  addCategoryDialogState.value = true;
};

const addCategory = async (): Promise<void> => {
  if (newCategory.value.categoryName) {
    dialogLoadingState.value = true;
    const body = new FormData();
    body.append("categoryName", newCategory.value.categoryName as string);
    body.append("idBrand", brandStore.selectedBrand?.id as string);

    const response = await apiRequest<fetchSaveCategoryType>(
      `${runtimeConfig.public.sellerApi}category/save`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${dataAuth.value?.token}`,
        },
        body,
      }
    );

    dialogLoadingState.value = false;

    if (!response.success) {
      showCustomToast(toast, response.msg);
    } else {
      addCategoryDialogState.value = false;
      if (response.data?.category) {
        const newCategories: categoryType[] = [
          response.data.category,
          ...(formReferences.value.categories || []),
        ];

        if (formReferences.value.categories) {
          formReferences.value.categories = newCategories;
        } else {
          formReferences.value = {
            ...formReferences.value,
            categories: newCategories,
          };
        }

        newCategory.value.categoryName = "";

        product.value.categoryName = response.data.category.name;
        product.value.idCategory = response.data.category.id as number;
      }
    }
  } else {
    showCustomToast(toast, "Kategori baru harus diisi");
  }
};

const editSpecification = (index?: number): void => {
  if (index === undefined) {
    selectedSpecification.value = {
      id: "",
      title: "",
      description: "",
    };
  } else if (product.value.specifications) {
    selectedSpecification.value = {
      ...product.value.specifications[index],
    };
  }

  selectedSpecificationIndex.value = index;
  specificationFormDialogState.value = true;
};

const deleteSpecification = (index: number): void => {
  product.value.specifications?.splice(index, 1);
};

const saveSpecification = (): void => {
  if (
    selectedSpecification.value.title &&
    selectedSpecification.value.description
  ) {
    if (product.value.specifications) {
      if (selectedSpecificationIndex.value === undefined) {
        product.value.specifications.push(selectedSpecification.value);
      } else {
        product.value.specifications[selectedSpecificationIndex.value] =
          selectedSpecification.value;
      }
    }
    specificationFormDialogState.value = false;
  } else {
    showCustomToast(
      toast,
      !selectedSpecification.value.title
        ? "Title masih kosong"
        : "Deskripsi masih kosong"
    );
  }
};

const scrollTo = (id: string): void => {
  scrollToAnchor(id);
};

const saveOptionHeader = (): void => {
  const { i0, i1, addNewData } = selectedOptionIndexes.value;
  if (selectedOptionHeader.value.title) {
    if (i0 === undefined) {
      product.value.productOptions = {
        title: selectedOptionHeader.value.title,
        options: addNewData ? [] : product.value.productOptions?.options || [],
      };
    } else if (i1 === undefined) {
      if (product.value.productOptions?.options[i0]) {
        product.value.productOptions.options[i0].children = {
          title: selectedOptionHeader.value.title,
          options: addNewData
            ? []
            : product.value.productOptions.options[i0].children?.options || [],
        };

        if (product.value.productOptions.options[i0].stock) {
          product.value.productOptions.options[i0].needRedistribute = true;
        }
      }
    } else {
      if (product.value.productOptions?.options[i0].children?.options[i1]) {
        product.value.productOptions.options[i0].children.options[i1].children =
          {
            title: selectedOptionHeader.value.title,
            options: addNewData
              ? []
              : product.value.productOptions.options[i0].children?.options[i1]
                  .children?.options || [],
          };

        if (
          product.value.productOptions.options[i0].children.options[i1].stock
        ) {
          product.value.productOptions.options[i0].children.options[
            i1
          ].needRedistribute = true;
        }
      }
    }
    optionHeaderDialogState.value = false;
    selectedOptionHeader.value.title = "";

    const trfOpt: transformedHeaderOptionsType[] | null =
      ProductServices.transformOpt(product.value);
    if (trfOpt) {
      transformedOpt.value = trfOpt;
    }

    expandAll();
  } else {
    showCustomToast(toast, "Title masih kosong");
  }
};

const modifyOption = (
  addNewData: boolean,
  isHeader: boolean,
  i0?: number,
  i1?: number,
  i2?: number
): void => {
  selectedOptionIndexes.value = {
    i0,
    i1,
    i2,
    addNewData,
  };

  if (isHeader) {
    optionHeaderDialogState.value = true;
    if (!addNewData) {
      selectedOptionHeader.value = {
        title:
          (i0 === undefined
            ? product.value.productOptions?.title
            : i1 === undefined
            ? product.value.productOptions?.options[i0].children?.title
            : product.value.productOptions?.options[i0].children?.options[i1]
                .children?.title) || "",
      };
    }
  } else {
    optionValueDialogState.value = true;
    if (!addNewData) {
      let option: string = "";
      let price: number = 0;
      let weight: number = 0;
      // let stock: number = 0;

      let dataOpt: productOptionValueType | undefined;

      if (i0 !== undefined) {
        dataOpt = product.value.productOptions?.options[i0];
        if (i1 !== undefined) {
          dataOpt = dataOpt?.children?.options[i1];
          if (i2 !== undefined) {
            dataOpt = dataOpt?.children?.options[i2];
          }
        }
      }

      if (dataOpt) {
        option = dataOpt.option;
        price = dataOpt.price;
        weight = dataOpt.weight;
        // stock = dataOpt.stock;
      }

      selectedOptionValue.value = {
        option,
        price,
        weight,
        // stock,
      };
    } else {
      let price: number = product.value.price;
      let weight: number = product.value.weight || 0;

      let dataOpt: productOptionValueType | undefined;

      if (i0 !== undefined) {
        dataOpt = product.value.productOptions?.options[i0];
        if (i1 !== undefined) {
          dataOpt = dataOpt?.children?.options[i1];
          if (i2 !== undefined) {
            dataOpt = dataOpt?.children?.options[i2];
          }
        }
      }

      if (dataOpt) {
        price = dataOpt.price;
        weight = dataOpt.weight;
      }

      selectedOptionValue.value = {
        ...selectedOptionValue.value,
        price,
        weight,
        // stock: 0,
      };
    }
  }
};

const saveOptionValue = (): void => {
  const { i0, i1, i2, addNewData } = selectedOptionIndexes.value;
  if (
    selectedOptionValue.value.option &&
    selectedOptionValue.value.price &&
    selectedOptionValue.value.weight
  ) {
    if (i0 === undefined) {
      const id = product.value.productOptions?.options.length
        ? product.value.productOptions.options[
            product.value.productOptions.options.length - 1
          ].id + 1
        : 1;
      if (product.value.productOptions) {
        product.value.productOptions.options.push({
          ...selectedOptionValue.value,
          id,
          children: null,
        });
      }
    } else if (i1 === undefined) {
      if (addNewData) {
        if (product.value.productOptions?.options[i0].children?.options) {
          const id = product.value.productOptions?.options[i0].children?.options
            ?.length
            ? product.value.productOptions.options[i0].children.options[
                product.value.productOptions.options[i0].children.options
                  .length - 1
              ].id + 1
            : 1;

          product.value.productOptions.options[i0].children.options.push({
            ...selectedOptionValue.value,
            id,
            children: null,
          });
        }
      } else {
        if (product.value.productOptions?.options[i0]) {
          product.value.productOptions.options[i0] = {
            ...product.value.productOptions.options[i0],
            ...selectedOptionValue.value,
          };
        }
      }
    } else if (i2 === undefined) {
      if (addNewData) {
        if (
          product.value.productOptions?.options[i0].children?.options[i1]
            .children?.options
        ) {
          const id = product.value.productOptions?.options[i0].children
            ?.options[i1].children?.options?.length
            ? product.value.productOptions.options[i0].children.options[i1]
                .children.options[
                product.value.productOptions.options[i0].children.options[i1]
                  .children.options.length - 1
              ].id + 1
            : 1;
          product.value.productOptions.options[i0].children.options[
            i1
          ].children.options.push({
            ...selectedOptionValue.value,
            id,
            children: null,
          });
        }
      } else {
        if (product.value.productOptions?.options[i0].children?.options[i1]) {
          product.value.productOptions.options[i0].children.options[i1] = {
            ...product.value.productOptions.options[i0].children.options[i1],
            ...selectedOptionValue.value,
          };
        }
      }
    } else {
      if (
        product.value.productOptions?.options[i0].children?.options[i1].children
          ?.options[i2]
      ) {
        product.value.productOptions.options[i0].children.options[
          i1
        ].children.options[i2] = {
          ...product.value.productOptions.options[i0].children.options[i1]
            .children.options[i2],
          ...selectedOptionValue.value,
        };
      }
    }

    optionValueDialogState.value = false;
    selectedOptionValue.value = {
      option: "",
      price: 0,
      weight: 0,
      // stock: 0,
    };

    const trfOpt: transformedHeaderOptionsType[] | null =
      ProductServices.transformOpt(product.value);
    if (trfOpt) {
      transformedOpt.value = trfOpt;
    }

    expandAll();

    // calculateProductOptionValues();
  } else {
    showCustomToast(
      toast,
      `${
        selectedOptionValue.value.option
          ? "Harge"
          : selectedOptionValue.value.price
          ? "Harga"
          : "Berat"
      } masih kosong`
    );
  }
};

const expandAll = (): void => {
  if (transformedOpt.value) {
    for (const node of transformedOpt.value) {
      expandNode(node);
    }

    transformedKeys.value = { ...transformedKeys.value };
  }
};

const expandNode = (
  node: transformedHeaderOptionsType | transformedValueOptionsType
): void => {
  if (node.children?.length) {
    transformedKeys.value[node.key] = true;

    for (const child of node.children) {
      expandNode(child);
    }
  }
};

const showDeleteOptConfirmation = (
  key: transformedHeaderOptionsType | transformedValueOptionsType
): void => {
  selectedOptKeyToDelete.value = key;
  deleteOptDialogState.value = true;
};

const deleteOption = (): void => {
  if (product.value.productOptions && selectedOptKeyToDelete.value) {
    const isHeader = !(
      selectedOptKeyToDelete.value as transformedValueOptionsType
    ).price;
    const { i0, i1, i2 } = selectedOptKeyToDelete.value;
    if (i0 === undefined) {
      product.value.productOptions = null;
    } else if (i1 === undefined) {
      if (isHeader) {
        product.value.productOptions.options[i0].children = null;
      } else {
        if (product.value.productOptions.options[i0].realId) {
          deletedProductOptionIds.value.push(
            product.value.productOptions.options[i0].realId
          );
        }
        product.value.productOptions.options.splice(i0, 1);
      }
    } else if (i2 === undefined) {
      if (product.value.productOptions.options[i0].children) {
        if (isHeader) {
          product.value.productOptions.options[i0].children.options[
            i1
          ].children = null;
        } else {
          if (
            product.value.productOptions.options[i0].children.options[i1].realId
          ) {
            deletedProductOptionIds.value.push(
              product.value.productOptions.options[i0].children.options[i1]
                .realId
            );
          }
          product.value.productOptions.options[i0].children.options.splice(
            i1,
            1
          );
        }
      }
    } else {
      if (
        product.value.productOptions.options[i0].children?.options[i1].children
      ) {
        if (
          product.value.productOptions.options[i0].children.options[i1].children
            .options[i2].realId
        ) {
          deletedProductOptionIds.value.push(
            product.value.productOptions.options[i0].children.options[i1]
              .children.options[i2].realId
          );
        }
        product.value.productOptions.options[i0].children.options[
          i1
        ].children.options.splice(i2, 1);
      }
    }
  }
  const trfOpt: transformedHeaderOptionsType[] | null =
    ProductServices.transformOpt(product.value);
  if (trfOpt) {
    transformedOpt.value = trfOpt;
  }

  expandAll();
  selectedOptKeyToDelete.value = null;
  deleteOptDialogState.value = false;

  // calculateProductOptionValues();
};

// img
const deleteImage = (index: number): void => {
  if (product.value.images?.[index]) {
    if (product.value.images[index].id) {
      deletedImages.value.push(product.value.images[index].id);
    }
    product.value.images.splice(index, 1);
  }
};

const onUploadImage = async (event: any): Promise<void> => {
  const file = event.files[0];
  const reader = new FileReader();
  const imageData = await fetch(file.objectURL as URL).then(
    async (
      r
    ): Promise<{
      blob: Blob;
      width: number;
      height: number;
    }> => {
      const imgBlob = await r.blob();
      const bitmap = await createImageBitmap(imgBlob);
      const { height, width } = bitmap;
      bitmap.close();

      return {
        blob: imgBlob,
        width,
        height,
      };
    }
  ); // blob:url

  if (imageData.blob.size / 1024 / 1024 > 4) {
    showCustomToast(toast, "Gambar maksimal 4MB");
  } else {
    reader.readAsDataURL(imageData.blob);

    reader.onloadend = function () {
      const base64data = reader.result;
      if (product.value.images) {
        product.value.images.push({
          id: "",
          image: base64data as string,
          size: imageData.blob.size,
          order: 0,
          type: imageData.blob.type,
          width: imageData.width,
          height: imageData.height,
        });
      } else {
        product.value.images = [
          {
            id: "",
            image: base64data as string,
            size: imageData.blob.size,
            order: 0,
            type: imageData.blob.type,
            width: imageData.width,
            height: imageData.height,
          },
        ];
      }
    };
  }
};

const showAddressDialog = (address?: userAddressType): void => {
  const availableServices: string[] = formReferences.value.shippingServices.map(
    (service) => service.service
  );
  addressInputState.value = {
    ...addressInputState.value,
    id: address?.id || "",
    idDistrict: address?.idDistrict || "",
    address: address?.address || "",
    shippingServices: address?.shippingServices || "",
    province: address?.province || "",
    city: address?.city || "",
    district: address?.district || "",
    availableServices,
  };

  addAddressDialogState.value = true;
};

const redistribute = (payload: {
  i0?: number;
  i1?: number;
  i2?: number;
  children: Array<{ index: number | string; qty: number }>;
}): void => {
  const productOptions = JSON.parse(
    JSON.stringify(product.value.productOptions)
  );
  if (payload.i0 !== undefined) {
    if (payload.i1 === undefined) {
      if (productOptions?.options[payload.i0]?.children?.options) {
        payload.children.forEach((child) => {
          if (child.index !== "" && payload.i0 !== undefined) {
            productOptions.options[payload.i0].children.options[
              parseInt(child.index + "")
            ].redistributedQty = child.qty;
          }
        });
      }
    } else {
      if (
        productOptions?.options[payload.i0]?.children?.options[payload.i1]
          ?.children?.options
      ) {
        payload.children.forEach((child) => {
          if (
            child.index !== "" &&
            payload.i0 !== undefined &&
            payload.i1 !== undefined
          ) {
            productOptions.options[payload.i0].children.options[
              payload.i1
            ].children.options[parseInt(child.index + "")].redistributedQty =
              child.qty;
          }
        });
      }
    }
  }

  product.value.productOptions = JSON.parse(JSON.stringify(productOptions));
  const trfOpt: transformedHeaderOptionsType[] | null =
    ProductServices.transformOpt(product.value);
  if (trfOpt) {
    transformedOpt.value = trfOpt;
  }
};

const updateProductDetail = (): void => {
  if (product.value.type === "bundle") {
    let price = 0;
    let weight = 0;
    product.value.bundle?.items.forEach((item) => {
      price += item.price * item.qty;
      weight += item.weight * item.qty;
    });

    product.value = {
      ...product.value,
      price,
      weight,
    };
  }
};
// End Functions

// Access API Functions
const getProduct = async (): Promise<void> => {
  if (!dataAuth.value) return;

  const response = await ProductServices.getInitProductForm(
    {
      idProduct: (product.value.id as string) || "",
      idBrand: brandStore.selectedBrand?.id as string,
    },
    dataAuth.value
  );

  isLoading.value = false;

  if (response.success) {
    if (response.data?.formReferences) {
      formReferences.value = response.data.formReferences;
    }
    if (response.data?.product) {
      product.value = response.data.product;
      if (response.data.product.type === "bundle") {
        updateProductDetail();
      }
      if (response.data.product.idAddress) {
        isShippingActive.value = true;
      }
      if (product.value.preOrder) {
        if (product.value.preOrder.limitQty) {
          product.value.preOrder.isLimitingQtyEnabled = true;
        }
        if (product.value.preOrder.downPayment) {
          product.value.preOrder.isInstallmentEnabled = true;
        }
      }
    }
    if (response.data?.transformedOpt) {
      transformedOpt.value = response.data.transformedOpt;
    }
  } else {
    showCustomToast(toast, response.message);
  }
};

const saveUserAddress = async (): Promise<void> => {
  if (!dataAuth.value) return;

  dialogLoadingState.value = true;

  const response = await ProductServices.saveAddress(
    dataAuth.value,
    JSON.parse(JSON.stringify(formReferences.value)),
    JSON.parse(JSON.stringify(product.value)),
    brandStore.selectedBrand?.id as string,
    addressInputState.value
  );
  dialogLoadingState.value = false;

  if (!response.success) {
    showCustomToast(toast, response.message);
  }

  if (response.data) {
    formReferences.value = response.data.formReferences;
    product.value = response.data.product;

    addAddressDialogState.value = false;
  }
};

const saveProductForm = async (): Promise<void> => {
  if (!dataAuth.value || (isShippingActive.value && !selectedAddress.value))
    return;
  isLoading.value = true;

  const response = await ProductServices.saveProduct(
    dataAuth.value,
    brandStore.selectedBrand?.id || "",
    isShippingActive.value ? selectedAddress.value : null,
    JSON.parse(JSON.stringify(product.value)),
    deletedProductOptionIds.value,
    deletedImages.value,
    {
      detailProductStatus: !!detailProductStatus.value,
      imagesStatus: !!imagesStatus.value,
      addressShippingStatus: !isShippingActive || !!addressShippingStatus.value,
    }
  );

  isLoading.value = false;

  if (!response.success) {
    showCustomToast(toast, response.message);
    if (response.scrollTo) {
      scrollTo(response.scrollTo as string);
    }
  } else if (response.data) {
    product.value = response.data.product;
    if (product.value.id && response.data.newImages.length) {
      await saveImages(response.data.newImages as productImage[]);
    } else {
      showCustomToast(toast, "Produk berhasil disimpan!", true);
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push("/product");
      }
    }
  }
};

const saveImages = async (newImages: productImage[]): Promise<void> => {
  isLoading.value = true;

  const body = new FormData();
  body.append("idProduct", (product.value.id as string) || "");
  body.append("images", JSON.stringify(newImages));

  const response = await apiRequest<fetchSaveProductImagesType>(
    `${runtimeConfig.public.sellerApi}product/saveImages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${dataAuth.value?.token}`,
      },
      body,
    }
  );

  isLoading.value = false;

  if (!response.success) {
    showCustomToast(toast, response.msg);
  } else {
    showCustomToast(toast, "Produk berhasil disimpan!", true);
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/product");
    }
  }
};
// End Access API Functions

// Mounted Function
onMounted(() => {
  const dataAuth_ = localStorage.getItem(storageNames.sellerToken as string);
  if (dataAuth_) {
    dataAuth.value = JSON.parse(dataAuth_);
  }
});

watch(
  [() => brandStore.selectedBrand, () => dataAuth.value?.token],
  async ([brand, token]) => {
    if (brand && token) {
      if (productStore.idProduct) {
        product.value.id =
          productStore.idProduct === "-" ? "" : productStore.idProduct;

        // reset store
        productStore.setIdProduct("");
      } else if (route.params.id) {
        product.value.id = route.params.id as string;
      }
      await getProduct();
    }
  },
  { immediate: false }
);

// End Mounted Function
</script>
<template>
  <div
    v-if="isLoading"
    class="text-center"
    style="height: 400px; align-content: center"
  >
    <ProgressSpinner />
  </div>
  <div v-else class="grid p-fluid mt-0">
    <div class="col-12 xl:col-8">
      <ProductFormDetail
        v-model:productName="product.productName"
        v-model:selectedCategory="categoryMutation"
        v-model:price="priceMutation"
        v-model:weight="weightMutation"
        v-model:description="product.description"
        :categoryReference="categoryReferenceMutation"
        :disabledDetail="disabledDetail"
        :type="product.type"
      />

      <ProductFormSpecification
        v-if="product.type !== 'bundle'"
        :specifications="product.specifications || []"
        :editSpecification="editSpecification"
        :deleteSpecification="deleteSpecification"
      />

      <ProductFormVariant
        v-if="product.type !== 'bundle'"
        :hasProductOption="!!product.productOptions"
        :transformedOpt="transformedOpt"
        v-model:transformedKeys="transformedKeys"
        :modifyOption="modifyOption"
        :showDeleteOptConfirmation="showDeleteOptConfirmation"
        @redistribute="redistribute"
      />

      <div id="productImages" class="card flex flex-column mx-0">
        <label class="mb-4 text-lg font-medium">Gambar Produk</label>
        <div class="grid">
          <div
            v-for="(img, i) in product.images"
            :key="i"
            class="col-6 md:col-3 lg:col-2"
          >
            <Image :src="img.image" width="100%"></Image>
            <div>
              <Button
                @click="deleteImage(i)"
                outlined
                class="w-full md:w-5"
                icon="pi pi-trash"
                severity="danger"
              ></Button>
            </div>
          </div>
        </div>
        <div
          v-if="!product.images || product.images.length < 10"
          class="flex justify-content-center mt-4"
        >
          <FileUpload
            mode="basic"
            auto
            chooseLabel="Tambah Gambar Produk"
            class="bg-blue-400"
            name="demo[]"
            url="/api/upload"
            accept="image/*"
            customUpload
            @uploader="onUploadImage($event)"
          />
        </div>
      </div>

      <div id="addressAndShipping" class="card flex flex-column mx-0">
        <label class="mb-4 text-lg font-medium">Alamat & Jasa Pengiriman</label>
        <div class="grid">
          <div class="col-12 flex align-items-center">
            <CustomForm
              :type="formType.switch"
              v-model:modelData="isShippingActive"
              :label="`Layanan Pengiriman ${
                isShippingActive ? '' : 'Tidak'
              } Aktif`"
            />
          </div>
        </div>
        <div v-if="isShippingActive && selectedAddress" class="grid">
          <div class="col-12 card p-4 flex flex-column bg-green-50">
            <div class="flex justify-content-end">
              <Button
                @click="product.idAddress = ''"
                outlined
                severity="danger"
                icon="pi pi-times"
              ></Button>
            </div>

            <p class="mb-0">{{ selectedAddress.address }}</p>
            <p class="mb-0">
              {{ selectedAddress.district }}, {{ selectedAddress.city }},
              {{ selectedAddress.province }}
            </p>
            <p class="mb-0">{{ selectedAddress.shippingServices }}</p>
          </div>
        </div>

        <div
          v-for="(address, i) in selectedAddress || !isShippingActive
            ? []
            : formReferences.addresses"
          :key="i"
          class="grid mb-4"
        >
          <div
            :class="`col-12 card p-4 flex flex-column ${
              address.id === product.idAddress ? 'bg-green-50' : ''
            }`"
          >
            <div class="flex justify-content-end">
              <Button
                @click="showAddressDialog(address)"
                outlined
                severity="info"
                icon="pi pi-pencil"
              ></Button>
            </div>

            <p class="mb-0">{{ address.address }}</p>
            <p class="mb-0">
              {{ address.district }}, {{ address.city }}, {{ address.province }}
            </p>
            <p class="">{{ address.shippingServices }}</p>
            <Button
              @click="selectAddress(address)"
              class="w-12 lg:w-2"
              severity="info"
              label="Pilih"
            ></Button>
          </div>
        </div>
        <div
          v-if="!selectedAddress && isShippingActive"
          class="flex justify-content-center mt-4"
        >
          <Button
            @click="showAddressDialog()"
            label="Tambah Alamat Pengiriman"
            class="w-12 md:w-5"
            icon="pi pi-plus"
          ></Button>
        </div>
      </div>

      <div id="discounts" class="card flex flex-column mx-0">
        <ProductFormDiscount
          :discounts="product.discounts"
          @update:discounts="
            (newDiscounts: ProductDiscountType[]) => (product.discounts = newDiscounts)
          "
          @delete:discounts="(id: string) => {
            if (product.discountsToDelete) {
              product.discountsToDelete.push(id);
            } else {
              product.discountsToDelete = [id];
            }
          }"
        />
      </div>

      <div id="bundle" class="card flex flex-column mx-0">
        <ProductFormBundle
          :token="dataAuth?.token ?? ''"
          :selectedProductsBundle="product.bundle?.items || []"
          :bundleItemsToDelete="product.bundleItemsToDelete || []"
          :idProduct="product.id"
          v-model:productType="productTypeMutation"
          v-model:bundle-discount-type="bundleDiscountTypeMutation"
          v-model:bundle-discount-value="bundleDiscountValueMutation"
          @update:selectedProductsBundle="(items: ProductBundleItemType[]) => {
            if (product.bundle) {
              product.bundle.items = items;
            } else {
              product.bundle = {
                items,
                bundleDiscountType: 'percent',
                bundleDiscountValue: 0,
              }
            }
            updateProductDetail();
          }"
          @update:bundleItemsToDelete="(id?: string) => {
            if (id) {
              if (product.bundleItemsToDelete) {
                product.bundleItemsToDelete.push(id);
              } else {
                product.bundleItemsToDelete = [id];
              }

              updateProductDetail();
            }
          }"
        />
      </div>

      <div id="wholesale" class="card flex flex-column mx-0">
        <ProductFormWholesaleTiers
          :tiers="product.wholesaleTiers"
          @update:wholesaleTiers="(tiers: ProductWholesaleType[]) => {
            product.wholesaleTiers = tiers;
          }"
          @update:wholesaleTiersToDelete="(id: string) => {
            if (!product.wholesaleTiersToDelete) {
              product.wholesaleTiersToDelete = [id];
            } else {
              product.wholesaleTiersToDelete.push(id);
            }
          }"
        />
      </div>

      <div id="preorder" class="card flex flex-column mx-0">
        <ProductFormPreOrder v-model:preOrderModel="product.preOrder" />
      </div>

      <div class="card flex mx-0 justify-content-center">
        <Button
          @click="saveProductForm"
          label="Simpan Produk"
          class="w-full md:w-5"
          icon="pi pi-save"
        ></Button>
      </div>
    </div>

    <div
      class="hidden xl:block col-12 md:col-3 lg:col-4"
      style="position: fixed; top: 24; right: 0; width: 24%; margin-right: 24px"
    >
      <div class="card grid mx-0">
        <div class="col-12 mb-2" @click="scrollTo('productDetail')">
          <Avatar
            v-if="detailProductStatus"
            icon="pi pi-check"
            style="background-color: green; color: white"
          ></Avatar>
          <Avatar v-else>1</Avatar>
          <span
            class="ml-2 mb-2 text-lg font-medium"
            :style="`color: ${detailProductStatus ? 'green' : 'black'}`"
            >Detail Produk</span
          >
        </div>

        <div
          v-if="product.type !== 'bundle'"
          class="col-12 mb-2"
          @click="scrollTo('productSpecification')"
        >
          <Avatar
            v-if="specificationStatus"
            icon="pi pi-check"
            style="background-color: green; color: white"
          ></Avatar>
          <Avatar v-else style="background-color: orange; color: white"
            >2</Avatar
          >
          <span
            class="ml-2 mb-2 text-lg font-mediumblack"
            :style="`color: ${specificationStatus ? 'green' : 'orange'}`"
            >Spesifikasi Produk (Opsional)</span
          >
        </div>

        <div
          v-if="product.type !== 'bundle'"
          class="col-12 mb-2"
          @click="scrollTo('productVariant')"
        >
          <Avatar
            v-if="optionsStatus"
            icon="pi pi-check"
            style="background-color: green; color: white"
          ></Avatar>
          <Avatar v-else style="background-color: orange; color: white"
            >3</Avatar
          >
          <span
            class="ml-2 mb-2 text-lg font-mediumblack"
            :style="`color: ${optionsStatus ? 'green' : 'orange'}`"
            >Varian Produk (Opsional)</span
          >
        </div>

        <div class="col-12 mb-2" @click="scrollTo('productImages')">
          <Avatar
            v-if="imagesStatus"
            icon="pi pi-check"
            style="background-color: green; color: white"
          ></Avatar>
          <Avatar v-else>{{ product.type === "bundle" ? 2 : 4 }}</Avatar>
          <span
            class="ml-2 mb-2 text-lg font-medium"
            :style="`color: ${imagesStatus ? 'green' : 'black'}`"
            >Gambar Produk</span
          >
        </div>

        <div class="col-12 mb-2" @click="scrollTo('addressAndShipping')">
          <Avatar
            v-if="addressShippingStatus"
            icon="pi pi-check"
            style="background-color: green; color: white"
          ></Avatar>
          <Avatar v-else style="background-color: orange; color: white">{{
            product.type === "bundle" ? 3 : 5
          }}</Avatar>
          <span
            class="ml-2 mb-2 text-lg font-medium"
            :style="`color: ${addressShippingStatus ? 'green' : ''}`"
            >Alamat & Jasa Pengiriman</span
          >
        </div>

        <div class="col-12 mb-2" @click="scrollTo('discounts')">
          <Avatar
            v-if="discountStatus"
            icon="pi pi-check"
            style="background-color: green; color: white"
          ></Avatar>
          <Avatar v-else style="background-color: orange; color: white">{{
            product.type === "bundle" ? 4 : 6
          }}</Avatar>
          <span
            class="ml-2 mb-2 text-lg font-medium"
            :style="`color: ${discountStatus ? 'green' : ''}`"
            >Diskon</span
          >
        </div>

        <div class="col-12 mb-2" @click="scrollTo('bundle')">
          <Avatar
            v-if="bundleStatus"
            icon="pi pi-check"
            style="background-color: green; color: white"
          ></Avatar>
          <Avatar v-else style="background-color: orange; color: white">{{
            product.type === "bundle" ? 5 : 7
          }}</Avatar>
          <span
            class="ml-2 mb-2 text-lg font-medium"
            :style="`color: ${bundleStatus ? 'green' : ''}`"
            >Bundle</span
          >
        </div>

        <div class="col-12 mb-2" @click="scrollTo('wholesale')">
          <Avatar
            v-if="wholesaleStatus"
            icon="pi pi-check"
            style="background-color: green; color: white"
          ></Avatar>
          <Avatar v-else style="background-color: orange; color: white">{{
            product.type === "bundle" ? 6 : 8
          }}</Avatar>
          <span
            class="ml-2 mb-2 text-lg font-medium"
            :style="`color: ${wholesaleStatus ? 'green' : ''}`"
            >Grosir</span
          >
        </div>

        <div class="col-12 mb-2" @click="scrollTo('preorder')">
          <Avatar
            v-if="preorderStatus"
            icon="pi pi-check"
            style="background-color: green; color: white"
          ></Avatar>
          <Avatar v-else style="background-color: orange; color: white">{{
            product.type === "bundle" ? 7 : 9
          }}</Avatar>
          <span
            class="ml-2 mb-2 text-lg font-medium"
            :style="`color: ${preorderStatus ? 'green' : ''}`"
            >Pre-Order</span
          >
        </div>
      </div>
    </div>
  </div>
  <CustomDialogUI
    v-model:dialogState="addCategoryDialogState"
    header="Kategori Baru"
    :width="48"
    :type="dialogType.form"
    :cancelButtonAction="() => (addCategoryDialogState = false)"
    :successButtonAction="addCategory"
    v-model:categoryInputState="newCategory"
    :isLoading="dialogLoadingState"
  ></CustomDialogUI>

  <CustomDialogUI
    v-model:dialogState="specificationFormDialogState"
    header="Spesifikasi Produk"
    :width="48"
    :type="dialogType.form"
    :cancelButtonAction="() => (specificationFormDialogState = false)"
    :successButtonAction="saveSpecification"
    v-model:specificationInputState="selectedSpecification"
    :isLoading="dialogLoadingState"
  ></CustomDialogUI>

  <CustomDialogUI
    v-model:dialogState="optionHeaderDialogState"
    header="Varian Produk"
    :width="48"
    :type="dialogType.form"
    :cancelButtonAction="() => (optionHeaderDialogState = false)"
    :successButtonAction="saveOptionHeader"
    v-model:optionHeaderInputState="selectedOptionHeader"
    :isLoading="dialogLoadingState"
  ></CustomDialogUI>

  <CustomDialogUI
    v-model:dialogState="optionValueDialogState"
    header="Varian Produk"
    :width="48"
    :type="dialogType.form"
    :cancelButtonAction="() => (optionValueDialogState = false)"
    :successButtonAction="saveOptionValue"
    v-model:optionValueInputState="selectedOptionValue"
    :isLoading="dialogLoadingState"
  ></CustomDialogUI>

  <CustomDialogUI
    v-model:dialogState="deleteOptDialogState"
    :header="`Hapus ${selectedOptKeyToDelete ? ((selectedOptKeyToDelete as transformedValueOptionsType).price ? 'Opsi' : 'Varian') : ''} ?`"
    :width="32"
    :type="dialogType.confirm"
    :cancelButtonAction="() => (deleteOptDialogState = false)"
    :successButtonAction="deleteOption"
    :isLoading="dialogLoadingState"
    success-button-text="Ya"
  ></CustomDialogUI>

  <CustomDialogUI
    v-model:dialogState="addAddressDialogState"
    :header="`Alamat Pengiriman`"
    :width="48"
    :type="dialogType.form"
    :cancelButtonAction="() => (addAddressDialogState = false)"
    :successButtonAction="saveUserAddress"
    v-model:address-input-state="addressInputState"
    :isLoading="dialogLoadingState"
  ></CustomDialogUI>

  <Toast />
</template>
