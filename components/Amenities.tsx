import React from 'react';

const AMENITIES = [
    { title: "Infinity Pool", icon: "≈", desc: "Suspended over the valley" },
    { title: "Private Chef", icon: "♨", desc: "Farm-to-table dining" },
    { title: "Fiber WiFi", icon: "⇪", desc: "Connect if you must" },
    { title: "Yoga Deck", icon: "☯", desc: "Sunrise practice" },
    { title: "24/7 Security", icon: "⚿", desc: "Complete peace of mind" },
    { title: "Concierge", icon: "☎", desc: "At your service" },
];

export const Amenities: React.FC = () => {
  return (
    <section className="relative py-32 md:py-48 px-6 md:px-24 bg-ink z-10 overflow-hidden">
      
      {/* Background Image */}
      <div className="absolute inset-0 opacity-40 mix-blend-overlay">
         <img 
            src="https://images.unsplash.com/photo-1613545325278-f24b0cae1224?q=80&w=2070&auto=format&fit=crop" 
            alt="Amenities Background" 
            className="w-full h-full object-cover grayscale"
         />
      </div>
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink opacity-90"></div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-24">
            <span className="font-sans text-xs uppercase tracking-widest text-matcha mb-4 block">Uncompromising Comfort</span>
            <h2 className="font-serif text-4xl md:text-6xl text-canvas">Everything You Need,<br/>Nothing You Don't.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            {AMENITIES.map((item, index) => (
                <div key={index} className="flex flex-col items-center text-center group">
                    <div className="w-16 h-16 rounded-full border border-canvas/20 flex items-center justify-center mb-6 group-hover:bg-canvas group-hover:text-ink transition-all duration-500">
                        <span className="text-3xl">{item.icon}</span>
                    </div>
                    <h3 className="font-serif text-2xl text-canvas mb-2">{item.title}</h3>
                    <p className="font-sans text-xs uppercase tracking-widest text-matcha/80">{item.desc}</p>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};