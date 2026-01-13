import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Experience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
        // Parallax for image
        gsap.to(imgRef.current, {
            yPercent: 15,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
        
        // Fade in for text
        gsap.from(textRef.current, {
            y: 50,
            opacity: 0,
            duration: 1,
            scrollTrigger: {
                trigger: textRef.current,
                start: "top 80%",
            }
        });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative py-20 md:py-40 px-6 md:px-0 bg-canvas z-10 flex flex-col md:flex-row overflow-hidden">
      {/* Left: Image (60%) */}
      <div className="w-full md:w-[60%] h-[50vh] md:h-[80vh] overflow-hidden relative order-2 md:order-1 mt-10 md:mt-0">
        <img 
            ref={imgRef}
            src="https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2070&auto=format&fit=crop"
            alt="Ubud Rice Terraces"
            className="w-full h-[120%] object-cover object-center -mt-10"
        />
      </div>

      {/* Right: Text (40%) */}
      <div ref={textRef} className="w-full md:w-[40%] flex flex-col justify-center px-6 md:px-20 order-1 md:order-2">
        <span className="font-sans text-xs uppercase tracking-widest text-matcha mb-4">The Location</span>
        <h2 className="font-serif text-4xl md:text-6xl text-ink leading-none mb-8">
            Ubud,<br/>The Soul of Bali.
        </h2>
        <p className="font-sans text-sm md:text-base text-ink/70 leading-relaxed mb-8">
            Away from the beach clubs and traffic. Our estates are located in the spiritual heart of the island. 
            Rice terraces, ancient temples, and dense rainforests surround you. 
        </p>
        <p className="font-sans text-sm md:text-base text-ink/70 leading-relaxed">
            This is not just a vacation rental. It's a return to nature, designed for the uncompromising traveler.
        </p>
        
        <div className="mt-12">
            <a href="#" className="font-serif text-lg text-ink border-b border-ink pb-1 hover:text-terrace hover:border-terrace transition-all">
                Explore the Map
            </a>
        </div>
      </div>
    </section>
  );
};