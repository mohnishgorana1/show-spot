"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

// Validation schema using Zod
const becomeOrganiserSchema = z.object({
  reason: z.string().min(10, "Please provide a valid reason"),
});

// Define the form values type
type BecomeOrganiserFormValues = z.infer<typeof becomeOrganiserSchema>;

export default function BecomeOrganiserForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BecomeOrganiserFormValues>({
    resolver: zodResolver(becomeOrganiserSchema),
  });

  const onSubmit: SubmitHandler<BecomeOrganiserFormValues> = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/users/become-organiser", {
        id: user?.id,
        reasonForOrganiser: data.reason,
      });
      if (response.data.success) {
        toast.success("Request submitted successfully!");
        router.push("/");
      } else {
        toast.error("Failed to submit request. Try again later.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
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
          <h1 className="text-xl md:text-3xl">Become an Organiser</h1>
          <h2 className="hidden md:block text-xl opacity-55">
            Host and manage your own events!
          </h2>
        </div>

        <div>
          <Textarea
            placeholder="Why do you want to become an organiser?"
            {...register("reason")}
            className={errors.reason ? "border-red-500" : ""}
          />
          {errors.reason && (
            <p className="text-red-500 text-sm">{errors.reason.message}</p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full bg-blue-700 text-lg hover:bg-blue-800"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Request"}
        </Button>
        <footer className="text-center">
          <p className="text-gray-400">
            Want to explore more events?{" "}
            <span className="block md:inline underline text-blue-600">
              <Link href="/events">Browse Events</Link>
            </span>
          </p>
        </footer>
      </form>
    </section>
  );
}
