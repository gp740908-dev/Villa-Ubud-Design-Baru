import { Villa } from './types';

export const PHONE_NUMBER = '6281234567890';

export const VILLAS: Villa[] = [
  {
    id: '1',
    slug: 'villa-amandari',
    name: 'Villa Amandari',
    pricePerNight: 4500000,
    capacity: 4,
    imageUrl: 'https://images.unsplash.com/photo-1572331165267-854da2b00ca1?q=80&w=2070&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?q=80&w=2069&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576013551627-5cc20b368619?q=80&w=2070&auto=format&fit=crop'
    ],
    description: 'Cliffside serenity overlooking the Ayung River valley.',
    longDescription: 'Perched on the edge of the Ayung River gorge, Villa Amandari is a testament to Balinese elegance. Designed to disappear into the jungle, the open-air architecture allows the breeze to flow freely. Every corner offers a view of the lush canopy. The infinity pool seems to drop straight into the river below, offering a swimming experience unlike any other.',
    specs: {
      bedrooms: 2,
      bathrooms: 2.5,
      poolSize: "12m x 4m",
      area: "350 sqm"
    },
    amenities: ["River View", "Infinity Pool", "Butler Service", "Floating Breakfast"],
    location: { lat: -8.4900, lng: 115.2400 }
  },
  {
    id: '2',
    slug: 'the-green-flow',
    name: 'The Green Flow',
    pricePerNight: 3200000,
    capacity: 2,
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-e328701102b9?q=80&w=2069&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1570213489059-0aac6626cade?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1974&auto=format&fit=crop'
    ],
    description: 'Deep jungle immersion with sustainable bamboo architecture.',
    longDescription: 'Constructed entirely from locally sourced bamboo, The Green Flow is a masterpiece of sustainable design. The structure curves and bends with the landscape, creating organic spaces that feel alive. Wake up to the sound of birds and the rustle of leaves. This is not just a stay; it is a communion with nature.',
    specs: {
      bedrooms: 1,
      bathrooms: 1,
      poolSize: "Plunge Pool",
      area: "120 sqm"
    },
    amenities: ["Bamboo Architecture", "Forest Bathing", "Organic Garden", "Private Yoga Deck"],
    location: { lat: -8.5200, lng: 115.2700 }
  },
  {
    id: '3',
    slug: 'sanctuary-hidden',
    name: 'Sanctuary Hidden',
    pricePerNight: 6800000,
    capacity: 6,
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?q=80&w=1974&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?q=80&w=2069&auto=format&fit=crop'
    ],
    description: 'Private waterfall access and expansive rice terrace views.',
    longDescription: 'Hidden away from the maps, this sanctuary offers exclusive access to a private waterfall. The villa sits atop a ridge, commanding 360-degree views of the emerald rice terraces. Interiors feature reclaimed teak and modern art, blending tradition with contemporary luxury.',
    specs: {
      bedrooms: 3,
      bathrooms: 3,
      poolSize: "15m x 5m",
      area: "500 sqm"
    },
    amenities: ["Private Waterfall", "Rice Terrace View", "Chef's Kitchen", "Media Room"],
    location: { lat: -8.4800, lng: 115.2800 }
  },
  {
    id: '4',
    slug: 'estate-kayon',
    name: 'Estate Kayon',
    pricePerNight: 9500000,
    capacity: 8,
    imageUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753197-8745131b8027?q=80&w=2070&auto=format&fit=crop'
    ],
    description: 'The ultimate executive retreat for private gatherings.',
    longDescription: 'Estate Kayon is the pinnacle of luxury in Ubud. Designed for large families or executive retreats, it features expansive living areas, a dedicated staff of six, and a spa pavilion. The architecture is grand yet grounded, using massive stone blocks and soaring thatched roofs.',
    specs: {
      bedrooms: 4,
      bathrooms: 5,
      poolSize: "20m Lap Pool",
      area: "850 sqm"
    },
    amenities: ["Full Staff", "Spa Pavilion", "Gym", "Wine Cellar"],
    location: { lat: -8.5300, lng: 115.2500 }
  }
];