// Stores event details (title, description, date, time, location, category, price, etc.).
// Associations with the organizer (User ID).
// Ticket availability and booking status.
import mongoose, { Document } from "mongoose";
import { EventCategory, EventState } from "../constants/index";

export interface IEvent extends Document {
  title: string;
  description: string;
  dateTime: Date; // Combined Date & Time
  location: string;
  state: EventState;
  eventThumbnail: {
    public_id: string;
    secure_url: string;
    download_url: string;
  };
  organiser: mongoose.Schema.Types.ObjectId;
  category: EventCategory;
  capacity: number;
  attendees: mongoose.Schema.Types.ObjectId[];
  price: number;
  isPublished: boolean;
  isLive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new mongoose.Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    dateTime: { type: Date, required: true }, // Combined date & time
    location: { type: String, required: true },
    organiser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventThumbnail: {
      public_id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
      download_url: {
        type: String,
        required: true,
      },
    },
    category: {
      type: String,
      enum: Object.values(EventCategory),
      required: true,
    },
    state: {
      type: String,
      enum: Object.values(EventState),
      default: EventState.DRAFT, // Default state when created
    },
    capacity: { type: Number, default: 100 },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    price: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false }, // organiser can publish event after admin approval
    isLive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Automatically set `isLive` based on `isPublished` and `dateTime`
eventSchema.pre("save", function (next) {
  this.isLive = this.isPublished && this.dateTime <= new Date();
  next();
});

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;

// If isPublished: true, the event should be visible to all users.
// If isPublished: false, it remains hidden (e.g., still in draft mode, pending approval, or incomplete).
// isPublished can only be true when the event is fully reviewed and approved.
// If isPublished: false, it could mean:
//    The event is still being edited by the organizer.
//    It is awaiting admin approval.
//    It was published previously but got unapproved due to policy violations.
// An event can be published (isPublished: true) but scheduled for a future date.
// Users can see it in listings before it actually becomes live (similar to "Upcoming Events").

// isLive should be true only when the event is both published and its start time has arrived.
// const isLive = event.isPublished && event.dateTime <= new Date();
// If an event is cancelled, instead of deleting it, you can unpublish it (isPublished: false).
// This allows the admin to restore the event later if needed.
// Archived events can be hidden from regular users but still exist in the database.
