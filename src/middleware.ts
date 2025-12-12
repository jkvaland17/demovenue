import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const data = (await getToken({ req: request })) as any;
  const { pathname } = request.nextUrl;
  if (!data) {
    const routes = ["/"];
    if (!routes.includes(pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  // const allowSuperAdmin = data?.routes?.routes.map(
  //   (item: any) => `${item.layout}${item.path}`,
  // );
  // const allowPathname = `${pathname?.split("/")[0]}/${pathname?.split("/")[1]}/${pathname?.split("/")[2]}`;
  // if (!allowSuperAdmin.includes(allowPathname)) {
  //   return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|.*\\..*).*)"],
};
