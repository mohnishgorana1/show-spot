import { NextResponse } from "next/server";
import Event from "@/models/event.model";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { eventId } = await req.json();
    console.log("req Data for get event details", eventId);

    // Validate input
    if (!eventId) {
      return NextResponse.json(
        {
          success: false,
          message: "Event Id is required",
        },
        { status: 400 }
      );
    }

    // Check if Event exists in the database
    const existingEvent = await Event.findById(eventId).populate("organiser");

    if (!existingEvent) {
      return NextResponse.json(
        { success: false, message: "Cannot find your Event in database" },
        { status: 401 }
      );
    }
    console.log("existingEvent", existingEvent);

    const response = NextResponse.json(
      {
        success: true,
        message: "Event Details Fetched Successfully",
        event: existingEvent,
      },
      { status: 200 }
    );

    return response;
  } catch (error) {
    console.error("Error in Fetching Event Details", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
