
export interface VillaSpecs {
  bedrooms: number;
  bathrooms: number;
  poolSize: string; // e.g. "12m x 4m"
  area: string; // e.g. "450 sqm"
}

export interface Villa {
  id: string;
  slug: string;
  name: string;
  pricePerNight: number;
  capacity: number;
  imageUrl: string; // Main Hero Image
  gallery: string[]; // Additional images
  description: string; // Short description
  longDescription: string; // Full story
  specs: VillaSpecs;
  amenities: string[];
  location: {
    lat: number;
    lng: number;
  };
}

export interface BookingDetails {
  villaName: string;
  checkIn: string;
  nights: number;
  guests: number;
  totalPrice: number;
}

export interface Booking {
    id: string;
    villa_id: string;
    start_date: string; // ISO Date string YYYY-MM-DD
    end_date: string;   // ISO Date string YYYY-MM-DD
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML string
  image_url: string;
  category: string;
  published_at: string;
  is_published: boolean;
}