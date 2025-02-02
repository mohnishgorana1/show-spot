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

export default function RegisterEventForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterEventFormValues>({
    resolver: zodResolver(registerEventSchema),
  });

  const onSubmit: SubmitHandler<RegisterEventFormValues> = async (data) => {
    setLoading(true);
    try {
      console.log("Register Event Data", data);

      const response = await axios.post("/api/events/register", data);

      console.log("Response", response);

      if (response.data.success) {
        toast.success("Event Registered Successfully!");
        router.push("/events");
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
        <div className="text-center md:space-y-2">
          <h1 className="text-xl md:text-3xl">Create an Event</h1>
          <h2 className="hidden md:block text-xl opacity-55">
            Connect with your audience through ShowSpot!
          </h2>
        </div>
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
        <div>
          <Input
            type="date"
            placeholder="Date"
            {...register("date")}
            className={errors.date ? "border-red-500" : ""}
          />
          {errors.date && (
            <p className="text-red-500 text-sm">{errors.date.message}</p>
          )}
        </div>
        <div>
          <Input
            type="time"
            placeholder="Time"
            {...register("time")}
            className={errors.time ? "border-red-500" : ""}
          />
          {errors.time && (
            <p className="text-red-500 text-sm">{errors.time.message}</p>
          )}
        </div>
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
        <Button
          type="submit"
          className="w-full bg-blue-700 text-lg hover:bg-blue-800"
          disabled={loading}
        >
          {loading ? "Registering Event..." : "Register Event"}
        </Button>

        <footer className="text-center">
          <p className="text-gray-400">
            Need help? {" "}
            <span className="block md:inline underline text-blue-600">
              <Link href="/support">Contact Support</Link>
            </span>
          </p>
        </footer>
      </form>
    </section>
  );
}
