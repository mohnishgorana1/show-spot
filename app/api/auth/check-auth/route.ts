import { NextResponse } from "next/server";
import jwt, { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req: Request) {
  const cookies = req.headers.get("cookie");
  const token = cookies
    ?.split(";")
    .find((c) => c.trim().startsWith("authToken="))
    ?.split("=")[1];

  if (!token) {
    console.log("cant find token in check auth");

    return NextResponse.json(
      { success: false, isAuthenticated: false },
      { status: 401 }
    );
  }

  console.log("authToken finded in check auth", token);

  try {
    // Verify token using 'jose' library
    const verified = jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    console.log("verrified", (await verified).payload);

    

    return NextResponse.json(
      {
        success: true,
        isAuthenticated: true,
        user: {
          email: (await verified).payload.email,
          name: (await verified).payload.name,
          id: (await verified).payload.id,
          role: (await verified).payload.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("JWT verification failed", error);
    return NextResponse.json(
      { success: false, isAuthenticated: false },
      { status: 401 }
    );
  }
}
