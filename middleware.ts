import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";

// Your secret key for verifying the token
// const JWT_SECRET = process.env.JWT_SECRET;
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // console.log("Pathname middleware checking", pathname);
  

  // Skip middleware for public paths
  const publicPaths = ["/auth/login", "/auth/register"];


  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Get token from headers or cookies
  const token = await req.cookies.get("authToken");

  if (!token?.value) {
    // Redirect to login if token is missing
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  try {
    // Verify token
    // console.log("got token", token);
    
    // const decoded = jwt.verify(token.value, JWT_SECRET);
    const decoded = await jwtVerify(token.value, JWT_SECRET);
    // console.log("decoded user", decoded);
    

    // Optionally, pass user data to the next request
    // req.headers.set("user", JSON.stringify(decoded));           // without jose
    // req.headers.set("user", JSON.stringify(decoded.payload));   // when using jose
  } catch (error) {
    console.error("Invalid Token:", error.message);
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

// Specify paths where middleware applies
export const config = {
  matcher: [
    "/",
    "/dashboard/:path*", // Protect dashboard and sub-routes
    "/profile/:path*",   // Protect profile pages
    "/api/protected/:path*", // Protect specific API routes
  ],
};
