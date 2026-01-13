import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface NotFoundProps {
  onNavigate: (view: 'home' | 'villa' | 'contact', slug?: string) => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const compassRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Floating 404 "Breathing" Animation
      gsap.to(textRef.current, {
        y: -30,
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });

      // 2. Mouse Spotlight Logic
      // We use quickTo for performance optimization on mouse movement
      const xTo = gsap.quickTo(spotlightRef.current, "x", { duration: 0.6, ease: "power3" });
      const yTo = gsap.quickTo(spotlightRef.current, "y", { duration: 0.6, ease: "power3" });

      const handleMouseMove = (e: MouseEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
      };

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleMouseEnterCompass = () => {
    gsap.to(compassRef.current, { rotation: 360, duration: 0.8, ease: "back.out(1.7)" });
  };

  const handleMouseLeaveCompass = () => {
    gsap.to(compassRef.current, { rotation: 0, duration: 0.8, ease: "power2.out" });
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-ink text-canvas overflow-hidden flex flex-col items-center justify-center cursor-none md:cursor-default selection:bg-canvas selection:text-ink">
      
      {/* Spotlight Effect */}
      <div 
        ref={spotlightRef} 
        className="fixed top-0 left-0 w-[500px] h-[500px] bg-canvas/5 blur-[100px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0 mix-blend-overlay"
      />

      {/* Big 404 Typography */}
      <h1 
        ref={textRef} 
        className="absolute z-0 font-serif italic text-[35vw] leading-none opacity-5 select-none pointer-events-none"
        style={{ 
            color: 'transparent', 
            WebkitTextStroke: '1px #D3D49F' 
        }}
      >
        404
      </h1>

      {/* Content Container */}
      <div className="relative z-10 text-center px-6 max-w-2xl flex flex-col items-center">
        <span className="font-sans text-xs uppercase tracking-[0.3em] text-canvas/60 mb-8 block border-b border-canvas/20 pb-2">Error 404</span>
        
        <h2 className="font-serif text-5xl md:text-7xl mb-6 text-canvas">
            Off the beaten path?
        </h2>
        
        <p className="font-sans text-sm md:text-base leading-relaxed opacity-80 mb-16 max-w-md mx-auto">
            Even in paradise, some paths remain uncharted. <br className="hidden md:block"/>
            Let us guide you back to serenity.
        </p>

        {/* The Compass Button (Rescue) */}
        <button 
            onClick={() => onNavigate('home')}
            onMouseEnter={handleMouseEnterCompass}
            onMouseLeave={handleMouseLeaveCompass}
            className="group relative inline-flex items-center gap-4 px-10 py-5 border border-canvas/50 rounded-full hover:bg-canvas hover:text-ink transition-all duration-500 mb-12"
        >
            <span className="font-sans text-xs uppercase tracking-widest font-bold z-10">Return to Sanctuary</span>
            <div ref={compassRef} className="w-5 h-5 z-10">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/>
                </svg>
            </div>
        </button>

        {/* Secondary Navigation */}
        <div className="flex gap-8 justify-center font-sans text-[10px] uppercase tracking-widest opacity-50">
            <button 
                onClick={() => onNavigate('home')} 
                className="hover:text-canvas hover:opacity-100 transition-all border-b border-transparent hover:border-canvas pb-1"
            >
                View Villas
            </button>
            <button 
                onClick={() => onNavigate('contact')} 
                className="hover:text-canvas hover:opacity-100 transition-all border-b border-transparent hover:border-canvas pb-1"
            >
                Contact Concierge
            </button>
        </div>
      </div>
      
    </div>
  );
};