"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { authClient } from "@/lib/auth-client";

const Context = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  async function refreshSession() {
    try {
      setLoading(true);

      const session = await authClient.getSession();

      setUser(session?.data?.user ?? null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshSession();
  }, []);

  return (
    <Context.Provider
      value={{
        user,

        loading,

        refreshSession,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useAuth = () => useContext(Context);
