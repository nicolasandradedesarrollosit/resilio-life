"use client";
import dynamic from "next/dynamic";

const LocationPicker = dynamic(() => import("./LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 rounded-xl border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
      <div className="animate-pulse text-gray-500">Cargando mapa...</div>
    </div>
  ),
});

interface LocationPickerWrapperProps {
  onLocationSelect: (lat: number, lng: number, address?: string) => void;
  initialLat?: number;
  initialLng?: number;
}

export default function LocationPickerWrapper(
  props: LocationPickerWrapperProps,
) {
  return <LocationPicker {...props} />;
}
