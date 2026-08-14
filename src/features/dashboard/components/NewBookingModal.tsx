import React, { useState } from 'react'
import { X, MapPin, Navigation, Calendar } from '@/utils/icons'
import type { IncomingBooking } from '../types'

interface NewBookingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (newBooking: IncomingBooking) => void
}

export default function NewBookingModal({
  isOpen,
  onClose,
  onSubmit
}: NewBookingModalProps) {
  const [vehicleType, setVehicleType] = useState('Standard SUV')
  const [pickupTitle, setPickupTitle] = useState('')
  const [pickupAddress, setPickupAddress] = useState('')
  const [dropTitle, setDropTitle] = useState('')
  const [dropAddress, setDropAddress] = useState('')
  const [scheduleTime, setScheduleTime] = useState('Today, 15:30 PM')
  const [isUrgent, setIsUrgent] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pickupTitle || !dropTitle) return

    const category = vehicleType.includes('Truck')
      ? 'Truck'
      : vehicleType.includes('Sedan')
      ? 'Sedan'
      : 'SUV'

    const newBooking: IncomingBooking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      vehicleType,
      vehicleCategory: category,
      isUrgent,
      urgentMessage: isUrgent ? '! Urgent Replace' : undefined,
      pickup: {
        title: pickupTitle,
        address: pickupAddress || 'Terminal Portico'
      },
      drop: {
        title: dropTitle,
        address: dropAddress || 'Main Entrance'
      },
      schedule: {
        time: scheduleTime,
        dueNote: isUrgent ? 'Overdue by 5m' : 'Starts in 1 hour',
        isOverdue: isUrgent
      }
    }

    onSubmit(newBooking)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn font-sans">
      <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-2xl border border-neutral-200 flex flex-col gap-5">
        <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
          <h3 className="text-lg font-bold text-neutral-900">Create New Dispatch Booking</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 cursor-pointer p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 text-xs">
            {/* Vehicle Type Selection */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-neutral-700">Vehicle Type</label>
              <select
                className="px-3 py-2 text-sm border border-neutral-200 rounded-md outline-none focus:border-[#1B6B5C] bg-white shadow-sm"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
              >
                <option value="Standard SUV">Standard SUV</option>
                <option value="Container Truck (12ft)">Container Truck (12ft)</option>
                <option value="Premium Sedan">Premium Sedan</option>
                <option value="Hatchback Cab">Hatchback Cab</option>
              </select>
            </div>

            {/* Pickup Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-neutral-700 flex items-center gap-1">
                  <MapPin size={12} className="text-[#1B6B5C]" /> Pickup Location Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Airport Terminal 3"
                  className="px-3 py-2 text-sm border border-neutral-200 rounded-md shadow-sm outline-none focus:border-[#1B6B5C]"
                  value={pickupTitle}
                  onChange={(e) => setPickupTitle(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-neutral-700">Pickup Address Details</label>
                <input
                  type="text"
                  placeholder="Gate 4B Portico"
                  className="px-3 py-2 text-sm border border-neutral-200 rounded-md shadow-sm outline-none focus:border-[#1B6B5C]"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                />
              </div>
            </div>

            {/* Drop Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-neutral-700 flex items-center gap-1">
                  <Navigation size={12} className="text-teal-600" /> Drop Destination Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cyber City Tower C"
                  className="px-3 py-2 text-sm border border-neutral-200 rounded-md shadow-sm outline-none focus:border-[#1B6B5C]"
                  value={dropTitle}
                  onChange={(e) => setDropTitle(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-neutral-700">Drop Address Details</label>
                <input
                  type="text"
                  placeholder="DLF Phase 2 Entrance"
                  className="px-3 py-2 text-sm border border-neutral-200 rounded-md shadow-sm outline-none focus:border-[#1B6B5C]"
                  value={dropAddress}
                  onChange={(e) => setDropAddress(e.target.value)}
                />
              </div>
            </div>

            {/* Schedule & Urgent Flag */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-neutral-700 flex items-center gap-1">
                  <Calendar size={12} /> Schedule Time
                </label>
                <input
                  type="text"
                  required
                  placeholder="Today, 15:30 PM"
                  className="px-3 py-2 text-sm border border-neutral-200 rounded-md shadow-sm outline-none focus:border-[#1B6B5C]"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="urgent-check"
                  className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                />
                <label htmlFor="urgent-check" className="font-bold text-red-600 cursor-pointer">
                  Mark as Urgent Replace
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 mt-2 pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md text-xs font-bold bg-[#0D5C4D] hover:bg-[#094237] text-white transition-colors cursor-pointer shadow-sm"
            >
              Submit Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
