import React from 'react'
import {
  ArrowLeft,
  MapPin,
  Sparkles
} from '@/utils/icons'

interface AssignVendorScreenProps {
  onBackToOverview: () => void
}

export default function AssignVendorScreen({ onBackToOverview }: AssignVendorScreenProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Header & Back Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button
            onClick={onBackToOverview}
            className="text-xs font-bold text-neutral-500 hover:text-neutral-900 cursor-pointer flex items-center gap-1 uppercase tracking-wider mb-1"
          >
            <ArrowLeft size={14} /> BACK TO BOOKINGS
          </button>
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
            Assign Vendor
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Select the best available partner for Booking #LX-9920
          </p>
        </div>

        <button className="px-4 py-2 border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-2">
          Filter by Fleet Size
        </button>
      </div>

      {/* Booking Route Summary Banner */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-8 text-xs">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">ROUTE</span>
            <span className="font-extrabold text-neutral-900 text-sm">New York, NY → Chicago, IL</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">CARGO TYPE</span>
            <span className="font-bold text-neutral-800">Perishable Goods</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">PICKUP WINDOW</span>
            <span className="font-bold text-neutral-800">Today, 14:00 - 16:00</span>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">EST. BUDGET</span>
          <span className="text-xl font-black text-[#1B6B5C]">$2,450.00</span>
        </div>
      </div>

      {/* Vendor Cards Grid (2x2 Grid with AI Recommendation Badge) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col justify-between gap-5 relative">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal-600 text-white font-extrabold text-lg flex items-center justify-center">
                NF
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 text-base">NorthStar Freight</h3>
                <span className="text-xs text-neutral-500 flex items-center gap-1">
                  <MapPin size={12} /> Jersey City, NJ
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-neutral-400 uppercase block">ACCEPTANCE RATE</span>
              <span className="text-xl font-black text-[#1B6B5C]">98%</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-neutral-50 p-2.5 rounded-xl text-center text-xs">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase block">RELIABILITY</span>
              <span className="font-bold text-amber-600">High</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase block">ACTIVE FLEET</span>
              <span className="font-bold text-neutral-900">12/15</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase block">AVG. DELAY</span>
              <span className="font-bold text-neutral-900">4 mins</span>
            </div>
          </div>

          <button className="w-full py-3 bg-[#0D5C4D] hover:bg-[#094237] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer">
            One-tap Assign ⚡
          </button>
        </div>

        {/* Card 2: AI RECOMMENDATION BADGE */}
        <div className="bg-white p-6 rounded-2xl border-2 border-[#1B6B5C] shadow-md flex flex-col justify-between gap-5 relative">
          {/* AI Recommendation Tag */}
          <div className="absolute -top-3 right-6 bg-[#8E4E3E] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
            <Sparkles size={12} /> AI RECOMMENDATION
          </div>

          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white font-extrabold text-lg flex items-center justify-center">
                SL
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 text-base">SwiftLink Logistics</h3>
                <span className="text-xs text-neutral-500 flex items-center gap-1">
                  <MapPin size={12} /> New York, NY
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-neutral-400 uppercase block">ACCEPTANCE RATE</span>
              <span className="text-xl font-black text-[#1B6B5C]">94%</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-neutral-50 p-2.5 rounded-xl text-center text-xs">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase block">BEST PRICE</span>
              <span className="font-bold text-emerald-600">$2,380</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase block">DISTANCE</span>
              <span className="font-bold text-neutral-900">2.4 mi</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase block">AVG. DELAY</span>
              <span className="font-bold text-neutral-900">12 mins</span>
            </div>
          </div>

          <button className="w-full py-3 bg-[#0D5C4D] hover:bg-[#094237] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
            One-tap Assign ⚡
          </button>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col justify-between gap-5">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-700 text-white font-extrabold text-lg flex items-center justify-center">
                AC
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 text-base">Apex Carriers</h3>
                <span className="text-xs text-neutral-500 flex items-center gap-1">
                  <MapPin size={12} /> Newark, NJ
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-neutral-400 uppercase block">ACCEPTANCE RATE</span>
              <span className="text-xl font-black text-[#1B6B5C]">89%</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-neutral-50 p-2.5 rounded-xl text-center text-xs">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase block">RELIABILITY</span>
              <span className="font-bold text-neutral-800">Stable</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase block">ACTIVE FLEET</span>
              <span className="font-bold text-neutral-900">4/10</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase block">AVG. DELAY</span>
              <span className="font-bold text-neutral-900">0 mins</span>
            </div>
          </div>

          <button className="w-full py-3 bg-[#0D5C4D] hover:bg-[#094237] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer">
            One-tap Assign ⚡
          </button>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col justify-between gap-5">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-600 text-white font-extrabold text-lg flex items-center justify-center">
                TH
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 text-base">Titan Haulage</h3>
                <span className="text-xs text-neutral-500 flex items-center gap-1">
                  <MapPin size={12} /> Brooklyn, NY
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-neutral-400 uppercase block">ACCEPTANCE RATE</span>
              <span className="text-xl font-black text-[#1B6B5C]">92%</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-neutral-50 p-2.5 rounded-xl text-center text-xs">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase block">RELIABILITY</span>
              <span className="font-bold text-neutral-900">Strong</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase block">ACTIVE FLEET</span>
              <span className="font-bold text-neutral-900">25/30</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase block">AVG. DELAY</span>
              <span className="font-bold text-neutral-900">18 mins</span>
            </div>
          </div>

          <button className="w-full py-3 bg-[#0D5C4D] hover:bg-[#094237] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer">
            One-tap Assign ⚡
          </button>
        </div>
      </div>

      {/* Load More Button */}
      <div className="flex justify-center mt-2">
        <button className="px-6 py-2.5 border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 font-bold text-xs rounded-full shadow-xs transition-all cursor-pointer">
          Load More Nearby Vendors
        </button>
      </div>
    </div>
  )
}
