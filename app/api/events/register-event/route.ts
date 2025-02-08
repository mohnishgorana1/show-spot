import dbConnect from "@/lib/dbConnect";
import Event from "@/models/event.model";
import User from "@/models/user.model";

import { EventCategory, EventState } from "../../../../constants/index"; // Ensure EventCategory and EventState are defined
import { NextResponse } from "next/server";
import { UploadFileToCloudinary } from "@/action/cloudinary.action";

const NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = String(
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
);

export async function POST(req: Request) {
  await dbConnect();

  const formData = await req.formData();
  const eventThumbnail = formData.get("eventThumbnail") as File;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const dateTime = formData.get("dateTime") as string;
  const location = formData.get("location") as string;
  const category = formData.get("category") as string;
  const price = formData.get("price") as string;
  const organiserId = formData.get("organiserId") as string;
  const capacity = formData.get("capacity") as string;
  console.log("Received formData:", formData);

  // validations
  if (
    !title ||
    !description ||
    !dateTime ||
    !price ||
    !capacity ||
    !location ||
    !category ||
    !organiserId || 
    !eventThumbnail
  ) {
    console.log("Invalid or Missing Data: Can't Register Event");

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

  console.log("all validation passed");

  try {
    // Check if the user exists
    const organiser = await User.findById(organiserId);
    if (!organiser) {
      return NextResponse.json(
        { success: false, message: "Organiser not found" },
        { status: 404 }
      );
    }

    console.log(
      "organiser found now Uploading event thumbnail to Cloudinary..."
    );
    const uploadResponse: any = await UploadFileToCloudinary(
      eventThumbnail,
      "show-spot"
    );
    console.log("Cloudinary Upload Response:", uploadResponse);
    const { asset_id, public_id, secure_url } = uploadResponse;

    // Generating the correct download URL
    const downloadUrl = `https://res-console.cloudinary.com/${NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/media_explorer_thumbnails/${asset_id}/download`;
    console.log("Generated DOWNLOAD URL:", downloadUrl);

    // File uploaded, now create the event
    const newEvent = new Event({
      title,
      description,
      dateTime,
      location,
      category,
      price: Number(price),
      organiser: organiserId,
      capacity: Number(capacity),
      eventThumbnail: {
        public_id,
        secure_url,
        download_url: downloadUrl,
      },
    });
    await newEvent.save();

    // Update user's myEvents array
    await User.findByIdAndUpdate(
      organiserId,
      { $push: { myEvents: newEvent._id } }, // Push new event to myEvents array
      { new: true }
    );
    console.log("new event", newEvent);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Event Created Successfully",
        event: newEvent,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error: Can't Create Event", error);

    return new Response(
      JSON.stringify({ success: false, message: "Error: Can't Create Event" }),
      { status: 500 }
    );
  }
}
