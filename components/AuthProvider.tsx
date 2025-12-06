<<<<<<< HEAD
"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

type AuthProviderProps = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}



=======
"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

type AuthProviderProps = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}



>>>>>>> 67c34c8c3324039ac4ec0cd00bb34da2653e93e1
