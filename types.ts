
export enum TestimonialStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface Testimonial {
  id: string;
  name: string;
  email?: string;
  message: string;
  rating: number;
  created_at: string;
  status: TestimonialStatus;
  is_certified?: boolean;
}

export interface StorageData {
  testimonials: Testimonial[];
}
