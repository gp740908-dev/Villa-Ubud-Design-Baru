import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Text Reveal Animation (Load)
      const chars = textRef.current?.querySelectorAll('.char');
      if (chars) {
        gsap.from(chars, {
          y: 100,
          opacity: 0,
          duration: 1.5,
          stagger: 0.05,
          ease: "power4.out",
          delay: 0.5
        });
      }

      // 2. Parallax Background (Scroll)
      gsap.to(imgRef.current, {
        yPercent: 30, // Moves down slower than scroll
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
      
      // 3. Text Parallax (Scroll - faster)
      gsap.to(textRef.current, {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const headline = "StayinUBUD";

  return (
    <section ref={containerRef} className="relative h-[100vh] w-full overflow-hidden flex items-center justify-center">
      {/* Background Image/Video */}
      <div className="absolute inset-0 z-0">
        <img 
          ref={imgRef}
          src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2538&auto=format&fit=crop" 
          alt="Bali Jungle" 
          className="w-full h-[120%] object-cover object-center -mt-10 opacity-80"
        />
        <div className="absolute inset-0 bg-canvas/30 mix-blend-multiply" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 overflow-hidden px-4">
        <h1 ref={textRef} className="font-serif text-[18vw] md:text-[15vw] leading-[0.85] text-ink mix-blend-hard-light flex justify-center">
          {headline.split('').map((char, i) => (
            <span key={i} className="char inline-block origin-bottom">
              {char}
            </span>
          ))}
        </h1>
      </div>
      
      <div className="absolute bottom-10 left-6 md:left-12 z-20">
        <p className="font-sans text-[10px] md:text-xs tracking-widest text-ink uppercase max-w-[200px] border-l border-ink pl-4">
            Curated sanctuary for the modern executive.
        </p>
      </div>
    </section>
  );
};