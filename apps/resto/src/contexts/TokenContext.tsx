import React, { createContext, useContext, useEffect, useState } from "react";
import { storageNames } from "/src/utils/constants";

interface TokenContextValue {
  token: string | null;
  setToken: (token: string | null) => void;
  employeeRole: string | null;
  setEmployeeRole: (role: string | null) => void;
}

const TokenContext = createContext<TokenContextValue | undefined>(undefined);

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [employeeRole, setEmployeeRole] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem(storageNames.restoToken);
    if (storedToken) {
      try {
        const { token, employeeRole } = JSON.parse(storedToken);
        setToken(token);
        setEmployeeRole(employeeRole);
      } catch {
        // Invalid JSON
        setToken(null);
        setEmployeeRole(null);
      }
    }
  }, []);

  return (
    <TokenContext.Provider
      value={{ token, setToken, employeeRole, setEmployeeRole }}
    >
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = (): TokenContextValue => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error("useToken must be used within a TokenProvider");
  }
  return context;
};
