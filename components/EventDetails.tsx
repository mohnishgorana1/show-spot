"use client";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUser,
  FaMoneyBillAlt,
} from "react-icons/fa";

function EventDetails({ eventId }: { eventId: string }) {
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);

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

  if (loading) {
    return <EventDetailsSkeleton />;
  }

  return (
    <main className="w-full relative mb-10 px-2 md:px-0">
      {/* bg image */}
      {eventDetails?.eventThumbnail?.secure_url && (
        <div className="min-w-full md:px-0 md:relative ">
          <Image
            src={eventDetails.eventThumbnail.secure_url}
            width={1000}
            height={100}
            alt="thumbnail"
            className="object-cover -z-10 w-full h-[30vh] md:h-[78vh] rounded-lg md:rounded-none md:blur-[1.5px] "
          />
          {/* overlay greying from right so that info shoudl be displayed there*/}
          <span className="hidden md:flex w-full absolute inset-0  bg-gradient-to-l from-gray-900 to-transparent" />
        </div>
      )}

      {/* overlay for big screen only */}
      <div className="z-20 md:absolute md:top-0 md:left-0 w-full flex items-center justify-center h-full gap-x-5 gap-y-5">
        <section className=" hidden md:flex inset-0">
          {eventDetails?.eventThumbnail?.secure_url && (
            <Image
              src={eventDetails.eventThumbnail.secure_url}
              width={1000}
              height={100}
              alt="thumbnail"
              className="w-[20vw] h-[70vh] object-cover rounded-lg shadow-sm shadow-white "
            />
          )}
        </section>
        <section className="my-5 md:my-0 bg-white/10 p-5 rounded-lg text-white backdrop-blur-md max-w-2xl md:h-[70vh] flex flex-col justify-between md:gap-y-5">
          {/* Event Title */}
          <h1 className="text-3xl md:text-4xl font-bold">
            {eventDetails?.title}
          </h1>

          {/* Event Info */}
          <div className="mt-3 text-gray-300 space-y-2">
            {/* Date & Time */}
            <p className="flex items-center">
              <FaCalendarAlt className="text-blue-400 mr-2" />
              {new Date(eventDetails?.dateTime).toLocaleDateString()} -{" "}
              {new Date(eventDetails?.dateTime).toLocaleTimeString()}
            </p>

            {/* Location */}
            <p className="flex items-center">
              <FaMapMarkerAlt className="text-red-400 mr-2" />
              {eventDetails?.location}
            </p>

            {/* Organizer */}
            <p className="flex items-center">
              <FaUser className="text-yellow-400 mr-2" />
              {eventDetails?.organiser?.name || "Unknown"}
            </p>

            {/* Price */}
            <p className="flex items-center">
              <FaMoneyBillAlt className="text-green-400 mr-2" />
              {eventDetails?.price > 0 ? `₹${eventDetails?.price}` : "Free"}
            </p>

            {/* Event Description */}
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mt-4">
              {showFullDescription
                ? eventDetails?.description
                : `${eventDetails?.description.slice(0, 200)}...`}
            </p>
            {eventDetails?.description.length > 200 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-blue-400 hover:underline mt-2"
              >
                {showFullDescription ? "Read Less" : "Read More"}
              </button>
            )}
          </div>

          {/* Register Button */}
          <div className="mt-6">
            <Link
              href={`${eventId}/enroll-event`}
              className="w-full md:w-auto"
            >
              <button className="md:w-auto w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition">
                Register Now
              </button>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

// Skeleton Component
function EventDetailsSkeleton() {
  return (
    <main className="w-full flex items-center justify-center mx-auto relative h-full mb-20">
      {/* Background Image Skeleton - Full Width */}
      <div className="absolute top-0 left-0 w-full h-[80vh] bg-gray-800 animate-pulse"></div>

      {/* Overlay Contents */}
      <div className="md:pt-24 relative z-10 w-full flex flex-col md:flex-row items-center justify-center mx-auto my-auto px-4 md:gap-x-10 gap-y-10">
        {/* Left Side - Small Image Card Skeleton */}
        <div className="w-64 md:w-80 bg-gray-900 bg-opacity-80 shadow-lg rounded-lg overflow-hidden">
          <div className="hidden md:flex rounded-t-lg w-[320px] h-[350px] bg-gray-700 animate-pulse"></div>
          <div className="size-80 flex md:hidden rounded-lg w-[256px] h-[100px] bg-gray-700 animate-pulse"></div>
        </div>

        {/* Right Side - Event Details Skeleton */}
        <div className="w-full md:max-w-lg">
          {/* Event Title Skeleton */}
          <div className="w-3/4 h-8 bg-gray-700 animate-pulse rounded-md"></div>

          {/* Event Info Skeleton */}
          <div className="mt-3 space-y-3">
            {/* Date & Time Skeleton */}
            <div className="flex items-center">
              <div className="w-5 h-5 bg-gray-600 animate-pulse rounded-full"></div>
              <div className="ml-2 w-1/2 h-4 bg-gray-700 animate-pulse rounded-md"></div>
            </div>

            {/* Location Skeleton */}
            <div className="flex items-center">
              <div className="w-5 h-5 bg-gray-600 animate-pulse rounded-full"></div>
              <div className="ml-2 w-1/3 h-4 bg-gray-700 animate-pulse rounded-md"></div>
            </div>

            {/* Organizer Skeleton */}
            <div className="flex items-center">
              <div className="w-5 h-5 bg-gray-600 animate-pulse rounded-full"></div>
              <div className="ml-2 w-1/4 h-4 bg-gray-700 animate-pulse rounded-md"></div>
            </div>

            {/* Price Skeleton */}
            <div className="flex items-center">
              <div className="w-5 h-5 bg-gray-600 animate-pulse rounded-full"></div>
              <div className="ml-2 w-1/5 h-4 bg-gray-700 animate-pulse rounded-md"></div>
            </div>
          </div>

          {/* Event Description Skeleton */}
          <div className="mt-4 space-y-2">
            <div className="w-full h-4 bg-gray-700 animate-pulse rounded-md"></div>
            <div className="w-5/6 h-4 bg-gray-700 animate-pulse rounded-md"></div>
            <div className="w-2/3 h-4 bg-gray-700 animate-pulse rounded-md"></div>
          </div>

          {/* Register Button Skeleton */}
          <div className="mt-6 w-full md:w-auto">
            <div className="w-full md:w-40 h-10 bg-gray-700 animate-pulse rounded-md"></div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default EventDetails;
