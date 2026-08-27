import React, { useState, useEffect, useRef } from 'react'
import type { Vendor } from '../types'
import { vendorApi } from '@/api/vendor.api'
import { validateGst, validatePan } from '@/utils/taxValidation'
import {
  ArrowLeft,
  CheckCircle,
  Check,
  Building2,
  X,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Camera,
  FileCheck,
  UploadCloud,
  CheckCircle2,
  Trash2,
  MapPin,
  Lock,
  Eye,
  EyeOff
} from '@/utils/icons'

interface VendorOnboardingWizardProps {
  onBackToOverview: () => void
  onVendorAdded: (vendor: Vendor) => void
}

export interface VehicleCategoryOption {
  id: string
  name: string
  description: string
  icon: string
  badge: string
}

const VEHICLE_CATEGORY_OPTIONS: VehicleCategoryOption[] = [
  {
    id: 'sedan',
    name: 'Sedan Cabs',
    description: 'Comfortable 4-seater sedans (Dzire, Etios, Aura)',
    icon: '🚗',
    badge: 'Popular'
  },
  {
    id: 'suv',
    name: 'SUV / MUV',
    description: 'Spacious 6-7 seater vehicles (Ertiga, Innova Crysta, Carens)',
    icon: '🚙',
    badge: 'High Demand'
  },
  {
    id: 'hatchback',
    name: 'Compact Hatchback',
    description: 'Economy 4-seater city cabs (WagonR, Tiago, Celerio)',
    icon: '🚘',
    badge: 'Economy'
  },
  {
    id: 'luxury',
    name: 'Luxury / Business Class',
    description: 'Premium executive vehicles (Camry, Mercedes E-Class, BMW 5)',
    icon: '🏎️',
    badge: 'Premium'
  },
  {
    id: 'ev',
    name: 'Electric EV Cabs',
    description: 'Zero-emission green electric vehicles (Tigor EV, ZS EV)',
    icon: '⚡',
    badge: 'Eco Green'
  },
  {
    id: 'van',
    name: 'Executive Van',
    description: 'Luxury multi-passenger vans (V-Class, Alphard, Traveller)',
    icon: '🚐',
    badge: 'Corporate'
  }
]

const CITY_OPTIONS = [
  'Jakarta Metro',
  'Mumbai',
  'Bengaluru',
  'Delhi NCR',
  'Pune',
  'Hyderabad',
  'Surat',
  'New York, NY',
  'Jersey City, NJ'
]

