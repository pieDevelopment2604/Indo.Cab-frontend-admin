import { useState, useEffect } from 'react'
import LoginCard from '@/components/auth/LoginCard'
import { TrendingUp, RefreshCw, Car, MapPin } from '@/utils/icons'

type VehicleClass = 'hatchback' | 'sedan' | 'suv'

interface AlertLog {
  id: string
  text: string
  time: string
  type: 'info' | 'success' | 'warning'
}

interface MapHub {
  id: string
  name: string
  x: string
  y: string
  demand: 'Low' | 'Moderate' | 'High'
  multiplier: string
  cabs: number
}

// Particular SVG Vector Graphics for Each Vehicle Type
const HatchbackSVG = ({ color = '#059669' }: { color?: string }) => (
  <g transform="translate(-24, -12)">
    <ellipse cx="24" cy="18" rx="22" ry="5" fill="#000000" opacity="0.25" />
    <rect x="5" y="0" width="8" height="4" rx="1.5" fill="#111827" />
    <rect x="33" y="0" width="8" height="4" rx="1.5" fill="#111827" />
    <rect x="5" y="20" width="8" height="4" rx="1.5" fill="#111827" />
    <rect x="33" y="20" width="8" height="4" rx="1.5" fill="#111827" />
    <path d="M 4 8 C 4 4, 12 2, 24 2 C 34 2, 42 4, 44 9 C 45 12, 45 15, 44 17 C 42 20, 34 22, 24 22 C 12 22, 4 20, 4 14 Z" fill={color} stroke="#FFFFFF" strokeWidth="1.2" />
    <path d="M 8 5 L 8 19" stroke="#000000" strokeWidth="1" opacity="0.3" />
    <path d="M 12 6 C 18 5, 30 5, 34 6 C 35 12, 35 12, 34 18 C 30 19, 18 19, 12 18 Z" fill="#1F2937" opacity="0.9" />
    <rect x="18" y="7" width="10" height="10" rx="1" fill="#6B7280" opacity="0.5" />
    <rect x="19" y="4" width="10" height="16" rx="2" fill="#FBBF24" stroke="#D97706" strokeWidth="0.8" />
    <ellipse cx="43" cy="6" rx="1.5" ry="2" fill="#FEF08A" />
    <ellipse cx="43" cy="18" rx="1.5" ry="2" fill="#FEF08A" />
  </g>
)

const SedanSVG = ({ color = '#047857' }: { color?: string }) => (
  <g transform="translate(-28, -12)">
    <ellipse cx="28" cy="18" rx="26" ry="5.5" fill="#000000" opacity="0.25" />
    <rect x="6" y="0" width="10" height="4" rx="1.5" fill="#111827" />
    <rect x="40" y="0" width="10" height="4" rx="1.5" fill="#111827" />
    <rect x="6" y="20" width="10" height="4" rx="1.5" fill="#111827" />
    <rect x="40" y="20" width="10" height="4" rx="1.5" fill="#111827" />
    <path d="M 3 11 C 3 6, 10 3, 24 3 L 42 3 C 50 3, 54 7, 54 11 C 54 15, 50 19, 42 19 L 24 19 C 10 19, 3 16, 3 11 Z" fill={color} stroke="#FFFFFF" strokeWidth="1.2" />
    <path d="M 12 4 L 12 18" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.4" />
    <path d="M 44 4 L 44 18" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.4" />
    <rect x="14" y="5" width="8" height="12" rx="1.5" fill="#1F2937" opacity="0.9" />
    <rect x="24" y="5" width="8" height="12" rx="1.5" fill="#1F2937" opacity="0.9" />
    <rect x="34" y="5" width="8" height="12" rx="1.5" fill="#1F2937" opacity="0.9" />
    <rect x="21" y="4" width="14" height="14" rx="2" fill="#FBBF24" stroke="#D97706" strokeWidth="0.8" />
    <polygon points="53,5 56,7 53,9" fill="#FEF08A" />
    <polygon points="53,13 56,15 53,17" fill="#FEF08A" />
  </g>
)

