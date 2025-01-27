import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  await dbConnect();

  const { email, password } = await req.json();
  console.log("loginFormData", email, password);

  // validations
  if (!email || !password) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Invalid or Missing Data: Can't Log In User",
      }),
      { status: 400 }
    );
  }

  try {
    // Check if the user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Error: User does not exist with this email",
        }),
        { status: 404 }
      );
    }

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Error: Invalid email or password",
        }),
        { status: 401 }
      );
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "Login Successful",
        token,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error: Can't Log In User", error);

    return new Response(
      JSON.stringify({ success: false, message: "Error: Can't Log In User" }),
      { status: 500 }
    );
  }
}
