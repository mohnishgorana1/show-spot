"use client";
import EventCard from "@/components/EventCard";
import { Input } from "@/components/ui/input";
import axios from "axios";
import React, { useEffect, useState } from "react";

//* Shows all published & approved events.
//* Filters: Category, Date, Location, Price (Free/Paid).
//* Search bar for event titles.
//* Pagination for browsing multiple events.

function EventsListingPage() {
  const [events, setEvents] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    price: "",
    search: "",
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [filters, page]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/events", {
        params: {
          ...Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== "")
          ),
          page,
        },
      });

      setEvents(data.events);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-4 space-y-3">
      <section className="w-full grid grid-cols-5 gap-x-3">
        <Input
          type="text"
          placeholder="Search events..."
          className="col-span-3 px-2 py-1 h-8 border border-gray-600 rounded-md bg-gray-800 text-white"
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
        />

        {/* Filters */}
        <div className="col-span-2 grid grid-cols-3 gap-x-2">
          <select
            className="px-2 border border-gray-600 rounded-md bg-gray-800 text-white"
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, category: e.target.value }))
            }
          >
            <option value="">All Categories</option>
            <option value="Music">Music</option>
            <option value="Technology">Technology</option>
            <option value="Business">Business</option>
          </select>

          <input
            type="text"
            placeholder="Location"
            className="px-2 border border-gray-600 rounded-md bg-gray-800 text-white"
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, location: e.target.value }))
            }
          />

          <select
            className="px-2 border border-gray-600 rounded-md bg-gray-800 text-white"
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, price: e.target.value }))
            }
          >
            <option value="">All Prices</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </section>
      {/* Search Bar */}

      {/* Events List */}
      {loading ? (
        <p className="text-white">Loading events...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.length > 0 ? (
            events.map((event) => <EventCard key={event._id} event={event} />)
          ) : (
            <p className="text-white">No events found</p>
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-2">
        <button
          className="px-3 cursor-pointer py-[1px] border rounded-md bg-gray-700 text-white disabled:opacity-50"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="text-white px-3 py-[1px]">
          {page} / {totalPages}
        </span>
        <button
          className="px-3 cursor-pointer py-[1px] border rounded-md bg-gray-700 text-white disabled:opacity-50"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </main>
  );
}

export default EventsListingPage;
