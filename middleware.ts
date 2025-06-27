import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/firebase";
import { useAuth } from "./contexts/Auth";
import { cookies } from "next/headers";

// Define your protected routes
const protectedRoutes = [
  "/verified",
  "/verificationdashboard",
  "/merchantverificationdashboard",
  "/merchantdashboard",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = (await cookies()).get("tripxPay__token")?.value ? true : false;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    if (token) {
      return NextResponse.next();
    } else {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
