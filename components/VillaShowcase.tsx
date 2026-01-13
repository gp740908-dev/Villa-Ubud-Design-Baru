import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Villa } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface VillaShowcaseProps {
    onNavigate: (view: 'home' | 'villa', slug?: string) => void;
    villas: Villa[];
}

// Icons (Inline SVG for reliability)
const Icons = {
  Maximize: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>,
  Home: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Building: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" x2="15" y1="22" y2="22"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M16 18h.01"/></svg>,
  BedDouble: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M12 4v6"/><path d="M2 18h20"/></svg>,
  Bath: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-1C4.5 3.5 3 5 3 5s5 5 7 7"/><path d="M12 6c1.1 0 2 .9 2 2a2 2 0 1 0 4 0c0-3-1.7-5-4.3-5-2.6 0-3.3 1.1-3.3 2.4"/><path d="M19 11a2 2 0 1 1-2 2h-1a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2z"/></svg>,
  Armchair: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/><path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z"/><path d="M5 18v2"/><path d="M19 18v2"/></svg>,
  Waves: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>,
  Utensils: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>,
  ArrowRight: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
  ArrowLeft: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>,
};

export const VillaShowcase: React.FC<VillaShowcaseProps> = ({ onNavigate, villas }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Animation Refs
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const specsRef = useRef<HTMLDivElement>(null);

  const [activeVillaId, setActiveVillaId] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Initialize active villa
  useEffect(() => {
    if (villas.length > 0 && !activeVillaId) {
      setActiveVillaId(villas[0].id);
    }
  }, [villas]);

  const activeVilla = villas.find(v => v.id === activeVillaId) || villas[0];

  // GSAP Animation Timeline on Villa Change
  useEffect(() => {
    if (!contentWrapperRef.current || !activeVilla) return;

    const ctx = gsap.context(() => {
        const tl = gsap.timeline();

        // 1. Reset states instantly for the new content entry
        // (Note: The exit animation happens in the click handler before state update)
        
        // A. Image Entry
        if (imageRef.current) {
            tl.fromTo(imageRef.current, 
                { opacity: 0, scale: 1.05 },
                { opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
            );
        }

        // B. Info Entry (Title, Price, Desc) - Starts slightly after image
        if (infoRef.current) {
            tl.fromTo(infoRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
                "-=0.8" // Overlap with image animation
            );
        }

        // C. Specs Grid Entry (Staggered)
        if (specsRef.current) {
            // Select all direct children (the spec items)
            const specs = specsRef.current.children;
            tl.fromTo(specs, 
                { y: 10, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.05, duration: 0.6, ease: "power3.out" },
                "-=0.6"
            );
        }

    }, containerRef);

    return () => ctx.revert();
  }, [activeVillaId]); // Re-run when activeVillaId changes

  // Construct images array (Main + Gallery)
  const getImages = (villa: Villa) => {
    let images = [villa.imageUrl, ...(villa.gallery || [])];
    while(images.length < 4 && images.length > 0) {
        images = [...images, ...images];
    }
    return images.slice(0, 5);
  };

  const images = activeVilla ? getImages(activeVilla) : [];

  const handleTabClick = (id: string) => {
    if (id === activeVillaId) return;
    
    // 1. Exit Animation: Fade out content quickly
    gsap.to(contentWrapperRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
            // 2. Update State (Triggering the Effect above)
            setActiveVillaId(id);
            setCurrentImageIndex(0);
            
            // 3. Reset Wrapper Opacity for the new content to be visible during its entry animation
            gsap.set(contentWrapperRef.current, { opacity: 1 });
        }
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price).replace("Rp", "Rp ");
  };

  const getAreaNumber = (areaStr?: string) => {
    if (!areaStr) return 0;
    const match = areaStr.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  if (!activeVilla) return <div className="py-20 text-center font-sans text-xs uppercase tracking-widest">Loading Showcase...</div>;

  return (
    <section ref={containerRef} className="relative py-20 bg-canvas text-ink z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* 1. TABS (Navigation) */}
        <div className="grid grid-cols-2 md:grid-cols-4 mb-12 border border-ink/20 rounded-sm overflow-hidden">
            {villas.slice(0, 4).map((villa) => (
                <button
                    key={villa.id}
                    onClick={() => handleTabClick(villa.id)}
                    className={`py-5 px-4 font-serif text-sm md:text-base uppercase tracking-wider transition-colors duration-500 border-r border-ink/20 last:border-r-0 ${
                        activeVillaId === villa.id 
                        ? 'bg-ink text-canvas font-bold' 
                        : 'bg-canvas text-ink/70 hover:bg-ink/5'
                    }`}
                >
                    {villa.name}
                </button>
            ))}
        </div>

        {/* CONTENT AREA WRAPPER */}
        <div ref={contentWrapperRef} className="opacity-100">
            
            {/* 2. IMAGE CAROUSEL */}
            <div className="relative w-full h-[50vh] md:h-[70vh] mb-16 group overflow-hidden bg-ink/5">
                <img 
                    ref={imageRef}
                    src={images[currentImageIndex]} 
                    alt={activeVilla.name}
                    className="w-full h-full object-cover" // Transform handled by GSAP now
                />
                
                {/* Navigation Arrows */}
                <div className="absolute inset-0 flex items-center justify-between px-4 md:px-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                        onClick={prevImage}
                        className="w-12 h-12 rounded-full bg-canvas/80 text-ink flex items-center justify-center hover:bg-ink hover:text-canvas transition-all"
                    >
                        {Icons.ArrowLeft}
                    </button>
                    <button 
                        onClick={nextImage}
                        className="w-12 h-12 rounded-full bg-canvas/80 text-ink flex items-center justify-center hover:bg-ink hover:text-canvas transition-all"
                    >
                        {Icons.ArrowRight}
                    </button>
                </div>

                {/* Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-canvas w-6' : 'bg-canvas/50'}`}
                        />
                    ))}
                </div>
            </div>

            {/* 3. MAIN INFO */}
            <div ref={infoRef} className="text-center mb-16 space-y-6">
                <h2 className="font-serif text-4xl md:text-6xl text-ink uppercase tracking-wide">
                    {activeVilla.name}
                </h2>
                <div className="w-16 h-px bg-ink mx-auto opacity-50"></div>
                <p className="font-sans text-sm md:text-base text-ink/70 max-w-2xl mx-auto leading-relaxed">
                    {activeVilla.description}
                    <br className="hidden md:block" />
                    Indulge your sense of sight with the endless green views of the jungle valley.
                </p>
                <div className="pt-4">
                    <span className="font-sans text-xs uppercase tracking-widest text-ink/50 block mb-2">Start From</span>
                    <span className="font-serif text-3xl md:text-5xl text-ink font-bold">
                        {formatPrice(activeVilla.pricePerNight)}
                    </span>
                    <span className="font-sans text-xs text-ink/50 ml-2">/ night</span>
                </div>
            </div>

            {/* 4. SPECIFICATIONS GRID */}
            <div className="mb-20">
                <div className="text-center mb-10">
                    <span className="font-sans text-xs uppercase tracking-[0.2em] border-b border-ink/20 pb-2">Specifications</span>
                </div>

                <div ref={specsRef} className="grid grid-cols-2 md:grid-cols-4 gap-px bg-ink/10 border border-ink/10">
                    {/* Item 1: Land Area */}
                    <div className="bg-canvas p-8 flex flex-col items-center gap-4 hover:bg-ink/5 transition-colors group">
                        <div className="text-ink group-hover:scale-110 transition-transform duration-300">{Icons.Maximize}</div>
                        <div className="text-center">
                            <span className="block font-serif text-xl text-ink">{(getAreaNumber(activeVilla.specs?.area) * 1.5).toFixed(0)} sqm</span>
                            <span className="block font-sans text-[10px] uppercase tracking-widest text-ink/50 mt-1">Land Area</span>
                        </div>
                    </div>

                    {/* Item 2: Building Area */}
                    <div className="bg-canvas p-8 flex flex-col items-center gap-4 hover:bg-ink/5 transition-colors group">
                        <div className="text-ink group-hover:scale-110 transition-transform duration-300">{Icons.Home}</div>
                        <div className="text-center">
                            <span className="block font-serif text-xl text-ink">{activeVilla.specs?.area || '-'}</span>
                            <span className="block font-sans text-[10px] uppercase tracking-widest text-ink/50 mt-1">Building Area</span>
                        </div>
                    </div>

                    {/* Item 3: Levels */}
                    <div className="bg-canvas p-8 flex flex-col items-center gap-4 hover:bg-ink/5 transition-colors group">
                        <div className="text-ink group-hover:scale-110 transition-transform duration-300">{Icons.Building}</div>
                        <div className="text-center">
                            <span className="block font-serif text-xl text-ink">1 - 2</span>
                            <span className="block font-sans text-[10px] uppercase tracking-widest text-ink/50 mt-1">Levels</span>
                        </div>
                    </div>

                    {/* Item 4: Bedrooms */}
                    <div className="bg-canvas p-8 flex flex-col items-center gap-4 hover:bg-ink/5 transition-colors group">
                        <div className="text-ink group-hover:scale-110 transition-transform duration-300">{Icons.BedDouble}</div>
                        <div className="text-center">
                            <span className="block font-serif text-xl text-ink">{activeVilla.specs?.bedrooms || '-'}</span>
                            <span className="block font-sans text-[10px] uppercase tracking-widest text-ink/50 mt-1">Bed Rooms</span>
                        </div>
                    </div>

                    {/* Item 5: Bathrooms */}
                    <div className="bg-canvas p-8 flex flex-col items-center gap-4 hover:bg-ink/5 transition-colors group">
                        <div className="text-ink group-hover:scale-110 transition-transform duration-300">{Icons.Bath}</div>
                        <div className="text-center">
                            <span className="block font-serif text-xl text-ink">{activeVilla.specs?.bathrooms || '-'}</span>
                            <span className="block font-sans text-[10px] uppercase tracking-widest text-ink/50 mt-1">Bath Rooms</span>
                        </div>
                    </div>

                    {/* Item 6: Living Room (Static) */}
                    <div className="bg-canvas p-8 flex flex-col items-center gap-4 hover:bg-ink/5 transition-colors group">
                        <div className="text-ink group-hover:scale-110 transition-transform duration-300">{Icons.Armchair}</div>
                        <div className="text-center">
                            <span className="block font-serif text-xl text-ink">1</span>
                            <span className="block font-sans text-[10px] uppercase tracking-widest text-ink/50 mt-1">Living Room</span>
                        </div>
                    </div>

                    {/* Item 7: Pool Area (Static) */}
                    <div className="bg-canvas p-8 flex flex-col items-center gap-4 hover:bg-ink/5 transition-colors group">
                        <div className="text-ink group-hover:scale-110 transition-transform duration-300">{Icons.Waves}</div>
                        <div className="text-center">
                            <span className="block font-serif text-xl text-ink">1</span>
                            <span className="block font-sans text-[10px] uppercase tracking-widest text-ink/50 mt-1">Private Pool</span>
                        </div>
                    </div>

                    {/* Item 8: Pantry (Static) */}
                    <div className="bg-canvas p-8 flex flex-col items-center gap-4 hover:bg-ink/5 transition-colors group">
                        <div className="text-ink group-hover:scale-110 transition-transform duration-300">{Icons.Utensils}</div>
                        <div className="text-center">
                            <span className="block font-serif text-xl text-ink">1</span>
                            <span className="block font-sans text-[10px] uppercase tracking-widest text-ink/50 mt-1">Pantry</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. FOOTER CTA */}
            <div className="text-center">
                <button 
                    onClick={() => onNavigate('villa', activeVilla.slug)}
                    className="group relative inline-flex items-center gap-3 px-12 py-4 bg-ink text-canvas overflow-hidden transition-all hover:bg-terrace hover:scale-105 duration-300"
                >
                    <span className="font-sans text-xs uppercase tracking-[0.2em] font-bold">View Full Details</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
                </button>
            </div>

        </div>
      </div>
    </section>
  );
};