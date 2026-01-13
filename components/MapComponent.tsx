import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Villa } from '../types';

// Extend Leaflet's Default Icon to avoid 404s
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapComponentProps {
  villas: Villa[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (slug: string) => void;
  className?: string;
}

export const MapComponent: React.FC<MapComponentProps> = ({ 
  villas, 
  center, 
  zoom = 12,
  onMarkerClick,
  className = "w-full h-full"
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy existing map if villas data changes
    if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
    }

    // 1. Initialize Map
    // Validate center coordinates safely
    const hasValidCenter = center && typeof center[0] === 'number' && typeof center[1] === 'number';
    const initialCenter: L.LatLngExpression = hasValidCenter ? center : [-8.5069, 115.2625];
    
    const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: zoom,
        scrollWheelZoom: false,
    });
    mapInstanceRef.current = map;

    // 2. Add Tile Layer (CartoDB Voyager - Clean/Beige)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // 3. Custom Icon
    const customIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="
          background-color: #537F5D;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid #D3D49F;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        ">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-[#D3D49F]" style="width: 16px; height: 16px;">
            <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
            <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
          </svg>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    const markers: L.Marker[] = [];

    // 4. Add Markers
    villas.forEach(villa => {
      // Validate location coordinates
      if (villa.location && typeof villa.location.lat === 'number' && typeof villa.location.lng === 'number') {
          const marker = L.marker([villa.location.lat, villa.location.lng], { icon: customIcon })
            .addTo(map)
            .bindPopup(`
              <div style="text-align: center; min-width: 150px;">
                <img src="${villa.imageUrl}" style="width: 100%; height: 80px; object-fit: cover; margin-bottom: 8px; border-radius: 2px;" />
                <h3 style="font-family: 'Playfair Display', serif; color: #537F5D; margin: 0; font-size: 16px;">${villa.name}</h3>
                <p style="font-family: 'Manrope', sans-serif; color: #537F5D; font-size: 10px; opacity: 0.8; margin: 4px 0;">${(villa.pricePerNight/1000000).toFixed(1)}M IDR / night</p>
                ${onMarkerClick 
                    ? `<button class="popup-btn" data-slug="${villa.slug}" style="margin-top: 8px; text-transform: uppercase; letter-spacing: 0.1em; font-size: 10px; color: #537F5D; border-bottom: 1px solid #537F5D; background: none; border: none; cursor: pointer;">View Details</button>` 
                    : ''}
              </div>
            `);
          
          markers.push(marker);
      }
    });

    // 5. Fit Bounds (if multiple villas and no specific center forced)
    if (!hasValidCenter && markers.length > 0) {
        const group = L.featureGroup(markers);
        map.fitBounds(group.getBounds(), { padding: [50, 50] });
    }

    // 6. Handle Popup Clicks
    if (onMarkerClick) {
        map.on('popupopen', (e) => {
             const content = e.popup.getElement();
             const btn = content?.querySelector('.popup-btn');
             if(btn) {
                btn.addEventListener('click', (evt) => {
                    evt.preventDefault();
                    // @ts-ignore
                    const slug = evt.target.dataset.slug;
                    if(slug) onMarkerClick(slug);
                });
             }
        });
    }

    // Cleanup
    return () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }
    }

  }, [villas, center, zoom, onMarkerClick]);

  return (
    <div className={`relative bg-canvas ${className}`}>
        <div ref={mapContainerRef} className="w-full h-full z-10" />
    </div>
  );
};