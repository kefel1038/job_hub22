import { useState, useEffect } from "react";

interface AuthState {
  isAdmin: boolean;
  isLoading: boolean;
}

export function useAuth(): AuthState {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setIsAdmin(data.isAdmin === true);
      })
      .catch(() => setIsAdmin(false))
      .finally(() => setIsLoading(false));
  }, []);

  return { isAdmin, isLoading };
}

export async function adminLogin(username: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) return { success: true };
    return { success: false, error: data.error };
  } catch {
    return { success: false, error: "Network error. Please try again." };
  }
}

export async function adminLogout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
}
