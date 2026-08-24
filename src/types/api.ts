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
export type PaymentStatus = "UNPAID" | "PAID" | "REFUNDED";
export type BookingChannel = "WHATSAPP" | "WEBCHAT" | "MANUAL";

export interface Booking {
  id: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  serviceDescription: string;
  address?: string;
  postcode?: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  amount: number;
  platformFee?: number;
  channel: BookingChannel;
  stripePaymentIntentId?: string;
  stripeSessionId?: string;
  createdAt: string;
  updatedAt: string;
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
