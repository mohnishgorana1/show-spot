import ManageOrganisersRequest from "@/components/ManageOrganisersRequest";
import axios from "axios";
import React from "react";

async function ManageOrganisersRequestPage() {
  async function fetchOrganisersRequest() {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/manage-organisers-requests`
    );
    if (data.success) {
      console.log("allOrganisersRequest", data.allOrganisersRequest);
      return data.allOrganisersRequest;
    }
  }

  const allOrganisersRequestData = await fetchOrganisersRequest();

  return (
    <main className="flex flex-col gap-y-3">
      <section className="mx-auto">
        <h1 className="text-xl font-semibold md:text-2xl lg:text-4xl">
          Manage Organisers Request
        </h1>
      </section>

      <section>
        <ManageOrganisersRequest
          allOrganisersRequestData={allOrganisersRequestData}
        />
      </section>
    </main>
  );
}

export default ManageOrganisersRequestPage;
