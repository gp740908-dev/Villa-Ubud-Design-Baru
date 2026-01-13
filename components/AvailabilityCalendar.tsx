import React, { useState } from 'react';
import { Booking } from '../types';

interface AvailabilityCalendarProps {
  bookings: Booking[];
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ bookings }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    const today = new Date();
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    // Prevent going back past current month
    if (newDate.getMonth() < today.getMonth() && newDate.getFullYear() <= today.getFullYear()) return;
    setCurrentDate(newDate);
  };

  const renderMonth = (date: Date, index: number) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun
    
    // Adjust for Monday start if desired (currently Sun=0)
    // Let's stick to Sun=0 for standard view, or logic:
    // const padding = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; (For Mon start)
    const padding = firstDayOfMonth; 

    const days = [];
    const today = new Date();
    today.setHours(0,0,0,0);

    // Padding Days
    for (let i = 0; i < padding; i++) {
        days.push(<div key={`pad-${i}`} className="w-8 h-8"></div>);
    }

    // Actual Days
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDayDate = new Date(year, month, day);
        const dateStr = currentDayDate.toISOString().split('T')[0];
        
        // Check Status
        const isPast = currentDayDate < today;
        const isBooked = bookings.some(b => 
            dateStr >= b.start_date && dateStr <= b.end_date
        );

        let classes = "w-8 h-8 flex items-center justify-center text-xs font-sans transition-all duration-300 rounded-full ";
        
        if (isPast) {
            classes += "text-ink/10 cursor-default";
        } else if (isBooked) {
            classes += "text-ink/30 line-through cursor-not-allowed";
        } else {
            classes += "text-ink cursor-default hover:bg-ink hover:text-canvas font-medium";
        }

        days.push(
            <div key={day} className="flex justify-center items-center">
                <span className={classes}>{day}</span>
            </div>
        );
    }

    return (
        <div className={`flex-1 ${index === 1 ? 'hidden md:block' : ''}`}>
            <h4 className="font-serif text-lg text-ink text-center mb-6">
                {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h4>
            
            {/* Days Header */}
            <div className="grid grid-cols-7 mb-4 text-center">
                {['S','M','T','W','T','F','S'].map(d => (
                    <span key={d} className="font-sans text-[10px] text-ink/40 uppercase tracking-widest">{d}</span>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-y-2">
                {days}
            </div>
        </div>
    );
  };

  const secondMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

  return (
    <div className="w-full bg-canvas border border-ink/10 p-6 md:p-8 mt-8">
        
        {/* Header / Nav */}
        <div className="flex justify-between items-center mb-8 border-b border-ink/10 pb-4">
            <span className="font-sans text-[10px] uppercase tracking-widest text-matcha">Availability</span>
            <div className="flex gap-4">
                <button onClick={prevMonth} className="text-ink hover:text-terrace disabled:opacity-20 transition-colors">&larr;</button>
                <button onClick={nextMonth} className="text-ink hover:text-terrace transition-colors">&rarr;</button>
            </div>
        </div>

        {/* Calendars Container */}
        <div className="flex flex-col md:flex-row gap-12">
            {renderMonth(currentDate, 0)}
            {renderMonth(secondMonthDate, 1)}
        </div>

        {/* Legend */}
        <div className="flex gap-6 mt-8 pt-4 border-t border-ink/10 justify-center md:justify-start">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-ink"></div>
                <span className="font-sans text-[10px] uppercase tracking-widest text-ink/60">Available</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="font-sans text-xs text-ink/30 line-through">12</span>
                <span className="font-sans text-[10px] uppercase tracking-widest text-ink/60">Booked</span>
            </div>
        </div>

    </div>
  );
};