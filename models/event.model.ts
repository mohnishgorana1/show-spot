// Stores event details (title, description, date, time, location, category, price, etc.).
// Associations with the organizer (User ID).
// Ticket availability and booking status.
import mongoose, { Schema, Document, Model } from "mongoose";
import { EventCategory, EventState } from "../constants/index";

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  state: EventState;
  organiser: mongoose.Schema.Types.ObjectId;
  category: EventCategory;
  capacity: number;
  attendees: mongoose.Schema.Types.ObjectId[];
  price: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new mongoose.Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    organiser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    isPublished: { type: Boolean, default: false },  // organiser can publish event after admin approval
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.models.Events || mongoose.model("Event", eventSchema);

export default Event;
