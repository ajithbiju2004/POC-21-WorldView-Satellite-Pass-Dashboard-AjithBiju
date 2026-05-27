"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

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
            <div className="text-black">
              <h2 className="font-bold">
                {satellite.name}
              </h2>

              <p>
                {satellite.coverage}
              </p>

              <p>
                {satellite.status}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}