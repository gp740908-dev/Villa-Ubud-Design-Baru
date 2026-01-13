import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { MapComponent } from './MapComponent';
import { PHONE_NUMBER } from '../constants';
import { Villa } from '../types';
import { supabase } from '../lib/supabase';

interface ContactProps {
    villas: Villa[];
}

export const Contact: React.FC<ContactProps> = ({ villas }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const faqs = [
    { 
      q: "What are the Check-in & Check-out times?", 
      a: "Check-in is at 14:00 and Check-out is at 12:00. Early check-in or late check-out is subject to availability and may incur additional charges." 
    },
    { 
      q: "Do you offer Airport Transfers?", 
      a: "Yes, our private chauffeur can arrange VIP airport pickup and drop-off. Please provide your flight details at least 48 hours prior to arrival." 
    },
    { 
      q: "Can I request a Private Chef?", 
      a: "Absolutely. Our culinary team can prepare breakfast, lunch, and dinner in your villa. We offer tailored menus including Balinese authentic cuisine and dietary-specific options." 
    },
    {
      q: "Is the location suitable for events?",
      a: "Select estates like Estate Kayon are designed for intimate gatherings and executive retreats. Please contact us directly to discuss capacity and requirements."
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
        // Staggered Entry Animation
        gsap.from(".animate-entry", {
            y: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.2
        });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
        const { error } = await supabase
            .from('inquiries')
            .insert([{ 
                name: formData.name, 
                email: formData.email, 
                message: formData.message 
            }]);

        if (error) throw error;
        
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
    } catch (err) {
        console.error('Error submitting form:', err);
        setStatus('error');
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-canvas pt-32 pb-24 px-6 md:px-24">
        
        {/* Main Split Layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-16 md:gap-24 mb-32">
            
            {/* Left Column (40%) */}
            <div className="md:col-span-2 flex flex-col gap-12">
                <div className="animate-entry">
                    <span className="font-sans text-xs uppercase tracking-widest text-matcha mb-4 block">Concierge Service</span>
                    <h1 className="font-serif text-5xl md:text-7xl text-ink leading-none">Let's Start <br/>Your Journey.</h1>
                </div>
                
                <p className="animate-entry font-sans text-ink/80 text-lg leading-relaxed">
                    Have a question about availability or planning a bespoke event? Our team is dedicated to crafting your perfect Ubud experience before you even arrive.
                </p>

                <div className="animate-entry flex flex-col gap-6 mt-4">
                    <div>
                        <span className="font-sans text-[10px] uppercase tracking-widest text-ink/50 block mb-1">Email Us</span>
                        <a href="mailto:hello@stayinubud.com" className="font-serif text-2xl md:text-3xl text-ink hover:text-terrace transition-colors border-b border-transparent hover:border-terrace w-max">
                            hello@stayinubud.com
                        </a>
                    </div>
                    <div>
                        <span className="font-sans text-[10px] uppercase tracking-widest text-ink/50 block mb-1">WhatsApp (24/7)</span>
                        <a href={`https://wa.me/${PHONE_NUMBER}`} target="_blank" className="font-serif text-2xl md:text-3xl text-ink hover:text-terrace transition-colors border-b border-transparent hover:border-terrace w-max">
                            +62 812 3456 7890
                        </a>
                    </div>
                </div>

                <div className="animate-entry mt-8 hidden md:block relative w-full aspect-[4/3] overflow-hidden">
                    <img 
                        src="https://images.unsplash.com/photo-1564053489984-317bbd824340?q=80&w=2000&auto=format&fit=crop" 
                        alt="Palm Shadow"
                        className="w-full h-full object-cover mix-blend-multiply opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
                    />
                </div>
            </div>

            {/* Right Column (60%) */}
            <div className="md:col-span-3 flex flex-col gap-20">
                
                {/* Minimalist Form */}
                <div className="animate-entry relative">
                    <h3 className="font-serif text-3xl text-ink mb-8">Send an Inquiry</h3>
                    
                    {status === 'success' ? (
                        <div className="bg-matcha/20 border border-matcha p-8 text-center animate-fade-in">
                            <h4 className="font-serif text-2xl text-ink mb-2">Message Sent</h4>
                            <p className="font-sans text-sm text-ink/80">Thank you for contacting us. Our concierge will be in touch shortly.</p>
                            <button onClick={() => setStatus('idle')} className="mt-6 text-xs uppercase tracking-widest border-b border-ink">Send another</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                            <div className="group">
                                <input 
                                    type="text" 
                                    placeholder="Your Name" 
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-transparent border-b border-ink/30 py-4 text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink transition-all font-serif text-xl"
                                    required
                                    disabled={status === 'submitting'}
                                />
                            </div>
                            <div className="group">
                                <input 
                                    type="email" 
                                    placeholder="Email Address" 
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    className="w-full bg-transparent border-b border-ink/30 py-4 text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink transition-all font-serif text-xl"
                                    required
                                    disabled={status === 'submitting'}
                                />
                            </div>
                            <div className="group">
                                <textarea 
                                    placeholder="How can we assist you?" 
                                    rows={3}
                                    value={formData.message}
                                    onChange={e => setFormData({...formData, message: e.target.value})}
                                    className="w-full bg-transparent border-b border-ink/30 py-4 text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink transition-all font-serif text-xl resize-none"
                                    required
                                    disabled={status === 'submitting'}
                                />
                            </div>
                            
                            {status === 'error' && (
                                <p className="text-red-500 text-xs uppercase tracking-widest">Something went wrong. Please try again.</p>
                            )}

                            <button 
                                type="submit"
                                disabled={status === 'submitting'}
                                className="self-start mt-4 px-10 py-4 border border-ink text-ink font-sans text-xs uppercase tracking-widest hover:bg-ink hover:text-canvas transition-all duration-300 disabled:opacity-50"
                            >
                                {status === 'submitting' ? 'Sending...' : 'Send Inquiry'}
                            </button>
                        </form>
                    )}
                </div>

                {/* FAQ Accordion */}
                <div className="animate-entry">
                    <h3 className="font-serif text-3xl text-ink mb-8">Common Questions</h3>
                    <div className="border-t border-ink/20">
                        {faqs.map((item, idx) => (
                            <div key={idx} className="border-b border-ink/20">
                                <button 
                                    onClick={() => toggleAccordion(idx)}
                                    className="w-full py-6 flex justify-between items-center text-left group"
                                >
                                    <span className="font-serif text-xl text-ink group-hover:text-terrace transition-colors">{item.q}</span>
                                    <span className={`font-sans text-xl transition-transform duration-300 ${activeAccordion === idx ? 'rotate-45' : ''}`}>+</span>
                                </button>
                                <div 
                                    className={`overflow-hidden transition-all duration-500 ease-in-out ${activeAccordion === idx ? 'max-h-40 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}
                                >
                                    <p className="font-sans text-ink/70 leading-relaxed pr-8">
                                        {item.a}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>

        {/* Map Section */}
        <div className="animate-entry w-full h-[400px] md:h-[500px] border border-ink/30 rounded-sm overflow-hidden relative">
            <div className="absolute top-6 left-6 z-[1000] bg-canvas/90 backdrop-blur px-4 py-2 border border-ink/10 shadow-sm">
                <span className="font-sans text-[10px] uppercase tracking-widest text-ink">Our Office / Ubud Central</span>
            </div>
            {/* Show all villas or specific office location if available */}
            <MapComponent 
                villas={villas} 
                zoom={12} 
            />
        </div>

    </div>
  );
};