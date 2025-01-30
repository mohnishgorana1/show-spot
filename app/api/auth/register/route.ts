import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  await dbConnect();

  const { name, email, password, confirmPassword } = await req.json();
  console.log("register Form Data", email, password);

  // validations
  if (!name || !email || !password || !confirmPassword) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Invalid or Missing Data: Can't Register User",
      }),
      { status: 400 }
    );
  }

  if (password !== confirmPassword) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Passwords do not match",
      }),
      { status: 400 }
    );
  }

  try {
    // Check if the user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Error: User Already exist with this email",
        }),
        { status: 404 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Register Successful",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error: Can't Register User", error);

    return new Response(
      JSON.stringify({ success: false, message: "Error: Can't Register User" }),
      { status: 500 }
    );
  }
}
