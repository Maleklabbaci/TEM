
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ActionModal from './ActionModal';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Avis', path: '/' },
    { name: 'Écrire', path: '/ecrire' },
  ];

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between h-14 md:h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-xl md:text-2xl font-black bg-slate-900 text-white px-3 py-1 rounded-lg hover:opacity-90 transition-opacity"
              >
                iV
              </button>
            </div>
            <div className="hidden sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold tracking-tight transition-all duration-200 ${
                    isActive(link.path)
                      ? 'border-blue-600 text-slate-900'
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {link.name === 'Avis' ? 'Nos clients' : 'Écrire un témoignage'}
                </Link>
              ))}
            </div>
            {/* Mobile menu links compact */}
            <div className="flex sm:hidden space-x-5">
               {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-[10px] font-black uppercase tracking-[0.1em] transition-colors ${
                    isActive(link.path) ? 'text-blue-600' : 'text-slate-400'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
      
      <ActionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;
