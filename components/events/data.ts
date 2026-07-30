import type { EventItem } from './types';

// Mock data standing in for a future events API/backend. Shapes here are
// intentionally the source of truth for `EventItem` — replace `fetchEvents`
// and `fetchEventById` with real network calls once a backend exists, and
// keep the same return contract so the screens do not need to change.
const MOCK_EVENTS: EventItem[] = [
  {
    id: 'code-for-change-2026',
    title: 'Code for Change Hackathon',
    status: 'upcoming',
    startAt: '2026-08-15T08:00:00+03:00',
    endAt: '2026-08-16T18:00:00+03:00',
    location: {
      venue: 'Swahilipot Hub Main Auditorium',
      address: 'Mnazi Moja Grounds, Mombasa',
    },
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
    summary: 'A 36-hour hackathon for youth building civic-tech solutions.',
    description:
      'Teams of up to five spend 36 hours designing and building a working prototype that ' +
      'addresses a civic or community challenge. Mentors from local tech companies will be ' +
      'on-site throughout, and the top three teams present to a panel of judges for seed ' +
      'funding and incubation support.',
    schedule: [
      { time: 'Day 1, 08:00', label: 'Registration and team check-in' },
      { time: 'Day 1, 10:00', label: 'Opening keynote and problem statements' },
      { time: 'Day 1, 12:00', label: 'Building begins' },
      { time: 'Day 2, 15:00', label: 'Submissions close' },
      { time: 'Day 2, 16:00', label: 'Judging and final presentations' },
      { time: 'Day 2, 18:00', label: 'Awards and closing' },
    ],
    organizer: {
      name: 'Swahilipot Hub Foundation',
      email: 'programs@swahilipot.org',
      phone: '+254 700 000 000',
    },
    registrationUrl: 'https://swahilipot.org/events/code-for-change-2026',
    shareUrl: 'https://swahilipot.org/events/code-for-change-2026',
  },
  {
    id: 'coastal-arts-showcase-2026',
    title: 'Coastal Arts Showcase',
    status: 'upcoming',
    startAt: '2026-08-22T17:00:00+03:00',
    location: {
      venue: 'Swahilipot Hub Amphitheatre',
    },
    imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80',
    summary: 'An evening of music, spoken word, and visual art from coastal youth artists.',
    description:
      'Local musicians, poets, and visual artists share new work in a relaxed, open-air ' +
      'showcase. Doors open an hour before the first performance, with food and craft ' +
      'vendors on site.',
    organizer: {
      name: 'Swahilipot Arts Collective',
    },
    registrationUrl: 'https://swahilipot.org/events/coastal-arts-showcase-2026',
  },
  {
    id: 'digital-skills-bootcamp-sept-2026',
    title: 'Digital Skills Bootcamp',
    status: 'upcoming',
    startAt: '2026-09-05T09:00:00+03:00',
    endAt: '2026-09-09T16:00:00+03:00',
    location: {
      venue: 'Swahilipot Hub Training Lab',
      address: 'Mnazi Moja Grounds, Mombasa',
    },
    summary: 'A free five-day bootcamp covering the fundamentals of web development.',
    schedule: [
      { time: 'Mon–Fri, 09:00', label: 'Morning session' },
      { time: 'Mon–Fri, 14:00', label: 'Afternoon lab and project work' },
    ],
    organizer: {
      name: 'Swahilipot Hub Foundation',
      email: 'programs@swahilipot.org',
    },
  },
  {
    id: 'fm-live-block-party-2026',
    title: 'Swahilipot FM Live Block Party',
    status: 'past',
    startAt: '2026-06-14T16:00:00+03:00',
    endAt: '2026-06-14T22:00:00+03:00',
    location: {
      venue: 'Swahilipot Hub Grounds',
    },
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    summary: 'Swahilipot FM broadcast live with performances from local artists.',
    description:
      'Swahilipot FM took its studio outdoors for a live broadcast block party, featuring ' +
      'sets from local DJs and performers alongside call-in segments from the regular ' +
      'FM schedule.',
    organizer: {
      name: 'Swahilipot FM',
    },
  },
  {
    id: 'youth-innovation-summit-2026',
    title: 'Youth Innovation Summit',
    status: 'past',
    startAt: '2026-05-02T09:00:00+03:00',
    endAt: '2026-05-03T17:00:00+03:00',
    location: {
      venue: 'Swahilipot Hub Main Auditorium',
      address: 'Mnazi Moja Grounds, Mombasa',
    },
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    summary: 'Two days of talks and workshops on entrepreneurship and technology.',
    description:
      'A two-day summit bringing together young entrepreneurs, technologists, and mentors ' +
      'for talks, panels, and hands-on workshops covering funding, product design, and ' +
      'community organizing.',
    schedule: [
      { time: 'Day 1, 09:00', label: 'Opening panel: Building for community' },
      { time: 'Day 1, 13:00', label: 'Workshop tracks' },
      { time: 'Day 2, 09:00', label: 'Fireside chats with founders' },
      { time: 'Day 2, 15:00', label: 'Closing remarks' },
    ],
    organizer: {
      name: 'Swahilipot Hub Foundation',
      email: 'programs@swahilipot.org',
      phone: '+254 700 000 000',
    },
  },
];

const SIMULATED_NETWORK_DELAY_MS = 700;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Fetch all events, most relevant first (soonest upcoming, then most recent past). */
export async function fetchEvents(): Promise<EventItem[]> {
  await delay(SIMULATED_NETWORK_DELAY_MS);

  return [...MOCK_EVENTS].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === 'upcoming' ? -1 : 1;
    }
    const aTime = new Date(a.startAt).getTime();
    const bTime = new Date(b.startAt).getTime();
    return a.status === 'upcoming' ? aTime - bTime : bTime - aTime;
  });
}

/** Fetch a single event by id. Resolves to `undefined` if no event matches. */
export async function fetchEventById(id: string): Promise<EventItem | undefined> {
  await delay(SIMULATED_NETWORK_DELAY_MS);

  return MOCK_EVENTS.find((event) => event.id === id);
}
