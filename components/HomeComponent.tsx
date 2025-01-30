"use client";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";

function HomeComponent() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div>
      
      <section>
        <h1>Auth States</h1>
        {/* {isAuthenticated && <p>{isAuthenticated}</p>} */}
        {user ? (
          <h1>
            {user.email} , {user.name} , {user.role} , {user.id}
          </h1>
        ) : (
          "No user"
        )}
      </section>
    </div>
  );
}

export default HomeComponent;
