import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const ParallaxBreak: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Heavy Parallax on Image
      gsap.fromTo(imageRef.current, 
        { yPercent: -20 },
        {
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        }
      );

      // 2. Text Reveal
      gsap.from(textRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.5,
        scrollTrigger: {
            trigger: containerRef.current,
            start: "center 70%",
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-screen overflow-hidden flex items-center justify-center z-10">
      <div className="absolute inset-0 w-full h-[140%] -top-[20%]">
        <img 
            ref={imageRef}
            src="https://images.unsplash.com/photo-1537956965359-7573183d1f57?q=80&w=2538&auto=format&fit=crop"
            alt="Bali Rice Terrace"
            className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/20"></div>
      </div>

      <div ref={textRef} className="relative z-10 text-center px-6">
        <h2 className="font-serif text-6xl md:text-9xl text-canvas drop-shadow-lg mix-blend-overlay">
            Breathe.
        </h2>
      </div>
    </section>
  );
};