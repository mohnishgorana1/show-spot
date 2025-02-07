"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import {
  RegisterEventFormValues,
  registerEventSchema,
} from "@/lib/validations/registerEventSchema";

// MUI Date & Time Picker
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { EventCategory } from "@/constants";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "./ui/label";
import Image from "next/image";

export default function RegisterEventForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [dateTime, setDateTime] = useState<Dayjs | null>(dayjs());
  const user = useSelector((state: RootState) => state.auth.user);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue, // Manually update some field
    formState: { errors },
  } = useForm<RegisterEventFormValues>({
    resolver: zodResolver(registerEventSchema),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit: SubmitHandler<RegisterEventFormValues> = async (data) => {
    console.log("submitting trye");
    if (!selectedFile) {
      toast.error("Event image is required!");
      return;
    }
    setLoading(true);
    // const formattedData = {
    //   ...data,
    //   dateTime: dateTime?.toISOString() || "", // Convert to ISO format for backend
    //   price: Number(data.price), // Ensure price is a number
    //   capacity: Number(data.capacity) || 100,
    //   category: data.category,
    //   organiserId: user?.id,
    // };

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("dateTime", dateTime?.toISOString() || "");
    formData.append("price", data.price.toString());
    formData.append("capacity", data.capacity.toString());
    formData.append("location", data.location);
    formData.append("category", data.category);
    formData.append("organiserId", user?.id || "");
    formData.append("eventThumbnail", selectedFile);

    for (const value of formData.values()) {
      console.log(value);
    }

    try {
      const response = await axios.post(
        "/api/events/register-event",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response", response);
      if (response.data.success) {
        toast.success("Event Registered Successfully!");
        router.push(`/events/${response.data.event?._id}`);
      } else {
        toast.error("Can't register event. Try Again Later");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col px-2 gap-y-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-slate-800 max-w-xl w-full md:w-[50%] mx-auto flex flex-col gap-4 p-4 border rounded-md"
      >
        {/* form header */}
        <header className="text-center md:space-y-2">
          <h1 className="text-xl md:text-3xl">Create an Event</h1>
          <h2 className="hidden md:block text-xl opacity-55">
            Connect with your audience through ShowSpot!
          </h2>
        </header>

        {/* title */}
        <div>
          <Input
            placeholder="Event Title"
            {...register("title")}
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        {/* description */}
        <div>
          <Input
            placeholder="Description"
            {...register("description")}
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* MUI Date & Time Picker */}
        <div>
          <label className="text-gray-300">Event Date & Time</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDateTimePicker
              value={dateTime}
              onChange={(newValue) => {
                setDateTime(newValue);
                setValue("dateTime", newValue?.toISOString() || ""); // Sync with react-hook-form
              }}
              className="w-full bg-gray-700 text-white rounded border border-gray-500 focus:border-blue-500"
              slots={{ toolbar: null }}
            />
          </LocalizationProvider>
          {errors.date && (
            <p className="text-red-500 text-sm">{errors.date.message}</p>
          )}
        </div>

        {/* category select */}
        <div>
          <label className="block text-sm font-medium">Category</label>
          <Select
            onValueChange={(value: any) => setValue("category", value)}
            defaultValue=""
          >
            <SelectTrigger
              className={`border p-2 rounded w-full ${
                errors.category ? "border-red-500" : ""
              }`}
            >
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900">
              {Object.values(EventCategory).map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                  className="hover:bg-slate-800"
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
          )}
        </div>

        {/* price */}
        <div>
          <Input
            type="number"
            placeholder="Price (₹)"
            {...register("price", {
              valueAsNumber: true, // Ensures the value is stored as a number
            })}
            onChange={(e) => {
              // Manually convert value to number
              const value = e.target.value ? Number(e.target.value) : 0;
              setValue("price", value); // Update the value in react-hook-form
            }}
            className={errors.price ? "border-red-500" : ""}
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>

        {/* capacity */}
        <div>
          <Input
            type="number"
            placeholder="Capacity (Max Attendees)"
            {...register("capacity", { valueAsNumber: true })}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : 1; // Default to 1
              setValue("capacity", value);
            }}
            className={errors.capacity ? "border-red-500" : ""}
          />
          {errors.capacity && (
            <p className="text-red-500 text-sm">{errors.capacity.message}</p>
          )}
        </div>

        {/* location */}
        <div>
          <Input
            placeholder="Location"
            {...register("location")}
            className={errors.location ? "border-red-500" : ""}
          />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location.message}</p>
          )}
        </div>

        <div>
          <input type="file" onChange={handleFileChange} accept="image/*" />
          {preview && (
            <Image
              src={preview}
              alt="Preview"
              width={50}
              height={50}
              className="w-32 h-32"
            />
          )}
        </div>

        {/* submit button */}
        <Button
          type="submit"
          className="w-full bg-blue-700 text-lg hover:bg-blue-800"
          disabled={loading}
        >
          {loading ? "Registering Event..." : "Register Event"}
        </Button>

        {/* footer (contact) */}
        <footer className="text-center">
          <p className="text-gray-400">
            Need help?{" "}
            <span className="block md:inline underline text-blue-600">
              <Link href="/support">Contact Support</Link>
            </span>
          </p>
        </footer>
      </form>
    </section>
  );
}
