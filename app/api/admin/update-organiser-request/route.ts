import { NextResponse } from "next/server";
import User from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { userId, status } = await req.json();
    console.log("updation for organiser requests", userId, status);

    // Request Fields Validation
    if (!userId || !status) {
      return NextResponse.json(
        { success: false, message: "Email and Status are required" },
        { status: 400 }
      );
    }
    // Validate status
    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status value" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
      {
        $set: {
          organiserRequestStatus: status, // Update the status
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "No user found" },
        { status: 404 }
      );
    }

    console.log("updatedUser", updatedUser);

    const response = NextResponse.json(
      {
        success: true,
        message: "Update Organisers Requests successfull",
        updatedUser,
      },
      { status: 200 }
    );

    return response;
  } catch (error) {
    console.error(" error: in updated organiser request", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
