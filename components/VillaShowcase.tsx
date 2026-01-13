import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Villa } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface VillaShowcaseProps {
    onNavigate: (view: 'home' | 'villa', slug?: string) => void;
    villas: Villa[];
}

export const VillaShowcase: React.FC<VillaShowcaseProps> = ({ onNavigate, villas }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      ScrollTrigger.matchMedia({
        // Desktop: Horizontal Scroll
        "(min-width: 768px)": function() {
          const getScrollAmount = () => {
            let trackWidth = track.scrollWidth;
            return -(trackWidth - window.innerWidth);
          };

          gsap.to(track, {
            x: getScrollAmount,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: () => `+=${Math.abs(getScrollAmount()) + 500}`, 
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            }
          });
        },
        // Mobile: No pinning, just natural scroll
        "(max-width: 767px)": function() {
            gsap.utils.toArray('.mobile-card').forEach((card: any) => {
                gsap.from(card, {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                    }
                })
            });
        }
      });
      
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const formatPrice = (price: number) => {
     return (price / 1000000).toFixed(1) + 'M IDR';
  };

  return (
    <>
        <section ref={containerRef} className="relative w-full bg-canvas z-10 flex flex-col justify-center py-20 md:py-0 md:h-screen">
            
            <div className="md:absolute top-0 md:top-12 left-6 md:left-24 z-10 mb-12 md:mb-0">
                <h2 className="font-serif text-4xl md:text-5xl text-ink">The Collection</h2>
                <div className="h-1 w-20 bg-ink mt-2"></div>
            </div>

            <div ref={trackRef} className="flex flex-col md:flex-row gap-8 md:gap-24 px-6 md:px-24 md:w-max items-center md:h-[70vh]">
                {villas.map((villa) => (
                    <div 
                        key={villa.id} 
                        className="mobile-card group relative flex-shrink-0 w-full md:w-[400px] h-[500px] md:h-[600px] flex flex-col cursor-pointer mb-8 md:mb-0"
                        onClick={() => onNavigate('villa', villa.slug)}
                    >
                        <div className="relative w-full h-4/5 overflow-hidden border border-ink bg-ink/10">
                            <img 
                                src={villa.imageUrl} 
                                alt={villa.name}
                                className="w-full h-full object-cover grayscale md:grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-in-out"
                            />
                            <div className="absolute top-4 right-4 bg-ink text-canvas px-3 py-1 font-sans text-xs tracking-wider">
                                {formatPrice(villa.pricePerNight)} / night
                            </div>
                        </div>

                        <div className="mt-6 flex justify-between items-end border-t border-ink/20 pt-4 group-hover:border-ink transition-colors duration-500">
                            <div>
                                <h3 className="font-serif text-2xl text-ink group-hover:text-terrace transition-colors">
                                    {villa.name}
                                </h3>
                                <p className="font-sans text-xs text-ink/60 mt-1 max-w-[250px] line-clamp-2">
                                    {villa.description}
                                </p>
                            </div>
                            <span className="font-sans text-[10px] uppercase tracking-widest border-b border-transparent group-hover:border-ink pb-1 transition-all">
                                View Details
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="hidden md:block absolute bottom-12 right-12 z-10 animate-pulse">
                <span className="font-sans text-[10px] uppercase tracking-widest text-ink">Scroll Down &rarr;</span>
            </div>
        </section>
    </>
  );
};