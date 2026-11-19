"use client";

import React from "react";
import { AccountProvider } from "@/context/AccountContext";

export const RootProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AccountProvider>{children}</AccountProvider>;
};
