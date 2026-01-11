
import React, { useState, useEffect, useMemo } from 'react';
import { getTestimonials, updateTestimonialStatus, deleteTestimonial, toggleTestimonialCertification } from '../services/storage.ts';
import { login, logout, isAuthenticated as checkAuth } from '../services/auth.ts';
import { Testimonial, TestimonialStatus } from '../types.ts';
import StarRating from '../components/StarRating.tsx';

const AdminPage: React.FC = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<TestimonialStatus | 'all'>(TestimonialStatus.PENDING);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (checkAuth()) setIsAuth(true);
  }, []);

  useEffect(() => {
    if (isAuth) loadTestimonials();
  }, [isAuth]);

  const loadTestimonials = async () => {
    setLoading(true);
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (err: any) {
      alert(`Erreur de chargement : ${err.message}`);
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
      alert('Accès refusé. Mot de passe incorrect.');
    }
    setIsLoggingIn(false);
  };

  const handleStatusChange = async (id: string, status: TestimonialStatus) => {
    try {
      await updateTestimonialStatus(id, status);
      await loadTestimonials();
    } catch (err: any) {
      alert(`Erreur status : ${err.message}`);
    }
  };

  const handleToggleCertify = async (id: string, current: boolean) => {
    try {
      await toggleTestimonialCertification(id, current);
      await loadTestimonials();
    } catch (err: any) {
      alert(`Erreur certification : ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet avis ?')) return;
    try {
      await deleteTestimonial(id);
      await loadTestimonials();
    } catch (err: any) {
      alert(`Erreur suppression : ${err.message}`);
    }
  };

  const processedTestimonials = useMemo(() => {
    let result = filter === 'all' ? [...testimonials] : testimonials.filter(t => t.status === filter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => t.name.toLowerCase().includes(q) || t.message.toLowerCase().includes(q));
    }
    return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [testimonials, filter, searchQuery]);

  if (!isAuth) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 animate-fade-in-up">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-8 text-white shadow-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2 text-center">Espace Admin</h2>
          <p className="text-slate-400 text-center mb-10 text-sm font-medium">Authentification via Supabase</p>
          
          <form onSubmit={handleLogin} className="w-full space-y-6">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-center text-xl tracking-widest focus:ring-4 focus:ring-slate-900/5 transition-all"
              autoFocus
            />
            <button 
              disabled={isLoggingIn}
              type="submit" 
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold shadow-xl hover:bg-black transition-all active:scale-95 flex items-center justify-center"
            >
              {isLoggingIn ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Vérification...</span>
                </div>
              ) : 'Accéder au panel'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Panneau de Modération</h1>
          <p className="text-slate-500 font-medium">Gérez vos retours clients en temps réel sur Supabase.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
             <input 
              type="text" 
              placeholder="Filtrer..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm outline-none w-48 focus:w-64 transition-all focus:ring-4 focus:ring-blue-500/5"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button 
            onClick={() => { logout(); setIsAuth(false); }} 
            className="px-6 py-3 bg-red-50 text-red-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm"
          >
            Déconnexion
          </button>
        </div>
      </header>

      <div className="flex bg-slate-200/50 p-1.5 rounded-2xl mb-10 w-fit">
        {(['all', TestimonialStatus.PENDING, TestimonialStatus.APPROVED, TestimonialStatus.REJECTED] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all tracking-widest ${
              filter === f ? 'bg-white shadow-md text-slate-900' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {f === 'all' ? 'Tous' : f === 'pending' ? 'À valider' : f === 'approved' ? 'Publiés' : 'Refusés'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center gap-4">
           <div className="h-12 w-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
           <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Mise à jour...</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Avis</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Note</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {processedTestimonials.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-slate-300 font-medium italic">Aucun avis trouvé dans cette catégorie.</td>
                  </tr>
                ) : (
                  processedTestimonials.map((t) => (
                    <tr key={t.id} className={`transition-colors hover:bg-slate-50/50 ${t.status === TestimonialStatus.PENDING ? 'bg-blue-50/30' : ''}`}>
                      <td className="px-8 py-7">
                        <div className="font-bold text-slate-900 text-base">{t.name}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{t.email || 'Pas d\'email'}</div>
                      </td>
                      <td className="px-8 py-7">
                        <div className="max-w-md">
                          <p className="text-sm text-slate-600 italic leading-relaxed">"{t.message}"</p>
                          <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-tighter">Posté le {new Date(t.created_at).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="px-8 py-7">
                        <div className="flex justify-center scale-90"><StarRating rating={t.rating} /></div>
                      </td>
                      <td className="px-8 py-7">
                        <div className="flex gap-2 justify-end">
                          {t.status !== TestimonialStatus.APPROVED && (
                            <button 
                              onClick={() => handleStatusChange(t.id, TestimonialStatus.APPROVED)} 
                              className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                              title="Approuver"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </button>
                          )}
                          {t.status === TestimonialStatus.APPROVED && (
                            <button 
                              onClick={() => handleStatusChange(t.id, TestimonialStatus.REJECTED)} 
                              className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-200 transition-all shadow-sm"
                              title="Retirer"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          )}
                          <button 
                            onClick={() => handleToggleCertify(t.id, !!t.is_certified)} 
                            className={`p-3 rounded-xl transition-all shadow-sm ${t.is_certified ? 'bg-slate-900 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
                            title="Certifier"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438z" /></svg>
                          </button>
                          <button 
                            onClick={() => handleDelete(t.id)} 
                            className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                            title="Supprimer"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
