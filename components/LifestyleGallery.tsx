import React from 'react';

const IMAGES = [
    { src: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2888&auto=format&fit=crop", label: "Details" },
    { src: "https://images.unsplash.com/photo-1516205651411-a8531c535682?q=80&w=2070&auto=format&fit=crop", label: "Rituals" },
    { src: "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?q=80&w=2070&auto=format&fit=crop", label: "Design" },
    { src: "https://images.unsplash.com/photo-1583212235753-b250a4b5b48e?q=80&w=1964&auto=format&fit=crop", label: "Taste" },
    { src: "https://images.unsplash.com/photo-1559393031-109e87365a34?q=80&w=2070&auto=format&fit=crop", label: "Silence" },
    { src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop", label: "Nature" },
];

export const LifestyleGallery: React.FC = () => {
  return (
    <section className="relative py-24 bg-canvas z-10 border-b border-ink/10">
      <div className="px-6 md:px-24 mb-12 flex justify-between items-end">
        <h2 className="font-serif text-4xl md:text-5xl text-ink">The Ubud Life</h2>
        <span className="font-sans text-[10px] uppercase tracking-widest text-ink/50 hidden md:block">Swipe to explore &rarr;</span>
      </div>

      {/* Horizontal Scroll Container (Native Drag feel) */}
      <div className="w-full overflow-x-auto pb-12 pl-6 md:pl-24 pr-6 hide-scrollbar flex gap-6 md:gap-12 cursor-grab active:cursor-grabbing">
        {IMAGES.map((img, i) => (
            <div key={i} className="relative flex-shrink-0 w-[280px] md:w-[400px] aspect-square overflow-hidden group">
                <img 
                    src={img.src} 
                    alt={img.label}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors duration-500 flex items-center justify-center">
                    <span className="font-serif text-2xl text-canvas opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        {img.label}
                    </span>
                </div>
            </div>
        ))}
        {/* Spacer for right padding */}
        <div className="w-6 md:w-24 flex-shrink-0"></div>
      </div>
    </section>
  );
};