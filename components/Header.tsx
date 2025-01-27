import Link from "next/link";
import React from "react";
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

function Header() {
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
            <span className="hover:text-gray-400 hover:underline cursor-pointer">Home</span>
          </Link>
          <Link href="/events" passHref>
            <span className="hover:text-gray-400 hover:underline cursor-pointer">Events</span>
          </Link>
          <Link href="/auth/login" passHref>
            <span className="hover:bg-blue-100 hover:ease-linear duration-100 cursor-pointer bg-white text-blue-600 py-2 px-4 font-semibold rounded ring-1 hover:ring-blue-300">
              Login
            </span>
          </Link>
          <Link href="/auth/register" passHref>
            <span className="hover:bg-blue-100 hover:ease-linear duration-100 cursor-pointer bg-white text-blue-600 py-2 px-4 font-semibold rounded ring-1 hover:ring-blue-300">
              Register
            </span>
          </Link>
        </nav>

        {/* mobile nav */}
        <nav className="md:hidden flex flex-col items-center gap-y-8">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>
                <MenuIcon />
              </MenubarTrigger>
              <MenubarContent className="flex flex-col items-center">
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
                  <MenubarItem>
                    {" "}
                    <Link href="/auth/login" passHref>
                      <span className="">Login</span>
                    </Link>
                  </MenubarItem>
                  <MenubarItem>
                    {" "}
                    <Link href="/auth/register" passHref>
                      <span className="">Register</span>
                    </Link>
                  </MenubarItem>
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
