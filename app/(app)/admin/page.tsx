import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function AdminPage() {
  return (
    <main className="flex flex-col md:flex-row items-center justify-center w-full md:gap-x-5 gap-x-5 ">
      <section>
        <Link href={"/admin/manage-users"}>
          <Button className="bg-white text-blue-600 font-bold text-lg">
            Manage Users
          </Button>
        </Link>
      </section>
      <section>
        <Link href={"/admin/manage-events"}>
          <Button className="bg-white text-blue-600 font-bold text-lg">
            Manage Events
          </Button>
        </Link>
      </section>{" "}
      <section>
        <Link href={"/admin/manage-organisers-requests"}>
          <Button className="bg-white text-blue-600 font-bold text-lg">
            Manage Organisers Request
          </Button>
        </Link>
      </section>
    </main>
  );
}

export default AdminPage;