const SuvSVG = ({ color = '#0f766e' }: { color?: string }) => (
  <g transform="translate(-30, -14)">
    <ellipse cx="30" cy="21" rx="28" ry="6" fill="#000000" opacity="0.3" />
    <rect x="6" y="0" width="11" height="5" rx="2" fill="#111827" />
    <rect x="43" y="0" width="11" height="5" rx="2" fill="#111827" />
    <rect x="6" y="23" width="11" height="5" rx="2" fill="#111827" />
    <rect x="43" y="23" width="11" height="5" rx="2" fill="#111827" />
    <line x1="12" y1="2" x2="48" y2="2" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="26" x2="48" y2="26" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
    <rect x="4" y="4" width="52" height="20" rx="5" fill={color} stroke="#FFFFFF" strokeWidth="1.5" />
    <rect x="2" y="9" width="4" height="10" rx="2" fill="#1F2937" />
    <rect x="12" y="6" width="10" height="16" rx="1.5" fill="#111827" />
    <rect x="24" y="6" width="10" height="16" rx="1.5" fill="#111827" />
    <rect x="36" y="6" width="10" height="16" rx="1.5" fill="#111827" />
    <rect x="21" y="5" width="18" height="18" rx="2" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
    <circle cx="54" cy="7" r="2" fill="#FEF08A" />
    <circle cx="54" cy="21" r="2" fill="#FEF08A" />
  </g>
)

