import { EventCategory } from "@/constants";
import { z } from "zod";

export const registerEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  dateTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  location: z.string().min(3, "Location must be at least 3 characters long"),
  price: z.number().nonnegative("Price cannot be negative"), // Price should not be negative

  category: z.nativeEnum(EventCategory, {
    message: "Invalid category",
  }),
  capacity: z.number().min(1, "Capacity must be at least 1"), // Add capacity validation
});

export type RegisterEventFormValues = z.infer<typeof registerEventSchema>;
