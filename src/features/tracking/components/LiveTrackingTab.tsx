import React, { useState, useMemo, useCallback } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import {
  Search,
  Crosshair,
  Plus,
  Minus,
  MessageSquare,
  PhoneCall,
  X,
  Clock,
  Car,
  CheckCircle2,
  Shield,
  Layers,
  MapPin,
  QrCode,
} from '@/utils/icons'

// Leaflet default icon fix
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

export interface TrackingTrip {
  id: string
  orderId: string
  title: string
  routeFrom: string
  routeTo: string
  pickupAddress: string
  dropoffAddress: string
  status: 'In Transit' | 'On Delivery' | 'Packed' | 'Delivered'
  statusVariant: 'blue' | 'amber' | 'green'
  category: 'on_the_way' | 'received'
  driver: {
    name: string
    role: string
    avatar: string
    phone: string
    vehicle: string
    plate: string
    rating: number
  }
  metrics: {
    milesLeft: string
    eta: string
    currentLocation: string
    speed: string
    batteryLevel?: string
  }
  coordinates: {
    current: [number, number]
    origin: [number, number]
    destination: [number, number]
    routePath: [number, number][]
  }
}

export const SAMPLE_TRACKING_TRIPS: TrackingTrip[] = [
  {
    id: 'TRIP-1',
    orderId: 'Order ID #14398-98567',
    title: 'Marseilles → New York',
    routeFrom: 'Marseille, France',
    routeTo: 'New York, USA',
    pickupAddress: '123 Rue de la République, 13002 Marseille, France',
    dropoffAddress: '456 Elm Street, New York, NY 10001, USA',
    status: 'On Delivery',
    statusVariant: 'amber',
    category: 'on_the_way',
    driver: {
      name: 'Hassan Welch',
      role: 'Courier',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      phone: '+1 (555) 382-9912',
      vehicle: 'Indo Prime Sedan - Black',
      plate: 'NY-882-CX',
      rating: 4.9,
    },
    metrics: {
      milesLeft: '3,600 miles',
      eta: '18 mins',
      currentLocation: 'Marseille, France',
      speed: '54 km/h',
      batteryLevel: '88%',
    },
    coordinates: {
      current: [40.758, -73.9855],
      origin: [40.7128, -74.006],
      destination: [40.7829, -73.9654],
      routePath: [
        [40.7128, -74.006],
        [40.7245, -73.998],
        [40.738, -73.991],
        [40.751, -73.987],
        [40.758, -73.9855],
        [40.768, -73.978],
        [40.7829, -73.9654],
      ],
    },
  },
  {
    id: 'TRIP-2',
    orderId: 'Order ID #14398-98568',
    title: 'London → Prague',
    routeFrom: 'London, UK',
    routeTo: 'Prague, Czech Republic',
    pickupAddress: '42 King Street, Covent Garden, London WC2E 8HD',
    dropoffAddress: '15 Old Town Square, 110 00 Prague, Czech Republic',
    status: 'In Transit',
    statusVariant: 'blue',
    category: 'on_the_way',
    driver: {
      name: 'Rajesh Kumar',
      role: 'Senior Courier',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      phone: '+44 20 7946 0912',
      vehicle: 'Indo Express Van',
      plate: 'LD-409-TR',
      rating: 4.8,
    },
    metrics: {
      milesLeft: '640 miles',
      eta: '1 hr 15 mins',
      currentLocation: 'Frankfurt Transit Hub',
      speed: '82 km/h',
      batteryLevel: '92%',
    },
    coordinates: {
      current: [50.1109, 8.6821],
      origin: [51.5074, -0.1278],
      destination: [50.0755, 14.4378],
      routePath: [
        [51.5074, -0.1278],
        [51.0504, 3.7304],
        [50.8503, 4.3517],
        [50.1109, 8.6821],
        [49.4521, 11.0767],
        [50.0755, 14.4378],
      ],
    },
  },
  {
    id: 'TRIP-3',
    orderId: 'Order ID #14398-98569',
    title: 'Rio → Tokyo',
    routeFrom: 'Rio de Janeiro, Brazil',
    routeTo: 'Tokyo, Japan',
    pickupAddress: 'Av. Atlântica 1702, Copacabana, Rio de Janeiro',
    dropoffAddress: '2-21-1 Shibuya, Shibuya City, Tokyo 150-8510',
    status: 'On Delivery',
    statusVariant: 'amber',
    category: 'on_the_way',
    driver: {
      name: 'Carlos Mendes',
      role: 'Courier Partner',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      phone: '+81 3 5555 0143',
      vehicle: 'Indo Eco EV',
      plate: 'TK-102-EP',
      rating: 4.95,
    },
    metrics: {
      milesLeft: '12 miles',
      eta: '24 mins',
      currentLocation: 'Minato City, Tokyo',
      speed: '42 km/h',
      batteryLevel: '76%',
    },
    coordinates: {
      current: [35.6586, 139.7454],
      origin: [35.5494, 139.7798],
      destination: [35.6595, 139.7004],
      routePath: [
        [35.5494, 139.7798],
        [35.6186, 139.7544],
        [35.6586, 139.7454],
        [35.6595, 139.7004],
      ],
    },
  },
  {
    id: 'TRIP-4',
    orderId: 'Order ID #14398-98570',
    title: 'Warsaw → Edinburgh',
    routeFrom: 'Warsaw, Poland',
    routeTo: 'Edinburgh, UK',
    pickupAddress: 'Marszałkowska 84/92, 00-514 Warsaw, Poland',
    dropoffAddress: '12 Royal Mile, Edinburgh EH1 2PB, UK',
    status: 'Packed',
    statusVariant: 'green',
    category: 'received',
    driver: {
      name: 'Piotr Kowalski',
      role: 'Courier',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
      phone: '+48 22 123 4567',
      vehicle: 'Indo Standard Cargo',
      plate: 'WA-904-PL',
      rating: 4.7,
    },
    metrics: {
      milesLeft: '0 miles',
      eta: 'Completed',
      currentLocation: 'Royal Mile, Edinburgh',
      speed: '0 km/h',
      batteryLevel: '100%',
    },
    coordinates: {
      current: [55.9533, -3.1883],
      origin: [52.2297, 21.0122],
      destination: [55.9533, -3.1883],
      routePath: [
        [52.2297, 21.0122],
        [52.52, 13.405],
        [53.5511, 9.9937],
        [55.9533, -3.1883],
      ],
    },
  },
]

