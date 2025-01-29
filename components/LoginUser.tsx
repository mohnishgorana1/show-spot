"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { LoginFormValues, loginSchema } from "@/lib/validations/loginSchema";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { loginUser } from "@/store/slices/authSlice";

export default function LoginUser() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, error } = useSelector(
    (state: RootState) => state.auth
  ); // Access Redux state

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setLoading(true);
    try {
      console.log("Login data", data);

      // const response = await axios.post("/api/auth/login", data);
      const response = await dispatch(loginUser(data)).unwrap(); // Dispatch loginUser action
      console.log("Response", response);

      // if (response.data.success) {
      //   toast.success("Login Successful!");
      //   localStorage.setItem("authToken", response.data?.token); // Store token
      //   router.push("/");
      // } else {
      //   toast.error(response.data.message || "Login failed. Try again.");
      // }

      toast.success("Login Successful!");
      router.push("/");
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="md:mt-12 flex flex-col px-2 gap-y-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-slate-800 max-w-xl w-full md:w-[50%] mx-auto flex flex-col gap-4 p-4 border rounded-md"
      >
        <div className="text-center md:space-y-2">
          <h1 className="text-xl md:text-3xl">Welcome Back to ShowSpot</h1>
          <h2 className="hidden md:block text-xl opacity-55">
            Your Gateway to Unforgettable Events!
          </h2>
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
        <Button
          type="submit"
          className="w-full bg-blue-700 text-lg hover:bg-blue-800"
          disabled={loading}
        >
          {loading ? "Logging In..." : "Login"}
        </Button>

        <footer className="text-center">
          <p className="text-gray-400">
            Don’t have an account?{" "}
            <span className="block md:inline underline text-blue-600">
              <Link href={"/auth/register"}>Register Here</Link>
            </span>
          </p>
        </footer>
      </form>
    </section>
  );
}
