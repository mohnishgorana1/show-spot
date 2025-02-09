import EventListing from "@/components/EventListing";
import axios from "axios";

//* Shows all published & approved events.
//* Filters: Category, Date, Location, Price (Free/Paid).
//* Search bar for event titles.
//* Pagination for browsing multiple events.

interface Event {
  _id: string;
  title: string;
  category: string;
  location: string;
  price: string;
}

interface EventsData {
  events: Event[];
  totalPages: number;
}

async function getEvents(filters: Record<string, string>, page: number) {
  try {
    const { data } = await axios.get<EventsData>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/events`,
      {
        params: {
          ...Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== "")
          ),
          page,
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error fetching events:", error);
    return { events: [], totalPages: 1 };
  }
}

async function EventsListingPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const filters = {
    category: searchParams.category || "",
    location: searchParams.location || "",
    price: searchParams.price || "",
    search: searchParams.search || "",
  };
  const page = Number(searchParams.page) || 1;

  const eventsData = await getEvents(filters, page);

  return (
    <EventListing
      initialEvents={eventsData.events}
      initialTotalPages={eventsData.totalPages}
    />
  );
}

export default EventsListingPage;
//* EXAMPLE
//*    filters = { category: "Music", location: "", price: "free", search: "" };
//       page = 2;

//*    Object.entries(filters)
//        [["category", "Music"], ["location", ""], ["price", "free"], ["search", ""]]

//*    Object.entries(filters).filter(([_, v]) => v !== "")
//        [["category", "Music"], ["price", "free"]]

//*    Object.fromEntries([...])
//        { category: "Music", price: "free" }
