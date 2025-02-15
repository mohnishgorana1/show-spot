import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";
import { SignJWT } from "jose";

// const JWT_SECRET = process.env.JWT_SECRET;
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const JWT_EXPIRATION = 24 * 60 * 60; // Token validity duration.

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { email, password } = await req.json();
    console.log("Login Data", email, password);

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and Password are required" },
        { status: 400 }
      );
    }

    // Check if user exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token withour jose
    // const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    //   expiresIn: JWT_EXPIRATION,
    // });

    console.log("Got user and passsword correct", user);

    // Generate JWT token using jose
    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(Math.floor(Date.now() / 1000) + JWT_EXPIRATION)
      .sign(JWT_SECRET);

    console.log("generated token", typeof token, token);

    const userToSent = {
      email: user.email,
      name: user.name,
      id: user.id,
      role: user.role,
    };

    console.log("login user to sent ", userToSent);
    

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        token,
        user: userToSent,
      },
      { status: 200 }
    );

    response.cookies.set("authToken", token, {
      httpOnly: true, // cookies accessible only by server
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production:
      maxAge: 60 * 60 * 24, // 24 hr,
      path: "/", // Make the cookie available for all routes
      sameSite: "strict", // prevent csrf
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
