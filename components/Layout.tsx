import React, { useEffect, ReactNode } from 'react';
import Lenis from 'lenis';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
  onNavigate?: (view: 'home' | 'villa' | 'contact', slug?: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onNavigate }) => {
  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical', 
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <Navbar onNavigate={onNavigate} />
      
      {/* Main Content with Curtain Effect Logic */}
      {/* mb-[85vh] must match the h-[85vh] of the fixed Footer */}
      <main className="relative z-10 bg-canvas mb-[85vh] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] min-h-screen rounded-b-3xl overflow-hidden">
        {children}
        
        {/* Decorative end-of-content line */}
        <div className="w-full py-12 flex justify-center items-center bg-canvas">
            <div className="w-px h-24 bg-ink/30"></div>
        </div>
      </main>

      <Footer />
    </>
  );
};