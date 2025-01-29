import { NextResponse } from "next/server";

export async function POST() {
  console.log("request for logout");

  const response = NextResponse.json(
    { success: true, message: "Logout successful" },
    { status: 200 }
  );

  // Clear authToken cookie by setting maxAge to 0
  response.cookies.set("authToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "strict",
    maxAge: 0, // Expire the cookie immediately
  });
  console.log("logout succes");

  return response;
}
