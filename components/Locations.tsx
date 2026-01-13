import React from 'react';
import { MapComponent } from './MapComponent';
import { Villa } from '../types';

interface LocationsProps {
    onNavigate: (view: 'home' | 'villa', slug?: string) => void;
    villas: Villa[];
}

export const Locations: React.FC<LocationsProps> = ({ onNavigate, villas }) => {
  return (
    <section className="relative py-20 md:py-32 px-6 md:px-24 bg-canvas z-10">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12">
        <div>
            <span className="font-sans text-xs uppercase tracking-widest text-matcha mb-2 block">Discovery</span>
            <h2 className="font-serif text-4xl md:text-5xl text-ink">Our Locations</h2>
        </div>
        <p className="font-sans text-xs md:text-sm text-ink/70 max-w-md mt-4 md:mt-0 text-right">
            Scattered across the most spiritual ridges of Ubud. <br/>Hidden from the world, yet connected to the soul of Bali.
        </p>
      </div>

      <div className="w-full h-[50vh] md:h-[60vh] border border-ink rounded-lg overflow-hidden relative">
        <MapComponent 
            villas={villas} 
            onMarkerClick={(slug) => onNavigate('villa', slug)}
        />
      </div>
    </section>
  );
};