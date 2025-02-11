import Image from "next/image";
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
    eventThumbnail: {
      secure_url: string;
    };
  };
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="border border-gray-700 rounded-lg shadow-lg bg-gray-900 text-white transition-transform transform hover:scale-[1.02]">
      {/* Event Image */}
      <Image
        width={1000}
        height={500}
        src={event.eventThumbnail?.secure_url || "/placeholder.jpg"}
        alt={event.title}
        className="w-full h-40 object-cover rounded-t-lg"
      />

      {/* Event Details */}
      <div className="p-4 space-y-2">
        <h2 className="text-lg font-bold">{event.title}</h2>
        <p className="text-gray-400 text-sm">
          {event.description.slice(0, 80)}...
        </p>

        <div className="flex items-center text-gray-400 text-xs gap-2">
          <span>📍 {event.location}</span>
          <span>📅 {new Date(event.dateTime).toDateString()}</span>
        </div>

        <div className="flex justify-between items-center mt-3">
          <span className="px-2 py-1 text-xs font-semibold rounded-md bg-blue-700 text-white">
            {event.category}
          </span>

          <span
            className={`px-2 py-1 text-xs font-semibold rounded-md ${
              event.price === 0
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {event.price === 0 ? "Free" : `₹${event.price}`}
          </span>
        </div>

        <Link
          href={`/events/${event._id}`}
          className="block text-center bg-blue-600 text-white mt-3 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
