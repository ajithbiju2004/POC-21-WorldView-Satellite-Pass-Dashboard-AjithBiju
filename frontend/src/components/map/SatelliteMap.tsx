"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { useRef, useEffect } from "react";
import { useMap } from "react-leaflet";


interface SatelliteMapProps {
  satellites: any[];
  setSelectedSatellite: (satellite: any) => void;
}

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function HeatLayer({ satellites }: { satellites: any[] }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const heatPoints = satellites.map((satellite) => [
      satellite.lat,
      satellite.lng,
      satellite.status === "Active"
        ? 1.0
        : satellite.status === "Standby"
        ? 0.6
        : 0.2
    ]);

    const heatLayer = (L as any).heatLayer(heatPoints, {
        radius: 90,
        blur: 55,
        maxZoom: 6,
        minOpacity: 0.4,
        gradient: {
            0.1: "#0011ff",
            0.3: "#00ffff",
            0.5: "#00ff44",
            0.7: "#ffcc00",
            1.0: "#ff0000",
        },
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, satellites]);

  return null;
}

export default function SatelliteMap({
  satellites,
  setSelectedSatellite,
}: SatelliteMapProps) {


  return (
    <MapContainer
        center={[20, 0]}
        zoom={2}
        className="h-full w-full"
    >

        <HeatLayer satellites={satellites} />

        <TileLayer
            attribution='&copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

      {satellites.map((satellite, index) => (
        <Marker
          key={index}
          position={[satellite.lat, satellite.lng]}
          icon={markerIcon}
          eventHandlers={{
            click: () => {
              setSelectedSatellite(satellite);
            },
          }}
        >
          <Popup>
            <div className="bg-[#030712] text-white p-2 rounded-md min-w-[180px]">
              <h2 className="font-bold text-[#38BDF8]">
                {satellite.name}
              </h2>

              <p className="text-sm text-gray-300">
                {satellite.coverage}
              </p>

              <p className="text-sm text-gray-300">
                {satellite.status}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}