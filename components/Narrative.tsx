import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Narrative: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
        // Parallax the image
        gsap.to(imageRef.current, {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
            }
        });

        // Slide the text block up slightly faster
        gsap.from(textBlockRef.current, {
            y: 100,
            opacity: 0,
            duration: 1,
            scrollTrigger: {
                trigger: textBlockRef.current,
                start: "top 85%",
            }
        });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative py-24 md:py-48 px-6 md:px-0 bg-canvas z-10 overflow-hidden">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 items-center">
        
        {/* LEFT: Tall Vertical Image */}
        <div className="md:col-span-7 relative h-[600px] md:h-[900px] overflow-hidden w-full">
            <img 
                ref={imageRef}
                src="https://images.unsplash.com/photo-1552853842-5a525f75e28f?q=80&w=2664&auto=format&fit=crop" 
                alt="Jungle Depth" 
                className="absolute inset-0 w-full h-[120%] object-cover object-center -mt-12"
            />
        </div>

        {/* RIGHT: Overlapping Text Block */}
        <div 
            ref={textBlockRef}
            className="md:col-span-5 relative z-10 bg-ink text-canvas p-12 md:p-20 -mt-20 md:mt-0 md:-ml-32 shadow-2xl"
        >
            <span className="font-sans text-xs uppercase tracking-widest text-matcha mb-4 block">The Philosophy</span>
            <h2 className="font-serif text-4xl md:text-6xl leading-tight mb-8">
                Escape to <br/> Paradise.
            </h2>
            <p className="font-sans text-sm md:text-base leading-relaxed opacity-80 mb-8">
                We believe that true luxury is the absence of noise. In a world that never stops, StayinUBUD offers a rare pause. 
                Nestled deep within the Ayung River valley, our estates are not just buildings; they are observation decks for nature's greatest performances.
            </p>
            <p className="font-sans text-sm md:text-base leading-relaxed opacity-80 mb-12">
                Wake up to the mist rolling over the canopy. Sleep to the symphony of the jungle. This is Bali, unfiltered.
            </p>
            <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-matcha"></div>
                <span className="font-serif italic text-lg text-matcha">Discover Silence</span>
            </div>
        </div>

      </div>
    </section>
  );
};