"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Redirection = () => {
  const session = useSession();
  const router = useRouter();
  const sessionStatus = session?.status;
  const sessionData = session.data?.user?.data;
  if (sessionStatus === "authenticated") {
    if (sessionData?.role === "superadmin") {
      router.push("/superadmin/all-organization");
    } else if (sessionData?.role === "admin") {
      router.push("/admin/all-subadmins");
    }
  }
};
export default Redirection;
