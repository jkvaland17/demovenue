"use client";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

import { NextUIProvider } from "@nextui-org/react";
import CheckAuthentication from "./CheckAuthentication";
import { Suspense } from "react";
function Provider({ children }) {
  return (
    <SessionProvider>
      <Suspense>
        <Toaster position="top-right" toastOptions={{ duration: 5000 }} />{" "}
        <NextUIProvider>
          <CheckAuthentication />
          {children}
        </NextUIProvider>
      </Suspense>
    </SessionProvider>
  );
}
export default Provider;
