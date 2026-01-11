
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
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<TestimonialStatus | 'all'>(TestimonialStatus.PENDING);
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (checkAuth()) {
      setIsAuth(true);
    }
  }, []);

  useEffect(() => {
    if (isAuth) {
      loadTestimonials();
    }
  }, [isAuth]);

  const loadTestimonials = async () => {
    setLoading(true);
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } finally {
      setLoading(false);
    }
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

  const handleStatusChange = async (id: string, status: TestimonialStatus) => {
    try {
      await updateTestimonialStatus(id, status);
      loadTestimonials();
    } catch (e) {
      alert('Erreur lors de la mise à jour du statut.');
    }
  };

  const handleToggleCertify = async (id: string, current: boolean) => {
    try {
      await toggleTestimonialCertification(id, current);
      loadTestimonials();
    } catch (e) {
      alert('Erreur lors de la certification.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer définitivement ce témoignage ?')) {
      try {
        await deleteTestimonial(id);
        loadTestimonials();
      } catch (e) {
        alert('Erreur lors de la suppression.');
      }
    }
  };

  const processedTestimonials = useMemo(() => {
    let result = filter === 'all' 
      ? [...testimonials] 
      : testimonials.filter(t => t.status === filter);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.name.toLowerCase().includes(q) || 
        t.message.toLowerCase().includes(q) ||
        (t.email && t.email.toLowerCase().includes(q))
      );
    }

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
  }, [testimonials, filter, sortBy, searchQuery]);

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
      <header className="flex flex-col xl:flex-row xl:items-end justify-between mb-8 gap-6">
        <div className="text-center xl:text-left">
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">Gestion des avis</h1>
          <p className="text-slate-500 text-xs md:text-lg">Modérez et certifiez les retours sur Supabase.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-grow sm:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input 
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
            {(['all', TestimonialStatus.PENDING, TestimonialStatus.APPROVED, TestimonialStatus.REJECTED] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 sm:flex-none px-4 py-2 whitespace-nowrap rounded-lg text-[9px] font-black uppercase transition-all ${
                  filter === f ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {f === 'all' ? 'Tous' : f === TestimonialStatus.PENDING ? 'En Attente' : f === TestimonialStatus.APPROVED ? 'Validés' : 'Refusés'}
              </button>
            ))}
          </div>

          <button 
            onClick={handleLogout} 
            className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center"
            title="Déconnexion"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
          </button>
        </div>
      </header>

      {loading && (
        <div className="flex items-center justify-center py-10">
          <div className="h-8 w-8 border-4 border-slate-900/10 border-t-slate-900 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Mobile view (Cards) */}
      {!loading && (
      <div className="xl:hidden space-y-4">
        {processedTestimonials.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-3xl">
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Aucun résultat</p>
          </div>
        ) : (
          processedTestimonials.map((t) => (
            <div key={t.id} className={`bg-white rounded-2xl p-5 shadow-sm border transition-all ${t.status === TestimonialStatus.PENDING ? 'border-amber-200 ring-2 ring-amber-50' : 'border-slate-100'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 font-bold border border-slate-100">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm leading-tight">{t.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{t.email || 'Pas d\'email'}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase ${
                  t.status === TestimonialStatus.APPROVED ? 'bg-green-100 text-green-700' :
                  t.status === TestimonialStatus.PENDING ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                }`}>
                  {t.status === TestimonialStatus.PENDING ? 'Attente' : t.status}
                </span>
              </div>
              
              <div className="mb-4">
                <div className="scale-75 origin-left mb-2">
                  <StarRating rating={t.rating} />
                </div>
                <p className="text-xs text-slate-600 italic line-clamp-4 bg-slate-50 p-3 rounded-xl border border-slate-100">"{t.message}"</p>
                <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-tight">
                  Posté le {new Date(t.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </p>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-slate-50">
                 {t.status !== TestimonialStatus.APPROVED && (
                    <button 
                      onClick={() => handleStatusChange(t.id, TestimonialStatus.APPROVED)} 
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-50 text-green-600 rounded-xl text-[10px] font-black uppercase hover:bg-green-600 hover:text-white transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      Approuver
                    </button>
                 )}
                 {t.status !== TestimonialStatus.REJECTED && t.status !== TestimonialStatus.APPROVED && (
                   <button 
                     onClick={() => handleStatusChange(t.id, TestimonialStatus.REJECTED)} 
                     className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                   </button>
                 )}
                 <button 
                  onClick={() => handleToggleCertify(t.id, !!t.isCertified)} 
                  className={`p-2.5 rounded-xl transition-all ${t.isCertified ? 'bg-slate-900 text-white' : 'bg-blue-50 text-blue-600'}`}
                  title={t.isCertified ? "Retirer la certification" : "Certifier cet avis"}
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438z" /></svg>
                 </button>
                 <button 
                  onClick={() => handleDelete(t.id)} 
                  className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                 </button>
              </div>
            </div>
          ))
        )}
      </div>
      )}

      {/* Desktop Table View */}
      {!loading && (
      <div className="hidden xl:block bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left table-fixed">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="w-[20%] px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                <th className="w-[35%] px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Témoignage</th>
                <th className="w-[12%] px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Note</th>
                <th className="w-[13%] px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="w-[20%] px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {processedTestimonials.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Aucun témoignage trouvé</p>
                  </td>
                </tr>
              ) : (
                processedTestimonials.map((t) => (
                  <tr 
                    key={t.id} 
                    className={`group transition-all hover:bg-slate-50/50 ${t.status === TestimonialStatus.PENDING ? 'bg-amber-50/30' : ''}`}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 h-11 w-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 font-black border border-slate-200 group-hover:bg-white group-hover:shadow-sm transition-all">
                          {t.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate pr-2">{t.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium truncate pr-2">{t.email || 'Email non fourni'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="bg-slate-50/50 rounded-xl p-3 border border-transparent group-hover:border-slate-100 group-hover:bg-white transition-all">
                        <p className="text-xs text-slate-600 italic line-clamp-2 leading-relaxed">"{t.message}"</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center scale-90">
                        <StarRating rating={t.rating} />
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                         <span className="text-xs font-bold text-slate-900">
                           {new Date(t.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                         </span>
                         <span className="text-[10px] text-slate-400 font-medium">
                           {new Date(t.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                         </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        {t.status !== TestimonialStatus.APPROVED && (
                          <button 
                            onClick={() => handleStatusChange(t.id, TestimonialStatus.APPROVED)} 
                            className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all text-[9px] font-black uppercase tracking-wider shadow-sm shadow-green-100/50"
                            title="Approuver et publier"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                            Valider
                          </button>
                        )}
                        {t.status === TestimonialStatus.APPROVED && (
                          <button 
                            onClick={() => handleStatusChange(t.id, TestimonialStatus.REJECTED)} 
                            className="px-3 py-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-200 hover:text-slate-600 transition-all text-[9px] font-black uppercase tracking-wider"
                            title="Retirer de la publication"
                          >
                            Retirer
                          </button>
                        )}
                        <button 
                          onClick={() => handleToggleCertify(t.id, !!t.isCertified)} 
                          className={`p-2 rounded-xl transition-all shadow-sm ${t.isCertified ? 'bg-slate-900 text-white shadow-slate-200' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white shadow-blue-50'}`}
                          title={t.isCertified ? "Enlever le badge certifié" : "Certifier ce témoignage"}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438z" /></svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(t.id)} 
                          className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm shadow-red-50"
                          title="Supprimer définitivement"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50 border-t border-slate-100 px-8 py-4">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            {processedTestimonials.length} Témoignage(s) sur Supabase
          </p>
        </div>
      </div>
      )}
    </div>
  );
};

export default AdminPage;
