import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/event.model";

export async function GET(req: Request) {
  await dbConnect();

  try {
    // Extract query parameters from the request URL
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const location = searchParams.get("location");
    const date = searchParams.get("date");
    const price = searchParams.get("price");
    const search = searchParams.get("search");
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    // Query filters
    const query: any = { isPublished: true, state: "Approved" }; // Fetch only approved & published events

    if (category) query.category = category;
    if (location) query.location = { $regex: location, $options: "i" };
    if (date) query.dateTime = { $gte: new Date(date) };
    if (price === "free") query.price = 0;
    if (price === "paid") query.price = { $gt: 0 };
    if (search) query.title = { $regex: search, $options: "i" };


    
    // Fetch events with pagination
    const events = await Event.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ dateTime: 1 })
      .populate("organiser") // Assuming you have an organiser field in the model
      .select("-password"); // Exclude password field if applicable

    const totalEvents = await Event.countDocuments(query);
    const totalPages = Math.ceil(totalEvents / limit);

    // Return response
    return NextResponse.json(
      {
        success: true,
        message: "Events fetched successfully",
        events,
        totalPages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
