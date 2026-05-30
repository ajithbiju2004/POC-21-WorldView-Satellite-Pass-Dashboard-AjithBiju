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

  const [filteredSatellites, setFilteredSatellites] = useState<any[]>([]);

  const [regionFilter, setRegionFilter] = useState("All Regions");

  const [statusFilter, setStatusFilter] = useState("All Status");

  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);

  const [simTime, setSimTime] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setSimTime((t) => (t + 1) % 24);
      }, 2000);

      return () => clearInterval(interval);
    }, []);

  const activePasses = filteredSatellites.filter(
    (_, index) => {
      const start = (index * 3) % 24;
      const end = start + 4;

      return simTime >= start && simTime <= end;
    }
  ).length;

  const exportReport = () => {

    const reportData = {
      generated_at: new Date().toISOString(),
      total_satellites: filteredSatellites.length,
      satellites: filteredSatellites,
    };

    const blob = new Blob(
      [JSON.stringify(reportData, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "satellite-report.json";

    link.click();

    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    async function loadSatellites() {
      try {
        const data = await getSatellites();
        setSatellites(data);
        setFilteredSatellites(data);
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
  useEffect(() => {

    let filtered = satellites;

    // Region Filter
    if (regionFilter !== "All Regions") {
      filtered = filtered.filter(
        (sat) => sat.coverage === regionFilter
      );
    }

    // Status Filter
    if (statusFilter !== "All Status") {
      filtered = filtered.filter(
        (sat) => sat.status === statusFilter
      );
    }

    // Search Filter
    if (searchTerm !== "") {
      filtered = filtered.filter((sat) =>
        sat.name.toLowerCase().includes(
          searchTerm.toLowerCase()
        )
      );
    }

    setFilteredSatellites(filtered);

    // Auto-select first filtered satellite
    if (filtered.length > 0) {
      setSelectedSatellite(filtered[0]);
    } else {
      setSelectedSatellite(null);
    }

  }, [regionFilter, statusFilter, searchTerm, satellites]);


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

                <div className="flex items-center gap-2">

                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>

                  <p className="text-sm text-gray-400">
                    Status: {
                      (() => {
                        const index = filteredSatellites.findIndex(
                          (sat) => sat.id === selectedSatellite.id
                        );

                        const start = (index * 3) % 24;
                        const end = start + 6;

                        return simTime >= start && simTime <= end
                          ? "ACTIVE OBSERVATION"
                          : "STANDBY ORBIT";
                      })()
                    }
                  </p>

                  <p className="text-sm text-gray-400">
                    Orbit: {selectedSatellite.orbit}
                  </p>

                  <p className="text-sm text-gray-400">
                    Altitude: {selectedSatellite.altitude}
                  </p>

                  <p className="text-sm text-gray-400">
                    Agency: {selectedSatellite.agency}
                  </p>

                </div>

                <p className="text-sm text-gray-400">
                  Revisit: {selectedSatellite.revisit_time}
                </p>

                <p className="text-sm">
                  Pass Status:
                  <span
                    className={`ml-2 ${
                      selectedSatellite.pass_status === "In Window"
                        ? "text-green-400"
                        : selectedSatellite.pass_status === "Maintenance"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {selectedSatellite.pass_status}
                  </span>
                </p>

                <p className="text-sm text-gray-400">
                  Next Pass: {selectedSatellite.next_pass}
                </p>


                <p className="text-sm text-gray-400">
                  Next Pass: {selectedSatellite.next_pass}
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

              <input
                type="text"
                placeholder="Search satellite..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0B1117] border border-[#1F2937] rounded-md p-2 text-sm text-gray-300"
              />

              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="w-full bg-[#0B1117] border border-[#1F2937] rounded-md p-2 text-sm text-gray-300"
              >
                <option>All Regions</option>
                <option>South Asia</option>
                <option>Europe</option>
                <option>North America</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-[#0B1117] border border-[#1F2937] rounded-md p-2 text-sm text-gray-300"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Standby</option>
                <option>Maintenance</option>
              </select>

            </div>

          </div>


          <div className="p-4 bg-[#030712] border border-[#1F2937] rounded-lg">

            <h2 className="text-sm text-[#38BDF8] font-semibold mb-3">
              LIVE TELEMETRY
            </h2>

            <div className="space-y-2 text-sm text-gray-400">

              <div className="flex justify-between">
                <span>Signal Strength</span>
                <span className="text-green-400">98%</span>
              </div>

              <div className="flex justify-between">
                <span>Tracking Stability</span>
                <span className="text-[#38BDF8]">Nominal</span>
              </div>

              <div className="flex justify-between">
                <span>Ground Lock</span>
                <span className="text-green-400">Confirmed</span>
              </div>

              <div className="flex justify-between">
                <span>Data Relay</span>
                <span className="text-orange-400">Live</span>
              </div>

            </div>

          </div>

          <div className="p-4 bg-[#030712] border border-[#1F2937] rounded-lg">

            <h2 className="text-sm text-[#38BDF8] font-semibold mb-2">
              WHY THIS MATTERS
            </h2>

            <p className="text-sm text-gray-400 leading-relaxed">
              Satellite observation infrastructure enables
              real-time environmental monitoring, strategic
              intelligence gathering, disaster response,
              and global logistics visibility.
            </p>

          </div>

          <div className="p-4 bg-[#030712] border border-[#1F2937] rounded-lg">

            <h2 className="text-sm text-[#38BDF8] font-semibold mb-2">
              WHO CONTROLS THE RAIL
            </h2>

            <p className="text-sm text-gray-400 leading-relaxed">
              Earth observation systems are primarily operated
              by aerospace agencies, defense organizations,
              and private satellite intelligence providers
              including ESA, Maxar, and national space programs.
            </p>

          </div>
          {/* Download Button */}
          <button
            onClick={exportReport}
            className="w-full bg-[#38BDF8] hover:bg-[#0ea5e9] text-black font-semibold py-2 rounded-lg transition-all duration-200"
          >

            Download Intelligence Report

          </button>

        </div>

        
      </div>

      {/* Main Panel (70%) */}
      <div className="w-[70%] p-4">

        {/* Top Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-4">

          <div className="bg-[#0B1117] border border-[#1F2937] p-4 rounded-lg shadow-[0_0_20px_rgba(56,189,248,0.08)] hover:shadow-[0_0_25px_rgba(56,189,248,0.18)] transition-all duration-300">

            <p className="text-sm text-gray-400">
              ACTIVE REGIONS
            </p>

            <h2 className="text-2xl font-bold text-[#38BDF8]">
              {filteredSatellites.length}
            </h2>

          </div>

          <div className="bg-[#0B1117] border border-[#1F2937] p-4 rounded-lg shadow-[0_0_20px_rgba(56,189,248,0.08)] hover:shadow-[0_0_25px_rgba(56,189,248,0.18)] transition-all duration-300">

            <p className="text-sm text-gray-400">
              ACTIVE PASSES
            </p>

            <h2 className="text-2xl font-bold text-green-400">
              {activePasses}
            </h2>

          </div>

          <div className="bg-[#0B1117] border border-[#1F2937] p-4 rounded-lg shadow-[0_0_20px_rgba(56,189,248,0.08)] hover:shadow-[0_0_25px_rgba(56,189,248,0.18)] transition-all duration-300">

            <p className="text-sm text-gray-400">
              SIMULATION CLOCK
            </p>

            <h2 className="text-2xl font-bold text-orange-400">
              {simTime}:00 UTC
            </h2>

          </div>



        </div>

        {/* Map Placeholder (we add Leaflet later) */}
        <div className="relative h-[80%] bg-[#0B1117] border border-[#1F2937] rounded-lg overflow-hidden">

          <SatelliteMap
            satellites={filteredSatellites}
            setSelectedSatellite={setSelectedSatellite}
          />

          {/* Tactical Legend */}
          <div className="absolute bottom-4 left-4 bg-[#030712]/90 border border-[#1F2937] rounded-lg p-3 text-xs text-gray-300 z-[1000]">

            <h2 className="text-[#38BDF8] font-semibold mb-2">
              OPERATIONAL LEGEND
            </h2>

            <div className="space-y-1">

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span>Active Surveillance</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <span>Standby Systems</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <span>Maintenance Window</span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}