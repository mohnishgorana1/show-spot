import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/event.model";

export async function GET(req: Request) {
  await dbConnect();
  try {
    const events = await Event.find().populate("organiser").select("-password");

    console.log("all events", events);

    if (!events || events.length <= 0) {
      return NextResponse.json(
        { success: false, message: "No Events Found" },
        { status: 500 }
      );
    }

    const response = NextResponse.json(
      {
        success: true,
        message: "Event Fetched successfully",
        events,
      },
      { status: 200 }
    );
    return response;
  } catch (error) {
    console.error("error fetching events:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
