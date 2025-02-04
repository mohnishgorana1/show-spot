import EventDetails from "@/components/EventDetails";

// Shows event details (title, description, location, date, price, etc.).
// "Register Now" button (if logged in).
// Organizer details.
// Related events.

function EventDetailsPage({ params }: { params: { eventId: string } }) {
  const eventId = params.eventId;

  return (
    <main>
      <section>
        <EventDetails eventId={eventId} />
      </section>
    </main>
  );
}

export default EventDetailsPage;
