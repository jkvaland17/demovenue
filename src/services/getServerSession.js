import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export default async function getSessionToken() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token;
  return token;
}
