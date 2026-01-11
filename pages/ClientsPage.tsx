
import React, { useEffect, useState } from 'react';
import { getTestimonials } from '../services/storage.ts';
import { Testimonial, TestimonialStatus } from '../types.ts';
import StarRating from '../components/StarRating.tsx';

const ClientsPage: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const all = await getTestimonials();
        setTestimonials(all.filter(t => t.status === TestimonialStatus.APPROVED));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-16">
      <header className="text-center mb-10 md:mb-20">
        <h1 className="text-3xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
          La parole à nos clients
        </h1>
        <div className="h-1.5 w-12 md:w-20 bg-blue-600 mx-auto rounded-full mb-6 shadow-lg"></div>
        <p className="text-sm md:text-xl text-slate-500 max-w-2xl mx-auto font-medium opacity-80">
          Découvrez les retours d'expérience de ceux qui nous font confiance.
        </p>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="h-10 w-10 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Récupération des avis...</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-[2rem] border-2 border-dashed border-white/50">
          <p className="text-slate-400 italic font-medium">Aucun témoignage publié pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {testimonials.map((t) => (
            <div 
              key={t.id} 
              className="glass-card p-6 md:p-10 rounded-[2rem] flex flex-col h-full hover:-translate-y-1.5 transition-all duration-500 relative"
            >
              {t.is_certified && (
                <div className="absolute -top-3 right-6 flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1.5 rounded-xl text-[8px] font-black tracking-[0.1em] shadow-xl">
                  CERTIFIÉ
                </div>
              )}
              
              <div className="mb-5 md:mb-8">
                <StarRating rating={t.rating} />
              </div>
              
              <div className="flex-grow">
                <blockquote className="text-slate-800 italic mb-6 leading-relaxed text-base md:text-xl font-medium opacity-90">
                  "{t.message}"
                </blockquote>
              </div>

              <div className="flex items-center space-x-3 md:space-x-4 pt-5 border-t border-slate-200/30">
                <div className="h-10 w-10 md:h-14 md:w-14 rounded-xl bg-gradient-to-br from-white to-slate-50 flex items-center justify-center text-slate-900 font-black text-lg md:text-2xl border border-white shadow">
                  {t.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-slate-900 truncate pr-4 text-sm md:text-base leading-tight">
                    {t.name}
                  </h3>
                  {t.brand_name && (
                    <p className="text-blue-600 font-bold text-[10px] uppercase tracking-wide truncate">
                      {t.brand_name}
                    </p>
                  )}
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">
                    {new Date(t.created_at).toLocaleDateString('fr-FR', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
