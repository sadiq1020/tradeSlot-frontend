export interface FormattedBookingTime {
  dateLabel: string;
  timeLabel: string;
  shortDate: string;
}

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function extractUtcParts(val: unknown) {
  if (!val) return null;
  const str = String(val).trim();
  const isoMatch = str.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/
  );
  if (isoMatch) {
    const [, y, m, d, h, min] = isoMatch;
    const year = parseInt(y, 10);
    const month = parseInt(m, 10);
    const day = parseInt(d, 10);
    const dateObj = new Date(Date.UTC(year, month - 1, day));
    const dayOfWeek = DAYS[dateObj.getUTCDay()];
    const shortDay = SHORT_DAYS[dateObj.getUTCDay()];
    const monthName = MONTHS[month - 1];
    const shortMonth = SHORT_MONTHS[month - 1];

    return {
      year,
      month,
      day,
      dateLabel: `${dayOfWeek}, ${day} ${monthName} ${year}`,
      shortDate: `${shortDay}, ${day} ${shortMonth}`,
      timeStr: h && min !== undefined ? `${h}:${min}` : undefined,
    };
  }
  return null;
}

export function formatBookingDateTime(booking: any): FormattedBookingTime {
  if (!booking) {
    return {
      dateLabel: "Date Pending",
      timeLabel: "Time Pending",
      shortDate: "",
    };
  }

  // 1. Gather all potential start time representations
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

  const startParts = extractUtcParts(rawStart);
  const endParts = extractUtcParts(rawEnd);
  const dateParts = extractUtcParts(rawDate);

  if (startParts) {
    dateLabel = startParts.dateLabel;
    shortDate = startParts.shortDate;
    if (startParts.timeStr) {
      if (endParts?.timeStr) {
        timeLabel = `${startParts.timeStr} — ${endParts.timeStr}`;
      } else {
        timeLabel = startParts.timeStr;
      }
    }
  } else if (dateParts) {
    dateLabel = dateParts.dateLabel;
    shortDate = dateParts.shortDate;
  }

  // If time is still pending, check direct rawTime field
  if (timeLabel === "Time Pending" && rawTime) {
    const rawTimeStr = String(rawTime).trim();
    const timeMatch = rawTimeStr.match(/\b([01]?[0-9]|2[0-3]):([0-5][0-9])\b/g);
    if (timeMatch && timeMatch.length >= 2) {
      timeLabel = `${timeMatch[0]} — ${timeMatch[1]}`;
    } else if (timeMatch && timeMatch.length === 1) {
      timeLabel = timeMatch[0];
    } else if (!rawTimeStr.includes("T")) {
      timeLabel = rawTimeStr;
    }
  }

  return { dateLabel, timeLabel, shortDate };
}
