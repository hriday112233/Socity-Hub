export interface User {
  id: number;
  name: string;
  email: string;
  role: 'resident' | 'admin';
  is_premium: number;
  subscription_expiry?: string;
}

export interface Service {
  id: number;
  name: string;
  category: string;
  base_price: number;
  is_available: number;
}

export interface Booking {
  id: number;
  user_id: number;
  user_name?: string;
  service_id: number;
  service_name?: string;
  status: 'pending' | 'assigned' | 'completed' | 'cancelled';
  created_at: string;
  refund_amount: number;
}

export interface Complaint {
  id: number;
  user_id: number;
  user_name?: string;
  subject: string;
  description: string;
  status: 'open' | 'resolved';
  resolution_message?: string;
  complaint_number: string;
  created_at: string;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  priority: 'normal' | 'high';
  created_at: string;
}

export interface Amenity {
  id: number;
  name: string;
  description: string;
  capacity: number;
  status: string;
}

export interface AmenityBooking {
  id: number;
  user_id: number;
  user_name?: string;
  amenity_id: number;
  amenity_name?: string;
  booking_date: string;
  time_slot: string;
  status: string;
  created_at: string;
}

export interface Transaction {
  id: number;
  user_id: number;
  user_name?: string;
  amount: number;
  type: 'deposit' | 'withdraw';
  method: 'upi' | 'razorpay';
  status: string;
  created_at: string;
}

export interface RegistrationReport {
  date: string;
  count: number;
}
