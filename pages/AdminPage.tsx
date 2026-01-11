
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
    setIsLoggingIn(true);
    if (await login(password)) {
      setIsAuth(true);
      setPassword('');
    } else {
      alert('Mot de passe incorrect (adminadmin)');
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
    if (!window.confirm('Supprimer définitivement ?')) return;
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
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white p-10 rounded-[2rem] shadow-2xl border border-slate-100">
          <h2 className="text-2xl font-black text-slate-900 mb-8 text-center">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-center text-xl tracking-widest"
            />
            <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg">
              {isLoggingIn ? '...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Modération</h1>
          <p className="text-slate-500">Gérez les avis stockés sur Supabase.</p>
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Rechercher..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none"
          />
          {/* Fix: Changed logout() || setIsAuth(false) to explicit block as logout returns void */}
          <button onClick={() => { logout(); setIsAuth(false); }} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold">Quitter</button>
        </div>
      </header>

      <div className="flex bg-slate-100 p-1 rounded-xl mb-6 w-fit">
        {(['all', TestimonialStatus.PENDING, TestimonialStatus.APPROVED, TestimonialStatus.REJECTED] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${filter === f ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
          >
            {f === 'all' ? 'Tous' : f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">Synchronisation...</div>
      ) : (
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-6">Client</th>
                  <th className="px-8 py-6">Message</th>
                  <th className="px-8 py-6">Note</th>
                  <th className="px-8 py-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {processedTestimonials.map((t) => (
                  <tr key={t.id} className={t.status === TestimonialStatus.PENDING ? 'bg-amber-50/30' : ''}>
                    <td className="px-8 py-6">
                      <div className="font-bold text-slate-900">{t.name}</div>
                      <div className="text-[10px] text-slate-400">{t.email}</div>
                    </td>
                    <td className="px-8 py-6 text-xs text-slate-600 italic">"{t.message}"</td>
                    <td className="px-8 py-6"><StarRating rating={t.rating} /></td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex gap-2 justify-end">
                        {t.status !== TestimonialStatus.APPROVED && (
                          <button onClick={() => handleStatusChange(t.id, TestimonialStatus.APPROVED)} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></button>
                        )}
                        <button onClick={() => handleToggleCertify(t.id, !!t.is_certified)} className={`p-2 rounded-lg transition-all ${t.is_certified ? 'bg-slate-900 text-white' : 'bg-blue-50 text-blue-600'}`}><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438z" /></svg></button>
                        <button onClick={() => handleDelete(t.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
