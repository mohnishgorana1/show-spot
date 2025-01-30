export enum EventCategory {
  CONFERENCE = "Conference",
  WORKSHOP = "Workshop",
  CONCERT = "Concert",
  MEETUP = "Meetup",
  SPORTS = "Sports",
  OTHER = "Other",
}
export enum EventState {
  DRAFT = "Draft",           // Created but not published
  PENDING_APPROVAL = "Pending Approval", // Waiting for admin approval
  APPROVED = "Approved",     // Approved by admin, can be listed
  REJECTED = "Rejected",     // Rejected by admin
  CANCELLED = "Cancelled",   // Cancelled by organiser
  COMPLETED = "Completed",   // Event has ended
}

export const EVENT_STATES = Object.values(EventState); // Array for frontend filtering
export const EVENT_CATEGORIES = Object.values(EventCategory); // Array of categories for frontend filters
