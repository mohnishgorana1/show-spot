import mongoose, { Schema, Document, Model } from "mongoose";

// Define an interface for the User document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "organiser"; // Define roles for authorization
  reasonForOrganiser?: string; // Reason for requesting organiser role
  organiserRequestStatus: "pending" | "approved" | "rejected"; // Request status
  isActive: boolean; // To handle account status
  myEvents: mongoose.Schema.Types.ObjectId[]; // Events created by organiser
  createdAt: Date;
  updatedAt: Date;
}

// Define the User schema
const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "organiser"], // Add more roles if needed
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    reasonForOrganiser: {
      type: String,
      trim: true,
    },
    organiserRequestStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    myEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event", // Reference to the Event model
      },
    ],
  },
  {
    timestamps: true, // Automatically create `createdAt` and `updatedAt` fields
  }
);

// Create a model
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
