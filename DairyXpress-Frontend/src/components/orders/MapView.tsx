import { useEffect, useMemo, useRef, useState } from 'react';
import L, { type LatLngBoundsExpression } from 'leaflet';
import { MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

type MapViewProps = { latitude?: number; longitude?: number; status: string; address: string };

const STORE_POSITION: [number, number] = [18.5111, 73.8491];
const STORE_ADDRESS = 'DairyXpress Store, Anand Nagar Metro Station, Pune';
const destinationIcon = L.divIcon({ className: 'bg-transparent', html: '<span style="display:grid;height:32px;width:32px;place-items:center;border:3px solid white;border-radius:999px;background:#2E7D32;color:white;box-shadow:0 4px 14px rgba(46,125,50,.35)">⌂</span>', iconSize: [32, 32], iconAnchor: [16, 16] });
const driverIcon = L.divIcon({ className: 'bg-transparent', html: '<span style="display:grid;height:30px;width:30px;place-items:center;border:3px solid white;border-radius:999px;background:#2563EB;color:white;box-shadow:0 4px 14px rgba(37,99,235,.35)">●</span>', iconSize: [30, 30], iconAnchor: [15, 15] });
const storeIcon = L.divIcon({ className: 'bg-transparent', html: '<span style="display:grid;height:34px;width:34px;place-items:center;border:3px solid white;border-radius:999px;background:#F59E0B;color:white;font-weight:800;box-shadow:0 4px 14px rgba(245,158,11,.4)">DX</span>', iconSize: [34, 34], iconAnchor: [17, 17] });

function FitRoute({ destination }: { destination: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    const bounds: LatLngBoundsExpression = [STORE_POSITION, destination];
    map.fitBounds(bounds, { padding: [42, 42], maxZoom: 14, animate: true });
  }, [destination, map]);
  return null;
}

function AnimatedDriverMarker({ position }: { position: [number, number] }) {
  const markerRef = useRef<L.Marker>(null);
  const [displayPosition, setDisplayPosition] = useState<[number, number]>(position);
  const displayPositionRef = useRef<[number, number]>(position);
  useEffect(() => {
    const start = displayPositionRef.current;
    const startedAt = performance.now();
    let frame = 0;
    const animate = (now: number) => {
      const progress = Math.min((now - startedAt) / 900, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next: [number, number] = [start[0] + (position[0] - start[0]) * eased, start[1] + (position[1] - start[1]) * eased];
      markerRef.current?.setLatLng(next);
      displayPositionRef.current = next;
      setDisplayPosition(next);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [position]);
  return <Marker ref={markerRef} position={displayPosition} icon={driverIcon}><Tooltip direction="top" offset={[0, -14]}>Estimated rider position</Tooltip></Marker>;
}

export function MapView({ latitude, longitude, status, address }: MapViewProps) {
  const destination = useMemo<[number, number]>(() => [latitude ?? 18.5204, longitude ?? 73.8567], [latitude, longitude]);
  const progress = status === 'DELIVERED' ? 1 : status === 'OUT_FOR_DELIVERY' ? 0.75 : status === 'PACKED' ? 0.45 : 0.16;
  const driver: [number, number] = [STORE_POSITION[0] + (destination[0] - STORE_POSITION[0]) * progress, STORE_POSITION[1] + (destination[1] - STORE_POSITION[1]) * progress];

  return <div className="relative h-72 overflow-hidden rounded-3xl border border-cream-300 bg-cream-200 sm:h-80">
    <MapContainer center={STORE_POSITION} zoom={13} scrollWheelZoom={false} className="h-full w-full" aria-label="Delivery route from DairyXpress Anand Nagar store">
      <FitRoute destination={destination} />
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Polyline positions={[STORE_POSITION, driver, destination]} pathOptions={{ color: '#2E7D32', weight: 5, opacity: 0.75, dashArray: status === 'DELIVERED' ? undefined : '10 10' }} />
      <Marker position={STORE_POSITION} icon={storeIcon}><Tooltip permanent direction="top" offset={[0, -18]}>{STORE_ADDRESS}</Tooltip></Marker>
      <Marker position={destination} icon={destinationIcon}><Tooltip direction="top" offset={[0, -16]}>{address || 'Delivery destination'}</Tooltip></Marker>
      <AnimatedDriverMarker position={driver} />
    </MapContainer>
    <div className="pointer-events-none absolute left-3 top-3 z-[500] max-w-[15rem] rounded-xl border border-white/60 bg-white/90 px-3 py-2 text-xs font-semibold text-ink shadow-card backdrop-blur">Dispatching from Anand Nagar Metro Station, Pune</div>
  </div>;
}
