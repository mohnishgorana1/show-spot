"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";

import { checkAuth } from "@/store/slices/authSlice";

export default function CheckAuth() {
  const dispatch = useDispatch <AppDispatch>();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return null; // Doesn't render anything, just fetches data
}
