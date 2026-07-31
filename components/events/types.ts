export type EventStatus = 'upcoming' | 'past';

export type EventScheduleItem = {
  time: string;
  label: string;
};

export type EventOrganizer = {
  name: string;
  email?: string;
  phone?: string;
};

export type EventLocation = {
  venue?: string;
  address?: string;
};

export type EventItem = {
  id: string;
  title: string;
  status: EventStatus;
  /** ISO 8601 start date/time. */
  startAt: string;
  /** ISO 8601 end date/time. */
  endAt?: string;
  location?: EventLocation;
  imageUrl?: string;
  /** Short summary shown on the list card. */
  summary: string;
  /** Full description shown on the detail screen. */
  description?: string;
  schedule?: EventScheduleItem[];
  organizer?: EventOrganizer;
  registrationUrl?: string;
  shareUrl?: string;
};
