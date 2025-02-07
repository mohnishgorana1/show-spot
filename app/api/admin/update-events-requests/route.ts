import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/event.model";

export async function POST(req: Request) {
  await dbConnect();
  try {
    console.log(
      "managing event request for updation(approve/reject) || APPROVED || REJECTED || PENDING_APPROVAL "
    );
    const { eventId, state } = await req.json();

    if (!eventId || !state) {
      return NextResponse.json(
        { success: false, message: "Missing Required Fields" },
        { status: 400 }
      );
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { state },
      { new: true }
    );

    if (!updatedEvent) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    console.log("updated event", updatedEvent);

    const response = NextResponse.json(
      {
        success: true,
        message: `Event updated successfully to ${state}`,
        updatedEvent,
      },
      { status: 200 }
    );

    return response;
  } catch (error) {
    console.error(" Error updating event:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
