"use client";
import { RootState } from "@/store/store";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

const TABS = ["Draft", "Pending Approval", "Approved", "Rejected"];

function MyEvents() {
  const user = useSelector((state: RootState) => state.auth.user);

  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Draft");

  const fetchMyEvents = async () => {
    if (!user?.id) {
      setError("Can't Fetch Your User ID, Please Refresh the Page");
    }
    try {
      console.log("calling api");
      const { data } = await axios.get(
        `/api/events/my-events?userId=${user?.id}`
      );
      if (data.success) {
        setEvents(data.myEvents);
        toast.success("Events Fetched Successfully");
      }
    } catch (error) {
      console.log("Failed to fetch events", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishEvent = async (
    eventId: string,
    publishStatus: boolean
  ) => {
    console.log("publish", eventId, publishStatus);
    const { data } = await axios.patch("/api/events/update-publish-event", {
      eventId,
      publishStatus,
    });
    if (data.success) {
      toast.success("Event Published Successfully");
      fetchMyEvents();
    } else {
      toast.error("Error publishing event!");
    }
  };
  useEffect(() => {
    if (user?.id) {
      fetchMyEvents();
    }
  }, []);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const filteredEvents = events.filter((event) => event.state === activeTab);

  return (
    <div className="w-full mx-auto px-4">
      {/* Tabs for Switching Between Draft, Pending Approval, Approved, Rejected */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:px-48 mb-5">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`col-span-1 px-4 py-2 text-xs md:text-sm lg:px-6 lg:py-2 rounded-md font-semibold transition-all duration-300
      ${
        activeTab === tab
          ? tab === "Draft"
            ? "bg-blue-500 text-white shadow-md"
            : tab === "Pending Approval"
            ? "bg-yellow-500 text-black shadow-md"
            : tab === "Approved"
            ? "bg-green-500 text-white shadow-md"
            : "bg-red-500 text-white shadow-md"
          : "bg-gray-700/50 hover:bg-gray-700/70 text-gray-300"
      }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <p className="text-center text-gray-400">
          No {activeTab} events found.
        </p>
      ) : (
        <Accordion type="multiple" className="space-y-3">
          {filteredEvents.map((event, index) => (
            <AccordionItem
              key={event._id}
              value={event._id}
              className="border border-gray-700 rounded-lg group"
            >
              <AccordionTrigger className="flex justify-between px-4 py-3 bg-gray-900 hover:bg-gray-800 rounded-lg text-white">
                <div className="w-full flex justify-between items-center pr-5 ">
                  <div className="group-hover:underline">
                    {event.title} -{" "}
                    <span
                      className={`${
                        event.state === "Draft"
                          ? "text-blue-500"
                          : event.state === "Pending Approval"
                          ? "text-yellow-500"
                          : event.state === "Approved"
                          ? "text-green-500"
                          : "text-red-600"
                      }`}
                    >
                      {event.state}
                    </span>
                  </div>
                  <div
                    onClick={() =>
                      handlePublishEvent(
                        event._id,
                        event.isPublished ? false : true
                      )
                    }
                    className={`${activeTab !== "Approved" && "hidden"} ${
                      event.isPublished
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-teal-600 hover:bg-teal-700"
                    } hidden md:flex text-center rounded-lg px-4 py-2  font-semibold no-underline`}
                  >
                    {event.isPublished ? "Don't Publish" : "Publish"}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="shadow-md border border-gray-700 bg-gray-800 text-white rounded-lg">
                    <CardHeader>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p>
                        <span className="font-bold">Title:</span> {event.title}
                      </p>
                      <p>
                        <span className="font-bold">Description:</span>{" "}
                        {event.description}
                      </p>
                      <p>
                        <span className="font-bold">Date & Time:</span>{" "}
                        {new Date(event.dateTime).toLocaleString()}
                      </p>
                      <p>
                        <span className="font-bold">Location:</span>{" "}
                        {event.location}
                      </p>
                      <p>
                        <span className="font-bold">Category:</span>{" "}
                        <span className="uppercase text-indigo-400">
                          {event.category}
                        </span>
                      </p>
                      <p>
                        <span className="font-bold">Attendees:</span>{" "}
                        {event.attendees.length}
                      </p>
                      <p>
                        <span className="font-bold">Price:</span> ₹
                        {event.price.toFixed(2)}
                      </p>
                      <p>
                        <span className="font-bold">Created At:</span>{" "}
                        {new Date(event.createdAt).toLocaleDateString()}
                      </p>
                      <p
                        onClick={() =>
                          handlePublishEvent(
                            event._id,
                            event.isPublished ? false : true
                          )
                        }
                        className={`${activeTab !== "Approved" && "hidden"} ${
                          event.isPublished
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-teal-600 hover:bg-teal-700"
                        }  md:hidden text-center rounded-lg px-2 py-2`}
                      >
                        {event.isPublished ? "Don't Publish" : "Publish"}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}

export default MyEvents;
