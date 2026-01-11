
import { createClient } from '@supabase/supabase-js';
import { Testimonial, TestimonialStatus } from '../types.ts';

const SUPABASE_URL = 'https://gtblvpzwmtssliomtoii.supabase.co';
const SUPABASE_KEY = 'sb_publishable_BKeUFU25FrAnFATV9XxRfA_nZE9b2p3';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const getTestimonials = async (): Promise<Testimonial[]> => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('createdAt', { ascending: false });

  if (error) {
    console.error('Erreur Supabase (fetch):', error);
    return [];
  }
  return data as Testimonial[];
};

export const saveTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'status' | 'isCertified'>): Promise<void> => {
  const { error } = await supabase
    .from('testimonials')
    .insert([
      {
        ...testimonial,
        status: TestimonialStatus.PENDING,
        isCertified: false
      }
    ]);

  if (error) {
    console.error('Erreur Supabase (save):', error);
    throw error;
  }
};

export const updateTestimonialStatus = async (id: string, status: TestimonialStatus): Promise<void> => {
  const { error } = await supabase
    .from('testimonials')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Erreur Supabase (update status):', error);
    throw error;
  }
};

export const toggleTestimonialCertification = async (id: string, currentCertified: boolean): Promise<void> => {
  const { error } = await supabase
    .from('testimonials')
    .update({ isCertified: !currentCertified })
    .eq('id', id);

  if (error) {
    console.error('Erreur Supabase (toggle certify):', error);
    throw error;
  }
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erreur Supabase (delete):', error);
    throw error;
  }
};
