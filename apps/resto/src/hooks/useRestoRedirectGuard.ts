import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useResto } from "@/contexts/RestoContext";
import { useIsFetching } from "@tanstack/react-query";

export const useRestoRedirectGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    brands,
    branches,
    selectedBrand,
    selectedBranch,
    brandsLoading,
    branchesLoading,
    brandLoadingStarted,
    brandLoadingFinished,
    branchLoadingStarted,
    branchLoadingFinished,
  } = useResto();

  const isFetching = useIsFetching(); // count of active queries

  const isLoginPage = location.pathname.includes("login");
  const isBrandPage = location.pathname.includes("brand");

  const isStillLoading = brandsLoading || branchesLoading;
  const isMissingData =
    !brands.length || !branches.length || !selectedBrand || !selectedBranch;

  useEffect(() => {
    if (isLoginPage || isBrandPage) return;

    if (
      (brandLoadingFinished && !brands.length) ||
      (branchLoadingFinished && !branches.length)
    ) {
      navigate(import.meta.env.BASE_URL + "brand", { replace: true });
    }
  }, [
    isLoginPage,
    isBrandPage,
    isStillLoading,
    isMissingData,
    navigate,
    brands,
    branches,
    brandLoadingFinished,
    branchLoadingFinished,
  ]);
};
