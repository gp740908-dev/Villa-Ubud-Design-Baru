import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Footer: React.FC = () => {
  const footerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
        // Parallax Effect: As the footer is revealed, move content slightly to create depth
        // Since footer is fixed, we trigger based on the scroll position relative to the document end
        
        gsap.fromTo(contentRef.current, 
            { y: -100 },
            { 
                y: 0, 
                ease: "none",
                scrollTrigger: {
                    trigger: "main", // The main content wrapper
                    start: "bottom bottom", // When bottom of main hits bottom of viewport
                    end: "+=100%", // Scroll distance equal to viewport height (approx footer height)
                    scrub: true,
                }
            }
        );

        // Watermark moves slower
        gsap.fromTo(watermarkRef.current,
            { y: 50 },
            {
                y: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: "main",
                    start: "bottom bottom",
                    scrub: true
                }
            }
        );

    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="fixed bottom-0 left-0 w-full h-[85vh] bg-ink text-canvas -z-10 overflow-hidden flex flex-col">
      
      {/* Parallax Container */}
      <div ref={contentRef} className="flex-grow flex flex-col justify-between p-8 md:p-12 lg:p-20 relative z-10 h-full">
        
        {/* 1. The Hook (Top) */}
        <div className="flex flex-col items-center justify-center flex-grow py-12">
            <h2 ref={titleRef} className="font-serif text-5xl md:text-8xl lg:text-9xl text-center leading-[0.9] mb-8">
                Ready to <br />
                <span className="italic text-matcha">Escape?</span>
            </h2>
            <button className="group relative px-8 py-3 overflow-hidden border border-canvas rounded-full transition-all duration-300 hover:bg-canvas hover:text-ink hover:scale-105">
                <span className="relative z-10 font-sans text-sm uppercase tracking-widest font-semibold">Book Your Stay</span>
            </button>
        </div>

        {/* 2. Middle Grid (Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-t border-canvas/20 pt-12 mb-24">
            
            {/* Col 1: Brand */}
            <div className="flex flex-col gap-4">
                <h3 className="font-serif text-2xl font-bold">StayinUBUD</h3>
                <p className="font-sans text-xs opacity-70 leading-relaxed max-w-[200px]">
                    Jl. Raya Sayan No. 12<br/>
                    Ubud, Bali 80571<br/>
                    Indonesia
                </p>
            </div>

            {/* Col 2: Explore */}
            <div className="flex flex-col gap-3">
                <h4 className="font-sans text-[10px] uppercase tracking-widest text-matcha mb-2">Explore</h4>
                {['Home', 'The Villas', 'Experience', 'Concierge'].map(item => (
                    <a key={item} href="#" className="font-sans text-xs uppercase tracking-widest hover:text-matcha transition-colors w-max">
                        {item}
                    </a>
                ))}
            </div>

            {/* Col 3: Socials */}
            <div className="flex flex-col gap-3">
                <h4 className="font-sans text-[10px] uppercase tracking-widest text-matcha mb-2">Connect</h4>
                {['Instagram', 'TikTok', 'WhatsApp', 'Email'].map(item => (
                    <a key={item} href="#" className="font-sans text-xs uppercase tracking-widest hover:text-matcha transition-colors w-max">
                        {item}
                    </a>
                ))}
            </div>

            {/* Col 4: Newsletter */}
            <div className="flex flex-col gap-4">
                <h4 className="font-sans text-[10px] uppercase tracking-widest text-matcha">The List</h4>
                <div className="flex items-end gap-2 border-b border-canvas/30 pb-2 focus-within:border-canvas transition-colors">
                    <input 
                        type="email" 
                        placeholder="Join the waitlist" 
                        className="bg-transparent border-none outline-none text-sm placeholder:text-canvas/30 w-full font-serif"
                    />
                    <button className="text-xs uppercase hover:text-matcha">&rarr;</button>
                </div>
            </div>
        </div>

        {/* 3. Bottom Legal */}
        <div className="flex justify-between items-center opacity-40 font-sans text-[10px] uppercase tracking-widest">
            <p>&copy; {new Date().getFullYear()} StayinUBUD</p>
            <div className="flex gap-4">
                <a href="#" className="hover:text-matcha">Privacy</a>
                <a href="#" className="hover:text-matcha">Terms</a>
            </div>
        </div>
      </div>

      {/* Background Watermark */}
      <div ref={watermarkRef} className="absolute bottom-0 left-0 w-full flex justify-center pointer-events-none select-none overflow-hidden">
        <span className="font-serif text-[20vw] leading-none text-canvas opacity-[0.03] whitespace-nowrap">
            STAYINUBUD
        </span>
      </div>

    </footer>
  );
};