"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";


interface SatelliteMapProps {
  satellites: any[];
  setSelectedSatellite: (satellite: any) => void;
}

const activeIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const standbyIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const maintenanceIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function getMarkerIcon(status: string) {
  switch (status) {
    case "Active":
      return activeIcon;

    case "Standby":
      return standbyIcon;

    case "Maintenance":
      return maintenanceIcon;

    default:
      return activeIcon;
  }
}

function HeatLayer({ satellites }: { satellites: any[] }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const heatPoints = satellites.map((satellite, index) => [
      satellite.lat,
      satellite.lng,
      0.5 + ((index % 5) * 0.1)
    ]);

    const heatLayer = (L as any).heatLayer(heatPoints, {
        radius: 75,
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

    const [simTime, setSimTime] = useState(0);
    const [animatedSatellites, setAnimatedSatellites] =
    useState(satellites);
    useEffect(() => {
        setAnimatedSatellites(satellites);
    }, [satellites]);
    useEffect(() => {
        const interval = setInterval(() => {
            setSimTime((t) => (t + 1) % 24);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
    const interval = setInterval(() => {
        setAnimatedSatellites((prev) =>
        prev.map((sat, index) => ({
            ...sat,

            lat:
            sat.lat +
            Math.sin((simTime + index) * 0.3) * 0.03,

            lng:
            sat.lng +
            Math.cos((simTime + index) * 0.3) * 0.03,
        }))
        );
    }, 4000);

    return () => clearInterval(interval);
    }, [simTime]);

    const isInPassWindow = (index: number) => {
    const start = (index * 3) % 24;
    const end = start + 6;

    return simTime >= start && simTime <= end;
    };

    const getPassWindow = (index: number) => {
        const start = (index * 3) % 24;
        const end = (start + 6) % 24;

        return {
            start,
            end,
        };
    };


  return (
    <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxBounds={[
            [-90, -180],
            [90, 180],
        ]}
        maxBoundsViscosity={1.0}
        worldCopyJump={false}
        className="h-full w-full"
    >

        <HeatLayer satellites={animatedSatellites} />

        <TileLayer
            attribution='&copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        
        {animatedSatellites.map((satellite, index) =>
            isInPassWindow(index) ? (
                <Circle
                key={`circle-${index}`}
                center={[satellite.lat, satellite.lng]}
                radius={600000}
                pathOptions={{
                    color: "#38BDF8",
                    fillColor: "#38BDF8",
                    fillOpacity: 0.08,
                }}
                />
            ) : null
        )}
        

      {animatedSatellites.map((satellite, index) => (
        <Marker
          key={index}
          position={[satellite.lat, satellite.lng]}
          icon={getMarkerIcon(satellite.status)}
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

              <p className="text-sm text-cyan-300">
                Sim Time: {simTime}:00 UTC
              </p>

              <p className="text-xs text-green-300">
                Pass Start: {getPassWindow(index).start}:00 UTC
              </p>

              <p className="text-xs text-orange-300">
                Pass End: {getPassWindow(index).end}:00 UTC
              </p>

              <p className="text-sm text-gray-300">
                {isInPassWindow(index)
                    ? "IN PASS WINDOW"
                    : "AWAITING PASS"}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}