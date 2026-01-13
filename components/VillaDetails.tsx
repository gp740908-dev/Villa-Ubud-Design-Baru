import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Villa, Booking } from '../types';
import { BookingForm } from './BookingForm';
import { MapComponent } from './MapComponent';
import { AvailabilityCalendar } from './AvailabilityCalendar';
import { supabase } from '../lib/supabase';

gsap.registerPlugin(ScrollTrigger);

interface VillaDetailsProps {
  slug: string;
  onNavigate: (view: 'home' | 'villa' | '404', slug?: string) => void;
  allVillas: Villa[];
}

const Icons = {
    Guests: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>,
    Bedroom: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l.6-3.8a2 2 0 0 1 1.9-1.7h14.5a2 2 0 0 1 1.9 1.7l.6 3.8M2 12h20M4 12v7M20 12v7M6 19h12M6 9V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" /></svg>,
    Bathroom: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8 4V3h8v1M4 13h16a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2zM12 13v-5M10 8h4" /></svg>,
    Area: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>,
    Wifi: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" /></svg>,
    Check: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
};

export const VillaDetails: React.FC<VillaDetailsProps> = ({ slug, onNavigate, allVillas }) => {
  const [villa, setVilla] = useState<Villa | null>(null);
  const [showMobileBooking, setShowMobileBooking] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]); 
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Find villa from the passed prop list
    const foundVilla = allVillas.find(v => v.slug === slug);
    if (foundVilla) {
      setVilla(foundVilla);
    } else if (allVillas.length > 0) {
        onNavigate('404');
    }
    window.scrollTo(0, 0);
  }, [slug, allVillas, onNavigate]);

  // Fetch Bookings from Supabase
  useEffect(() => {
    if (!villa) return;

    const fetchBookings = async () => {
        try {
            // Fetch bookings that are active (end_date >= today)
            const today = new Date().toISOString().split('T')[0];
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .eq('villa_id', villa.id)
                .gte('end_date', today);

            if (error) throw error;
            if (data) setBookings(data);
        } catch (err) {
            console.error('Error fetching bookings:', err);
            // Fallback to empty if error (keeps calendar clean)
            setBookings([]);
        }
    };

    fetchBookings();
  }, [villa]);

  useEffect(() => {
    if (!villa) return;
    
    const ctx = gsap.context(() => {
        // Hero Parallax
        if(heroRef.current && containerRef.current) {
            gsap.to(heroRef.current, {
                yPercent: 30,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });
        }

        // Stagger Content Entry
        gsap.from(".detail-section", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: contentRef.current,
                start: "top 80%",
            }
        });

    }, containerRef);

    return () => ctx.revert();
  }, [villa]);

  if (!villa) return <div className="h-screen w-full flex items-center justify-center bg-canvas text-ink uppercase tracking-widest text-xs">Loading Sanctuary...</div>;

  const hasLocation = villa.location && typeof villa.location.lat === 'number' && typeof villa.location.lng === 'number';

  return (
    <div ref={containerRef} className="bg-canvas min-h-screen relative pb-24 md:pb-0">
      
      {/* Back Button */}
      <div className="fixed top-8 left-6 z-50 md:top-12 md:left-12 mix-blend-difference text-canvas md:text-ink">
        <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 group"
        >
            <div className="w-8 h-px bg-current transition-all group-hover:w-16"></div>
            <span className="font-sans text-[10px] uppercase tracking-widest font-bold">Back</span>
        </button>
      </div>

      {/* 1. Hero Section */}
      <header className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-ink/10 z-10"></div>
        <img 
            ref={heroRef}
            src={villa.imageUrl} 
            alt={villa.name}
            className="w-full h-[120%] object-cover object-center -mt-10"
        />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-ink/50 to-transparent h-48 z-10"></div>
        <div className="absolute bottom-12 left-6 md:left-24 z-20 text-canvas drop-shadow-lg">
            <span className="font-sans text-xs uppercase tracking-widest block mb-2 opacity-90">Ubud, Bali</span>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl">{villa.name}</h1>
        </div>
      </header>

      {/* 2. Main Content Grid */}
      <section ref={contentRef} className="relative z-20 px-4 md:px-10 py-12 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 xl:gap-20">
            
            {/* LEFT COLUMN (2/3) */}
            <div className="lg:col-span-2 flex flex-col gap-16">
                
                {/* A. Floating Stats Bar */}
                <div className="detail-section flex flex-wrap gap-y-4 justify-between items-center border-y border-ink/10 py-8 px-2">
                    <StatIcon icon={Icons.Guests} label={`${villa.capacity} Guests`} />
                    <StatIcon icon={Icons.Bedroom} label={`${villa.specs?.bedrooms ?? '-'} Bedrooms`} />
                    <StatIcon icon={Icons.Bathroom} label={`${villa.specs?.bathrooms ?? '-'} Bathrooms`} />
                    <StatIcon icon={Icons.Area} label="300 sqm" /> {/* Hardcoded as requested */}
                    <StatIcon icon={Icons.Wifi} label="100 Mbps" /> {/* Hardcoded as requested */}
                </div>

                {/* B. The Experience (Description) */}
                <div className="detail-section">
                    <h3 className="font-serif text-3xl text-ink mb-6">The Experience</h3>
                    <div className="prose prose-lg text-ink/80 font-serif leading-loose whitespace-pre-line mb-8">
                        {villa.longDescription}
                    </div>
                    
                    {/* Concierge Note */}
                    <div className="bg-terrace/10 p-8 border-l-2 border-terrace">
                        <p className="font-sans text-sm italic text-ink/80">
                            <strong className="block uppercase not-italic text-xs tracking-widest text-ink mb-2">Concierge Note</strong>
                            "Best for: Honeymooners and Digital Nomads seeking absolute silence. The morning mist over the valley is a spiritual experience not to be missed."
                        </p>
                    </div>
                </div>

                {/* C. Sleeping Arrangements (Hardcoded UI) */}
                <div className="detail-section">
                    <h3 className="font-serif text-3xl text-ink mb-6">Sleeping Arrangements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <BedroomCard 
                            title="Master Sanctuary" 
                            subtitle="King Bed, Ensuite, Jungle View"
                            icon={Icons.Bedroom}
                        />
                        <BedroomCard 
                            title="Guest Suite" 
                            subtitle="Twin Beds (Convertible), Work Desk"
                            icon={Icons.Bedroom}
                        />
                    </div>
                </div>

                {/* D. Premium Amenities */}
                <div className="detail-section">
                    <h3 className="font-serif text-3xl text-ink mb-6">Premium Amenities</h3>
                    
                    {/* Simulated Categories */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-8">
                        <div>
                            <h4 className="font-sans text-xs uppercase tracking-widest text-ink/50 mb-4">Comfort & Leisure</h4>
                            <ul className="space-y-3">
                                {villa.amenities?.slice(0, 3).map((item, i) => (
                                    <AmenityItem key={i} label={item} />
                                )) ?? <AmenityItem label="Premium Linens" />}
                                <AmenityItem label="Air Conditioning" />
                                <AmenityItem label="Private Infinity Pool" />
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-sans text-xs uppercase tracking-widest text-ink/50 mb-4">Tech & Services</h4>
                            <ul className="space-y-3">
                                {villa.amenities?.slice(3).map((item, i) => (
                                    <AmenityItem key={i} label={item} />
                                )) ?? <AmenityItem label="Butler Service" />}
                                <AmenityItem label="Smart TV with Netflix" />
                                <AmenityItem label="JBL Bluetooth Sound System" />
                            </ul>
                        </div>
                    </div>
                </div>

                {/* E. House Rules Accordion */}
                <div className="detail-section">
                    <h3 className="font-serif text-3xl text-ink mb-6">House Rules & Policies</h3>
                    <div className="border-t border-ink/10">
                        <AccordionItem title="Check-in / Check-out">
                            <p>Check-in: 14:00 onwards</p>
                            <p>Check-out: 11:00</p>
                            <p className="text-xs mt-2 opacity-60">Early check-in subject to availability.</p>
                        </AccordionItem>
                        <AccordionItem title="Noise Policy">
                            <p>To respect the serenity of the valley and our neighbors, we kindly ask for quiet hours between 10:00 PM and 7:00 AM.</p>
                        </AccordionItem>
                        <AccordionItem title="Smoking Policy">
                            <p>Smoking is strictly prohibited inside the villa bedrooms. You are welcome to smoke in the open-air living areas and poolside.</p>
                        </AccordionItem>
                        <AccordionItem title="Cancellation Policy">
                            <p>Full refund for cancellations made within 48 hours of booking, if the check-in date is at least 14 days away.</p>
                        </AccordionItem>
                    </div>
                </div>

                {/* F. Location Context */}
                <div className="detail-section">
                    <h3 className="font-serif text-3xl text-ink mb-6">Location Context</h3>
                    <p className="font-sans text-sm text-ink/70 mb-6">
                        Located in the spiritual heart of Bali. 10 minutes drive from Ubud Center, yet a world away in terms of peace and privacy.
                    </p>
                    <div className="w-full h-[400px] border border-ink/10 rounded-sm overflow-hidden relative">
                        <MapComponent 
                            villas={[villa]} 
                            center={hasLocation ? [villa.location.lat, villa.location.lng] : undefined}
                            zoom={14}
                        />
                    </div>
                </div>

            </div>

            {/* RIGHT COLUMN (1/3) - Sticky Sidebar */}
            <div className="lg:col-span-1 relative">
                <div className="sticky top-24 space-y-8">
                    {/* Booking Widget */}
                    <div className="bg-canvas border border-ink/10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] p-1">
                        <BookingForm villa={villa} variant="widget" />
                    </div>
                    
                    {/* Availability Calendar (New) */}
                    <AvailabilityCalendar bookings={bookings} />

                    {/* Mini Help Box */}
                    <div className="text-center p-6 border border-ink/5 rounded-sm">
                        <p className="font-sans text-xs text-ink/60 mb-2">Need help planning?</p>
                        <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="font-serif text-lg text-ink border-b border-ink/30 hover:border-ink transition-all">
                            Chat with Concierge
                        </a>
                    </div>
                </div>
            </div>

        </div>
      </section>

      {/* Mobile Sticky Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-ink p-4 border-t border-canvas/20 flex justify-between items-center shadow-2xl">
        <div>
            <span className="block font-serif text-canvas text-lg">{villa.name}</span>
            <span className="block font-sans text-matcha text-xs">From {(villa.pricePerNight / 1000000).toFixed(1)}M IDR / night</span>
        </div>
        <button 
            onClick={() => setShowMobileBooking(true)}
            className="bg-canvas text-ink px-6 py-3 font-sans text-xs font-bold uppercase tracking-widest"
        >
            Reserve
        </button>
      </div>

      {/* Mobile Modal */}
      {showMobileBooking && (
        <BookingForm villa={villa} variant="modal" onClose={() => setShowMobileBooking(false)} />
      )}

    </div>
  );
};

