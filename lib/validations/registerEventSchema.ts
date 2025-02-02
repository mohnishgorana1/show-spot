import { z } from "zod";

export const registerEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  time: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
  location: z.string().min(3, "Location must be at least 3 characters long"),
});

export type RegisterEventFormValues = z.infer<typeof registerEventSchema>;
