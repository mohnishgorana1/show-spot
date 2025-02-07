import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/event.model";
import User from "@/models/user.model";

export async function GET(req: Request) {
    console.log("inside api");

  await dbConnect();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  console.log("searchparams", searchParams);
  

  if (!userId) {
    console.log("User ID is required");
    
    return new Response(
      JSON.stringify({
        success: false,
        message: "User ID is required",
      }),
      { status: 400 }
    );
  }
  try {
    const user = await User.findById(userId).populate("myEvents");
    if (!user) {
        console.log("User not found");
        
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    console.log("my events", user.myEvents);

    const response = NextResponse.json(
      {
        success: true,
        message: "Your Event Fetched successfully",
        myEvents: user.myEvents,
      },
      { status: 200 }
    );
    return response;
  } catch (error) {
    console.error("error fetching your events:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
