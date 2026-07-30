import type { EventItem } from './types';

const DATE_FORMATTER = new Intl.DateTimeFormat('en-KE', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});

const DATE_FORMATTER_WITH_YEAR = new Intl.DateTimeFormat('en-KE', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const TIME_FORMATTER = new Intl.DateTimeFormat('en-KE', {
  hour: 'numeric',
  minute: '2-digit',
});

/** Short date for list cards, e.g. "Sat, 15 Aug". */
export function formatEventDateShort(isoDate: string): string {
  return DATE_FORMATTER.format(new Date(isoDate));
}

/** Long date for the detail screen, e.g. "Saturday, 15 August 2026". */
export function formatEventDateLong(isoDate: string): string {
  return DATE_FORMATTER_WITH_YEAR.format(new Date(isoDate));
}

export function formatEventTime(isoDate: string): string {
  return TIME_FORMATTER.format(new Date(isoDate));
}

/** Combined date + time range used on the detail screen, spanning days if needed. */
export function formatEventWhen(event: Pick<EventItem, 'startAt' | 'endAt'>): string {
  const start = new Date(event.startAt);
  const startLabel = `${formatEventDateLong(event.startAt)} · ${TIME_FORMATTER.format(start)}`;

  if (!event.endAt) {
    return startLabel;
  }

  const end = new Date(event.endAt);
  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  if (sameDay) {
    return `${startLabel} – ${TIME_FORMATTER.format(end)}`;
  }

  return `${startLabel} – ${formatEventDateLong(event.endAt)} · ${TIME_FORMATTER.format(end)}`;
}

/** Short date range used on the list card. */
export function formatEventWhenShort(event: Pick<EventItem, 'startAt' | 'endAt'>): string {
  const start = new Date(event.startAt);
  const startLabel = `${formatEventDateShort(event.startAt)} · ${TIME_FORMATTER.format(start)}`;

  if (!event.endAt) {
    return startLabel;
  }

  const end = new Date(event.endAt);
  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  return sameDay ? startLabel : `${formatEventDateShort(event.startAt)} – ${formatEventDateShort(event.endAt)}`;
}