// Custom Leaflet View Handler & Map Controls
function MapController({
  center,
  zoom,
}: {
  center: [number, number]
  zoom: number
}) {
  const map = useMap()

  const handleRecenter = useCallback(() => {
    map.flyTo(center, zoom, { duration: 1.2 })
  }, [map, center, zoom])

  const handleZoomIn = useCallback(() => {
    map.setZoom(map.getZoom() + 1)
  }, [map])

  const handleZoomOut = useCallback(() => {
    map.setZoom(map.getZoom() - 1)
  }, [map])

  return (
    <div className="absolute top-5 right-5 z-[400] flex flex-col gap-2.5">
      <button
        type="button"
        onClick={handleRecenter}
        className="w-10 h-10 rounded-2xl bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-neutral-100 flex items-center justify-center text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
        title="Recenter Map"
      >
        <Crosshair size={18} />
      </button>

      <div className="flex flex-col bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-neutral-100 overflow-hidden">
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-10 h-10 flex items-center justify-center text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 active:scale-95 transition-all border-b border-neutral-100 cursor-pointer"
          title="Zoom In"
        >
          <Plus size={18} />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="w-10 h-10 flex items-center justify-center text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
          title="Zoom Out"
        >
          <Minus size={18} />
        </button>
      </div>
    </div>
  )
}

