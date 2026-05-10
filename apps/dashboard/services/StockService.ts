import { apiRequest } from "~/services/APIService";
import type { FetchProductStocks, FetchStockHistory } from "~/types/fetchData";
import type { authType } from "~/types/authData";
import type {
  ProductStock,
  productOptionValueType,
  TransformedProductOptionStock,
  StockHistoryType,
} from "~/types/productData";

const getStockHistories = async (
  dataAuth: authType | undefined,
  payload: {
    idBrand: string;
    page: number;
    limit: number;
    search: string;
    orderBy: string;
    orderDirection: string;
  }
): Promise<{
  success: boolean;
  message?: string;
  data?: {
    stockHistories: StockHistoryType[];
    totalRecords: number;
  };
}> => {
  const { page, limit, idBrand, search, orderBy, orderDirection } = payload;
  const runtimeConfig = useRuntimeConfig();

  const body = new FormData();
  body.append("page", page + "");
  body.append("limit", limit + "");
  body.append("idBrand", idBrand);
  body.append("search", search);
  body.append("orderBy", `${orderBy} ${orderDirection}`);

  const response = await apiRequest<FetchStockHistory>(
    `${runtimeConfig.public.sellerApi}stock/stockHistory`,
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

  return {
    success: true,
    data: response.data,
  };
};

const getStock = async (
  dataAuth: authType | undefined,
  payload: {
    idBrand: string;
    idProduct: string;
  }
): Promise<{
  success: boolean;
  message?: string;
  data?: {
    productStock: ProductStock;
  };
}> => {
  const { idProduct, idBrand } = payload;
  const runtimeConfig = useRuntimeConfig();

  const body = new FormData();
  body.append("idProduct", idProduct);
  body.append("idBrand", idBrand);

  const response = await apiRequest<FetchProductStocks>(
    `${runtimeConfig.public.sellerApi}stock/getProductStocks`,
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

  const result: {
    success: boolean;
    message?: string;
    data?: {
      productStock: ProductStock;
    };
  } = {
    success: true,
  };

  if (response.data) {
    result.data = {
      productStock: response.data.productStock,
    };
  }

  return result;
};

const saveStock = async (
  dataAuth: authType | undefined,
  payload: {
    idBrand: string;
    idProduct: string;
    notes: string;
    type: "in" | "out";
    expiredDate?: string | null;
    stock?: number;
    pricePerUnit?: number;
    options?: Array<{
      dOpt0: number;
      stock: number;
      pricePerUnit: number;
      expiredDate?: string | null;
    }>;
  }
): Promise<{
  success: boolean;
  message?: string;
  data?: {
    productStock: ProductStock;
  };
}> => {
  const runtimeConfig = useRuntimeConfig();

  const body = new FormData();
  body.append("idProduct", payload.idProduct);
  body.append("idBrand", payload.idBrand);
  body.append("notes", payload.notes);
  body.append("type", payload.type);
  body.append("stock", payload.stock + "");
  body.append("pricePerUnit", payload.pricePerUnit + "");
  if (payload.expiredDate) {
    body.append("expiredDate", payload.expiredDate);
  }
  body.append("options", JSON.stringify(payload.options));

  const response = await apiRequest<FetchProductStocks>(
    `${runtimeConfig.public.sellerApi}stock/adjustStock`,
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

  return { success: true };
};

const flattenOptions = (
  node: productOptionValueType,
  path: string[] = []
): TransformedProductOptionStock[] => {
  const newPath: string[] = [...path, node.option];
  const stock =
    typeof node.stock === "string"
      ? parseInt((node.stock ?? 0) + "")
      : node.stock ?? 0;

  if (!node.children) {
    // leaf node → return as a single row
    return [
      {
        id: node.id,
        option: newPath.join(" / "),
        stock,
        price: node.price,
        weight: node.weight,
        adjustedStock: 0,
        pricePerUnit: 0,
        expiredDate: node.expiredDate,
      },
    ];
  }

  // not a leaf → recurse into children
  return node.children.options.flatMap((child) =>
    flattenOptions(child, newPath)
  );
};

const transformProductOptionStocks = (root: {
  title: string;
  options: productOptionValueType[];
}): TransformedProductOptionStock[] => {
  return root?.options.flatMap((opt) => flattenOptions(opt));
};

export default {
  getStock,
  transformProductOptionStocks,
  saveStock,
  getStockHistories,
};
