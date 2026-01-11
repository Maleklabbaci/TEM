
import React, { useState } from 'react';
import { saveTestimonial } from '../services/storage.ts';
import StarRating from '../components/StarRating.tsx';

const SubmitPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    rating: 5
  });
  
  const [errors, setErrors] = useState({
    name: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', message: '' };

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est obligatoire.';
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Le message ne peut pas être vide.';
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Le message doit contenir au moins 10 caractères.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    saveTestimonial(formData);
    setLoading(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '', rating: 5 });
    setErrors({ name: '', message: '' });
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 md:py-32 text-center overflow-hidden">
        <div className="relative h-32 flex items-center justify-center mb-8">
          <div className="animate-fly text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center animate-fade-in-up" style={{ animationDelay: '0.8s', opacity: 0 }}>
             <div className="bg-green-100 text-green-600 w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl shadow-green-100/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
             </div>
          </div>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '1s', opacity: 0 }}>
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">Message envoyé !</h2>
          <p className="text-sm md:text-xl text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed opacity-80">
            Votre témoignage s'est envolé vers nos modérateurs. Il sera publié dès validation.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-all shadow-xl active:scale-95"
          >
            Écrire un autre avis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-20">
      <div className="glass-card rounded-[2rem] md:rounded-[3rem] shadow-xl overflow-hidden flex flex-col md:flex-row border border-white/50">
        <div className="bg-slate-900 md:w-5/12 p-8 md:p-16 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="hidden md:block absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="w-10 h-1 bg-blue-500 mb-6 rounded-full"></div>
            <h2 className="text-2xl md:text-5xl font-black mb-4 tracking-tight leading-tight">Votre avis compte.</h2>
            <p className="text-slate-400 leading-relaxed text-sm md:text-lg font-medium opacity-90">
              Partagez votre ressenti sur nos services et aidez la communauté.
            </p>
          </div>
        </div>
        <div className="p-6 md:p-14 md:w-7/12">
          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Nom complet</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  placeholder="Sophie Richard"
                  className={`w-full px-5 py-3 md:px-6 md:py-4 bg-white/50 border rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all outline-none text-sm md:text-lg text-slate-900 ${
                    errors.name ? 'border-red-500' : 'border-slate-100'
                  }`}
                />
                {errors.name && <p className="mt-1 text-[10px] text-red-500 font-bold px-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">E-mail</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="sophie@ivision.fr"
                  className="w-full px-5 py-3 md:px-6 md:py-4 bg-white/50 border border-slate-100 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all outline-none text-sm md:text-lg text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Note globale</label>
              <div className="bg-white/30 p-4 md:p-8 rounded-2xl border border-white/60 flex justify-center sm:justify-start">
                <StarRating 
                  rating={formData.rating} 
                  interactive 
                  onRatingChange={(rating) => setFormData({ ...formData, rating })} 
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Votre message</label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => {
                  setFormData({ ...formData, message: e.target.value });
                  if (errors.message) setErrors({ ...errors, message: '' });
                }}
                placeholder="Racontez-nous tout..."
                className={`w-full px-5 py-3 md:px-6 md:py-4 bg-white/50 border rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all outline-none resize-none text-sm md:text-lg leading-relaxed text-slate-900 ${
                  errors.message ? 'border-red-500' : 'border-slate-100'
                }`}
              ></textarea>
              {errors.message && <p className="mt-1 text-[10px] text-red-500 font-bold px-1">{errors.message}</p>}
            </div>

            <button
              disabled={loading}
              type="submit"
              className={`w-full bg-blue-600 text-white py-4 md:py-6 rounded-xl md:rounded-2xl font-black text-sm md:text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-[0.98] flex items-center justify-center gap-3 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Envol imminent...</span>
                </div>
              ) : (
                'Envoyer mon avis'
              )}
            </button>
            <p className="text-[9px] text-center text-slate-400 font-bold tracking-widest">
              VÉRIFICATION SYSTÉMATIQUE AVANT PUBLICATION
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitPage;
