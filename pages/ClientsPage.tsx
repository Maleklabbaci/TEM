
import React, { useEffect, useState } from 'react';
import { getTestimonials } from '../services/storage.ts';
import { Testimonial, TestimonialStatus } from '../types.ts';
import StarRating from '../components/StarRating.tsx';

const ClientsPage: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const all = getTestimonials();
    setTestimonials(all.filter(t => t.status === TestimonialStatus.APPROVED));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-16">
      <header className="text-center mb-10 md:mb-20 px-2">
        <h1 className="text-3xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
          La parole à <br className="sm:hidden" /> nos clients
        </h1>
        <div className="h-1.5 w-12 md:w-20 bg-blue-600 mx-auto rounded-full mb-6 shadow-lg shadow-blue-200"></div>
        <p className="text-sm md:text-xl text-slate-500 max-w-2xl mx-auto font-medium opacity-80 leading-relaxed">
          Découvrez les retours d'expérience de ceux qui nous font confiance.
        </p>
      </header>

      {testimonials.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-[2rem] border-2 border-dashed border-white/50 mx-2">
          <p className="text-slate-400 italic font-medium">Aucun témoignage publié pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {testimonials.map((t) => (
            <div 
              key={t.id} 
              className="glass-card p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] flex flex-col h-full hover:-translate-y-1.5 transition-all duration-500 relative group"
            >
              {t.isCertified && (
                <div className="absolute -top-3 right-6 flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1.5 rounded-xl text-[8px] md:text-[9px] font-black tracking-[0.1em] shadow-xl border border-slate-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  CERTIFIÉ
                </div>
              )}
              
              <div className="mb-5 md:mb-8">
                <StarRating rating={t.rating} />
              </div>
              
              <div className="flex-grow">
                <blockquote className="text-slate-800 italic mb-6 md:mb-8 leading-relaxed text-base md:text-xl font-medium opacity-90">
                  "{t.message}"
                </blockquote>
              </div>

              <div className="flex items-center space-x-3 md:space-x-4 pt-5 md:pt-6 border-t border-slate-200/30">
                <div className="h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-[1.2rem] bg-gradient-to-br from-white to-slate-50 flex items-center justify-center text-slate-900 font-black text-lg md:text-2xl border border-white shadow shadow-slate-200">
                  {t.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-slate-900 truncate pr-4 text-sm md:text-xl">
                    {t.name}
                  </h3>
                  <p className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest mt-0.5 md:mt-1">
                    {new Date(t.createdAt).toLocaleDateString('fr-FR', {
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
