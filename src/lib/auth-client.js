import { createAuthClient } from "better-auth/react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export const authClient = createAuthClient({
  baseURL: API,

  fetchOptions: {
    credentials: "include",
  },
});
