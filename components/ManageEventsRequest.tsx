"use client";
import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { EventState } from "@/constants";

const TABS = ["Draft", "Pending Approval", "Approved", "Rejected"];

function ManageEventsRequest({ events }: { events: any[] }) {
  // Manage state for organiser requests
  const [allEvents, setAllEvents] = useState(events);
  const [activeTab, setActiveTab] = useState("Draft");

  const filteredEvents = allEvents.filter(
    (event) => event.state.toLowerCase() === activeTab.toLowerCase()
  );

  console.log("filre", filteredEvents);

  const handleAction = async (eventId: string, newState: EventState) => {
    console.log("update aciton", eventId, newState);

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/update-events-requests`,
        {
          eventId,
          state: newState,
        }
      );

      if (data.success) {
        toast.success(`Event updated to ${newState} successfully`);
        // Update the UI immediately without refreshing
        setAllEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === eventId ? { ...event, state: newState } : event
          )
        );
      } else {
        toast.error(`Something went wrong while updating event state`);
      }
    } catch (error) {
      console.error("Error updating event request:", error);
      toast.error(`Something went wrong while updating event state`);
    }
  };

  return (
    <div className="w-full mx-auto px-4">
      {/* Tabs for Switching Between Pending, Approved, Rejected */}

      <div className="max-w-full grid grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-2 lg:px-48 mb-5">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`col-span-1 px-4 py-2 text-xs md:text-sm lg:px-6 lg:py-2 rounded-md font-semibold transition-all duration-300
      ${
        activeTab === tab
          ? tab === "Draft"
            ? "bg-blue-500 text-white shadow-md" // Draft: Blue
            : tab === "Pending_Approval"
            ? "bg-yellow-500 text-black shadow-md" // Pending Approval: Yellow
            : tab === "Approved"
            ? "bg-green-500 text-white shadow-md" // Approved: Green
            : "bg-red-500 text-white shadow-md" // Rejected: Red
          : "bg-gray-700/50 hover:bg-gray-700/70 text-gray-300"
      }
    `}
          >
            {tab === "Pending_Approval" ? "Pending Approval" : tab}
          </button>
        ))}
      </div>

      {/* Request List */}
      {filteredEvents.length === 0 ? (
        <p className="text-center text-gray-400">
          No {activeTab} requests found.
        </p>
      ) : (
        <Accordion type="multiple" className="space-y-3">
          {filteredEvents.map((event, index) => (
            <AccordionItem
              key={event.title}
              value={event.title}
              className="border border-gray-700 rounded-lg"
            >
              <AccordionTrigger className="flex justify-between px-4 py-3 bg-gray-900 hover:bg-gray-800 rounded-lg text-white">
                <span>
                  {event.title} -{" "}
                  <span
                    className={`
                        ${event.state === "Draft" && "text-blue-500"} 
                        ${
                          event.state === "Pending_Approval" &&
                          "text-yellow-500"
                        }
                        ${event.state === "Approved" && "text-green-500"}
                        ${event.state === "Rejected" && "text-red-600"}
                    `}
                  >
                    {event.state}
                  </span>
                </span>
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
                        <span>
                          <span className="font-bold">Organiser:</span>{" "}
                          {event.organiser.name}
                        </span>
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
                        <span className="font-bold">Capacity:</span>{" "}
                        {event.capacity}
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
                      <p>
                        <span className="font-bold">Last Updated:</span>{" "}
                        {new Date(event.updatedAt).toLocaleDateString()}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex flex-col md:flex-row w-full gap-x-3 gap-y-2 mt-4">
                        {event.state !== EventState.APPROVED && (
                          <button
                            className="px-4 py-2 text-white font-semibold rounded-lg backdrop-blur-lg bg-green-500/40 border border-transparent hover:bg-green-500/80 transition-all duration-300"
                            onClick={() =>
                              handleAction(event._id, EventState.APPROVED)
                            }
                          >
                            Approve
                          </button>
                        )}
                        {event.state === EventState.DRAFT && (
                          <button
                            className="px-4 py-2 text-white font-semibold rounded-lg backdrop-blur-lg bg-yellow-500/40 border border-transparent hover:bg-yellow-500/80 transition-all duration-300"
                            onClick={() =>
                              handleAction(
                                event._id,
                                EventState.PENDING_APPROVAL
                              )
                            }
                          >
                            Add to Pending Approval
                          </button>
                        )}
                        {event.state !== EventState.REJECTED && (
                          <button
                            className="px-4 py-2 text-white font-semibold rounded-lg backdrop-blur-lg bg-red-500/40 border border-transparent hover:bg-red-500/80 transition-all duration-300"
                            onClick={() =>
                              handleAction(event._id, EventState.REJECTED)
                            }
                          >
                            Reject
                          </button>
                        )}
                      </div>
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

export default ManageEventsRequest;


