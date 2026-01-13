import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const AtmosphericVideo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
        // Subtle Zoom (Ken Burns)
        gsap.to(videoRef.current, {
            scale: 1.1,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
            }
        });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-[60vh] overflow-hidden bg-ink flex items-center justify-center">
       {/* Simulated Video Loop (using high res image with scale animation) */}
       <div ref={videoRef} className="absolute inset-0 w-full h-full">
            <img 
                src="https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=2574&auto=format&fit=crop" 
                alt="Rainforest Texture" 
                className="w-full h-full object-cover opacity-60"
            />
       </div>
       
       <div className="relative z-10 text-center mix-blend-soft-light">
            <p className="font-serif text-3xl md:text-5xl text-canvas italic tracking-wide opacity-90">
                "The sound of silence."
            </p>
       </div>
    </section>
  );
};