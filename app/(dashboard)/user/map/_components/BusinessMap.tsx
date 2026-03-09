"use client";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useSelector } from "react-redux";
import { selectAllMapLocations, selectMapLocationsData } from "@/features/mapLocations/mapLocationsSlice";
import { selectAllCatalogBenefits } from "@/features/benefitCatalog/benefitCatalogSlice";
import { selectIsNavOpen } from "@/features/navbar/navbarSlice";

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const ROSARIO_LAT = -32.9468;
const ROSARIO_LNG = -60.6393;

interface Props {
  focusBusinessId?: string;
}

export default function BusinessMap({ focusBusinessId }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const locations = useSelector(selectAllMapLocations);
  const { loading } = useSelector(selectMapLocationsData);
  const catalogBenefits = useSelector(selectAllCatalogBenefits);
  const isNavOpen = useSelector(selectIsNavOpen);

  // Init map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView([ROSARIO_LAT, ROSARIO_LNG], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapRef.current = map;
    setMapReady(true);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        setMapReady(false);
      }
    };
  }, []);

  // Invalidate size after sidebar transition
  useEffect(() => {
    if (!mapRef.current) return;
    const timeout = setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 310);
    return () => clearTimeout(timeout);
  }, [isNavOpen]);

  // Add markers — only runs when map is ready
  useEffect(() => {
    if (!mapReady || !mapRef.current || locations.length === 0) return;


    // Remove existing markers before re-adding
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current!.removeLayer(layer);
      }
    });

    locations.forEach((loc) => {
      if (!loc.coordinates || loc.coordinates.length < 2) return;
      const [lat, lng] = loc.coordinates;

      const businessBenefits = catalogBenefits.filter(
        (b) => b.business._id === loc.business?._id
      );

      const benefitRows =
        businessBenefits.length > 0
          ? businessBenefits
              .map(
                (b) =>
                  `<li style="margin:3px 0;display:flex;justify-content:space-between;gap:12px">
                    <span>${b.title}</span>
                    <span style="color:#7c3aed;font-weight:600;white-space:nowrap">${b.pointsCost} pts</span>
                  </li>`
              )
              .join("")
          : `<li style="color:#999;font-style:italic">Sin beneficios activos</li>`;

      const popup = `
        <div style="min-width:220px;max-width:280px;font-family:system-ui,sans-serif;line-height:1.4">
          <p style="font-size:15px;font-weight:700;margin:0 0 4px">${loc.business?.businessName ?? "Negocio"}</p>
          ${
            loc.business?.businessCategory
              ? `<span style="font-size:11px;background:#f3e8ff;color:#7c3aed;padding:2px 8px;border-radius:999px;display:inline-block;margin-bottom:8px">${loc.business.businessCategory}</span>`
              : ""
          }
          <p style="font-size:12px;color:#555;margin:4px 0">
            <b>Sede:</b> ${loc.name}
          </p>
          <p style="font-size:12px;color:#555;margin:4px 0 10px">
            <b>Ubicación:</b> ${lat.toFixed(5)}, ${lng.toFixed(5)}
          </p>
          <p style="font-size:12px;font-weight:600;color:#111;margin:0 0 4px">
            Beneficios activos (${loc.activeBenefitCount})
          </p>
          <ul style="margin:0;padding-left:0;list-style:none;font-size:12px;color:#444;border-top:1px solid #eee;padding-top:6px">
            ${benefitRows}
          </ul>
        </div>
      `;

      const marker = L.marker([lat, lng])
        .addTo(mapRef.current!)
        .bindPopup(popup, { maxWidth: 300 });

      // Auto-focus if this business matches the query param
      if (focusBusinessId && loc.business?._id === focusBusinessId) {
        mapRef.current!.flyTo([lat, lng], 17, { duration: 1.2 });
        marker.openPopup();
      }
    });
  }, [mapReady, locations, catalogBenefits, focusBusinessId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-magenta-fuchsia-600" />
      </div>
    );
  }

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-screen"
      style={{ zIndex: 0 }}
    />
  );
}
