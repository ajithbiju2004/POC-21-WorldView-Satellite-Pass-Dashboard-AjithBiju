"use client";

import { useEffect, useState } from "react";
import { getSatellites } from "@/lib/api";
import dynamic from "next/dynamic";

const SatelliteMap = dynamic(
  () => import("@/components/map/SatelliteMap"),
  {
    ssr: false,
  }
);

export default function Home() {

  const [selectedSatellite, setSelectedSatellite] = useState<any>(null);
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


          {/* Why This Matters */}
          <div className="p-4 bg-[#030712] border border-[#1F2937] rounded-lg">

            <h2 className="text-sm text-[#38BDF8] font-semibold mb-2">
              WHY THIS MATTERS
            </h2>

            <p className="text-sm text-gray-400 leading-relaxed">
              Satellite intelligence enables infrastructure monitoring,
              disaster response, environmental surveillance, and
              strategic regional observation in near real-time.
            </p>

          </div>

          {/* Control Rail */}
          <div className="p-4 bg-[#030712] border border-[#1F2937] rounded-lg">

            <h2 className="text-sm text-[#38BDF8] font-semibold mb-2">
              CONTROL RAIL
            </h2>

            <div className="space-y-2 text-sm text-gray-400">

              <p>
                Operator: Maxar Intelligence
              </p>

              <p>
                Orbit Class: Low Earth Orbit
              </p>

              <p>
                Priority: Strategic Monitoring
              </p>

            </div>

          </div>

          {/* Filters */}
          <div className="p-4 bg-[#030712] border border-[#1F2937] rounded-lg">

            <h2 className="text-sm text-[#38BDF8] font-semibold mb-3">
              FILTERS
            </h2>

            <div className="space-y-3">

              <select className="w-full bg-[#0B1117] border border-[#1F2937] rounded-md p-2 text-sm text-gray-300">
                <option>All Regions</option>
                <option>South Asia</option>
                <option>Europe</option>
                <option>North America</option>
              </select>

              <select className="w-full bg-[#0B1117] border border-[#1F2937] rounded-md p-2 text-sm text-gray-300">
                <option>All Status</option>
                <option>Active</option>
                <option>Standby</option>
                <option>Maintenance</option>
              </select>

            </div>

          </div>

          {/* Download Button */}
          <button className="w-full bg-[#38BDF8] hover:bg-[#0ea5e9] text-black font-semibold py-2 rounded-lg transition-all duration-200">

            Download Intelligence Report

          </button>

        </div>

        
      </div>

      {/* Main Panel (70%) */}
      <div className="w-[70%] p-4">

        {/* Top Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-4">

          <div className="bg-[#0B1117] border border-[#1F2937] p-4 rounded-lg">

            <p className="text-sm text-gray-400">
              ACTIVE REGIONS
            </p>

            <h2 className="text-2xl font-bold text-[#38BDF8]">
              12
            </h2>

          </div>

          <div className="bg-[#0B1117] border border-[#1F2937] p-4 rounded-lg">

            <p className="text-sm text-gray-400">
              COVERAGE STATUS
            </p>

            <h2 className="text-2xl font-bold text-green-400">
              Stable
            </h2>

          </div>

          <div className="bg-[#0B1117] border border-[#1F2937] p-4 rounded-lg">

            <p className="text-sm text-gray-400">
              AVG REVISIT
            </p>

            <h2 className="text-2xl font-bold text-orange-400">
              4 hrs
            </h2>

          </div>



        </div>

        {/* Map Placeholder (we add Leaflet later) */}
        <div className="h-[80%] bg-[#0B1117] border border-[#1F2937] rounded-lg overflow-hidden">
          <SatelliteMap
            satellites={satellites}
            setSelectedSatellite={setSelectedSatellite}
          />
        </div>

      </div>

    </div>
  );
}