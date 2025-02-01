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
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const TABS = ["Pending", "Approved", "Rejected"];

function ManageOrganisersRequest({
  allOrganisersRequestData,
}: {
  allOrganisersRequestData: any[];
}) {
  const user = useSelector((state: RootState) => state.auth.user);
  console.log("id", user?.id);

  const [activeTab, setActiveTab] = useState("Pending");

  const filteredData = allOrganisersRequestData.filter(
    (user) =>
      user.organiserRequestStatus.toLowerCase() === activeTab.toLowerCase()
  );

  const handleAction = async (
    userId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/update-organiser-request`,
        {
          userId,
          status,
        }
      );
      // alert(`Request ${status} successfully!`);
      toast.success(`Request ${status} successfully`);
      // Optional: Reload page or update state here
    } catch (error) {
      console.error("Error updating request:", error);
      toast.error(`Something went wrong while updating organiser request`);
    }
  };

  return (
    <div className="w-full mx-auto px-4">
      {/* Tabs for Switching Between Pending, Approved, Rejected */}
      <div className="max-w-full flex justify-center mb-6 space-x-3 lg:space-x-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 text-sm lg:px-6 lg:py-2 rounded-lg text-white font-semibold transition-all duration-300 ${
              activeTab === tab
                ? tab === "Pending"
                  ? "bg-yellow-500" // Custom color for "Pending" tab
                  : tab === "Approved"
                  ? "bg-green-500" // Custom color for "Approved" tab
                  : "bg-red-500" // Custom color for "Rejected" tab
                : "bg-gray-700/50 hover:bg-gray-700/70"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Request List */}
      {filteredData.length === 0 ? (
        <p className="text-center text-gray-400">
          No {activeTab} requests found.
        </p>
      ) : (
        <Accordion type="multiple" className="space-y-3">
          {filteredData.map((user, index) => (
            <AccordionItem
              key={user.email}
              value={user.email}
              className="border border-gray-700 rounded-lg"
            >
              <AccordionTrigger className="flex justify-between px-4 py-3 bg-gray-900 hover:bg-gray-800 rounded-lg text-white">
                <span>
                  {user.name} - {user.organiserRequestStatus}
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
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        <span className="font-bold">📧 Email:</span>{" "}
                        {user.email}
                      </p>
                      <p>
                        <span className="font-bold">👤 Role:</span> {user.role}
                      </p>
                      <p>
                        <span className="font-bold">📝 Reason:</span>{" "}
                        {user.reasonForOrganiser}
                      </p>
                      <p>
                        <span className="font-bold">✅ Status:</span>{" "}
                        {user.organiserRequestStatus}
                      </p>

                      {/* Glassmorphic Buttons (Only for Pending Requests) */}
                      {activeTab === "Pending" && (
                        <div className="flex gap-4 mt-4">
                          <button
                            className="px-4 py-2 text-white font-semibold rounded-lg backdrop-blur-lg bg-green-500/20 border border-transparent hover:bg-green-500/40 transition-all duration-300"
                            onClick={() => handleAction(user._id, "approved")}
                          >
                            ✅ Accept
                          </button>
                          <button
                            className="px-4 py-2 text-white font-semibold rounded-lg backdrop-blur-lg bg-red-500/20 border border-transparent hover:bg-red-500/40 transition-all duration-300"
                            onClick={() => handleAction(user._id, "rejected")}
                          >
                            ❌ Reject
                          </button>
                        </div>
                      )}
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

export default ManageOrganisersRequest;
