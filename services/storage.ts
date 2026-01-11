
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
    console.error('Erreur Supabase Fetch:', error);
    throw new Error(error.message);
  }
  return data || [];
};

export const saveTestimonial = async (data: { name: string, brand_name: string, email: string, message: string, rating: number }): Promise<void> => {
  const { error } = await supabase
    .from('testimonials')
    .insert([
      {
        name: data.name,
        brand_name: data.brand_name || null,
        email: data.email || null,
        message: data.message,
        rating: data.rating,
        status: TestimonialStatus.PENDING,
        is_certified: false
      }
    ]);

  if (error) {
    console.error('Erreur Supabase Insert:', error);
    throw new Error(error.message);
  }
};

export const updateTestimonialStatus = async (id: string, status: TestimonialStatus): Promise<void> => {
  const { error } = await supabase
    .from('testimonials')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Erreur Supabase Update Status:', error);
    throw new Error(error.message);
  }
};

export const toggleTestimonialCertification = async (id: string, currentCertified: boolean): Promise<void> => {
  const { error } = await supabase
    .from('testimonials')
    .update({ is_certified: !currentCertified })
    .eq('id', id);

  if (error) {
    console.error('Erreur Supabase Certify:', error);
    throw new Error(error.message);
  }
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erreur Supabase Delete:', error);
    throw new Error(error.message);
  }
};
