import HomeComponent from "@/components/HomeComponent";

import React from "react";

//* Displays featured/upcoming events.
//* Search and filter options (by category, date, etc.).
//* Call-to-action (CTA) for signing up.

function Home() {
  return (
    <main className="px-2 md:px-4">
      <HomeComponent />
    </main>
  );
}

export default Home;
