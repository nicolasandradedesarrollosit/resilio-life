"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, X, MapPin, Navigation2 } from "lucide-react";

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number, address?: string) => void;
  initialLat?: number;
  initialLng?: number;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const ROSARIO_LAT = -32.9468;
const ROSARIO_LNG = -60.6393;

export default function LocationPicker({
  onLocationSelect,
  initialLat = ROSARIO_LAT,
  initialLng = ROSARIO_LNG,
}: LocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [selectedCoords, setSelectedCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const useMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización");

      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;

        if (mapRef.current) {
          mapRef.current.setView([lat, lng], 17);

          if (markerRef.current) {
            markerRef.current.remove();
          }

          const marker = L.marker([lat, lng]).addTo(mapRef.current);

          marker
            .bindPopup(
              `<b>Tu ubicación</b><br>Lat: ${lat.toFixed(6)}<br>Lng: ${lng.toFixed(6)}`,
            )
            .openPopup();
          markerRef.current = marker;
        }

        setSelectedCoords({ lat, lng });
        onLocationSelect(lat, lng);
        setIsLocating(false);
      },
      (error) => {
        alert("No se pudo obtener tu ubicación. Verificá los permisos.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, [onLocationSelect]);

  const searchAddress = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);

      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=ar&viewbox=-61.1,-33.2,-60.1,-32.7&bounded=1&limit=5`,
        {
          headers: {
            "Accept-Language": "es",
          },
        },
      );
      const data: NominatimResult[] = await response.json();

      setSearchResults(data);
      setShowResults(true);
    } catch (error) {
      // Error handled silently
    } finally{
      setIsSearching(false);
    }
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSearchQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchAddress(value);
    }, 400);
  };

  const selectSearchResult = (result: NominatimResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 17);

      if (markerRef.current) {
        markerRef.current.remove();
      }

      const marker = L.marker([lat, lng]).addTo(mapRef.current);

      marker
        .bindPopup(
          `<b>${result.display_name.split(",")[0]}</b><br>${result.display_name}`,
        )
        .openPopup();
      markerRef.current = marker;
    }

    setSelectedCoords({ lat, lng });
    setSearchQuery(result.display_name.split(",")[0]);
    setShowResults(false);
    onLocationSelect(lat, lng, result.display_name);
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView(
      [initialLat, initialLng],
      14,
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      if (markerRef.current) {
        markerRef.current.remove();
      }

      const marker = L.marker([lat, lng]).addTo(map);

      marker
        .bindPopup(
          `<b>Ubicación seleccionada</b><br>Lat: ${lat.toFixed(6)}<br>Lng: ${lng.toFixed(6)}`,
        )
        .openPopup();
      markerRef.current = marker;

      setSelectedCoords({ lat, lng });
      onLocationSelect(lat, lng);
      setSearchQuery("");
      setSearchResults([]);
      setShowResults(false);
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [initialLat, initialLng, onLocationSelect]);

  return (
    <div className="w-full space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-black"
            size={18}
          />
          <input
            className="w-full text-black pl-10 pr-10 py-2.5 border-2 border-gray-200 rounded-xl focus:border-fuchsia-500 focus:outline-none text-sm transition-colors"
            placeholder="Buscar dirección..."
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchResults.length > 0 && setShowResults(true)}
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSearchResults([]);
                setShowResults(false);
              }}
            >
              <X size={18} />
            </button>
          )}

          {showResults && searchResults.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
              {searchResults.map((result) => (
                <button
                  key={result.place_id}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-fuchsia-50 border-b border-gray-100 last:border-0 transition-colors"
                  type="button"
                  onClick={() => selectSearchResult(result)}
                >
                  <span className="font-medium text-magenta-fuchsia-800">
                    {result.display_name.split(",")[0]}
                  </span>
                  <span className="text-black text-xs block truncate">
                    {result.display_name}
                  </span>
                </button>
              ))}
            </div>
          )}

          {isSearching && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-center text-sm text-gray-500">
              Buscando...
            </div>
          )}
        </div>

        <button
          className="px-4 py-2.5 bg-gradient-to-r from-magenta-fuchsia-600 to-magenta-fuchsia-400 text-white rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 text-sm font-medium disabled:opacity-50"
          disabled={isLocating}
          title="Usar mi ubicación actual"
          type="button"
          onClick={useMyLocation}
        >
          <Navigation2
            className={isLocating ? "animate-pulse" : ""}
            size={18}
          />
          <span className="hidden sm:inline">
            {isLocating ? "Localizando..." : "Mi ubicación"}
          </span>
        </button>
      </div>

      <div
        ref={mapContainerRef}
        className="w-full h-64 rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm"
        style={{ zIndex: 0 }}
      />

      {selectedCoords && (
        <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
          <MapPin className="inline text-magenta-fuchsia-800" size={16} /> Lat:{" "}
          <span className="font-mono">{selectedCoords.lat.toFixed(6)}</span>,
          <MapPin
            className="inline text-magenta-fuchsia-800"
            size={16}
          /> Lng:{" "}
          <span className="font-mono">{selectedCoords.lng.toFixed(6)}</span>
        </div>
      )}

      <p className="text-xs text-gray-400">
        Usá el botón &quot;Mi ubicación&quot; o buscá una dirección para encontrar tu negocio
      </p>
    </div>
  );
}
