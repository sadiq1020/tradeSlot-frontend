export type Role = "TRADER" | "ADMIN" | "USER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPage?: number;
  };
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken?: string;
}

export interface WorkArea {
  id: string;
  date: string; // ISO format: YYYY-MM-DD or full timestamp
  areaLabel: string;
  postcodes?: string[];
  traderId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateWorkAreaInput {
  date: string;
  areaLabel: string;
  postcodes?: string[];
}

export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "UNPAID" | "PAID" | "SUCCEEDED" | "PENDING" | "FAILED" | "REFUNDED";
export type BookingChannel = "WHATSAPP" | "WEBCHAT" | "MANUAL";

export interface Payment {
  id: string;
  bookingId: string;
  stripePaymentIntentId?: string | null;
  stripeAccountId?: string;
  amount?: number;
  applicationFeeAmount?: number;
  status: PaymentStatus;
  stripeEventId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Customer {
  id?: string;
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  postcode?: string;
}

export interface Booking {
  id: string;
  // Direct or nested customer fields
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customer?: Customer;

  // Direct or alternative description fields
  serviceDescription?: string;
  jobDescription?: string;
  description?: string;
  service?: string;
  notes?: string;

  // Address
  address?: string;
  postcode?: string;
  location?: string;

  // Dates & Times
  slotStart?: string;
  slotEnd?: string;
  slot_start?: string;
  slot_end?: string;
  startTime?: string;
  endTime?: string;
  date?: string;
  slot?: {
    startTime?: string;
    endTime?: string;
    date?: string;
  };

  // Status & Financials
  status: BookingStatus;
  payment?: Payment | null;
  paymentStatus?: PaymentStatus;
  amount?: number;
  fee?: number;
  bookingFee?: number;
  platformFee?: number;
  channel?: BookingChannel;
  stripePaymentIntentId?: string;
  stripeSessionId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetBookingsParams {
  status?: BookingStatus | "ALL";
  date?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface StripeConnectStatus {
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  accountId?: string;
  connected?: boolean;
}

export interface StripeOnboardResponse {
  onboardingUrl: string;
}

export interface CheckoutResponse {
  checkoutUrl: string;
  sessionId?: string;
}

export interface AvailableSlot {
  startTime: string;
  endTime: string;
  displayTime?: string;
}

export interface WebchatMessageInput {
  senderId: string;
  message: string;
}

export interface WebchatMessageResponse {
  reply: string;
  booking?: Booking;
  bookingId?: string;
  availableSlots?: AvailableSlot[];
  checkoutUrl?: string;
}
