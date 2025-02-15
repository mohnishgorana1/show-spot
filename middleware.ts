import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Define JWT secret
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// List of public routes (accessible without authentication)
const PUBLIC_ROUTES = ["/auth/login", "/auth/register", "/"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log("Middleware checking:", pathname);

  // ✅ Ignore Next.js static files and API calls
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/public")
  ) {
    console.log("Skipping static/API/public files:", pathname);
    return NextResponse.next();
  }

  // ✅ Get token from cookies
  const token = req.cookies.get("authToken");

  if (!token?.value) {
    // 🔹 If user is NOT logged in & tries to access a protected route → Redirect to login
    if (!PUBLIC_ROUTES.includes(pathname)) {
      console.log("No token found, redirecting to /auth/login");
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    // 🔹 If user is NOT logged in but accessing a public route → Allow
    return NextResponse.next();
  }

  try {
    // ✅ Verify token
    const decoded = await jwtVerify(token.value, JWT_SECRET);

    // ✅ Check token expiration
    // if exipred
    if (decoded.payload.exp && Date.now() >= decoded.payload.exp * 1000) {
      console.log("Token expired, redirecting to /auth/login");
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // 🔹 If logged in & trying to access /auth/login or /auth/register → Redirect to Home
    if (PUBLIC_ROUTES.includes(pathname) && pathname !== "/") {
      console.log("Already logged in, redirecting to home.");
      return NextResponse.redirect(new URL("/", req.url));
    }
  } catch (error) {
    console.error("Invalid Token:", error.message);
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // ✅ Allow access if all checks pass
  return NextResponse.next();
}

// ✅ Middleware runs on all pages except public & static files
export const config = {
  matcher: "/((?!_next/static|_next/image|$).*)",
};
