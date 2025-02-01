import { NextResponse } from "next/server";
import User from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: Request) {
  await dbConnect();
  console.log("Checking becoming organiser request status");
  try {
    const { email } = await req.json();

    // Check if user exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      console.log("no user found", email);

      return NextResponse.json(
        { success: false, message: "No User found" },
        { status: 404 }
      );
    }

    console.log("user for checking request status", user);

    const response = NextResponse.json(
      {
        success: true,
        message: "Status Fetched Success",
        user,
        status: user.organiserRequestStatus,
      },
      { status: 200 }
    );

    return response;
  } catch (error) {
    console.error(" error: in Status fetching", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
