
import React, { useState, useEffect, useMemo } from 'react';
import { getTestimonials, updateTestimonialStatus, deleteTestimonial, toggleTestimonialCertification } from '../services/storage.ts';
import { login, logout, isAuthenticated as checkAuth } from '../services/auth.ts';
import { Testimonial, TestimonialStatus } from '../types.ts';
import StarRating from '../components/StarRating.tsx';

type SortOption = 'date-desc' | 'date-asc' | 'name-asc';

const AdminPage: React.FC = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filter, setFilter] = useState<TestimonialStatus | 'all'>(TestimonialStatus.PENDING);
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  useEffect(() => {
    if (checkAuth()) {
      setIsAuth(true);
      loadTestimonials();
    }
  }, []);

  useEffect(() => {
    if (isAuth) {
      loadTestimonials();
    }
  }, [isAuth]);

  const loadTestimonials = () => {
    setTestimonials(getTestimonials());
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    
    setIsLoggingIn(true);
    const success = await login(password);
    
    if (success) {
      setIsAuth(true);
      setPassword('');
    } else {
      alert('Mot de passe incorrect. Essayez: adminadmin');
    }
    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    logout();
    setIsAuth(false);
  };

  const handleStatusChange = (id: string, status: TestimonialStatus) => {
    updateTestimonialStatus(id, status);
    loadTestimonials();
  };

  const handleToggleCertify = (id: string) => {
    toggleTestimonialCertification(id);
    loadTestimonials();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer définitivement ce témoignage ?')) {
      deleteTestimonial(id);
      loadTestimonials();
    }
  };

  const processedTestimonials = useMemo(() => {
    let result = filter === 'all' 
      ? [...testimonials] 
      : testimonials.filter(t => t.status === filter);

    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name-asc':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return result;
  }, [testimonials, filter, sortBy]);

  if (!isAuth) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 md:py-20">
        <div className="bg-white p-6 md:p-10 rounded-[2rem] shadow-2xl border border-slate-100">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-xl shadow-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2 text-center">Admin Login</h2>
          <p className="text-slate-500 text-center mb-8 text-xs">Espace de gestion iVision</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-900/5 focus:bg-white outline-none transition-all text-center text-xl tracking-widest text-slate-900"
              disabled={isLoggingIn}
            />
            <button
              disabled={isLoggingIn || !password}
              type="submit"
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg"
            >
              {isLoggingIn ? 'Vérification...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">Gestion des avis</h1>
          <p className="text-slate-500 text-xs md:text-lg">Modérez les retours clients.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto no-scrollbar">
            {(['all', TestimonialStatus.PENDING, TestimonialStatus.APPROVED, TestimonialStatus.REJECTED] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 sm:flex-none px-3 py-2 whitespace-nowrap rounded-lg text-[9px] font-black uppercase transition-all ${
                  filter === f ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
                }`}
              >
                {f === 'all' ? 'Tous' : f === TestimonialStatus.PENDING ? 'Attente' : f === TestimonialStatus.APPROVED ? 'Validés' : 'Refusés'}
              </button>
            ))}
          </div>
          <button onClick={handleLogout} className="p-2.5 bg-red-50 text-red-600 rounded-xl">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
          </button>
        </div>
      </header>

      <div className="lg:hidden space-y-4">
        {processedTestimonials.map((t) => (
          <div key={t.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900 font-bold border border-slate-100">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm leading-tight">{t.name}</p>
                  <div className="scale-75 origin-left mt-0.5">
                    <StarRating rating={t.rating} />
                  </div>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                t.status === TestimonialStatus.APPROVED ? 'bg-green-100 text-green-700' :
                t.status === TestimonialStatus.PENDING ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
              }`}>
                {t.status}
              </span>
            </div>
            <p className="text-xs text-slate-600 italic mb-4 line-clamp-3">"{t.message}"</p>
            <div className="flex gap-2 justify-end pt-3 border-t border-slate-50">
               {t.status !== TestimonialStatus.APPROVED && (
                  <button onClick={() => handleStatusChange(t.id, TestimonialStatus.APPROVED)} className="p-2 bg-green-50 text-green-600 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  </button>
               )}
               <button onClick={() => handleToggleCertify(t.id)} className={`p-2 rounded-lg ${t.isCertified ? 'bg-slate-900 text-white' : 'bg-blue-50 text-blue-600'}`}>
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
               </button>
               <button onClick={() => handleDelete(t.id)} className="p-2 bg-red-50 text-red-600 rounded-lg">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
               </button>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden lg:block bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {processedTestimonials.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900 font-black border border-slate-200">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{t.name}</p>
                        <div className="scale-90 origin-left"><StarRating rating={t.rating} /></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                      t.status === TestimonialStatus.APPROVED ? 'bg-green-100 text-green-700' :
                      t.status === TestimonialStatus.PENDING ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleStatusChange(t.id, TestimonialStatus.APPROVED)} className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      </button>
                      <button onClick={() => handleToggleCertify(t.id)} className={`p-2 rounded-xl transition-all ${t.isCertified ? 'bg-slate-900 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(t.id)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