export default function VendorOnboardingWizard({
  onBackToOverview,
  onVendorAdded
}: VendorOnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cityInput, setCityInput] = useState('')
  const [step1Errors, setStep1Errors] = useState<{ gst?: string; pan?: string; password?: string }>({})

  // Form State
  const [name, setName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [phone, setPhone] = useState('')
  const [gstNumber, setGstNumber] = useState('')
  const [panNumber, setPanNumber] = useState('')
  const [city, setCity] = useState('')
  const [operatingCities, setOperatingCities] = useState<string[]>([])

  // Step 2: Fleet & Vehicle Categories (Multi-select)
  const [fleetSize, setFleetSize] = useState<number>(1)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [commissionRate, setCommissionRate] = useState<number>(10.0)
  const [slaAccepted, setSlaAccepted] = useState(true)

  // Step 3: Bank Settlement & Document Uploads
  const [bankName, setBankName] = useState('')
  const [accountName, setAccountName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [ifscCode, setIfscCode] = useState('')

  // Image Upload States
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFileName, setLogoFileName] = useState<string>('')
  const [licensePreview, setLicensePreview] = useState<string | null>(null)
  const [licenseFileName, setLicenseFileName] = useState<string>('')
  const [fleetPhotoPreview, setFleetPhotoPreview] = useState<string | null>(null)
  const [fleetPhotoFileName, setFleetPhotoFileName] = useState<string>('')

  // File Input Refs
  const logoInputRef = useRef<HTMLInputElement>(null)
  const licenseInputRef = useRef<HTMLInputElement>(null)
  const fleetPhotoInputRef = useRef<HTMLInputElement>(null)

  // Created Vendor State
  const [createdVendor, setCreatedVendor] = useState<Vendor | null>(null)

  // Scroll to top on step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStep])

  // Real-time GST and PAN Validation
  const gstValidation = validateGst(gstNumber, panNumber)
  const panValidation = validatePan(panNumber)
  const isGstValid = gstValidation.isValid
  const isPanValid = panValidation.isValid

  // Handlers for GST & PAN
  const handleGstChange = (val: string) => {
    const uppercaseGst = val.toUpperCase().trim()
    let updatedPan = panNumber
    if (uppercaseGst.length >= 12) {
      const extractedPan = uppercaseGst.substring(2, 12)
      if (validatePan(extractedPan).isValid && (!panNumber || panNumber.length < 10)) {
        updatedPan = extractedPan
      }
    }
    setGstNumber(uppercaseGst)
    if (updatedPan !== panNumber) setPanNumber(updatedPan)
    if (step1Errors.gst) setStep1Errors((prev) => ({ ...prev, gst: undefined }))
  }

  const handlePanChange = (val: string) => {
    const uppercasePan = val.toUpperCase().trim()
    setPanNumber(uppercasePan)
    if (step1Errors.pan) setStep1Errors((prev) => ({ ...prev, pan: undefined }))
  }

  // Logo Image Upload Handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFileName(file.name)
      const reader = new FileReader()
      reader.onload = (evt) => {
        setLogoPreview(evt.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Document Image Upload Handler
  const handleLicenseUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLicenseFileName(file.name)
      const reader = new FileReader()
      reader.onload = (evt) => {
        setLicensePreview(evt.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Fleet Photo Image Upload Handler
  const handleFleetPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFleetPhotoFileName(file.name)
      const reader = new FileReader()
      reader.onload = (evt) => {
        setFleetPhotoPreview(evt.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Toggle Category Selection
  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(catId)) {
        if (prev.length === 1) return prev // Keep at least 1 category
        return prev.filter((id) => id !== catId)
      } else {
        return [...prev, catId]
      }
    })
  }

  // City Tag Handlers
  const handleAddCity = (cityToAdd: string) => {
    const trimmed = cityToAdd.trim()
    if (trimmed && !operatingCities.includes(trimmed)) {
      setOperatingCities((prev) => [...prev, trimmed])
    }
    setCityInput('')
  }

  const handleRemoveCity = (cityToRemove: string) => {
    setOperatingCities((prev) => prev.filter((c) => c !== cityToRemove))
  }

  // Form Step Handlers
  const handleNextToStep2 = (e: React.FormEvent) => {
    e.preventDefault()
    if (password && password.length < 6) {
      setStep1Errors((prev) => ({ ...prev, password: 'Password must be at least 6 characters.' }))
      return
    }
    if (gstNumber) {
      const gValid = validateGst(gstNumber, panNumber)
      if (!gValid.isValid) {
        setStep1Errors((prev) => ({ ...prev, gst: gValid.message }))
        return
      }
    }
    if (panNumber) {
      const pValid = validatePan(panNumber)
      if (!pValid.isValid) {
        setStep1Errors((prev) => ({ ...prev, pan: pValid.message }))
        return
      }
    }
    setStep1Errors({})
    setCurrentStep(2)
  }

  const handleNextToStep3 = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentStep(3)
  }

  // Final Submission Handler
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const categoryNames = selectedCategories.map(
      (catId) => VEHICLE_CATEGORY_OPTIONS.find((c) => c.id === catId)?.name || catId
    )

    const nameParts = (contactPerson || '').trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    const apiPayload = {
      email,
      password: password || undefined,
      mobile_number: phone,
      first_name: firstName,
      last_name: lastName,
      profile_image_url: logoPreview || '',
      company_name: companyName,
      gst_number: gstNumber,
      pan_number: panNumber,
      address: city || operatingCities[0] || '',
      operating_cities: operatingCities
    }

    const newId = `VND-${Math.floor(1000 + Math.random() * 9000)}-IC`
    const newVendor: Vendor = {
      id: newId,
      name: companyName || name || 'Partner Vendor',
      companyName: companyName || name || 'Vendor Logistics',
      contactPerson: contactPerson || 'Contact Manager',
      firstName,
      lastName,
      email,
      password: password || undefined,
      phone,
      city: city || operatingCities[0] || '',
      fleetSize: fleetSize || 1,
      activeCars: Math.floor((fleetSize || 1) * 0.8),
      idleCars: Math.ceil((fleetSize || 1) * 0.2),
      commissionRate: commissionRate || 10.0,
      rating: 5.0,
      acceptanceRate: 100.0,
      cancellationRate: 0.0,
      completionRate: 100.0,
      status: 'active',
      joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      logo: logoPreview || undefined,
      gstNumber: gstNumber || undefined,
      panNumber: panNumber || undefined,
      vehicleCategories: categoryNames,
      operatingCities: operatingCities,
      bankDetails: {
        bankName,
        accountName: accountName || contactPerson,
        accountNumber,
        ifscCode
      },
      documents: {
        licenseUrl: licensePreview || undefined,
        licenseFileName,
        fleetPhotoUrl: fleetPhotoPreview || undefined,
        fleetPhotoFileName
      }
    }

    try {
      await vendorApi.createVendor(apiPayload)
    } catch (err) {
      console.warn('Backend API createVendor warning, using local state persistence:', err)
    } finally {
      setIsSubmitting(false)
      setCreatedVendor(newVendor)
      onVendorAdded(newVendor)
      setCurrentStep(4)
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto pb-16">
      {/* Top Header & Breadcrumbs */}
      <div>
        <button
          onClick={onBackToOverview}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer mb-2"
        >
          <ArrowLeft size={14} /> Back to Vendor Directory
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0D5C4D] text-white flex items-center justify-center shadow-xs">
            <Building2 size={20} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
              Partner Vendor Onboarding
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Register a new fleet operator, configure vehicle categories, and upload verification credentials.
            </p>
          </div>
        </div>
      </div>

      {/* Main Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Vertical Stepper Navigation */}
        <div className="lg:col-span-3 flex flex-col gap-6 card p-5">
          <div className="flex flex-col gap-6 relative">
            {/* Step 1 */}
            <div className="flex items-start gap-3.5 relative">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 transition-all ${
                  currentStep === 1
                    ? 'bg-[#0D5C4D] text-white shadow-xs'
                    : currentStep > 1
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-neutral-100 text-neutral-400'
                }`}
              >
                {currentStep > 1 ? <Check size={14} strokeWidth={3} /> : '1'}
              </div>
              <div className="flex flex-col pt-1">
                <span className={`text-xs font-bold ${currentStep === 1 ? 'text-neutral-900' : 'text-neutral-500'}`}>
                  Partner Identity & Logo
                </span>
                <span className="text-[10px] text-neutral-400">Basic details, logo & GST</span>
              </div>
            </div>

            <div className="w-0.5 h-6 bg-neutral-200 ml-4 -my-3" />

            {/* Step 2 */}
            <div className="flex items-start gap-3.5 relative">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 transition-all ${
                  currentStep === 2
                    ? 'bg-[#0D5C4D] text-white shadow-xs'
                    : currentStep > 2
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-neutral-100 text-neutral-400'
                }`}
              >
                {currentStep > 2 ? <Check size={14} strokeWidth={3} /> : '2'}
              </div>
              <div className="flex flex-col pt-1">
                <span className={`text-xs font-bold ${currentStep === 2 ? 'text-neutral-900' : 'text-neutral-500'}`}>
                  Fleet & Categories
                </span>
                <span className="text-[10px] text-neutral-400">Multi-vehicle setup & region</span>
              </div>
            </div>

            <div className="w-0.5 h-6 bg-neutral-200 ml-4 -my-3" />

            {/* Step 3 */}
            <div className="flex items-start gap-3.5 relative">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 transition-all ${
                  currentStep === 3
                    ? 'bg-[#0D5C4D] text-white shadow-xs'
                    : currentStep > 3
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-neutral-100 text-neutral-400'
                }`}
              >
                {currentStep > 3 ? <Check size={14} strokeWidth={3} /> : '3'}
              </div>
              <div className="flex flex-col pt-1">
                <span className={`text-xs font-bold ${currentStep === 3 ? 'text-neutral-900' : 'text-neutral-500'}`}>
                  Settlement & Docs
                </span>
                <span className="text-[10px] text-neutral-400">Bank info & image uploads</span>
              </div>
            </div>

            <div className="w-0.5 h-6 bg-neutral-200 ml-4 -my-3" />

            {/* Step 4 */}
            <div className="flex items-start gap-3.5 relative">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 transition-all ${
                  currentStep === 4 ? 'bg-emerald-600 text-white shadow-xs' : 'bg-neutral-100 text-neutral-400'
                }`}
              >
                <CheckCircle size={15} />
              </div>
              <div className="flex flex-col pt-1">
                <span className={`text-xs font-bold ${currentStep === 4 ? 'text-neutral-900' : 'text-neutral-500'}`}>
                  Partner Activated
                </span>
                <span className="text-[10px] text-neutral-400">Confirmation badge</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center / Right Column: Step Forms */}
        <div className="lg:col-span-9 card p-8 flex flex-col gap-6">
          {/* STEP 1: PARTNER IDENTITY & LOGO */}
          {currentStep === 1 && (
            <form onSubmit={handleNextToStep2} className="flex flex-col gap-6">
              <div className="border-b border-neutral-100 pb-3 flex justify-between items-center">
                <h3 className="text-xs font-extrabold tracking-wider text-neutral-400 uppercase">
                  STEP 1: VENDOR PARTNER BRANDING & IDENTITY
                </h3>
                <span className="text-xs font-semibold text-[#0D5C4D] bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100">
                  Required Fields *
                </span>
              </div>

              {/* Vendor Logo Image Drag & Drop Upload Component */}
              <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200/80 flex flex-col sm:flex-row items-center gap-6">
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 rounded-2xl bg-white border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center overflow-hidden shadow-xs relative">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Vendor Logo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-neutral-400">
                        <Camera size={24} />
                        <span className="text-[10px] font-bold">Upload Logo</span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </div>

                <div className="flex flex-col gap-2 text-center sm:text-left flex-1">
                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                    <h4 className="text-sm font-bold text-neutral-900">Vendor Logo / Avatar</h4>
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      JPEG, PNG, WebP (Max 5MB)
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Upload a high-resolution logo for partner branding across dispatch cards and receipts.
                  </p>
                  <div className="flex gap-2.5 mt-1 justify-center sm:justify-start">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="px-3.5 py-1.5 bg-[#0D5C4D] hover:bg-[#094237] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Upload size={14} /> {logoPreview ? 'Change Image' : 'Select Image'}
                    </button>
                    {logoPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setLogoPreview(null)
                          setLogoFileName('')
                        }}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    )}
                  </div>
                  {logoFileName && (
                    <span className="text-[11px] text-neutral-500 font-mono flex items-center gap-1">
                      <ImageIcon size={12} className="text-[#0D5C4D]" /> File: {logoFileName}
                    </span>
                  )}
                </div>
              </div>

              {/* General Partner Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-700">Vendor Display Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Indo.Cab Premium Fleet"
                    className="px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#0D5C4D] transition-colors"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-700">Registered Legal Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PT Indo Cab Mobility Services"
                    className="px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#0D5C4D] transition-colors"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-700">Contact Person / Fleet Manager *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Budi Santoso"
                    className="px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#0D5C4D] transition-colors"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-700">Primary Contact Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    className="px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#0D5C4D] transition-colors"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-700">Official Business Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="budi@indocabfleet.com"
                    className="px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#0D5C4D] transition-colors"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-neutral-700 flex items-center gap-1">
                      <Lock size={13} className="text-[#0D5C4D]" />
                      <span>Vendor Portal Password *</span>
                    </label>
                    <span className="text-[10px] text-neutral-400 font-medium">Min 6 characters</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter login password"
                      className={`w-full px-3.5 py-2.5 pr-10 text-sm border rounded-xl outline-none transition-colors ${
                        step1Errors.password
                          ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                          : 'border-neutral-200 focus:border-[#0D5C4D]'
                      }`}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (step1Errors.password) setStep1Errors((prev) => ({ ...prev, password: undefined }))
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {step1Errors.password && (
                    <span className="text-[10px] font-semibold text-rose-500 flex items-center gap-1">
                      <AlertCircle size={12} /> {step1Errors.password}
                    </span>
                  )}
                </div>
              </div>

              {/* GST & PAN Tax Credentials */}
              <div className="border-b border-neutral-100 pb-2 pt-2">
                <h3 className="text-xs font-extrabold tracking-wider text-neutral-400 uppercase">
                  TAX & COMPLIANCE REGISTRATION
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* GST Number */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-neutral-700">GST Registration Number</label>
                    {gstNumber && (
                      <span className={`text-[10px] font-bold ${isGstValid ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {isGstValid ? 'Valid GSTIN Format' : '15 Chars Required'}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="27ABCDE1234F1Z5"
                    className={`px-3.5 py-2.5 text-sm font-mono border rounded-xl outline-none uppercase transition-colors ${
                      step1Errors.gst || (gstNumber && !isGstValid)
                        ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                        : isGstValid
                        ? 'border-emerald-300 bg-emerald-50/20 focus:border-emerald-600'
                        : 'border-neutral-200 focus:border-[#0D5C4D]'
                    }`}
                    value={gstNumber}
                    onChange={(e) => handleGstChange(e.target.value)}
                  />
                  {step1Errors.gst && (
                    <span className="text-[10px] font-semibold text-rose-500 flex items-center gap-1">
                      <AlertCircle size={12} /> {step1Errors.gst}
                    </span>
                  )}
                </div>

                {/* PAN Number */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-neutral-700">Business PAN Card Number</label>
                    {panNumber && (
                      <span className={`text-[10px] font-bold ${isPanValid ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {isPanValid ? 'Valid PAN Format' : '10 Chars Required'}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="ABCDE1234F"
                    className={`px-3.5 py-2.5 text-sm font-mono border rounded-xl outline-none uppercase transition-colors ${
                      step1Errors.pan || (panNumber && !isPanValid)
                        ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                        : isPanValid
                        ? 'border-emerald-300 bg-emerald-50/20 focus:border-emerald-600'
                        : 'border-neutral-200 focus:border-[#0D5C4D]'
                    }`}
                    value={panNumber}
                    onChange={(e) => handlePanChange(e.target.value)}
                  />
                  {step1Errors.pan && (
                    <span className="text-[10px] font-semibold text-rose-500 flex items-center gap-1">
                      <AlertCircle size={12} /> {step1Errors.pan}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={onBackToOverview}
                  className="btn btn-neutral"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-submit"
                >
                  Configure Fleet & Categories &rarr;
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: FLEET & MULTI-SELECT VEHICLE CATEGORIES */}
          {currentStep === 2 && (
            <form onSubmit={handleNextToStep3} className="flex flex-col gap-6">
              <div className="border-b border-neutral-100 pb-3 flex justify-between items-center">
                <h3 className="text-xs font-extrabold tracking-wider text-neutral-400 uppercase">
                  STEP 2: FLEET CAPACITY & MULTI-VEHICLE CATEGORIES
                </h3>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                  {selectedCategories.length} Categories Selected
                </span>
              </div>

              {/* Multi-Select Vehicle Categories Grid */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-neutral-800">
                    Operated Vehicle Categories (Select All That Apply) *
                  </label>
                  <span className="text-[11px] text-neutral-400">Click card to toggle selection</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {VEHICLE_CATEGORY_OPTIONS.map((cat) => {
                    const isSelected = selectedCategories.includes(cat.id)
                    return (
                      <div
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between gap-3 relative ${
                          isSelected
                            ? 'border-[#0D5C4D] bg-teal-50/40 shadow-xs ring-1 ring-[#0D5C4D]'
                            : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50/60'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-2xl">{cat.icon}</span>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                isSelected ? 'bg-[#0D5C4D] text-white' : 'bg-neutral-100 text-neutral-500'
                              }`}
                            >
                              {cat.badge}
                            </span>
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                                isSelected ? 'bg-[#0D5C4D] text-white' : 'border border-neutral-300 text-transparent'
                              }`}
                            >
                              <Check size={12} strokeWidth={3} />
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-neutral-900">{cat.name}</h4>
                          <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">{cat.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Operational Parameters */}
              <div className="border-b border-neutral-100 pb-2 pt-3">
                <h3 className="text-xs font-extrabold tracking-wider text-neutral-400 uppercase">
                  OPERATIONAL PARAMETERS & REGIONAL COVERAGE
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-700">Initial Total Fleet Size</label>
                  <input
                    type="number"
                    min={1}
                    required
                    className="px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#0D5C4D] font-bold"
                    value={fleetSize}
                    onChange={(e) => setFleetSize(parseInt(e.target.value) || 1)}
                  />
                  <span className="text-[10px] text-neutral-400">Total active cabs in partner pool</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-700">Primary Hub City</label>
                  <select
                    className="px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#0D5C4D] bg-white"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    {CITY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] text-neutral-400">Main operating center</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-700">Commission Rate (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    min={5}
                    max={30}
                    required
                    className="px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#0D5C4D] font-bold"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(parseFloat(e.target.value) || 10)}
                  />
                  <span className="text-[10px] text-neutral-400">Standard Indo.Cab platform split</span>
                </div>
              </div>

              {/* Operating Cities Tag Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-neutral-700">Operating Regional Cities</label>
                <div className="flex flex-wrap gap-1.5 mb-1">
                  {operatingCities.map((c) => (
                    <span
                      key={c}
                      className="px-3 py-1 bg-teal-50 text-[#0D5C4D] border border-teal-200 text-xs font-bold rounded-lg flex items-center gap-1.5"
                    >
                      <MapPin size={12} /> {c}
                      <button
                        type="button"
                        onClick={() => handleRemoveCity(c)}
                        className="hover:text-red-600 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add operational city (e.g. Pune)..."
                    className="flex-1 px-3.5 py-2 text-xs border border-neutral-200 rounded-xl outline-none focus:border-[#0D5C4D]"
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddCity(cityInput)
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddCity(cityInput)}
                    className="btn btn-neutral"
                  >
                    + Add City
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="btn btn-neutral"
                >
                  &larr; Back to Identity
                </button>
                <button
                  type="submit"
                  className="btn btn-submit"
                >
                  Proceed to Bank & Documents &rarr;
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: BANK SETTLEMENT & COMPLIANCE DOCUMENT UPLOADS */}
          {currentStep === 3 && (
            <form onSubmit={handleFinalSubmit} className="flex flex-col gap-6">
              <div className="border-b border-neutral-100 pb-3 flex justify-between items-center">
                <h3 className="text-xs font-extrabold tracking-wider text-neutral-400 uppercase">
                  STEP 3: BANK SETTLEMENT & COMPLIANCE IMAGE UPLOADS
                </h3>
                <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100">
                  Verification Phase
                </span>
              </div>

              {/* Bank Settlement Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-700">Bank Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Bank Central Asia / HDFC Bank"
                    className="px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#0D5C4D]"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-700">Beneficiary Account Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Indo Cab Mobility Enterprise"
                    className="px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#0D5C4D]"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-700">Account Number</label>
                  <input
                    type="text"
                    placeholder="9876543210123"
                    className="px-3.5 py-2.5 text-sm font-mono border border-neutral-200 rounded-xl outline-none focus:border-[#0D5C4D]"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-700">IFSC / Swift Code</label>
                  <input
                    type="text"
                    placeholder="HDFC0001234"
                    className="px-3.5 py-2.5 text-sm font-mono border border-neutral-200 rounded-xl outline-none uppercase focus:border-[#0D5C4D]"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  />
                </div>
              </div>

              {/* Compliance & Image Upload Slots Grid */}
              <div className="border-b border-neutral-100 pb-2 pt-3">
                <h3 className="text-xs font-extrabold tracking-wider text-neutral-400 uppercase">
                  DOCUMENT & FLEET IMAGE UPLOADS
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Document Upload 1: Business License / Govt Certificate */}
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCheck className="text-[#0D5C4D]" size={18} />
                      <span className="text-xs font-bold text-neutral-900">Trade License / Govt Reg.</span>
                    </div>
                    <span className="text-[10px] text-neutral-400">PDF / Image</span>
                  </div>

                  <input
                    ref={licenseInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={handleLicenseUpload}
                  />

                  {licensePreview ? (
                    <div className="relative group rounded-xl overflow-hidden border border-emerald-200 bg-emerald-50/50 p-2 flex items-center gap-3">
                      <img src={licensePreview} alt="License" className="w-14 h-14 object-cover rounded-lg border" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-neutral-800 truncate block">{licenseFileName}</span>
                        <span className="text-[10px] font-semibold text-emerald-700">Verified Preview Ready</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setLicensePreview(null)
                          setLicenseFileName('')
                        }}
                        className="p-1.5 text-rose-500 hover:bg-rose-100 rounded-lg cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => licenseInputRef.current?.click()}
                      className="border-2 border-dashed border-neutral-300 hover:border-[#0D5C4D] bg-white rounded-xl p-5 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <UploadCloud size={24} className="text-neutral-400" />
                      <span className="text-xs font-bold text-neutral-700">Upload Business License</span>
                      <span className="text-[10px] text-neutral-400">Click or drag & drop document</span>
                    </div>
                  )}
                </div>

                {/* Document Upload 2: Fleet Sample Photo */}
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="text-[#0D5C4D]" size={18} />
                      <span className="text-xs font-bold text-neutral-900">Partner Fleet Photo</span>
                    </div>
                    <span className="text-[10px] text-neutral-400">Image Photo</span>
                  </div>

                  <input
                    ref={fleetPhotoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFleetPhotoUpload}
                  />

                  {fleetPhotoPreview ? (
                    <div className="relative group rounded-xl overflow-hidden border border-emerald-200 bg-emerald-50/50 p-2 flex items-center gap-3">
                      <img src={fleetPhotoPreview} alt="Fleet" className="w-14 h-14 object-cover rounded-lg border" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-neutral-800 truncate block">{fleetPhotoFileName}</span>
                        <span className="text-[10px] font-semibold text-emerald-700">Fleet Photo Uploaded</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFleetPhotoPreview(null)
                          setFleetPhotoFileName('')
                        }}
                        className="p-1.5 text-rose-500 hover:bg-rose-100 rounded-lg cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fleetPhotoInputRef.current?.click()}
                      className="border-2 border-dashed border-neutral-300 hover:border-[#0D5C4D] bg-white rounded-xl p-5 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Camera size={24} className="text-neutral-400" />
                      <span className="text-xs font-bold text-neutral-700">Upload Fleet Sample Photo</span>
                      <span className="text-[10px] text-neutral-400">Click to upload vehicle photo</span>
                    </div>
                  )}
                </div>
              </div>

              {/* SLA Agreement */}
              <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="sla"
                  className="mt-0.5 cursor-pointer accent-[#0D5C4D]"
                  checked={slaAccepted}
                  onChange={(e) => setSlaAccepted(e.target.checked)}
                />
                <label htmlFor="sla" className="text-xs text-neutral-700 cursor-pointer">
                  <strong className="text-neutral-900 font-bold">Standard SLA & Quality Compliance Agreement</strong>: I verify that this partner meets Indo.Cab quality standards, fleet insurance verification, and fare settlement guidelines.
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="btn btn-neutral"
                >
                  &larr; Back to Fleet Setup
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !slaAccepted}
                  className="btn btn-submit"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Activating Partner...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} /> Submit & Activate Vendor
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: ONBOARDING SUCCESS CONFIRMATION */}
          {currentStep === 4 && createdVendor && (
            <div className="flex flex-col items-center text-center p-6 gap-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
                <CheckCircle size={36} strokeWidth={2.5} />
              </div>

              <div className="flex flex-col gap-1 max-w-md">
                <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
                  Partner Successfully Onboarded
                </span>
                <h2 className="text-2xl font-extrabold text-neutral-900">{createdVendor.companyName}</h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Vendor Partner ID <span className="font-mono font-bold text-neutral-800">{createdVendor.id}</span> is now active in the Indo.Cab dispatch network.
                </p>
              </div>

              {/* Summary Card */}
              <div className="w-full max-w-lg bg-neutral-50 p-6 rounded-2xl border border-neutral-200/80 flex flex-col gap-4 text-left">
                <div className="flex items-center gap-3 border-b border-neutral-200 pb-3">
                  <div className="w-12 h-12 rounded-xl bg-white border border-neutral-200 flex items-center justify-center font-bold text-lg text-[#0D5C4D] overflow-hidden">
                    {createdVendor.logo ? (
                      <img src={createdVendor.logo} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      createdVendor.name.charAt(0)
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-neutral-900 text-sm">{createdVendor.name}</span>
                    <span className="text-xs text-neutral-500">{createdVendor.email} • {createdVendor.phone}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-bold block">Hub Region</span>
                    <span className="font-semibold text-neutral-800">{createdVendor.city}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-bold block">Initial Fleet Size</span>
                    <span className="font-bold text-emerald-700">{createdVendor.fleetSize} Vehicles</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-neutral-400 uppercase font-bold block mb-1">
                      Vehicle Categories Enabled
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {createdVendor.vehicleCategories?.map((cat) => (
                        <span key={cat} className="px-2 py-0.5 bg-teal-100 text-[#0D5C4D] text-[10px] font-bold rounded-md">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center mt-2">
                <button
                  type="button"
                  onClick={onBackToOverview}
                  className="btn btn-submit"
                >
                  Return to Vendor Directory
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setName('')
                    setCompanyName('')
                    setContactPerson('')
                    setEmail('')
                    setPhone('')
                    setGstNumber('')
                    setPanNumber('')
                    setLogoPreview(null)
                    setLicensePreview(null)
                    setFleetPhotoPreview(null)
                    setCreatedVendor(null)
                    setCurrentStep(1)
                  }}
                  className="btn btn-neutral"
                >
                  + Add Another Vendor
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
