import MyEvents from "@/components/MyEvents";
import React from "react";

// Lists events created by the organizer.
// Buttons for "Edit", "Delete", or "Publish" events.

function MyEventsPage() {
  

  return (
    <main className="flex flex-col gap-y-3">
      <section className="mx-auto">
        <h1 className="text-xl font-semibold md:text-2xl lg:text-4xl">
          My Events
        </h1>
      </section>

      <section>
        <MyEvents />
      </section>
    </main>
  );
}

export default MyEventsPage;
