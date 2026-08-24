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

  // 1. Gather all potential start time representations (camelCase & snake_case)
  const rawStart =
    booking.slotStart ||
    booking.slot_start ||
    booking.startTime ||
    booking.start_time ||
    booking.start ||
    booking.slotStartTime ||
    booking.slot_start_time ||
    booking.scheduledAt ||
    booking.scheduled_at ||
    booking.slot?.startTime ||
    booking.slot?.start_time ||
    booking.slot?.start ||
    booking.appointmentTime;

  // 2. Gather all potential end time representations
  const rawEnd =
    booking.slotEnd ||
    booking.slot_end ||
    booking.endTime ||
    booking.end_time ||
    booking.end ||
    booking.slotEndTime ||
    booking.slot_end_time ||
    booking.slot?.endTime ||
    booking.slot?.end_time ||
    booking.slot?.end;

  // 3. Gather date representations
  const rawDate =
    booking.date ||
    booking.bookingDate ||
    booking.booking_date ||
    booking.serviceDate ||
    booking.service_date ||
    booking.slot?.date ||
    booking.workArea?.date ||
    booking.work_area?.date ||
    booking.createdAt ||
    booking.created_at;

  // 4. Gather direct time strings (e.g. "14:00 - 15:00" or "14:00")
  const rawTime =
    booking.time ||
    booking.timeSlot ||
    booking.time_slot ||
    booking.slotTime ||
    booking.slot_time ||
    booking.slot?.time ||
    booking.requestedTime ||
    booking.requested_time ||
    (typeof booking.slot === "string" ? booking.slot : undefined);

  let dateLabel = "Date Pending";
  let shortDate = "";
  let timeLabel = "Time Pending";

  // Check if rawStart is a valid ISO timestamp
  if (rawStart) {
    try {
      const parsedStart = parseISO(String(rawStart));
      if (isValid(parsedStart)) {
        dateLabel = format(parsedStart, "EEEE, dd MMMM yyyy");
        shortDate = format(parsedStart, "EEE, dd MMM");

        if (rawEnd) {
          const parsedEnd = parseISO(String(rawEnd));
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

  // If time is still pending, check direct rawTime field
  if (timeLabel === "Time Pending" && rawTime) {
    try {
      const parsed = parseISO(String(rawTime));
      if (isValid(parsed)) {
        timeLabel = format(parsed, "HH:mm");
      } else {
        timeLabel = String(rawTime);
      }
    } catch {
      timeLabel = String(rawTime);
    }
  }

  // If date is still pending, parse rawDate
  if (dateLabel === "Date Pending" && rawDate) {
    try {
      const parsedDate = parseISO(String(rawDate));
      if (isValid(parsedDate)) {
        dateLabel = format(parsedDate, "EEEE, dd MMMM yyyy");
        shortDate = format(parsedDate, "EEE, dd MMM");
        if (timeLabel === "Time Pending") {
          timeLabel = format(parsedDate, "HH:mm");
        }
      } else {
        dateLabel = String(rawDate);
        shortDate = String(rawDate);
      }
    } catch {
      dateLabel = String(rawDate);
      shortDate = String(rawDate);
    }
  }

  // Clean any stray ISO strings in timeLabel
  if (timeLabel.includes("T") && timeLabel.includes("Z")) {
    try {
      const parsed = parseISO(timeLabel);
      if (isValid(parsed)) {
        timeLabel = format(parsed, "HH:mm");
      }
    } catch {}
  }

  return { dateLabel, timeLabel, shortDate };
}
