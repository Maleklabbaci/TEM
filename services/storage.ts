
import { Testimonial, TestimonialStatus, StorageData } from '../types';

const STORAGE_KEY = 'ivision_testimonials_data';

const INITIAL_DATA: Testimonial[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    email: 'jean@example.com',
    message: 'Un service exceptionnel ! L\'équipe d\'iVision a su répondre à toutes mes attentes avec un professionnalisme rare.',
    rating: 5,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: TestimonialStatus.APPROVED,
    isCertified: true
  },
  {
    id: '2',
    name: 'Marie Claire',
    email: 'marie@test.fr',
    message: 'Très satisfaite de mon expérience. Je recommande vivement leurs services pour tout projet sérieux.',
    rating: 4,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: TestimonialStatus.APPROVED,
    isCertified: false
  }
];

export const getTestimonials = (): Testimonial[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ testimonials: INITIAL_DATA }));
    return INITIAL_DATA;
  }
  return (JSON.parse(data) as StorageData).testimonials;
};

export const saveTestimonial = (testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'status' | 'isCertified'>): void => {
  const testimonials = getTestimonials();
  const newTestimonial: Testimonial = {
    ...testimonial,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: TestimonialStatus.PENDING,
    isCertified: false
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ testimonials: [newTestimonial, ...testimonials] }));
};

export const updateTestimonialStatus = (id: string, status: TestimonialStatus): void => {
  const testimonials = getTestimonials();
  const updated = testimonials.map(t => t.id === id ? { ...t, status } : t);
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ testimonials: updated }));
};

export const toggleTestimonialCertification = (id: string): void => {
  const testimonials = getTestimonials();
  const updated = testimonials.map(t => t.id === id ? { ...t, isCertified: !t.isCertified } : t);
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ testimonials: updated }));
};

export const deleteTestimonial = (id: string): void => {
  const testimonials = getTestimonials();
  const filtered = testimonials.filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ testimonials: filtered }));
};
