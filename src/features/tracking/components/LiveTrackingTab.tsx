import React, { useState, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Search, Filter, SlidersHorizontal, Crosshair } from "@/utils/icons";
import {
  type ActiveTripDriver,
  SAMPLE_ACTIVE_DRIVERS,
} from "../../dashboard/types";

// Fix leaflet icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const defaultCenter = {
  lat: 28.6139,
  lng: 77.209,
};

// Component to handle map view updates
function ChangeView({
  center,
  zoom,
}: {
  center: { lat: number; lng: number };
  zoom: number;
}) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

function LiveTrackingTabComponent() {
  const [activeDrivers] = useState<ActiveTripDriver[]>(SAMPLE_ACTIVE_DRIVERS);
  const [searchMapQuery, setSearchMapQuery] = useState("");
  const [selectedDriver, setSelectedDriver] = useState<ActiveTripDriver>(
    SAMPLE_ACTIVE_DRIVERS[0],
  );

  const filteredDrivers = useMemo(() => {
    const query = searchMapQuery.toLowerCase().trim();
    if (!query) return activeDrivers;

    return activeDrivers.filter(
      (d) =>
        d.driverName.toLowerCase().includes(query) ||
        d.tripId.toLowerCase().includes(query) ||
        d.origin.toLowerCase().includes(query) ||
        d.destination.toLowerCase().includes(query),
    );
  }, [activeDrivers, searchMapQuery]);

  const handleSelectDriver = useCallback((driver: ActiveTripDriver) => {
    setSelectedDriver(driver);
  }, []);

  return (
    <div className="flex flex-col gap-4 -m-6 p-6 min-h-[calc(100vh-64px)] bg-neutral-50/50 text-neutral-900">
      {/* Header Search & Title Bar */}
      <div className="card grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 items-center">
        <div className="lg:col-span-7 relative lg:w-full sm:w-[480px] h-full">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search active trips, drivers, or plate numbers..."
            className="w-full h-10 pl-10 pr-4 text-sm border border-neutral-200 bg-white shadow-sm rounded-md text-black outline-none focus:border-[#1B6B5C] focus:ring-1 focus:ring-[#1B6B5C] transition-all placeholder:text-slate-400"
            value={searchMapQuery}
            onChange={(e) => setSearchMapQuery(e.target.value)}
          />
        </div>

        {/* Filter & Sort controls */}
        <div className="lg:col-span-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            className="btn btn-neutral"
          >
            <Filter size={13} /> Filter
          </button>
          <button
            type="button"
            className="btn btn-neutral"
          >
            <SlidersHorizontal size={13} /> Sort
          </button>
        </div>

        <div className="lg:col-span-2 flex justify-end items-center gap-4 text-xs font-semibold text-slate-300">
          <span className="status-success">
            Live Tracking Active
          </span>
        </div>
      </div>

      {/* Main Map & Sidebar Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-160px)] min-h-[550px]">
        {/* left Sidebar: Active Trips */}
        <div className="lg:col-span-4 card h-[100%] p-4 flex flex-col gap-4 overflow-y-auto">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
            <h3 className="text-sm font-bold text-neutral-900">Active Trips</h3>
            <span className="status-success">
              {activeDrivers.length} Total
            </span>
          </div>

          {/* Active Trip Cards List */}
          <div className="flex flex-col gap-3">
            {filteredDrivers.map((driver) => {
              const isSelected = selectedDriver?.id === driver.id;
              return (
                <div
                  key={driver.id}
                  onClick={() => handleSelectDriver(driver)}
                  className={`p-4 rounded-md border transition-all cursor-pointer flex flex-col gap-3 ${
                    isSelected
                      ? "ring-1 ring-[#1B6B5C] bg-teal-50 border-[#1B6B5C]"
                      : "bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-sm"
                  }`}
                >
                  {/* Driver Header */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={driver.avatar}
                        alt={driver.driverName}
                        className="w-9 h-9 rounded-md object-cover border border-neutral-200"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-xs text-neutral-900">
                          {driver.driverName}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          ID: {driver.tripId}
                        </span>
                      </div>
                    </div>

                    <span
                      className={
                        driver.statusType === "warning"
                          ? "status-warning"
                          : "status-success"
                      }
                    >
                      {driver.status}
                    </span>
                  </div>

                  {/* Route points */}
                  <div className="flex flex-col gap-1 text-[11px] border-y border-neutral-100 py-2 text-neutral-600">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span className="font-medium">{driver.origin}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                      <span className="font-medium">{driver.destination}</span>
                    </div>
                  </div>

                  {/* ETA & Progress */}
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-neutral-400 uppercase font-bold">
                        ETA
                      </span>
                      <span className="font-extrabold text-neutral-900">
                        {driver.eta}{" "}
                        <span className="text-[10px] text-neutral-500 font-normal">
                          ({driver.etaNote})
                        </span>
                      </span>
                    </div>

                    <div className="w-24 flex flex-col gap-1">
                      <span className="text-[9px] text-neutral-400 uppercase font-bold text-right">
                        Progress
                      </span>
                      <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${driver.statusType === "warning" ? "bg-amber-500" : "bg-emerald-500"}`}
                          style={{ width: `${driver.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* right/Center Map Display */}
        <div className="lg:col-span-8 relative bg-neutral-100 rounded-lg border border-neutral-200 overflow-hidden shadow-sm flex items-center justify-center select-none z-0">
          <MapContainer
            center={
              selectedDriver
                ? { lat: selectedDriver.lat, lng: selectedDriver.lng }
                : defaultCenter
            }
            zoom={13}
            className="w-full h-full"
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">Carto</a>'
            />
            {selectedDriver && (
              <ChangeView
                center={{ lat: selectedDriver.lat, lng: selectedDriver.lng }}
                zoom={14}
              />
            )}

            {activeDrivers.map((driver) => (
              <Marker
                key={driver.id}
                position={{ lat: driver.lat, lng: driver.lng }}
                eventHandlers={{
                  click: () => handleSelectDriver(driver),
                }}
              >
                <Popup className="font-sans">
                  <div className="text-slate-800 p-0.5 min-w-[140px]">
                    <div className="font-bold text-sm mb-1">
                      {driver.driverName}
                    </div>
                    <div className="text-[11px] mb-2 font-mono text-slate-500">
                      ID: {driver.tripId}
                    </div>
                    <div className="text-[11px]">
                      <span className="font-bold text-slate-700">
                        Distance:
                      </span>{" "}
                      {driver.distance || "N/A"}
                    </div>
                    <div className="text-[11px]">
                      <span className="font-bold text-slate-700">
                        Duration:
                      </span>{" "}
                      {driver.duration || "N/A"}
                    </div>
                    <div className="text-[11px] mt-1 border-t pt-1 border-slate-200">
                      <span className="font-bold text-slate-700">Status:</span>
                      <span
                        className={
                          driver.statusType === "warning"
                            ? "text-amber-600 font-bold ml-1"
                            : "text-emerald-600 font-bold ml-1"
                        }
                      >
                        {driver.status}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map Controls */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-[400]">
            <button
              type="button"
              onClick={() => {
                if (selectedDriver) {
                  setSelectedDriver({ ...selectedDriver });
                }
              }}
              className="icon-btn icon-btn-secondary"
              title="Recenter Map"
            >
              <Crosshair size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(LiveTrackingTabComponent);
