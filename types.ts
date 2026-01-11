
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
  createdAt: string;
  status: TestimonialStatus;
  isCertified?: boolean;
}

export interface StorageData {
  testimonials: Testimonial[];
}