export default function LoginPage() {
  // Vehicle Estimator States
  const [vehicleClass, setVehicleClass] = useState<VehicleClass>('sedan')
  const [distance, setDistance] = useState<number>(14.5)
  const [isEstimating, setIsEstimating] = useState(false)

  // Simulation States
  const [isSimulating, setIsSimulating] = useState(true)
  const [stats, setStats] = useState({ activeDrivers: 154, unassignedTrips: 8, completionRate: 98.4 })
  const [alerts, setAlerts] = useState<AlertLog[]>([
    { id: '1', text: 'Driver J. Patel is now online (CAB-4092)', time: 'Just now', type: 'info' },
    { id: '2', text: 'Trip #8402 assigned to Driver S. Ali', time: '2m ago', type: 'success' },
    { id: '3', text: 'High demand alert in Airport Terminal 2', time: '5m ago', type: 'warning' },
  ])

  // Interactive Map Hub States
  const [selectedHub, setSelectedHub] = useState<string>('airport')

  const hubs: MapHub[] = [
    { id: 'airport', name: 'Airport Terminal 2', x: '78%', y: '22%', demand: 'High', multiplier: '1.5x', cabs: 18 },
    { id: 'downtown', name: 'Downtown Center', x: '48%', y: '42%', demand: 'High', multiplier: '1.8x', cabs: 26 },
    { id: 'station', name: 'Railway Station', x: '68%', y: '62%', demand: 'Moderate', multiplier: '1.2x', cabs: 14 },
    { id: 'business', name: 'Business District', x: '22%', y: '58%', demand: 'Low', multiplier: '1.0x', cabs: 9 },
    { id: 'techpark', name: 'IT Tech Park', x: '18%', y: '28%', demand: 'High', multiplier: '1.6x', cabs: 21 },
    { id: 'mall', name: 'Grand City Mall', x: '38%', y: '78%', demand: 'Moderate', multiplier: '1.3x', cabs: 11 },
    { id: 'stadium', name: 'National Stadium', x: '82%', y: '75%', demand: 'High', multiplier: '1.7x', cabs: 23 },
    { id: 'university', name: 'University Campus', x: '32%', y: '18%', demand: 'Low', multiplier: '1.0x', cabs: 8 },
    { id: 'port', name: 'Harbor Port Gate', x: '88%', y: '45%', demand: 'Moderate', multiplier: '1.4x', cabs: 12 },
    { id: 'convention', name: 'Convention Center', x: '58%', y: '20%', demand: 'Moderate', multiplier: '1.3x', cabs: 15 },
  ]

  // Run live simulation updates
  useEffect(() => {
    if (!isSimulating) return

    const interval = setInterval(() => {
      // Randomly update stats slightly
      setStats(prev => ({
        activeDrivers: Math.max(120, prev.activeDrivers + (Math.random() > 0.5 ? 1 : -1)),
        unassignedTrips: Math.max(1, prev.unassignedTrips + (Math.random() > 0.6 ? 1 : -1)),
        completionRate: parseFloat((prev.completionRate + (Math.random() > 0.5 ? 0.1 : -0.1)).toFixed(1))
      }))

      // Randomly inject new operations alert
      const randomAlerts = [
        { text: 'Driver A. Kumar completed Trip #8391', type: 'success' as const },
        { text: 'Booking request received from Hotel Marriott', type: 'info' as const },
        { text: 'Peak pricing multiplier 1.2x activated in downtown', type: 'warning' as const },
        { text: 'Driver R. Singh logged off (CAB-1082)', type: 'info' as const },
      ]
      const chosen = randomAlerts[Math.floor(Math.random() * randomAlerts.length)]

      setAlerts(prev => [
        {
          id: Math.random().toString(),
          text: chosen.text,
          time: 'Just now',
          type: chosen.type
        },
        ...prev.map(a => ({
          ...a,
          time: a.time === 'Just now' ? '1m ago' : a.time.includes('m ago') ? `${parseInt(a.time) + 1}m ago` : a.time
        })).slice(0, 3)
      ])
    }, 5000)

    return () => clearInterval(interval)
  }, [isSimulating])

  // Calculate fare dynamically based on distance and class
  const getFare = () => {
    const base = vehicleClass === 'hatchback' ? 5 : vehicleClass === 'sedan' ? 8 : 12
    const perKm = vehicleClass === 'hatchback' ? 1.2 : vehicleClass === 'sedan' ? 1.5 : 2.2
    return (base + distance * perKm).toFixed(2)
  }

  const handleSimulateRequest = () => {
    setIsEstimating(true)
    setTimeout(() => {
      setIsEstimating(false)
      // Inject simulated request alert
      setAlerts(prev => [
        {
          id: Math.random().toString(),
          text: `Simulated Booking: Requesting ${vehicleClass.toUpperCase()} for ${distance} km`,
          time: 'Just now',
          type: 'success'
        },
        ...prev.slice(0, 3)
      ])
    }, 600)
  }

  const handleHubDispatch = (hubName: string) => {
    setAlerts(prev => [
      {
        id: Math.random().toString(),
        text: `Manual Dispatch: Directing available cabs to ${hubName}`,
        time: 'Just now',
        type: 'info'
      },
      ...prev.slice(0, 3)
    ])
  }

  const activeHub = hubs.find(h => h.id === selectedHub) || hubs[0]

  return (
    <div className="flex min-h-screen w-full font-sans bg-white overflow-hidden">
      {/* Left side: Reusable Login Card Component */}
      <LoginCard />

      {/* Right side: Interactive SVG Map & Controller Panel */}
      <div className="hidden lg:flex flex-[1.2] flex-col justify-between p-10 relative z-0 bg-[#f4f7f4] overflow-hidden select-none">

        {/* Map Grid Background (Procedural styling, no static image) */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(27,107,92,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(27,107,92,0.03)_1px,transparent_1px)] bg-[size:28px_28px] -z-20" />

        {/* Soft decorative background circles */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[#1B6B5C]/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-30 blur-3xl" />

        {/* Interactive SVG Cab Routes & Animation (6 Long Drive Lanes with mini cars) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10" viewBox="0 0 1000 650" fill="none">
          {/* 6 Long Drive Lanes */}
          {/* Drive Line 1 */}
          <path d="M -100 120 C 300 80, 600 200, 1100 150" stroke="#1B6B5C" strokeWidth="2" strokeDasharray="6 4" opacity="0.35" />
          
          {/* Drive Line 2 */}
          <path d="M -100 240 C 250 160, 550 320, 1100 220" stroke="#1B6B5C" strokeWidth="2" strokeDasharray="6 4" opacity="0.35" />
          
          {/* Drive Line 3 */}
          <path d="M -100 360 Q 450 180, 1100 380" stroke="#1B6B5C" strokeWidth="2.5" strokeDasharray="7 4" opacity="0.4" />
          
          {/* Drive Line 4 */}
          <path d="M -100 480 Q 500 600, 1100 420" stroke="#1B6B5C" strokeWidth="2" strokeDasharray="6 4" opacity="0.35" />
          
          {/* Drive Line 5 */}
          <path d="M 80 -100 L 920 750" stroke="#1B6B5C" strokeWidth="2" strokeDasharray="6 4" opacity="0.3" />
          
          {/* Drive Line 6 */}
          <path d="M 920 -100 L 80 750" stroke="#1B6B5C" strokeWidth="2" strokeDasharray="6 4" opacity="0.3" />

          {/* 6 Mini Cars Vector SVGs: Hatchback, Sedan, and SUV Types */}
          
          {/* Mini Car 1: Hatchback (Line 1) */}
          <g>
            <animateMotion path="M -100 120 C 300 80, 600 200, 1100 150" dur="13s" repeatCount="indefinite" rotate="auto" />
            <HatchbackSVG color="#059669" />
          </g>
          <g>
            <animateMotion path="M -100 120 C 300 80, 600 200, 1100 150" dur="13s" repeatCount="indefinite" />
            <foreignObject width="140" height="30" x="-70" y="-34">
              <div className="flex justify-center items-center">
                <div className="bg-[#059669] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-lg border border-white flex items-center gap-1.5 whitespace-nowrap tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-pulse" />
                  <span>Hatchback • indo.cab #101</span>
                </div>
              </div>
            </foreignObject>
          </g>

          {/* Mini Car 2: Sedan (Line 2) */}
          <g>
            <animateMotion path="M -100 240 C 250 160, 550 320, 1100 220" dur="15s" begin="2s" repeatCount="indefinite" rotate="auto" />
            <SedanSVG color="#047857" />
          </g>
          <g>
            <animateMotion path="M -100 240 C 250 160, 550 320, 1100 220" dur="15s" begin="2s" repeatCount="indefinite" />
            <foreignObject width="140" height="30" x="-70" y="-34">
              <div className="flex justify-center items-center">
                <div className="bg-[#047857] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-lg border border-white flex items-center gap-1.5 whitespace-nowrap tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  <span>Sedan • indo.cab #102</span>
                </div>
              </div>
            </foreignObject>
          </g>

          {/* Mini Car 3: SUV (Line 3) */}
          <g>
            <animateMotion path="M -100 360 Q 450 180, 1100 380" dur="14s" begin="4s" repeatCount="indefinite" rotate="auto" />
            <SuvSVG color="#0f766e" />
          </g>
          <g>
            <animateMotion path="M -100 360 Q 450 180, 1100 380" dur="14s" begin="4s" repeatCount="indefinite" />
            <foreignObject width="140" height="30" x="-70" y="-34">
              <div className="flex justify-center items-center">
                <div className="bg-[#0f766e] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-lg border border-white flex items-center gap-1.5 whitespace-nowrap tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-200 animate-pulse" />
                  <span>SUV • indo.cab #103</span>
                </div>
              </div>
            </foreignObject>
          </g>

          {/* Mini Car 4: Hatchback (Line 4) */}
          <g>
            <animateMotion path="M -100 480 Q 500 600, 1100 420" dur="16s" begin="1s" repeatCount="indefinite" rotate="auto" />
            <HatchbackSVG color="#374151" />
          </g>
          <g>
            <animateMotion path="M -100 480 Q 500 600, 1100 420" dur="16s" begin="1s" repeatCount="indefinite" />
            <foreignObject width="140" height="30" x="-70" y="-34">
              <div className="flex justify-center items-center">
                <div className="bg-[#1f2937] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-lg border border-white flex items-center gap-1.5 whitespace-nowrap tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Hatchback • indo.cab #104</span>
                </div>
              </div>
            </foreignObject>
          </g>

          {/* Mini Car 5: Sedan (Line 5) */}
          <g>
            <animateMotion path="M 80 -100 L 920 750" dur="17s" begin="3s" repeatCount="indefinite" rotate="auto" />
            <SedanSVG color="#047857" />
          </g>
          <g>
            <animateMotion path="M 80 -100 L 920 750" dur="17s" begin="3s" repeatCount="indefinite" />
            <foreignObject width="140" height="30" x="-70" y="-34">
              <div className="flex justify-center items-center">
                <div className="bg-[#047857] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-lg border border-white flex items-center gap-1.5 whitespace-nowrap tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  <span>Sedan • indo.cab #105</span>
                </div>
              </div>
            </foreignObject>
          </g>

          {/* Mini Car 6: SUV (Line 6) */}
          <g>
            <animateMotion path="M 920 -100 L 80 750" dur="18s" begin="5s" repeatCount="indefinite" rotate="auto" />
            <SuvSVG color="#1f2937" />
          </g>
          <g>
            <animateMotion path="M 920 -100 L 80 750" dur="18s" begin="5s" repeatCount="indefinite" />
            <foreignObject width="140" height="30" x="-70" y="-34">
              <div className="flex justify-center items-center">
                <div className="bg-[#1f2937] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-lg border border-white flex items-center gap-1.5 whitespace-nowrap tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>SUV • indo.cab #106</span>
                </div>
              </div>
            </foreignObject>
          </g>
        </svg>

        {/* Top Header: Simulator Switcher */}
        <div className="w-full flex justify-between items-center z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-100/50">
              Live Operations Map
            </span>
          </div>

          <div className="bg-white/85 backdrop-blur-md border border-neutral-200/50 rounded-xl px-4 py-2 flex items-center gap-3 shadow-sm">
            <span className="text-xs font-semibold text-neutral-800">Simulator Status:</span>
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${isSimulating ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className="text-[11px] font-bold uppercase tracking-wider text-primary-700 hover:text-primary-800 focus:outline-none cursor-pointer"
              >
                {isSimulating ? 'Pause' : 'Resume'}
              </button>
            </div>
          </div>
        </div>

        {/* Center Section: Interactive Hub Pins & Detail Cards */}
        <div className="w-full h-full flex flex-col justify-center items-center relative my-4">

          {/* Map Location Buttons (Clickable Hotspots) */}
          {hubs.map((hub) => {
            const isSelected = selectedHub === hub.id
            return (
              <button
                key={hub.id}
                onClick={() => setSelectedHub(hub.id)}
                className="absolute flex flex-col items-center justify-center transition-transform hover:scale-110 focus:outline-none cursor-pointer z-20 group"
                style={{ left: hub.x, top: hub.y }}
              >
                {/* Ping rings if High Demand */}
                {hub.demand === 'High' && (
                  <span className="absolute -top-1 w-6 h-6 rounded-full bg-red-400/30 animate-ping" />
                )}

                <MapPin
                  size={26}
                  className={`transition-colors drop-shadow-md ${isSelected
                      ? 'text-red-500 fill-red-200'
                      : 'text-primary-600 fill-primary-100 group-hover:text-primary-800'
                    }`}
                />

                {/* Floating Hub Name tag */}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm border mt-1 select-none pointer-events-none transition-all ${isSelected
                    ? 'bg-neutral-800 text-white border-neutral-800'
                    : 'bg-white text-neutral-700 border-neutral-200 group-hover:bg-neutral-50'
                  }`}>
                  {hub.name}
                </span>
              </button>
            )
          })}

          {/* Centered Hub Inspector Card (Presents details when pins are clicked) */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md border border-neutral-200/60 rounded-2xl p-4 shadow-lg w-[240px] z-30 transition-all">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">{activeHub.name}</h3>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${activeHub.demand === 'High'
                  ? 'bg-red-50 text-red-600 border border-red-100'
                  : activeHub.demand === 'Moderate'
                    ? 'bg-yellow-50 text-yellow-600 border border-yellow-100'
                    : 'bg-green-50 text-green-600 border border-green-100'
                }`}>
                {activeHub.demand} Demand
              </span>
            </div>

            <div className="flex flex-col gap-1.5 text-xs border-b border-neutral-100 pb-3 mb-3">
              <div className="flex justify-between">
                <span className="text-neutral-500">Fare Multiplier:</span>
                <span className="font-semibold text-neutral-800">{activeHub.multiplier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Available Cabs:</span>
                <span className="font-semibold text-primary-700">{activeHub.cabs} Cars</span>
              </div>
            </div>

            <button
              onClick={() => handleHubDispatch(activeHub.name)}
              className="w-full py-2 bg-primary-600 hover:bg-primary-700 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RefreshCw size={12} />
              Re-route Cabs Here
            </button>
          </div>

          {/* Interactive Calculator Overlay */}
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md border border-neutral-200/60 rounded-2xl p-4 shadow-lg w-[240px] z-30">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5 mb-2 pb-1.5 border-b border-neutral-100">
              <Car size={13} className="text-primary-600" />
              Fare Estimator
            </span>

            <div className="flex flex-col gap-2.5">
              <div className="flex bg-neutral-100 rounded-lg p-0.5">
                {(['hatchback', 'sedan', 'suv'] as VehicleClass[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => setVehicleClass(v)}
                    className={`flex-1 py-1 text-[10px] font-semibold rounded-md capitalize transition-all focus:outline-none cursor-pointer ${vehicleClass === v
                        ? 'bg-white text-primary-700 shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-800'
                      }`}
                  >
                    {v}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] text-neutral-500">
                  <span>Distance:</span>
                  <span className="font-bold text-neutral-800">{distance} km</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="50"
                  step="0.5"
                  className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  value={distance}
                  onChange={(e) => setDistance(parseFloat(e.target.value))}
                />
              </div>

              <div className="bg-primary-50/50 rounded-xl p-2.5 border border-primary-100/50 flex justify-between items-center">
                <div>
                  <div className="text-[9px] text-neutral-400">Estimate Fare</div>
                  <div className="text-base font-extrabold text-primary-700">${getFare()}</div>
                </div>
                <button
                  onClick={handleSimulateRequest}
                  disabled={isEstimating}
                  className="bg-primary-600 hover:bg-primary-700 text-white rounded-md p-1.5 transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw size={12} className={isEstimating ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Section: Operations Alerts Log & Active Drivers Stats */}
        <div className="w-full z-20 flex flex-col md:flex-row gap-4 items-center justify-between mt-auto">

          {/* Live Alert Logger (Bottom Left) */}
          <div className="bg-white/80 backdrop-blur-md border border-neutral-200/55 rounded-2xl p-4 shadow-md w-full md:max-w-[280px]">
            <div className="flex justify-between items-center mb-2 pb-1 border-b border-neutral-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                <TrendingUp size={12} className="text-primary-600" />
                Live Status Log
              </span>
            </div>
            <div className="flex flex-col gap-2 max-h-[100px] overflow-y-auto">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex gap-1.5 items-start">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${alert.type === 'success' ? 'bg-green-500' : alert.type === 'warning' ? 'bg-yellow-500' : 'bg-primary-500'
                    }`} />
                  <div className="flex flex-col">
                    <span className="text-[11px] leading-tight text-neutral-700">{alert.text}</span>
                    <span className="text-[8px] text-neutral-400">{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fleet Statistics (Bottom Right) */}
          <div className="bg-white/80 backdrop-blur-md border border-neutral-200/55 rounded-2xl p-4 shadow-md w-full md:max-w-[340px] flex justify-between gap-4">
            <div className="text-center flex-1">
              <div className="text-[9px] uppercase font-bold text-neutral-400 tracking-wider">Active Drivers</div>
              <div className="text-sm font-extrabold text-primary-700 mt-0.5">{stats.activeDrivers}</div>
            </div>
            <div className="w-px h-6 bg-neutral-200 self-center" />
            <div className="text-center flex-1">
              <div className="text-[9px] uppercase font-bold text-neutral-400 tracking-wider">Queued Requests</div>
              <div className="text-sm font-extrabold text-secondary-600 mt-0.5">{stats.unassignedTrips}</div>
            </div>
            <div className="w-px h-6 bg-neutral-200 self-center" />
            <div className="text-center flex-1">
              <div className="text-[9px] uppercase font-bold text-neutral-400 tracking-wider">Trip Success</div>
              <div className="text-sm font-extrabold text-neutral-800 mt-0.5">{stats.completionRate}%</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
