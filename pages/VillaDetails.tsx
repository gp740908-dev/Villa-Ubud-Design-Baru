import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { Villa } from '../types';
import { VillaDetails as VillaDetailsView } from '../components/VillaDetails';

export const VillaDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [villa, setVilla] = useState<Villa | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVilla = async () => {
      if (!slug) return;
      try {
        const { data, error } = await supabase
          .from('villas')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error || !data) {
          console.warn('Villa not found or error:', error);
          navigate('/404');
          return;
        }

        // Map snake_case from DB to camelCase for the app
        const mappedVilla: Villa = {
            ...data,
            pricePerNight: data.price_per_night ?? data.pricePerNight,
            imageUrl: data.image_url ?? data.imageUrl,
            longDescription: data.long_description ?? data.longDescription,
            specs: data.specs || {},
            location: data.location || { lat: 0, lng: 0 }
        };

        setVilla(mappedVilla);
      } catch (err) {
        console.error(err);
        navigate('/404');
      } finally {
        setLoading(false);
      }
    };

    fetchVilla();
  }, [slug, navigate]);

  const handleNavigate = (view: 'home' | 'villa' | '404', s?: string) => {
    if (view === 'home') navigate('/');
    else if (view === 'villa' && s) navigate(`/villa/${s}`);
    else if (view === '404') navigate('/404');
  };

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-canvas text-ink uppercase tracking-widest text-xs animate-pulse">
        Loading Sanctuary...
    </div>
  );

  if (!villa) return null;

  return (
    <>
      <Helmet>
        <title>{villa.name} | StayinUBUD</title>
        <meta name="description" content={villa.description} />
      </Helmet>
      <VillaDetailsView 
        slug={slug || ''} 
        onNavigate={handleNavigate} 
        allVillas={[villa]} 
      />
    </>
  );
};