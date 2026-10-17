import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, PageHeader, Screen } from './ui';
import { IconGround } from './icons';

interface Location {
  latitude: number;
  longitude: number;
}

interface Hospital {
  id: string;
  name: string;
  phone?: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
}

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

const TILE_SIZE = 256;
const ZOOM = 14;
const MAP_WIDTH = TILE_SIZE * 3;
const MAP_HEIGHT = TILE_SIZE * 2;

function worldPoint({ latitude, longitude }: Location) {
  const scale = TILE_SIZE * 2 ** ZOOM;
  const mapLatitude = Math.max(-85.0511, Math.min(85.0511, latitude));
  const sinLatitude = Math.sin((mapLatitude * Math.PI) / 180);
  return {
    x: ((longitude + 180) / 360) * scale,
    y: ((0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI)) * scale),
  };
}

function distanceKm(a: Location, b: Location) {
  const radians = Math.PI / 180;
  const dLat = (b.latitude - a.latitude) * radians;
  const dLon = (b.longitude - a.longitude) * radians;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.latitude * radians) *
      Math.cos(b.latitude * radians) *
      Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function EmergencyMap() {
  const [location, setLocation] = useState<Location | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const findHospitals = useCallback(() => {
    setLoading(true);
    setError('');
    setLocation(null);
    setHospitals([]);

    if (!navigator.geolocation) {
      setError('Location services are not supported in this browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const current = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(current);

        try {
          const query = `[out:json][timeout:20];(nwr["amenity"="hospital"](around:20000,${current.latitude},${current.longitude}););out tags center;`;
          const response = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            body: new URLSearchParams({ data: query }),
          });
          if (!response.ok) {
            throw new Error(`Hospital search failed (${response.status}).`);
          }
          const data = (await response.json()) as { elements?: OverpassElement[] };
          const nearest = (data.elements ?? [])
            .map((element) => {
              const latitude = element.lat ?? element.center?.lat;
              const longitude = element.lon ?? element.center?.lon;
              if (latitude === undefined || longitude === undefined) return null;
              return {
                id: `${element.type}-${element.id}`,
                name: element.tags?.name || 'Hospital (name unavailable)',
                phone: element.tags?.phone || element.tags?.['contact:phone'],
                latitude,
                longitude,
                distanceKm: distanceKm(current, { latitude, longitude }),
              };
            })
            .filter((hospital): hospital is NonNullable<typeof hospital> => hospital !== null)
            .sort((a, b) => a.distanceKm - b.distanceKm)
            .slice(0, 5);
          setHospitals(nearest);
        } catch (searchError) {
          setError(
            searchError instanceof Error
              ? `${searchError.message} Please try again in a moment.`
              : 'Could not load nearby hospitals. Please try again.',
          );
        } finally {
          setLoading(false);
        }
      },
      (locationError) => {
        setError(
          locationError.code === locationError.PERMISSION_DENIED
            ? 'Location access was denied. Allow location access in your browser settings to find nearby hospitals.'
            : `Could not get your location: ${locationError.message}`,
        );
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  }, []);

  useEffect(() => {
    findHospitals();
  }, [findHospitals]);

  const center = useMemo(() => location ? worldPoint(location) : null, [location]);
  const tiles = useMemo(() => {
    if (!center) return [];
    const left = Math.floor(center.x / TILE_SIZE) - 1;
    const top = Math.floor(center.y / TILE_SIZE) - 1;
    return Array.from({ length: 9 }, (_, index) => {
      const tileX = left + (index % 3);
      const tileY = top + Math.floor(index / 3);
      return {
        key: `${tileX}-${tileY}`,
        x: tileX * TILE_SIZE - center.x + MAP_WIDTH / 2,
        y: tileY * TILE_SIZE - center.y + MAP_HEIGHT / 2,
        url: `https://tile.openstreetmap.org/${ZOOM}/${tileX}/${tileY}.png`,
      };
    });
  }, [center]);

  return (
    <Screen>
      <PageHeader
        kicker="Emergency support"
        title="Nearby hospitals"
        sub="Allow location access to find the closest hospitals. Your location is sent to the OpenStreetMap search service for this lookup and is not saved by this app."
      />

      {error && (
        <Card className="mb-4 border-rosesoft-300/25">
          <p role="alert" className="text-sm text-rosesoft-300">{error}</p>
          <button
            type="button"
            onClick={findHospitals}
            className="mt-3 rounded-full border border-white/10 px-4 py-2 text-sm text-mist-200 hover:bg-white/5"
          >
            Try again
          </button>
        </Card>
      )}

      {loading && (
        <Card className="mb-4">
          <div role="status" className="flex items-center gap-3 text-sm text-mist-300">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-glow-300/30 border-t-glow-300" />
            Finding your location and nearby hospitals…
          </div>
        </Card>
      )}

      {location && center && (
        <Card className="mb-4 overflow-hidden !p-2">
          <svg
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            className="block w-full rounded-2xl bg-night-900"
            role="img"
            aria-label={`Map showing your location and ${hospitals.length} nearby hospitals`}
          >
            <title>Your location and nearby hospitals</title>
            {tiles.map((tile) => (
              <image
                key={tile.key}
                href={tile.url}
                x={tile.x}
                y={tile.y}
                width={TILE_SIZE}
                height={TILE_SIZE}
              />
            ))}
            {hospitals.map((hospital) => {
              const point = worldPoint(hospital);
              const x = point.x - center.x + MAP_WIDTH / 2;
              const y = point.y - center.y + MAP_HEIGHT / 2;
              if (x < 0 || x > MAP_WIDTH || y < 0 || y > MAP_HEIGHT) return null;
              return (
                <g key={hospital.id} transform={`translate(${x} ${y})`}>
                  <circle r="11" fill="#9f3948" stroke="white" strokeWidth="3" />
                  <text y="4" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">H</text>
                </g>
              );
            })}
            <g transform={`translate(${MAP_WIDTH / 2} ${MAP_HEIGHT / 2})`}>
              <circle r="12" fill="#1976d2" stroke="white" strokeWidth="3" />
              <circle r="4" fill="white" />
            </g>
          </svg>
          <div className="flex flex-wrap gap-4 px-2 pt-2 text-xs text-mist-400">
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-blue-600" />Your location</span>
            <span className="inline-flex items-center gap-2"><span className="grid h-4 w-4 place-items-center rounded-full bg-rosesoft-300 text-[9px] font-bold text-white">H</span>Hospital</span>
          </div>
          <p className="px-2 pt-2 text-[11px] text-mist-500">
            Map data © OpenStreetMap contributors
          </p>
        </Card>
      )}

      <section aria-labelledby="hospital-results-title">
        <h2 id="hospital-results-title" className="mb-3 flex items-center gap-2 font-display text-xl text-mist-50">
          <IconGround className="h-5 w-5 text-glow-300" />
          Nearest hospitals
        </h2>
        {!loading && !error && hospitals.length === 0 && (
          <Card>
            <p className="text-sm text-mist-400">No hospitals were found within 20 km. If this is an emergency, contact your local emergency service.</p>
          </Card>
        )}
        <div className="space-y-3">
          {hospitals.map((hospital, index) => (
            <Card key={hospital.id} className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-rosesoft-300/15 font-semibold text-rosesoft-300">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-mist-100">{hospital.name}</h3>
                <p className="mt-1 text-xs text-mist-500">{hospital.distanceKm.toFixed(1)} km away</p>
                {hospital.phone ? (
                  <a className="mt-2 inline-block text-sm text-glow-300 underline" href={`tel:${hospital.phone}`}>
                    {hospital.phone}
                  </a>
                ) : (
                  <p className="mt-2 text-xs text-mist-600">Phone number not listed</p>
                )}
                <a
                  className="ml-3 inline-block text-xs text-glow-300 underline"
                  href={`https://www.openstreetmap.org/?mlat=${hospital.latitude}&mlon=${hospital.longitude}#map=${ZOOM}/${hospital.latitude}/${hospital.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open map
                </a>
              </div>
            </Card>
          ))}
        </div>
      </section>
      <p className="mt-4 text-xs leading-relaxed text-mist-600">
        Hospital listings come from OpenStreetMap and may be incomplete or out of date. For a medical emergency, contact your local emergency number.
      </p>
    </Screen>
  );
}
