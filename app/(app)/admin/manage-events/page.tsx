import ManageEventsRequest from "@/components/ManageEventsRequest";
import axios from "axios";
import React from "react";

async function ManageEventsPage() {
  async function fetchOrganisersRequest() {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/events/get-all-events`
    );
    if (data.success) {
      console.log("all events", data.events);
      return data.events;
    }
  }

  const allEvents = await fetchOrganisersRequest();

  return (
    <main className="flex flex-col gap-y-3">
      <section className="mx-auto">
        <h1 className="text-xl font-semibold md:text-2xl lg:text-4xl">
          Manage Events 
        </h1>
      </section>

      <section>
        <ManageEventsRequest
          events={allEvents}
        />
      </section>
    </main>
  );
}

export default ManageEventsPage;
