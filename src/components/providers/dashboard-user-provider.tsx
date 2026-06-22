"use client";

import { createContext, useContext } from "react";

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
  plan: string;
  stripeCustomerId?: string | null;
}

const DashboardUserContext = createContext<DashboardUser | null>(null);

export function DashboardUserProvider({
  user,
  children,
}: {
  user: DashboardUser;
  children: React.ReactNode;
}) {
  return (
    <DashboardUserContext.Provider value={user}>{children}</DashboardUserContext.Provider>
  );
}

export function useDashboardUser() {
  return useContext(DashboardUserContext);
}
