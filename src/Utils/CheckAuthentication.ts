import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const CheckAuthentication = () => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loginStatus = sessionStorage.getItem("loginStatus");
      if (
        (loginStatus !== "active" && status === "authenticated") ||
        (loginStatus === "active" && status === "unauthenticated")
      ) {
        sessionStorage.clear();
        signOut();
      }
    }
  }, [status, router]);
  return;
};

export default CheckAuthentication;
