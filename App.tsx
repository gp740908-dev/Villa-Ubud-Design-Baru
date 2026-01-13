import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { Narrative } from './components/Narrative';
import { VillaShowcase } from './components/VillaShowcase';
import { AtmosphericVideo } from './components/AtmosphericVideo';
import { Amenities } from './components/Amenities';
import { ParallaxBreak } from './components/ParallaxBreak';
import { LifestyleGallery } from './components/LifestyleGallery';
import { CTA } from './components/CTA';
import { VillaDetails } from './components/VillaDetails';
import { Contact } from './components/Contact';
import { Locations } from './components/Locations';
import { Experience } from './components/Experience';
import { Journal } from './components/Journal';
import { JournalPost } from './components/JournalPost';
import { NotFound } from './components/NotFound';
import { supabase } from './lib/supabase';
import { Villa } from './types';
import { VILLAS as STATIC_VILLAS } from './constants';

type ViewState = 'home' | 'villa' | 'contact' | 'journal' | 'journal-post' | '404';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [activeSlug, setActiveSlug] = useState<string>('');
  const [villas, setVillas] = useState<Villa[]>(STATIC_VILLAS);

  useEffect(() => {
    const fetchVillas = async () => {
      // Fetch villas from Supabase. If table doesn't exist or is empty, fall back to static data
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

  const handleNavigate = (newView: ViewState | 'home', slug?: string) => {
    // Cast strict type for compatibility
    const targetView = newView as ViewState;
    
    if ((targetView === 'villa' || targetView === 'journal-post') && slug) {
        setActiveSlug(slug);
    }
    setView(targetView);
    window.scrollTo(0, 0);
  };

  // 404 Page is standalone (No Navbar/Footer)
  if (view === '404') {
    return <NotFound onNavigate={handleNavigate} />;
  }

  return (
    <Layout onNavigate={handleNavigate}>
      {view === 'home' && (
        <div className="flex flex-col w-full overflow-hidden">
          <Hero />
          <Narrative />
          {/* Pass dynamic villas to Showcase to ensure slugs match Details page */}
          <VillaShowcase onNavigate={handleNavigate} villas={villas} />
          <AtmosphericVideo />
          <Amenities />
          <ParallaxBreak />
          <LifestyleGallery />
          <Experience />
          <Locations onNavigate={handleNavigate} villas={villas} /> 
          <CTA />
        </div>
      )}

      {view === 'villa' && activeSlug && (
        <VillaDetails slug={activeSlug} onNavigate={handleNavigate} allVillas={villas} />
      )}

      {view === 'contact' && (
        <Contact villas={villas} />
      )}

      {view === 'journal' && (
        <Journal onNavigate={handleNavigate} />
      )}

      {view === 'journal-post' && activeSlug && (
        <JournalPost slug={activeSlug} onNavigate={handleNavigate} />
      )}
    </Layout>
  );
};

export default App;