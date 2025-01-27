"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  RegisterFormValues,
  registerSchema,
} from "@/lib/validations/registerSchema";
import Link from "next/link";

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    setLoading(true);
    try {
      console.log("REgister data", data);

      const response = await axios.post("/api/auth/register", data);

      console.log("REsponse", response);

      if (response.data.success) {
        toast.success("Account Created Successfully!")
        router.push("/auth/login")
      }else{
        toast.error("Can't create account.Try Again Later")
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
          <h1 className="text-xl md:text-3xl">Join ShowSpot Today</h1>
          <h2 className="hidden md:block text-xl opacity-55">
            Your Gateway to Unforgettable Events!
          </h2>
        </div>
        <div>
          <Input
            placeholder="Name"
            {...register("name")}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
        <div>
          <Input
            placeholder="Email"
            {...register("email")}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            {...register("password")}
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
        <div>
          <Input
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword")}
            className={errors.confirmPassword ? "border-red-500" : ""}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full bg-blue-700 text-lg hover:bg-blue-800"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </Button>

        <footer className="text-center">
          <p className="text-gray-400">
            Already have an account?{" "}
            <span className="block md:inline underline text-blue-600">
              <Link href={"/auth/login"}>Please Login</Link>
            </span>
          </p>
        </footer>
      </form>
    </section>
  );
}
