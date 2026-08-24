import { format, parseISO, isValid } from "date-fns";

export interface FormattedBookingTime {
  dateLabel: string;
  timeLabel: string;
  shortDate: string;
}

export function formatBookingDateTime(booking: any): FormattedBookingTime {
  if (!booking) {
    return { dateLabel: "Date Pending", timeLabel: "Time Pending", shortDate: "" };
  }

  // 1. Try finding time and date raw values
  const rawStart =
    booking.startTime ||
    booking.start ||
    booking.slotStartTime ||
    booking.scheduledAt ||
    booking.slot?.startTime ||
    booking.slot?.start;

  const rawEnd =
    booking.endTime ||
    booking.end ||
    booking.slotEndTime ||
    booking.slot?.endTime ||
    booking.slot?.end;

  const rawDate =
    booking.date ||
    booking.bookingDate ||
    booking.serviceDate ||
    booking.slot?.date ||
    booking.createdAt;

  const rawTime =
    booking.time ||
    booking.timeSlot ||
    booking.slotTime ||
    booking.slot?.time ||
    (typeof booking.slot === "string" ? booking.slot : undefined);

  let dateLabel = "Date Pending";
  let shortDate = "";
  let timeLabel = "Time Pending";

  // Check if rawStart is a full ISO date string
  if (rawStart) {
    try {
      const parsedStart = parseISO(rawStart);
      if (isValid(parsedStart)) {
        dateLabel = format(parsedStart, "EEEE, dd MMMM yyyy");
        shortDate = format(parsedStart, "EEE, dd MMM");

        if (rawEnd) {
          const parsedEnd = parseISO(rawEnd);
          if (isValid(parsedEnd)) {
            timeLabel = `${format(parsedStart, "HH:mm")} — ${format(parsedEnd, "HH:mm")}`;
          } else {
            timeLabel = format(parsedStart, "HH:mm");
          }
        } else {
          timeLabel = format(parsedStart, "HH:mm");
        }
      } else if (typeof rawStart === "string") {
        timeLabel = rawStart;
      }
    } catch {
      timeLabel = String(rawStart);
    }
  }

  // If timeLabel is still pending, check rawTime
  if (timeLabel === "Time Pending" && rawTime) {
    timeLabel = String(rawTime);
  }

  // If dateLabel is still pending, parse rawDate
  if (dateLabel === "Date Pending" && rawDate) {
    try {
      const parsedDate = parseISO(rawDate);
      if (isValid(parsedDate)) {
        dateLabel = format(parsedDate, "EEEE, dd MMMM yyyy");
        shortDate = format(parsedDate, "EEE, dd MMM");
      } else {
        dateLabel = String(rawDate);
        shortDate = String(rawDate);
      }
    } catch {
      dateLabel = String(rawDate);
      shortDate = String(rawDate);
    }
  }

  return { dateLabel, timeLabel, shortDate };
}
