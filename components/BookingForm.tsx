import React, { useState, useEffect } from 'react';
import { Villa } from '../types';
import { PHONE_NUMBER } from '../constants';
import { supabase } from '../lib/supabase';

interface BookingFormProps {
  villa: Villa;
  onClose?: () => void;
  variant?: 'modal' | 'widget';
}

export const BookingForm: React.FC<BookingFormProps> = ({ villa, onClose, variant = 'modal' }) => {
  const [nights, setNights] = useState<number>(3);
  const [guests, setGuests] = useState<number>(2);
  const [checkIn, setCheckIn] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Set default date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setCheckIn(tomorrow.toISOString().split('T')[0]);
  }, []);

  const total = nights * villa.pricePerNight;

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Construct the WhatsApp message
    const messageDetails = `
*New Booking Request - StayinUBUD*

*Villa:* ${villa.name}
*Guest:* ${name}
*Email:* ${email}
*Check-in:* ${checkIn}
*Nights:* ${nights}
*Guests:* ${guests}

*Estimated Total:* ${formatIDR(total)}

------------------------
Please confirm availability for these dates.
    `.trim();

    // 1. Save Lead to Supabase 'inquiries' table
    try {
        await supabase.from('inquiries').insert([{
            name: name,
            email: email,
            message: `BOOKING REQUEST: ${villa.name} | ${checkIn} | ${nights} nights | ${guests} pax`
        }]);
    } catch (err) {
        console.error("Failed to save lead:", err);
        // Continue to WhatsApp even if DB save fails
    }

    setIsSubmitting(false);

    // 2. Open WhatsApp
    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(messageDetails)}`;
    window.open(url, '_blank');
  };

  // Styles based on variant
  const containerClasses = variant === 'modal' 
    ? "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/90 backdrop-blur-sm"
    : "w-full bg-ink border border-canvas/20 p-8 shadow-xl";

  const wrapperClasses = variant === 'modal'
    ? "bg-ink w-full max-w-md border border-canvas/20 p-8 md:p-12 shadow-2xl relative"
    : "flex flex-col gap-6";

  return (
    <div className={containerClasses}>
        <div className={wrapperClasses}>
            {variant === 'modal' && (
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-canvas/50 hover:text-canvas transition-colors font-sans text-xs uppercase tracking-widest"
                >
                    Close [x]
                </button>
            )}

            <div>
                <h3 className="font-serif text-2xl md:text-3xl text-canvas mb-1">{villa.name}</h3>
                <p className="font-sans text-[10px] uppercase tracking-widest text-matcha">Reservation Inquiry</p>
            </div>

            <form onSubmit={handleBooking} className="flex flex-col gap-5 mt-6">
                <div className="flex flex-col gap-2">
                    <label className="text-canvas/60 text-[10px] uppercase tracking-widest">Full Name</label>
                    <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-transparent border-b border-canvas/20 py-2 text-canvas focus:outline-none focus:border-matcha transition-colors placeholder:text-canvas/20 font-serif text-lg"
                        placeholder="John Doe"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-canvas/60 text-[10px] uppercase tracking-widest">Email Address</label>
                    <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-transparent border-b border-canvas/20 py-2 text-canvas focus:outline-none focus:border-matcha transition-colors placeholder:text-canvas/20 font-serif text-lg"
                        placeholder="john@example.com"
                    />
                </div>

                <div className="flex gap-4">
                    <div className="flex flex-col gap-2 w-1/2">
                        <label className="text-canvas/60 text-[10px] uppercase tracking-widest">Check-in</label>
                        <input 
                            type="date" 
                            required
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            className="bg-transparent border-b border-canvas/20 py-2 text-canvas focus:outline-none focus:border-matcha transition-colors font-sans text-sm"
                        />
                    </div>
                    <div className="flex flex-col gap-2 w-1/4">
                        <label className="text-canvas/60 text-[10px] uppercase tracking-widest">Nights</label>
                        <input 
                            type="number" 
                            min="1"
                            value={nights}
                            onChange={(e) => setNights(parseInt(e.target.value))}
                            className="bg-transparent border-b border-canvas/20 py-2 text-canvas focus:outline-none focus:border-matcha transition-colors font-sans text-sm"
                        />
                    </div>
                    <div className="flex flex-col gap-2 w-1/4">
                        <label className="text-canvas/60 text-[10px] uppercase tracking-widest">Guests</label>
                        <input 
                            type="number" 
                            min="1"
                            max={villa.capacity}
                            value={guests}
                            onChange={(e) => setGuests(parseInt(e.target.value))}
                            className="bg-transparent border-b border-canvas/20 py-2 text-canvas focus:outline-none focus:border-matcha transition-colors font-sans text-sm"
                        />
                    </div>
                </div>

                <div className="my-2 pt-4 border-t border-canvas/10 flex justify-between items-end">
                    <span className="text-canvas/60 text-xs font-sans">Estimated Total</span>
                    <span className="text-matcha text-xl md:text-2xl font-serif">{formatIDR(total)}</span>
                </div>

                <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-canvas text-ink py-4 hover:bg-matcha hover:text-ink transition-colors duration-500 font-sans text-xs font-bold uppercase tracking-widest mt-2 disabled:opacity-50"
                >
                    {isSubmitting ? 'Processing...' : 'Request Booking via WhatsApp'}
                </button>
            </form>
        </div>
    </div>
  );
};