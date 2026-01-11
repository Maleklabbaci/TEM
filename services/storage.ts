
import { createClient } from '@supabase/supabase-js';
import { Testimonial, TestimonialStatus } from '../types.ts';

const SUPABASE_URL = 'https://gtblvpzwmtssliomtoii.supabase.co';
const SUPABASE_KEY = 'sb_publishable_BKeUFU25FrAnFATV9XxRfA_nZE9b2p3';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const getTestimonials = async (): Promise<Testimonial[]> => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase fetch error:', error);
    throw new Error(error.message);
  }
  return data as Testimonial[];
};

export const saveTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'created_at' | 'status' | 'is_certified'>): Promise<void> => {
  const { error } = await supabase
    .from('testimonials')
    .insert([
      {
        ...testimonial,
        status: TestimonialStatus.PENDING,
        is_certified: false
      }
    ]);

  if (error) {
    console.error('Supabase insert error:', error);
    throw new Error(error.message);
  }
};

export const updateTestimonialStatus = async (id: string, status: TestimonialStatus): Promise<void> => {
  const { error } = await supabase
    .from('testimonials')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Supabase update status error:', error);
    throw new Error(error.message);
  }
};

export const toggleTestimonialCertification = async (id: string, currentCertified: boolean): Promise<void> => {
  const { error } = await supabase
    .from('testimonials')
    .update({ is_certified: !currentCertified })
    .eq('id', id);

  if (error) {
    console.error('Supabase toggle certify error:', error);
    throw new Error(error.message);
  }
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Supabase delete error:', error);
    throw new Error(error.message);
  }
};