/* --- Sub-Components --- */

const StatIcon: React.FC<{ icon: React.ReactNode, label: string }> = ({ icon, label }) => (
    <div className="flex flex-col items-center gap-2 min-w-[80px]">
        <div className="text-ink/80">{icon}</div>
        <span className="font-sans text-[10px] uppercase tracking-widest text-ink/60">{label}</span>
    </div>
);

const BedroomCard: React.FC<{ title: string, subtitle: string, icon: React.ReactNode }> = ({ title, subtitle, icon }) => (
    <div className="border border-ink/10 p-6 flex items-start gap-4 hover:border-ink/30 transition-colors">
        <div className="text-ink/80 mt-1">{icon}</div>
        <div>
            <h4 className="font-serif text-lg text-ink mb-1">{title}</h4>
            <p className="font-sans text-xs text-ink/60">{subtitle}</p>
        </div>
    </div>
);

const AmenityItem: React.FC<{ label: string }> = ({ label }) => (
    <li className="flex items-center gap-3 font-sans text-sm text-ink/80">
        <span className="text-terrace">{Icons.Check}</span>
        {label}
    </li>
);

const AccordionItem: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => {
    return (
        <details className="group border-b border-ink/10">
            <summary className="flex justify-between items-center py-6 cursor-pointer list-none">
                <span className="font-serif text-lg text-ink group-hover:text-terrace transition-colors">{title}</span>
                <span className="transition-transform duration-300 group-open:rotate-45 text-xl font-thin">+</span>
            </summary>
            <div className="pb-6 font-sans text-sm text-ink/70 leading-relaxed px-2">
                {children}
            </div>
        </details>
    );
};