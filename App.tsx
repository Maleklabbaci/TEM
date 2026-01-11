
import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import ClientsPage from './pages/ClientsPage.tsx';
import SubmitPage from './pages/SubmitPage.tsx';
import AdminPage from './pages/AdminPage.tsx';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<ClientsPage />} />
            <Route path="/ecrire" element={<SubmitPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-slate-200 py-10">
          <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-2">
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} iVision Témoignages. Tous droits réservés.
            </p>
            <Link 
              to="/admin" 
              className="text-[10px] text-slate-100 hover:text-slate-300 transition-colors duration-500 select-none"
              title="Accès restreint"
            >
              Administration
            </Link>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
