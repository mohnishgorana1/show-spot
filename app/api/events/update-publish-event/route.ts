import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/event.model";

export async function PATCH(req: Request) {
  await dbConnect();

  const { eventId, publishStatus } = await req.json();
  console.log("publish update", eventId, publishStatus);

  if (!eventId) {
    console.log("event ID is required");

    return new Response(
      JSON.stringify({
        success: false,
        message: "event ID is required",
      }),
      { status: 400 }
    );
  }

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { isPublished: publishStatus },
      { new: true }
    );
    if (!updatedEvent) {
      console.log("Event not found");

      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    const response = NextResponse.json(
      {
        success: true,
        message: "Event Updated for isPublished successfully",
        updatedEvent,
      },
      { status: 200 }
    );
    return response;
  } catch (error) {
    console.error("error updating events:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
