import React from 'react';
import { Hero } from '../components/Hero';
import { Narrative } from '../components/Narrative';
import { VillaShowcase } from '../components/VillaShowcase';
import { AtmosphericVideo } from '../components/AtmosphericVideo';
import { Amenities } from '../components/Amenities';
import { ParallaxBreak } from '../components/ParallaxBreak';
import { LifestyleGallery } from '../components/LifestyleGallery';
import { Experience } from '../components/Experience';
import { Locations } from '../components/Locations';
import { CTA } from '../components/CTA';
import { Villa } from '../types';

interface HomeProps {
  villas: Villa[];
  onNavigate: (view: 'home' | 'villa' | 'contact', slug?: string) => void;
}

export const Home: React.FC<HomeProps> = ({ villas, onNavigate }) => {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      <Hero />
      <Narrative />
      <VillaShowcase onNavigate={onNavigate} villas={villas} />
      <AtmosphericVideo />
      <Amenities />
      <ParallaxBreak />
      <LifestyleGallery />
      <Experience />
      <Locations onNavigate={onNavigate} villas={villas} /> 
      <CTA />
    </div>
  );
};