import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, Navigate, useParams } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { VillaDetails } from './pages/VillaDetails';
import { Contact } from './components/Contact';
import { Journal } from './components/Journal';
import { JournalPost } from './components/JournalPost';
import { NotFound } from './components/NotFound';
import { supabase } from './lib/supabase';
import { Villa } from './types';
import { VILLAS as STATIC_VILLAS } from './constants';

// Wrapper for JournalPost to handle params since the component expects a slug prop
const JournalPostWrapper: React.FC<{ onNavigate: any }> = ({ onNavigate }) => {
    const { slug } = useParams<{ slug: string }>();
    if (!slug) return <Navigate to="/404" replace />;
    return <JournalPost slug={slug} onNavigate={onNavigate} />;
}

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const [villas, setVillas] = useState<Villa[]>(STATIC_VILLAS);

  useEffect(() => {
    const fetchVillas = async () => {
      try {
        const { data, error } = await supabase.from('villas').select('*');
        if (!error && data && data.length > 0) {
            setVillas(data);
        }
      } catch (e) {
        console.warn('Using static villa data');
      }
    };
    fetchVillas();
  }, []);

  // Adapter function to maintain compatibility with existing components that expect onNavigate
  const handleNavigate = (view: 'home' | 'villa' | 'contact' | 'journal' | 'journal-post' | '404', slug?: string) => {
    window.scrollTo(0, 0);
    switch (view) {
        case 'home':
            navigate('/');
            break;
        case 'villa':
            if (slug) navigate(`/villa/${slug}`);
            else navigate('/');
            break;
        case 'contact':
            navigate('/contact');
            break;
        case 'journal':
            navigate('/journal');
            break;
        case 'journal-post':
            if (slug) navigate(`/journal/${slug}`);
            else navigate('/journal');
            break;
        case '404':
            navigate('/404');
            break;
        default:
            navigate('/');
    }
  };

  return (
    <Layout onNavigate={handleNavigate}>
      <Routes>
        <Route path="/" element={<Home villas={villas} onNavigate={handleNavigate} />} />
        <Route path="/villa/:slug" element={<VillaDetails />} />
        <Route path="/contact" element={<Contact villas={villas} />} />
        <Route path="/journal" element={<Journal onNavigate={handleNavigate} />} />
        <Route path="/journal/:slug" element={<JournalPostWrapper onNavigate={handleNavigate} />} />
        <Route path="/404" element={<NotFound onNavigate={handleNavigate} />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </HelmetProvider>
  );
};

export default App;