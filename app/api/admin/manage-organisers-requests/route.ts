import { NextResponse } from "next/server";
import User from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";

export async function GET() {
  await dbConnect();
  try {
    console.log("rquesting organiser requests");

    // Check if user exists in the database
    const allOrganisersRequest = await User.find(
      { reasonForOrganiser: { $exists: true } },
      "_id name email role reasonForOrganiser organiserRequestStatus"
    );

    if (!allOrganisersRequest.length) {
      return NextResponse.json(
        { success: false, message: "No organiser requests found" },
        { status: 404 }
      );
    }

    // console.log("allOrganisersRequest", allOrganisersRequest);

    const response = NextResponse.json(
      {
        success: true,
        message: "Organisers Requests foundsuccessful",
        allOrganisersRequest,
      },
      { status: 200 }
    );

    return response;
  } catch (error) {
    console.error(" error: in allOrganisersRequest", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
