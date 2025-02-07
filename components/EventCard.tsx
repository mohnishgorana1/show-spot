import Link from "next/link";

interface EventCardProps {
  event: {
    _id: string;
    title: string;
    description: string;
    dateTime: string;
    location: string;
    category: string;
    price: number;
  };
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="border p-4 rounded-md shadow-md bg-gray-800 text-white">
      <h2 className="text-xl font-bold">{event.title}</h2>
      <p className="text-sm">{event.description.slice(0, 100)}...</p>
      <p className="text-sm text-gray-400">{new Date(event.dateTime).toDateString()}</p>
      <p className="text-sm">{event.location}</p>
      <p className="text-sm">{event.category}</p>
      <p className="text-sm font-semibold">{event.price === 0 ? "Free" : `₹${event.price}`}</p>
      <Link href={`/events/${event._id}`} className="text-blue-400 underline mt-2 block">
        View Details
      </Link>
    </div>
  );
}
