import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Logo } from './Logo';

gsap.registerPlugin(ScrollTrigger);

interface NavbarProps {
  onNavigate?: (view: 'home' | 'villa' | 'contact' | 'journal', slug?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
  // Refs for animation targeting
  const linksContainerRef = useRef<HTMLDivElement>(null);
  const infoContainerRef = useRef<HTMLDivElement>(null);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [tl] = useState(() => gsap.timeline({ paused: true }));

  // Define links with view types and hover images
  const navLinks = [
    { 
        name: 'Home', 
        view: 'home' as const,
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2538&auto=format&fit=crop'
    },
    { 
        name: 'Villas', 
        view: 'home' as const, // For MVP we keep villas on home, usually anchors
        image: 'https://images.unsplash.com/photo-1572331165267-854da2b00ca1?q=80&w=2070&auto=format&fit=crop'
    }, 
    { 
        name: 'Experience', 
        view: 'home' as const,
        image: 'https://images.unsplash.com/photo-1590059390047-685b095eb1bc?q=80&w=2785&auto=format&fit=crop'
    },
    { 
        name: 'Journal', 
        view: 'journal' as const, 
        image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2888&auto=format&fit=crop'
    },
    { 
        name: 'Contact', 
        view: 'contact' as const,
        image: 'https://images.unsplash.com/photo-1564053489984-317bbd824340?q=80&w=2000&auto=format&fit=crop'
    },
  ];

  // Headroom & Scroll Style Effect
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const showAnim = gsap.from(el, { 
      yPercent: -100,
      paused: true,
      duration: 0.4,
      ease: "power3.out"
    }).progress(1);

    ScrollTrigger.create({
      start: "top top",
      end: 99999,
      onUpdate: (self) => {
        if (isMobileMenuOpen) return;
        if (self.direction === -1) {
            showAnim.play();
        } else {
            showAnim.reverse();
        }
      }
    });

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobileMenuOpen]);

  // Menu Animation Timeline
  useEffect(() => {
    if (!mobileMenuRef.current || !linksContainerRef.current || !infoContainerRef.current) return;
    
    const links = linksContainerRef.current.children;
    const infoItems = infoContainerRef.current.children;

    tl.clear();
    
    // Using fromTo ensures styles are correctly reset and animated even in React Strict Mode
    tl.to(mobileMenuRef.current, {
        autoAlpha: 1,
        duration: 0.5,
        ease: "power2.inOut"
    })
    .fromTo(links, {
        x: -50,
        opacity: 0
    }, {
        x: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out"
    })
    .fromTo(infoItems, {
        y: 20,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out"
    }, "-=0.6");

  }, [tl]);

  const toggleMenu = () => {
    if (isMobileMenuOpen) {
        tl.reverse();
        setHoveredLink(null);
    } else {
        tl.play();
    }
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLinkClick = (e: React.MouseEvent, view: 'home' | 'villa' | 'contact' | 'journal') => {
      e.preventDefault();
      if(onNavigate) {
          onNavigate(view);
      }
      if(isMobileMenuOpen) {
          toggleMenu();
      }
  }

  return (
    <>
        <style>{`
            @keyframes pulse-slow {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.3; }
            }
            .animate-pulse-slow {
                animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            .group:hover .animate-pulse-slow {
                animation: none;
                opacity: 1;
            }
        `}</style>

        {/* Main Navbar */}
        <nav 
          ref={navRef}
          className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 px-6 md:px-12 py-6 flex justify-between items-center
            ${isScrolled && !isMobileMenuOpen ? 'bg-canvas/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}
          `}
        >
          {/* Logo */}
          <div className="z-50 relative">
            <a 
                href="#" 
                onClick={(e) => handleLinkClick(e, 'home')}
                className="block text-ink"
            >
              <Logo className="h-10 md:h-12 w-auto object-contain" />
            </a>
          </div>

          {/* Desktop CTA (Hidden when menu open) */}
          <div className={`hidden md:block transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <button className="border border-ink px-6 py-2 font-sans text-xs uppercase tracking-widest text-ink hover:bg-ink hover:text-canvas transition-all duration-300">
                Book Now
            </button>
          </div>

          {/* Typography + Indicator Menu Trigger */}
          <button 
            onClick={toggleMenu} 
            className="z-50 group flex items-center gap-3 focus:outline-none cursor-pointer py-2"
          >
             {/* Indicator Dot */}
             <span 
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 group-hover:scale-125 ${isMobileMenuOpen ? 'bg-canvas' : 'bg-ink animate-pulse-slow'}`}
             ></span>
             
             {/* Text */}
             <span 
                className={`font-sans text-xs font-bold uppercase tracking-[0.25em] transition-colors duration-300 ${isMobileMenuOpen ? 'text-canvas' : 'text-ink group-hover:text-terrace'}`}
             >
                {isMobileMenuOpen ? 'Close' : 'Menu'}
             </span>
          </button>
        </nav>

        {/* Full Screen Overlay Menu */}
        <div 
            ref={mobileMenuRef} 
            className="fixed inset-0 z-40 bg-ink text-canvas invisible opacity-0 overflow-hidden"
        >
            {/* Background Image Reveal */}
            <div className="absolute inset-0 pointer-events-none opacity-10 transition-all duration-700 ease-in-out">
                 {navLinks.map((link) => (
                    <img 
                        key={link.name}
                        src={link.image}
                        alt="Background"
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${hoveredLink === link.name ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
                    />
                 ))}
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full h-full grid grid-cols-1 md:grid-cols-12 px-6 md:px-24 pt-32 pb-12">
                
                {/* Left: Navigation Links */}
                <div ref={linksContainerRef} className="md:col-span-7 flex flex-col justify-center gap-2 md:gap-6">
                    {navLinks.map((link) => (
                        <a 
                            key={link.name} 
                            href="#"
                            onClick={(e) => handleLinkClick(e, link.view)}
                            onMouseEnter={() => setHoveredLink(link.name)}
                            onMouseLeave={() => setHoveredLink(null)}
                            className="font-serif text-5xl md:text-8xl text-canvas hover:text-matcha transition-all duration-300 transform hover:translate-x-4 w-max"
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                {/* Divider (Mobile Only) */}
                <div className="md:hidden w-full h-px bg-canvas/20 my-8"></div>

                {/* Right: Info Cluster */}
                <div ref={infoContainerRef} className="md:col-span-5 flex flex-col justify-end gap-12 pb-8 md:pl-12">
                    
                    {/* Socials */}
                    <div className="flex flex-col gap-4">
                        <span className="font-sans text-[10px] uppercase tracking-widest text-matcha opacity-60">Follow Us</span>
                        <div className="flex flex-col gap-2">
                             {[
                                { label: 'Instagram', url: '#' },
                                { label: 'TikTok', url: '#' },
                                { label: 'Facebook', url: '#' }
                             ].map(social => (
                                <a key={social.label} href={social.url} className="group flex items-center gap-2 font-sans text-sm uppercase tracking-widest text-canvas hover:text-matcha transition-colors w-max">
                                    {social.label} <span className="opacity-0 group-hover:opacity-100 transition-opacity -mt-1">↗</span>
                                </a>
                             ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col gap-4">
                         <span className="font-sans text-[10px] uppercase tracking-widest text-matcha opacity-60">Get in Touch</span>
                         <a href="mailto:hello@stayinubud.com" className="font-serif text-2xl md:text-3xl hover:text-matcha transition-colors">hello@stayinubud.com</a>
                         <a href="#" className="font-sans text-sm uppercase tracking-widest hover:text-matcha transition-colors">+62 812 3456 7890</a>
                    </div>

                    {/* Location & Vibe */}
                    <div className="mt-4 pt-8 border-t border-canvas/10 flex justify-between items-end">
                        <div className="flex flex-col">
                            <span className="font-sans text-xs uppercase tracking-widest">Ubud, Bali</span>
                            <span className="font-sans text-[10px] opacity-50 uppercase tracking-widest">Indonesia</span>
                        </div>
                        <span className="font-serif text-lg italic text-matcha opacity-80 hidden md:block">Experience the silence.</span>
                    </div>

                </div>
            </div>
        </div>
    </>
  );
};