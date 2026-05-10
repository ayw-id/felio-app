import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useToken } from "@/contexts/TokenContext";
import { restoStorageNames } from "@/utils/constants";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface Brand {
  id: string;
  name: string;
}

interface Branch {
  id: string;
  idBrand: string;
  name: string;
  address: string;
  phone: string;
  isActive: boolean;
}

interface RestoContextType {
  brands: Brand[];
  branches: Branch[];
  selectedBrand: Brand | null;
  selectedBranch: Branch | null;
  setSelectedBrand: (b: Brand) => void;
  setSelectedBranch: (b: Branch) => void;
  brandsLoading: boolean;
  branchesLoading: boolean;
  brandLoadingFinished: boolean;
  branchLoadingFinished: boolean;
}

/* ------------------------------------------------------------------ */
/*  Context Helpers                                                   */
/* ------------------------------------------------------------------ */

const RestoContext = createContext<RestoContextType | undefined>(undefined);

export const useResto = () => {
  const ctx = useContext(RestoContext);
  if (!ctx) throw new Error("useResto must be used within RestoProvider");
  return ctx;
};

/* Utility to read latest cache from localStorage */
const readLocal = () => {
  const raw = localStorage.getItem(restoStorageNames.brandAndBranches);
  return raw ? JSON.parse(raw) : null;
};

/* ------------------------------------------------------------------ */
/*  Provider                                                          */
/* ------------------------------------------------------------------ */

export const RestoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token } = useToken();
  const authHeader = token ?? "";
  const hasToken = !!token;

  const qc = useQueryClient();

  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  // const [brandLoadingStarted, setBrandLoadingStarted] = useState<boolean>(false);
  // const [brandLoadingFinished, setBrandLoadingFinished] = useState<boolean>(false);
  // const [branchLoadingStarted, setBranchLoadingStarted] = useState<boolean>(false);
  // const [branchLoadingFinished, setBranchLoadingFinished] = useState<boolean>(false);

  /* ---------------------------------- */
  /* 1. Fetch brands                    */
  /* ---------------------------------- */
  const brandsQuery = useQuery({
    queryKey: ["brands"],
    enabled: hasToken,
    queryFn: async (): Promise<Brand[]> => {
      const res = await fetch(`${import.meta.env.VITE_API}resto/brand`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authHeader}`,
        },
      });
      const json = await res.json();
      if (json.success !== 1) throw new Error(json.msg);
      return json.data.brands as Brand[];
    },
    staleTime: 30 * 60 * 1000,
    initialData: readLocal()?.brands,
    onSuccess: (brands) => {},
    onError: (err) => {
      console.warn("err", err);
    },
  });

  const brands = brandsQuery.data ?? [];

  /* ---------------------------------- */
  /* 2. Sync selectedBrand w/ storage   */
  /* ---------------------------------- */
  const updateSelectedBrand = (brand) => {
    const saved = readLocal() ?? {};
    localStorage.setItem(
      restoStorageNames.brandAndBranches,
      JSON.stringify({
        ...saved,
        selectedBrand: brand,
      })
    );

    setSelectedBrand(brand);
  };

  useEffect(() => {
    if (!brands.length) return;

    const saved = readLocal();
    const storedBrand = saved?.selectedBrand;
    const fallback = brands[0];

    if (!storedBrand) {
      const found = brands.find((b) => b.id === storedBrand?.id);
      updateSelectedBrand(found ?? fallback);
    } else {
      setSelectedBrand(storedBrand);
    }
  }, [brands]);

  /* ---------------------------------- */
  /* 3. Fetch branches for brand        */
  /* ---------------------------------- */
  const selectedBrandId = selectedBrand?.id;

  const branchesQuery = useQuery({
    enabled: hasToken && !!selectedBrandId,
    queryKey: ["branches", selectedBrandId],
    queryFn: async (): Promise<Branch[]> => {
      const res = await fetch(`${import.meta.env.VITE_API}resto/branch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authHeader}`,
        },
        body: JSON.stringify({ idBrand: selectedBrandId }),
      });
      const json = await res.json();
      if (json.success !== 1) throw new Error(json.msg);
      return json.data.branches as Branch[];
    },
    staleTime: 30 * 60 * 1000,
    initialData: readLocal()?.branches,
    onSuccess: (branches) => {},
  });

  const branches = branchesQuery.data ?? [];

  const brandsLoading = brandsQuery.isLoading;
  const branchesLoading = branchesQuery.isLoading;
  const brandLoadingFinished = brandsQuery.isSuccess;
  const branchLoadingFinished = branchesQuery.isSuccess;

  /* ---------------------------------- */
  /* 4. Sync selectedBranch w/ storage  */
  /* ---------------------------------- */
  const updateSelectedBranch = (branch) => {
    const saved = readLocal() ?? {};
    localStorage.setItem(
      restoStorageNames.brandAndBranches,
      JSON.stringify({
        ...saved,
        selectedBranch: branch,
      })
    );

    setSelectedBranch(branch);
  };

  useEffect(() => {
    if (!branches.length) return;

    const saved = readLocal();
    const storedBranch = saved?.selectedBranch;
    const fallback = branches[0];
    if (!storedBranch) {
      const found = branches.find((b) => b.id === storedBranch?.id);
      updateSelectedBranch(found ?? fallback);
    } else {
      const selectedBranchByCode = branches.find(
        (b) => b.code === storedBranch.code
      );
      if (selectedBranchByCode) {
        setSelectedBranch(selectedBranchByCode);
      } else {
        updateSelectedBranch(fallback);
      }
    }
  }, [branches]);

  /* ---------------------------------- */
  /* 6. Build context value             */
  /* ---------------------------------- */
  const value = useMemo<RestoContextType>(
    () => ({
      brands,
      branches,
      selectedBrand,
      selectedBranch,
      updateSelectedBrand,
      updateSelectedBranch,
      brandsLoading,
      branchesLoading,
      brandLoadingFinished,
      branchLoadingFinished,
    }),
    [
      brands,
      branches,
      selectedBrand,
      selectedBranch,
      brandsLoading,
      branchesLoading,
      brandLoadingFinished,
      branchLoadingFinished,
    ]
  );

  return (
    <RestoContext.Provider value={value}>{children}</RestoContext.Provider>
  );
};
