"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaUser } from "react-icons/fa";

function EventDetails({ eventId }: { eventId: string }) {
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) return;
      try {
        const { data } = await axios.post("/api/events/get-event-details", {
          eventId,
        });

        if (data.success) {
          setEventDetails(data.event);
        }
      } catch (error) {
        console.error("Error fetching event details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  return (
    <main className="max-w-[95vw] md:max-w-[95vw] mx-auto p-4">
      {loading ? (
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/3"></div>
        </div>
      ) : eventDetails ? (
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-md">
          {/* Title */}
          <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-7">
            {eventDetails.title}
          </h1>

          {/* Event Info */}
          <div className="space-y-3">
            <p className="flex items-center text-gray-300">
              <FaCalendarAlt className="text-blue-400 mr-2" />
              {new Date(eventDetails?.dateTime).toLocaleDateString()} -{" "}
              {new Date(eventDetails?.dateTime).toLocaleTimeString()}
            </p>

            <p className="flex items-center text-gray-300">
              <FaMapMarkerAlt className="text-red-400 mr-2" />
              {eventDetails?.location}
            </p>

            <p className="text-gray-300">{eventDetails?.description}</p>
          </div>

          {/* Price & Registration */}
          <Link
            href={`enroll-event-${eventId}`}
            className="mt-6 flex flex-col sm:flex-row justify-between items-center"
          >
            <p className="text-lg font-semibold">
              Price :{" "}
              {eventDetails?.price > 0 ? `₹${eventDetails?.price}` : "Free"}
            </p>
            <button className="mt-3 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition">
              Register Now
            </button>
          </Link>

          {/* Organizer Info */}
          <div className="mt-6 text-gray-400 flex items-center">
            <FaUser className="text-yellow-400 mr-2" />
            <p>Organized by: {eventDetails?.organiser?.name || "Unknown"}</p>
          </div>
        </div>
      ) : (
        <p className="text-red-400 text-center">Event not found.</p>
      )}
    </main>
  );
}

export default EventDetails;
