import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("RESTO_TOKEN");

  useEffect(() => {
    const isLoginPage = location.pathname.includes("/resto/login");

    if (!token && !isLoginPage) {
      // Not logged in and trying to access a protected route
      navigate("/resto/login/", { replace: true });
    } else if (token && isLoginPage) {
      // Already logged in and trying to access login
      navigate(import.meta.env.BASE_URL || "/", { replace: true });
    }
  }, [token, location.pathname, navigate]);

  return <>{children}</>;
};

export default AuthGuard;
