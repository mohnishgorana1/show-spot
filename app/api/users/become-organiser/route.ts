import { NextResponse } from "next/server";
import User from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { id, reasonForOrganiser } = await req.json();
    console.log("req Data for organiser", id, reasonForOrganiser);

    // Validate input
    if (!id || !reasonForOrganiser) {
      return NextResponse.json(
        {
          success: false,
          message: "User Id and Reason For Organiser are required",
        },
        { status: 400 }
      );
    }

    // Check if user exists in the database
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { reasonForOrganiser, organiserRequestStatus: "pending" } },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "Cannot find your account in database" },
        { status: 401 }
      );
    }
    console.log("updatedUser", updatedUser);

    const response = NextResponse.json(
      {
        success: true,
        message: "Request for Organiser Sent Successful",
        user: updatedUser,
      },
      { status: 200 }
    );

    return response;
  } catch (error) {
    console.error("Error in Organiser Request", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
