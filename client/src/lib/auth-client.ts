// src/lib/auth-client.ts

// Just a simple in-memory flag — resets on every refresh (that's fine)
let authStatus: "loading" | "authenticated" | "unauthenticated" = "loading";

export const getAuthStatus = () => authStatus;

export const setAuthStatus = (
  status: "loading" | "authenticated" | "unauthenticated"
) => {
  authStatus = status;
};
