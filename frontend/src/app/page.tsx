"use client";

import { useEffect, useState } from "react";
import { getSatellites } from "@/lib/api";
const [selectedSatellite, setSelectedSatellite] = useState<any>(null);

export default function Home() {

  const [satellites, setSatellites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSatellites() {
      try {
        const data = await getSatellites();
        setSatellites(data);
        if (data.length > 0) {
          setSelectedSatellite(data[0]);
        }
      } catch (err) {
        console.error("Error fetching satellites:", err);
      } finally {
        setLoading(false);
      }
    }

    loadSatellites();
  }, []);


  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#030712] text-[#38BDF8]">
        Loading satellite data...
      </div>
    );
  }

  return (
    <div className="h-screen flex">

      <div className="w-[30%] bg-[#0B1117] border-r border-[#1F2937] p-4 overflow-y-auto">

        <h1 className="text-[#38BDF8] text-xl font-bold mb-6">
          WorldView Intelligence Console
        </h1>

        {/* Active Metrics */}
        <div className="space-y-4">

          <div className="p-4 bg-[#030712] border border-[#1F2937] rounded-lg">
            <p className="text-sm text-gray-400">ACTIVE SATELLITES</p>
            <h2 className="text-2xl text-[#38BDF8] font-bold">
              {satellites.length}
            </h2>
          </div>

          {/* Intelligence Panel */}
          <div className="p-4 bg-[#030712] border border-[#1F2937] rounded-lg">

            <p className="text-sm text-gray-400 mb-2">
              SELECTED SATELLITE
            </p>

            {selectedSatellite ? (
              <div className="space-y-2">

                <h2 className="text-lg font-semibold text-white">
                  {selectedSatellite.name}
                </h2>

                <p className="text-sm text-gray-400">
                  Coverage: {selectedSatellite.coverage}
                </p>

                <p className="text-sm text-gray-400">
                  Status: {selectedSatellite.status}
                </p>

                <p className="text-sm text-gray-400">
                  Revisit: {selectedSatellite.revisit_time}
                </p>

              </div>
            ) : (
              <p className="text-gray-500">
                No satellite selected
              </p>
            )}

          </div>

        </div>
      </div>

      {/* Main Panel (70%) */}
      <div className="w-[70%] p-4">

        {/* Top Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-4">

          <div className="bg-[#0B1117] border border-[#1F2937] p-4 rounded-lg">
            Metric 1
          </div>

          <div className="bg-[#0B1117] border border-[#1F2937] p-4 rounded-lg">
            Metric 2
          </div>

          <div className="bg-[#0B1117] border border-[#1F2937] p-4 rounded-lg">
            Metric 3
          </div>

        </div>

        {/* Map Placeholder (we add Leaflet later) */}
        <div className="h-[80%] bg-[#0B1117] border border-[#1F2937] rounded-lg flex items-center justify-center">
          Map Area (Coming Next)
        </div>

      </div>

    </div>
  );
}