export default function LiveTrackingTab() {
  const [trips] = useState<TrackingTrip[]>(SAMPLE_TRACKING_TRIPS)
  const [activeTab, setActiveTab] = useState<'on_the_way' | 'received'>('on_the_way')
  const [selectedTripId, setSelectedTripId] = useState<string>(SAMPLE_TRACKING_TRIPS[0].id)
  const [searchQuery, setSearchQuery] = useState('')
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false)
  const [mobileViewMode, setMobileViewMode] = useState<'split' | 'map' | 'list'>('split')

  const selectedTrip = useMemo(() => {
    return trips.find((t) => t.id === selectedTripId) || trips[0]
  }, [trips, selectedTripId])

  const filteredTrips = useMemo(() => {
    return trips.filter((t) => {
      const matchesTab = t.category === activeTab
      if (!searchQuery.trim()) return matchesTab

      const q = searchQuery.toLowerCase()
      const matchesQuery =
        t.title.toLowerCase().includes(q) ||
        t.orderId.toLowerCase().includes(q) ||
        t.driver.name.toLowerCase().includes(q) ||
        t.dropoffAddress.toLowerCase().includes(q)

      return matchesTab && matchesQuery
    })
  }, [trips, activeTab, searchQuery])

  // Custom HTML markers
  const destinationMarkerIcon = useMemo(() => {
    return L.divIcon({
      className: 'destination-speech-marker',
      html: `
        <div style="position: relative; transform: translate(-50%, -100%); margin-bottom: 12px; filter: drop-shadow(0 10px 18px rgba(0,0,0,0.22)); cursor: pointer;">
          <div style="background: #0f2921; color: #ffffff; padding: 8px 12px; border-radius: 12px; font-size: 11px; font-weight: 700; white-space: normal; max-width: 220px; text-align: center; line-height: 1.3; border: 1px solid rgba(255,255,255,0.15); font-family: Inter, sans-serif;">
            ${selectedTrip.dropoffAddress}
          </div>
          <div style="width: 10px; height: 10px; background: #0f2921; transform: rotate(45deg); margin: -5px auto 0;"></div>
          <div style="width: 12px; height: 12px; background: #0f2921; border-radius: 50%; border: 2.5px solid #ffffff; margin: 4px auto 0; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>
        </div>
      `,
      iconSize: [220, 60],
      iconAnchor: [110, 60],
    })
  }, [selectedTrip.dropoffAddress])

  const vehicleMarkerIcon = useMemo(() => {
    return L.divIcon({
      className: 'vehicle-pulse-marker',
      html: `
        <div style="position: relative; transform: translate(-50%, -50%); display: flex; align-items: center; justify-content: center; cursor: pointer;">
          <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(19, 92, 78, 0.28); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: relative; width: 28px; height: 28px; border-radius: 50%; background: #135c4e; border: 3px solid #ffffff; box-shadow: 0 4px 12px rgba(19,92,78,0.45); display: flex; align-items: center; justify-content: center; color: white;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="3 11 22 2 13 21 11 13 3 11"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    })
  }, [])

  return (
    <div className="w-full flex flex-col gap-4 max-w-[1520px] mx-auto animate-fadeIn pb-6">
      {/* Mobile & Tablet View Mode Pill Bar (Only on < 1024px) */}
      <div className="flex lg:hidden items-center justify-between bg-white p-1.5 rounded-2xl border border-neutral-200/80 shadow-2xs">
        <span className="text-xs font-bold text-neutral-800 px-2">
          Tracking View:
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMobileViewMode('split')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mobileViewMode === 'split'
                ? 'bg-neutral-900 text-white shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900 bg-neutral-50'
            }`}
          >
            Split
          </button>
          <button
            type="button"
            onClick={() => setMobileViewMode('list')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mobileViewMode === 'list'
                ? 'bg-neutral-900 text-white shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900 bg-neutral-50'
            }`}
          >
            Packages ({filteredTrips.length})
          </button>
          <button
            type="button"
            onClick={() => setMobileViewMode('map')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mobileViewMode === 'map'
                ? 'bg-neutral-900 text-white shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900 bg-neutral-50'
            }`}
          >
            Live Map
          </button>
        </div>
      </div>

      {/* ── Main Two-Column Tracking Surface ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ══════════════════════════════════════════════════════════
            LEFT PANEL: Package & Live Ride Tracking List
            ══════════════════════════════════════════════════════════ */}
        <div className={`${mobileViewMode === 'map' ? 'hidden lg:flex' : 'flex'} lg:col-span-4 xl:col-span-4 flex-col gap-3.5 bg-white rounded-3xl p-4 sm:p-5 border border-neutral-200/80 shadow-xs`}>
          {/* Header with Title & Search Icon */}
          <div className="flex items-center justify-between pb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
              Package tracking
            </h1>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('tracking-search-input')
                el?.focus()
              }}
              className="w-9 h-9 rounded-full bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/70 flex items-center justify-center text-neutral-600 transition-colors cursor-pointer"
              title="Search packages"
            >
              <Search size={16} />
            </button>
          </div>

          {/* Segmented Filter Pills Toggle */}
          <div className="bg-neutral-100/90 p-1 rounded-2xl flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('on_the_way')}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-[13px] font-bold transition-all cursor-pointer text-center ${
                activeTab === 'on_the_way'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 bg-transparent'
              }`}
            >
              On the way
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('received')}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-[13px] font-bold transition-all cursor-pointer text-center ${
                activeTab === 'received'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 bg-transparent'
              }`}
            >
              Received
            </button>
          </div>

          {/* Quick Search Bar */}
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              id="tracking-search-input"
              type="text"
              placeholder="Search by order ID, city, or driver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-200/80 rounded-xl bg-neutral-50/70 text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-300 focus:bg-white transition-all"
            />
          </div>

          {/* Tracking Cards List */}
          <div className="flex flex-col gap-3 max-h-[calc(100vh-270px)] overflow-y-auto pr-1">
            {filteredTrips.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center gap-2 text-neutral-400">
                <MapPin size={28} className="opacity-40" />
                <span className="text-xs font-medium">No active packages in this category</span>
              </div>
            ) : (
              filteredTrips.map((trip) => {
                const isSelected = selectedTrip.id === trip.id

                return (
                  <div
                    key={trip.id}
                    onClick={() => setSelectedTripId(trip.id)}
                    className={`rounded-2xl transition-all cursor-pointer border ${
                      isSelected
                        ? 'border-2 border-[#135c4e] bg-white shadow-xs p-4'
                        : 'border-neutral-200/90 bg-white hover:border-neutral-300 hover:bg-neutral-50/50 p-4'
                    }`}
                  >
                    {/* Top Row: Route & Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col min-w-0">
                        <h3 className="text-sm font-bold text-neutral-900 truncate">
                          {trip.title}
                        </h3>
                        <span className="text-[11px] text-neutral-400 font-medium">
                          {trip.orderId}
                        </span>
                      </div>

                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex items-center gap-1.5 ${
                          trip.statusVariant === 'blue'
                            ? 'bg-emerald-50 text-[#135c4e] border border-emerald-200/80'
                            : trip.statusVariant === 'amber'
                            ? 'bg-amber-50 text-amber-600 border border-amber-200/60'
                            : 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            trip.statusVariant === 'blue'
                              ? 'bg-[#135c4e]'
                              : trip.statusVariant === 'amber'
                              ? 'bg-amber-600'
                              : 'bg-emerald-600'
                          }`}
                        />
                        {trip.status}
                      </span>
                    </div>

                    {/* Expanded Content for Selected Trip */}
                    {isSelected && (
                      <div className="mt-3.5 flex flex-col gap-3 animate-fadeIn">
                        {/* Driver Profile Bar */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={trip.driver.avatar}
                              alt={trip.driver.name}
                              className="w-10 h-10 rounded-xl object-cover border border-neutral-200 shadow-2xs shrink-0"
                            />
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-bold text-neutral-900 truncate">
                                {trip.driver.name}
                              </span>
                              <span className="text-[10px] font-medium text-neutral-400">
                                {trip.driver.role}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                alert(`Opening message chat with ${trip.driver.name}`)
                              }}
                              className="w-8 h-8 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors cursor-pointer"
                              title="Chat"
                            >
                              <MessageSquare size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                alert(`Calling ${trip.driver.name} at ${trip.driver.phone}`)
                              }}
                              className="w-8 h-8 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors cursor-pointer"
                              title="Call"
                            >
                              <PhoneCall size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Indo Cab Teal Gradient Timeline Box */}
                        <div className="rounded-2xl bg-gradient-to-br from-[#135c4e] to-[#0b382f] p-4 text-white shadow-md flex flex-col gap-3">
                          {/* Pickup Point */}
                          <div className="flex items-start gap-3">
                            <div className="w-3.5 h-3.5 rounded-full border-2 border-white bg-[#135c4e] flex items-center justify-center mt-0.5 shrink-0 shadow-xs">
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[10px] text-white/70 font-semibold uppercase tracking-wider">
                                Deliver from
                              </span>
                              <span className="text-xs font-bold text-white leading-snug">
                                {trip.pickupAddress}
                              </span>
                            </div>
                          </div>

                          {/* Connecting Dotted Line */}
                          <div className="ml-1.5 h-4 border-l-2 border-dashed border-white/40" />

                          {/* Drop-off Point */}
                          <div className="flex items-start gap-3">
                            <div className="w-3.5 h-3.5 rounded-full border-2 border-white bg-white flex items-center justify-center mt-0.5 shrink-0 shadow-xs">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#135c4e]" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[10px] text-white/70 font-semibold uppercase tracking-wider">
                                Addressed
                              </span>
                              <span className="text-xs font-bold text-white leading-snug">
                                {trip.dropoffAddress}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* View Details Action Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsDetailDrawerOpen(true)
                          }}
                          className="w-full py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200/90 text-neutral-900 text-xs font-bold transition-all cursor-pointer text-center shadow-2xs"
                        >
                          View details
                        </button>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            RIGHT PANEL: Immersive Leaflet Map & Floating Card
            ══════════════════════════════════════════════════════════ */}
        <div className={`${mobileViewMode === 'list' ? 'hidden lg:flex' : 'flex'} lg:col-span-8 xl:col-span-8 flex-col gap-4 relative`}>
          <div className="relative bg-slate-100 rounded-3xl border border-neutral-200/90 overflow-hidden shadow-sm h-[580px] sm:h-[640px] lg:h-[calc(100vh-140px)] min-h-[500px]">
            {/* Interactive Leaflet Map */}
            <MapContainer
              center={selectedTrip.coordinates.current}
              zoom={13}
              zoomControl={false}
              className="w-full h-full z-0"
            >
              {/* Voyager clean carto basemap */}
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">Carto</a>'
              />

              {/* Map Controller for FlyTo, ZoomIn, ZoomOut */}
              <MapController
                center={selectedTrip.coordinates.current}
                zoom={13}
              />

              {/* Route Polyline in Indo.Cab Brand Teal */}
              <Polyline
                positions={selectedTrip.coordinates.routePath}
                pathOptions={{
                  color: '#135c4e',
                  weight: 5,
                  opacity: 0.95,
                  lineCap: 'round',
                  lineJoin: 'round',
                }}
              />

              {/* Destination Callout Marker */}
              <Marker
                position={selectedTrip.coordinates.destination}
                icon={destinationMarkerIcon}
              />

              {/* Vehicle Current Position Pulse Marker */}
              <Marker
                position={selectedTrip.coordinates.current}
                icon={vehicleMarkerIcon}
              />
            </MapContainer>

            {/* ── Floating Trip Overview Bottom Card (Matching Reference) ── */}
            <div className="absolute bottom-4 sm:bottom-6 left-4 right-4 sm:left-6 sm:right-6 z-[400] bg-white/98 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-neutral-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.14)] flex flex-col gap-3.5">
              {/* Top Row: Order ID + Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-sm sm:text-base font-extrabold text-neutral-900 tracking-tight">
                    {selectedTrip.orderId}
                  </h2>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                      selectedTrip.statusVariant === 'blue'
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : selectedTrip.statusVariant === 'amber'
                        ? 'bg-amber-50 text-amber-600 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        selectedTrip.statusVariant === 'blue'
                          ? 'bg-blue-600'
                          : selectedTrip.statusVariant === 'amber'
                          ? 'bg-amber-600'
                          : 'bg-emerald-600'
                      }`}
                    />
                    {selectedTrip.status}
                  </span>
                </div>
              </div>

              {/* Driver Identity */}
              <div className="flex items-center gap-2.5">
                <img
                  src={selectedTrip.driver.avatar}
                  alt={selectedTrip.driver.name}
                  className="w-8 h-8 rounded-lg object-cover border border-neutral-200 shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-neutral-900">
                    {selectedTrip.driver.name}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-medium">
                    {selectedTrip.driver.role}
                  </span>
                </div>
              </div>

              <div className="h-px bg-neutral-100 w-full" />

              {/* Bottom Metrics Bar & QR Code */}
              <div className="flex items-center justify-between gap-4">
                {/* 4 Metric Columns */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 flex-1 min-w-0">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                      From
                    </span>
                    <span className="text-xs font-bold text-neutral-900 truncate">
                      {selectedTrip.routeFrom}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                      To
                    </span>
                    <span className="text-xs font-bold text-neutral-900 truncate">
                      {selectedTrip.routeTo}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                      Current Location
                    </span>
                    <span className="text-xs font-bold text-neutral-900 truncate">
                      {selectedTrip.metrics.currentLocation}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                      Miles Left
                    </span>
                    <span className="text-xs font-bold text-neutral-900 truncate">
                      {selectedTrip.metrics.milesLeft}
                    </span>
                  </div>
                </div>

                {/* QR Code Scan Graphic */}
                <div className="flex flex-col items-center gap-0.5 shrink-0 pl-2 sm:pl-4 border-l border-neutral-100">
                  <div className="w-11 h-11 rounded-lg bg-neutral-900 text-white flex items-center justify-center p-1.5 shadow-2xs">
                    <QrCode size={28} strokeWidth={2.2} />
                  </div>
                  <span className="text-[9px] font-semibold text-neutral-400 whitespace-nowrap">
                    View in app
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          DETAILS DRAWER / MODAL (Triggered by "View details")
          ══════════════════════════════════════════════════════════ */}
      {isDetailDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  Trip Telematics & Manifest
                </h3>
                <p className="text-xs text-neutral-400 font-medium">
                  {selectedTrip.orderId}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex flex-col gap-4 text-xs">
              {/* Driver & Vehicle */}
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedTrip.driver.avatar}
                    alt={selectedTrip.driver.name}
                    className="w-12 h-12 rounded-xl object-cover border border-neutral-200 shadow-xs"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">
                      {selectedTrip.driver.name}
                    </h4>
                    <p className="text-neutral-500 font-medium">{selectedTrip.driver.vehicle}</p>
                    <p className="text-neutral-400 font-mono text-[11px]">{selectedTrip.driver.plate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg border border-emerald-200">
                    ★ {selectedTrip.driver.rating} Rating
                  </span>
                </div>
              </div>

              {/* Real-time stats */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold">Speed</span>
                  <p className="text-sm font-extrabold text-neutral-900">{selectedTrip.metrics.speed}</p>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold">ETA</span>
                  <p className="text-sm font-extrabold text-neutral-900">{selectedTrip.metrics.eta}</p>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold">Battery</span>
                  <p className="text-sm font-extrabold text-neutral-900">{selectedTrip.metrics.batteryLevel || '90%'}</p>
                </div>
              </div>

              {/* Full Address Breakdown */}
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Pickup Location</span>
                  <p className="text-xs font-semibold text-neutral-900 mt-0.5">{selectedTrip.pickupAddress}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/70">
                  <span className="text-[10px] font-bold text-blue-600 uppercase">Destination Drop-Off</span>
                  <p className="text-xs font-semibold text-neutral-900 mt-0.5">{selectedTrip.dropoffAddress}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDetailDrawerOpen(false)}
                className="btn btn-neutral"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Contacting fleet driver ${selectedTrip.driver.name} at ${selectedTrip.driver.phone}`)
                }}
                className="btn btn-submit"
              >
                Contact Driver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}