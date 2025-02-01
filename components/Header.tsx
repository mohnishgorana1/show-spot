"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { MenuIcon } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { logoutUser } from "@/store/slices/authSlice";
import { Button } from "./ui/button";

function Header() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { isAuthenticated, user, loading } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");

    dispatch(logoutUser());
    window.location.reload();
  };

  return (
    <header className="">
      <div className="flex items-center justify-between ">
        <Link href="/" passHref>
          <h1 className="text-2xl md:text-4xl font-bold cursor-pointer text-white font-serif1">
            ShowSpot
          </h1>
        </Link>

        {/* desktop menu */}
        <nav className="hidden md:flex items-baseline gap-x-8">
          <Link href="/" passHref>
            <span className="hover:text-gray-400 hover:underline cursor-pointer">
              Home
            </span>
          </Link>
          <Link href="/events" passHref>
            <span className="hover:text-gray-400 hover:underline cursor-pointer">
              Events
            </span>
          </Link>
          {isAuthenticated ? (
            <div className="flex gap-x-2">
              {user?.role === "user" && (
                <Link href={"/organiser"}>
                  <Button className="bg-green-600 font-semibold hover:bg-green-700">
                    Become an Event Organier
                  </Button>
                </Link>
              )}
              {user?.role === "admin" && (
                <Link href={"/admin"}>
                  <Button className="bg-green-600 font-semibold hover:bg-green-700">
                    Admin
                  </Button>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="hover:bg-red-700 hover:ease-linear duration-100 cursor-pointer bg-red-600 text-white py-1 px-4 font-semibold rounded flex w-full items-center justify-center"
              >
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <>
              <Link href="/auth/login" passHref>
                <Button className="hover:bg-blue-100 hover:ease-linear duration-100 cursor-pointer bg-white text-blue-600 py-2 px-4 font-semibold rounded">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register" passHref>
                <Button className="hover:bg-blue-100 hover:ease-linear duration-100 cursor-pointer bg-white text-blue-600 py-2 px-4 font-semibold rounded">
                  Register
                </Button>
              </Link>
            </>
          )}
        </nav>

        {/* mobile nav */}
        <nav className="md:hidden flex flex-col items-center gap-y-8">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>
                <MenuIcon className="size-5" />
              </MenubarTrigger>
              <MenubarContent className="mr-5 flex flex-col items-center bg-white text-slate-900 font-semibold">
                <MenubarItem>
                  <Link href="/" passHref>
                    <span className="hover:text-gray-400 cursor-pointer">
                      Home
                    </span>
                  </Link>
                </MenubarItem>
                <MenubarItem>
                  {" "}
                  <Link href="/events" passHref>
                    <span className="hover:text-gray-400 cursor-pointer">
                      Events
                    </span>
                  </Link>
                </MenubarItem>
                <MenubarSeparator />
                <div className="border-t w-full flex items-center flex-col">
                  {isAuthenticated ? (
                    <MenubarItem>
                      <div className="flex flex-col gap-y-2">
                        <Link href={"/organiser"}>
                          <Button className="bg-green-600 font-semibold hover:bg-green-700 text-white">
                            Become an Event Organier
                          </Button>
                        </Link>
                        <Button
                          onClick={handleLogout}
                          className="hover:bg-red-100 hover:ease-linear duration-100 cursor-pointer bg-red-600 text-white py-2 px-4 font-semibold rounded"
                        >
                          Logout
                        </Button>
                      </div>
                    </MenubarItem>
                  ) : (
                    <>
                      <MenubarItem>
                        <Link href="/auth/login" passHref>
                          <Button className="">Login</Button>
                        </Link>
                      </MenubarItem>
                      <MenubarItem>
                        <Link href="/auth/register" passHref>
                          <Button className="">Register</Button>
                        </Link>
                      </MenubarItem>
                    </>
                  )}
                </div>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </nav>
      </div>
    </header>
  );
}

export default Header;
