import React, { useState, useMemo, useCallback, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Crosshair,
  Truck,
} from "@/utils/icons";
import { type ActiveTripDriver, SAMPLE_ACTIVE_DRIVERS } from "../types";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 28.6139,
  lng: 77.209,
};

function LiveTrackingTabComponent() {
  const [activeDrivers] = useState<ActiveTripDriver[]>(SAMPLE_ACTIVE_DRIVERS);
  const [searchMapQuery, setSearchMapQuery] = useState("");
  const [selectedDriver, setSelectedDriver] = useState<ActiveTripDriver>(
    SAMPLE_ACTIVE_DRIVERS[0],
  );

  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

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
    if (mapRef.current) {
      mapRef.current.panTo({ lat: driver.lat, lng: driver.lng });
      mapRef.current.setZoom(13);
    }
  }, []);

  const handleMapLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
      if (selectedDriver) {
        map.panTo({ lat: selectedDriver.lat, lng: selectedDriver.lng });
        map.setZoom(13);
      }
    },
    [selectedDriver],
  );

  return (
    <div className="flex flex-col gap-4 -m-6 p-6 min-h-[calc(100vh-64px)] text-white font-sans">
      {/* Header Search & Title Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-xs items-center">
        <div className="lg:col-span-7 relative lg:w-full sm:w-[480px] h-full">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search active trips, drivers, or plate numbers..."
            className="w-full h-13 pl-10 pr-4  text-md border border-neutral-200/80 bg-white shadow-xs rounded-xl text-black outline-none focus:border-[#1B6B5C] focus:ring-2 focus:ring-[#1B6B5C]/20 transition-all placeholder:text-slate-500"
            value={searchMapQuery}
            onChange={(e) => setSearchMapQuery(e.target.value)}
          />
        </div>

        {/* Filter & Sort controls */}
        <div className="lg:col-span-3 grid grid-cols-2 gap-2">
          <button className="py-2 px-3 bg-slate-900 border border-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 hover:bg-slate-800 cursor-pointer">
            <Filter size={13} /> Filter
          </button>
          <button className="py-2 px-3 bg-slate-900 border border-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 hover:bg-slate-800 cursor-pointer">
            <SlidersHorizontal size={13} /> Sort
          </button>
        </div>

        <div className="lg:col-span-2 flex justify-end items-center gap-4 text-xs font-semibold text-slate-300">
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-full font-bold whitespace-nowrap">
            Live Tracking
          </span>
        </div>
      </div>
      {/* Main Map & Sidebar Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-160px)] min-h-[550px]">
        {/* left Sidebar: Active Trips */}

        <div className="lg:col-span-4 bg-white border border-neutral-200/80 shadow-xs h-[100%] rounded-2xl p-4 flex flex-col gap-4 overflow-y-auto">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">Active Trips</h3>
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2.5 py-0.5 rounded-full">
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
                  className={`bg-slate-900/90 p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-3 ${
                    isSelected
                      ? "ring-2 ring-[#1B6B5C]/30 bg-slate-800/80"
                      : "border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {/* Driver Header */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={driver.avatar}
                        alt={driver.driverName}
                        className="w-9 h-9 rounded-full object-cover border border-slate-700"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-xs text-white">
                          {driver.driverName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ID: {driver.tripId}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold capitalize ${
                        driver.statusType === "warning"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      • {driver.status}
                    </span>
                  </div>

                  {/* Route points */}
                  <div className="flex flex-col gap-1 text-[11px] border-y border-slate-800/80 py-2 text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span>{driver.origin}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                      <span>{driver.destination}</span>
                    </div>
                  </div>

                  {/* ETA & Progress */}
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-400 uppercase font-bold">
                        ETA
                      </span>
                      <span className="font-extrabold text-white">
                        {driver.eta}{" "}
                        <span className="text-[10px] text-slate-400 font-normal">
                          ({driver.etaNote})
                        </span>
                      </span>
                    </div>

                    <div className="w-24 flex flex-col gap-1">
                      <span className="text-[9px] text-slate-400 uppercase font-bold text-right">
                        Progress
                      </span>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
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

        <div className="lg:col-span-8 relative bg-[#111A24] rounded-2xl border border-slate-800 overflow-hidden shadow-xl flex items-center justify-center select-none">
          {loadError ? (
            <div className="text-red-400 font-bold">
              Error Loading Map. Please check your API key.
            </div>
          ) : !isLoaded ? (
            <div className="text-slate-400 font-bold animate-pulse">
              Loading Google Maps...
            </div>
          ) : (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={defaultCenter}
              zoom={11}
              onLoad={handleMapLoad}
              options={{
                disableDefaultUI: true,
                zoomControl: true,
                styles: [
                  {
                    elementType: "geometry",
                    stylers: [{ color: "#242f3e" }],
                  },
                  {
                    elementType: "labels.text.stroke",
                    stylers: [{ color: "#242f3e" }],
                  },
                  {
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#746855" }],
                  },
                  {
                    featureType: "administrative.locality",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#d59563" }],
                  },
                  {
                    featureType: "poi",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#d59563" }],
                  },
                  {
                    featureType: "poi.park",
                    elementType: "geometry",
                    stylers: [{ color: "#263c3f" }],
                  },
                  {
                    featureType: "poi.park",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#6b9a76" }],
                  },
                  {
                    featureType: "road",
                    elementType: "geometry",
                    stylers: [{ color: "#38414e" }],
                  },
                  {
                    featureType: "road",
                    elementType: "geometry.stroke",
                    stylers: [{ color: "#212a37" }],
                  },
                  {
                    featureType: "road",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#9ca5b3" }],
                  },
                  {
                    featureType: "road.highway",
                    elementType: "geometry",
                    stylers: [{ color: "#746855" }],
                  },
                  {
                    featureType: "road.highway",
                    elementType: "geometry.stroke",
                    stylers: [{ color: "#1f2835" }],
                  },
                  {
                    featureType: "road.highway",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#f3d19c" }],
                  },
                  {
                    featureType: "water",
                    elementType: "geometry",
                    stylers: [{ color: "#17263c" }],
                  },
                  {
                    featureType: "water",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#515c6d" }],
                  },
                  {
                    featureType: "water",
                    elementType: "labels.text.stroke",
                    stylers: [{ color: "#17263c" }],
                  },
                ],
              }}
            >
              {activeDrivers.map((driver) => (
                <Marker
                  key={driver.id}
                  position={{ lat: driver.lat, lng: driver.lng }}
                  onClick={() => handleSelectDriver(driver)}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor:
                      driver.statusType === "warning" ? "#F59E0B" : "#10B981",
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: "#FFFFFF",
                    scale: 8,
                  }}
                />
              ))}

              {selectedDriver && (
                <InfoWindow
                  position={{
                    lat: selectedDriver.lat,
                    lng: selectedDriver.lng,
                  }}
                  onCloseClick={() => setSelectedDriver(activeDrivers[0])}
                  options={{ pixelOffset: new google.maps.Size(0, -20) }}
                >
                  <div className="bg-white text-slate-800 p-1.5 rounded min-w-[160px]">
                    <div className="font-bold text-sm mb-1">
                      {selectedDriver.driverName}
                    </div>
                    <div className="text-[11px] mb-2 font-mono text-slate-500">
                      ID: {selectedDriver.tripId}
                    </div>
                    <div className="text-[11px]">
                      <span className="font-bold text-slate-700">
                        Distance:
                      </span>{" "}
                      {selectedDriver.distance || "N/A"}
                    </div>
                    <div className="text-[11px]">
                      <span className="font-bold text-slate-700">
                        Duration:
                      </span>{" "}
                      {selectedDriver.duration || "N/A"}
                    </div>
                    <div className="text-[11px] mt-1 border-t pt-1 border-slate-200">
                      <span className="font-bold text-slate-700">Status:</span>
                      <span
                        className={
                          selectedDriver.statusType === "warning"
                            ? "text-amber-600 font-bold ml-1"
                            : "text-emerald-600 font-bold ml-1"
                        }
                      >
                        {selectedDriver.status}
                      </span>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          )}

          {/* Map Controls */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-30">
            <button
              onClick={() => {
                if (mapRef.current && selectedDriver) {
                  mapRef.current.panTo({
                    lat: selectedDriver.lat,
                    lng: selectedDriver.lng,
                  });
                  mapRef.current.setZoom(14);
                }
              }}
              className="w-9 h-9 bg-[#1B6B5C] hover:bg-[#155649] text-white border border-teal-400/30 rounded-xl flex items-center justify-center shadow-lg cursor-pointer"
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
