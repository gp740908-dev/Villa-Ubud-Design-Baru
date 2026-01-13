import React from 'react';
import { PHONE_NUMBER } from '../constants';

export const CTA: React.FC = () => {
  return (
    <section className="relative py-32 md:py-48 px-6 bg-canvas z-10 flex flex-col items-center justify-center text-center border-t border-ink/5">
      <h2 className="font-serif text-5xl md:text-8xl text-ink mb-8 leading-tight">
        Your Sanctuary <br/> Awaits.
      </h2>
      <a 
        href={`https://wa.me/${PHONE_NUMBER}`}
        target="_blank"
        rel="noreferrer"
        className="group relative inline-flex items-center justify-center overflow-hidden rounded-none px-8 py-4 md:px-12 md:py-6 border border-ink transition-all duration-300 hover:bg-ink"
      >
        <span className="font-sans text-xs md:text-sm uppercase tracking-widest text-ink group-hover:text-canvas transition-colors relative z-10">
          Book Your Stay
        </span>
      </a>
      <p className="mt-6 font-sans text-[10px] md:text-xs uppercase tracking-widest text-ink/50">
        Direct Booking via WhatsApp
      </p>
    </section>
  );
};