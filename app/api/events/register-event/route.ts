import dbConnect from "@/lib/dbConnect";
import Event from "@/models/event.model";
import User from "@/models/user.model";

import { EventCategory, EventState } from "../../../../constants/index"; // Ensure EventCategory and EventState are defined
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();

  const {
    title,
    description,
    dateTime,
    location,
    category,
    price,
    organiserId,
    capacity,
  } = await req.json();
  console.log("Register Event Data", {
    title,
    description,
    dateTime,
    location,
    category,
    price,
    organiserId,
    capacity,
  });

  // validations
  if (
    !title ||
    !description ||
    !dateTime ||
    !location ||
    !category ||
    !price ||
    !organiserId ||
    !capacity
  ) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Invalid or Missing Data: Can't Register Event",
      }),
      { status: 400 }
    );
  }

  const eventDate = new Date(dateTime);
  if (isNaN(eventDate.getTime())) {
    console.log("invalid date format");

    return new Response(
      JSON.stringify({
        success: false,
        message: "Invalid date format",
      }),
      { status: 400 }
    );
  }

  // ✅ Validate Event Category
  if (!Object.values(EventCategory).includes(category)) {
    console.log("Invalid Event Category:", category);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Invalid event category. Please select a valid category.",
      }),
      { status: 400 }
    );
  }

  try {
    // Check if the user exists
    const organiser = await User.findById(organiserId);
    if (!organiser) {
      return NextResponse.json(
        { success: false, message: "Organiser not found" },
        { status: 404 }
      );
    }

    // create event
    const newEvent = await Event.create({
      title,
      description,
      dateTime: eventDate,
      location,
      price,
      capacity,
      category,
      organiser: organiser._id,
      state: EventState.DRAFT, // default state since event is just created and need to be approved
    });

    // Update user's myEvents array
    await User.findByIdAndUpdate(
      organiserId,
      { $push: { myEvents: newEvent._id } }, // Push new event to myEvents array
      { new: true }
    );

    await newEvent.save();

    console.log("new event", newEvent);

    return NextResponse.json(
      {
        success: true,
        message: "Event Registered Successfully",
        event: newEvent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error: Can't Register Event", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Error: Can't Register Event",
      }),
      { status: 500 }
    );
  }
}
