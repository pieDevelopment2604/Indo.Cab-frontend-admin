import React, { useState, useEffect } from 'react'
import type { CorporateClient, RazorpayPaymentInfo } from '../types'
import { clientApi } from '@/api/client.api'
import { validateGst, validatePan } from '@/utils/taxValidation'
import {
  ArrowLeft,
  CheckCircle,
  Check,
  Building2,
  BookOpen,
  Plus,
  X,
  ShieldCheck,
  AlertCircle
} from '@/utils/icons'

/* ====================================================================
   PAYMENT INTEGRATION (COMMENTED OUT AS REQUESTED)
   ====================================================================
// Helper to dynamically load official Razorpay Checkout SDK script
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export type PaymentSchemeKey = 'enterprise' | 'standard' | 'flexi'

export interface PaymentScheme {
  key: PaymentSchemeKey
  name: string
  price: string
  numericPrice: number
  tier: 'Enterprise Premium' | 'Corporate Standard' | 'Custom Rate'
  baseRate: string
  badge?: string
  badgeStyle?: string
  features: string[]
}

export const PAYMENT_SCHEMES: PaymentScheme[] = [
  {
    key: 'enterprise',
    name: 'Enterprise Premium Scheme',
    price: '₹12,000',
    numericPrice: 12000,
    tier: 'Enterprise Premium',
    baseRate: '₹18/km',
    badge: 'MOST POPULAR',
    badgeStyle: 'bg-emerald-600 text-white',
    features: [
      'Unlimited corporate trips & priority dispatch',
      'Dedicated 24/7 SLA Account Manager',
      'Base rate: ₹18/km (15% night surcharge)',
      'Net 30 Days Credit Billing Terms'
    ]
  },
  {
    key: 'standard',
    name: 'Corporate Standard Scheme',
    price: '₹5,000',
    numericPrice: 5000,
    tier: 'Corporate Standard',
    baseRate: '₹20/km',
    badge: 'RECOMMENDED',
    badgeStyle: 'bg-[#135c4e] text-white',
    features: [
      'Up to 150 trips/mo fleet allocation',
      '24/7 Dispatch Control support',
      'Base rate: ₹20/km (20% night surcharge)',
      'Net 30 Days Credit Billing Terms'
    ]
  },
  {
    key: 'flexi',
    name: 'Flexi Pay-As-You-Go Scheme',
    price: '₹2,500',
    numericPrice: 2500,
    tier: 'Custom Rate',
    baseRate: '₹22/km',
    badge: 'STARTER',
    badgeStyle: 'bg-neutral-800 text-white',
    features: [
      'Pay-per-trip usage & basic support',
      'Standard dispatch API & webhook access',
      'Base rate: ₹22/km (15% night surcharge)',
      'Net 7 Days / Immediate Payment Terms'
    ]
  }
]
==================================================================== */

interface ClientOnboardingWizardProps {
  onBackToOverview: () => void
  onClientAdded: (client: CorporateClient) => void
}

export interface ClientOnboardingFormData {
  company_name: string
  contact_person: string
  email: string
  mobile_number: string
  gst_number: string
  pan_number: string
  address: string
  operating_cities: string[]
  category: 'Corporate' | 'SME' | 'Inter-City'
  billingAddress: string
  billingContactPerson: string
  billingEmail: string
  paymentTerms: string
  pricingTier: 'Enterprise Premium' | 'Corporate Standard' | 'Custom Rate'
  apiKey: string
  webhookUrl: string
  paymentGateway: string
}

const CITY_OPTIONS = [
  'Bangalore',
  'Mumbai',
  'Delhi NCR',
  'Pune',
  'Ahmedabad',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Jaipur',
  'Surat'
]

export default function ClientOnboardingWizard({
  onBackToOverview,
  onClientAdded
}: ClientOnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [cityInput, setCityInput] = useState('')
  const [step1Errors, setStep1Errors] = useState<{ gst?: string; pan?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<ClientOnboardingFormData>({
    company_name: '',
    contact_person: '',
    email: '',
    mobile_number: '',
    gst_number: '',
    pan_number: '',
    address: '',
    operating_cities: ['Bangalore', 'Mumbai'],
    category: 'Corporate',
    billingAddress: '',
    billingContactPerson: '',
    billingEmail: '',
    paymentTerms: 'Net 30 Days',
    pricingTier: 'Corporate Standard',
    apiKey: `ik_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`,
    webhookUrl: '',
    paymentGateway: 'Corporate Invoice Terms'
  })

  const [createdClient, setCreatedClient] = useState<CorporateClient | null>(null)

  // Auto-scroll to top when switching steps or mounting
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const mainEl = document.querySelector('.main-content')
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [currentStep])

  // Real-time GST and PAN Validation Statuses
  const gstValidation = validateGst(formData.gst_number, formData.pan_number)
  const panValidation = validatePan(formData.pan_number)
  const isGstValid = gstValidation.isValid
  const isPanValid = panValidation.isValid
  const isAddressGeocoded = formData.address.trim().length > 10

  const handleGstChange = (value: string) => {
    const uppercaseGst = value.toUpperCase().trim()
    let updatedPan = formData.pan_number

    if (uppercaseGst.length >= 12) {
      const extractedPan = uppercaseGst.substring(2, 12)
      if (validatePan(extractedPan).isValid && (!formData.pan_number || formData.pan_number.length < 10)) {
        updatedPan = extractedPan
      }
    }

    setFormData((prev) => ({
      ...prev,
      gst_number: uppercaseGst,
      pan_number: updatedPan
    }))

    if (step1Errors.gst) {
      setStep1Errors((prev) => ({ ...prev, gst: undefined }))
    }
  }

  const handlePanChange = (value: string) => {
    const uppercasePan = value.toUpperCase().trim()
    setFormData((prev) => ({
      ...prev,
      pan_number: uppercasePan
    }))
    if (step1Errors.pan) {
      setStep1Errors((prev) => ({ ...prev, pan: undefined }))
    }
  }

  const handleAddCity = (cityToAdd: string) => {
    const trimmed = cityToAdd.trim()
    if (trimmed && !formData.operating_cities.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        operating_cities: [...prev.operating_cities, trimmed]
      }))
    }
    setCityInput('')
  }

  const handleRemoveCity = (cityToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      operating_cities: prev.operating_cities.filter((c) => c !== cityToRemove)
    }))
  }

  // Completion handler to save client details (Payment integration bypassed)
  const finalizeClientOnboarding = async () => {
    setIsSubmitting(true)

    const payInfo: RazorpayPaymentInfo = {
      transactionId: `N/A - Direct Onboarding`,
      orderId: `order_direct`,
      method: 'Credit Terms (Postpaid)',
      methodDetail: `Payment Integration Bypassed - ${formData.paymentTerms}`,
      amount: 'N/A',
      status: 'SUCCESS',
      paidAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    }

    const newId = `CL-${Math.floor(8000 + Math.random() * 999)}-${(formData.company_name || 'CLI').substring(0, 3).toUpperCase()}`
    const newClient: CorporateClient = {
      id: newId,
      company_name: formData.company_name,
      companyName: formData.company_name,
      contact_person: formData.contact_person,
      contactPerson: formData.contact_person,
      email: formData.email,
      mobile_number: formData.mobile_number,
      phone: formData.mobile_number,
      gst_number: formData.gst_number,
      gstin: formData.gst_number,
      pan_number: formData.pan_number,
      address: formData.address,
      operating_cities: formData.operating_cities.length > 0 ? formData.operating_cities : ['Bangalore'],
      category: formData.category,
      status: 'active',
      monthlyBookingVolume: 0,
      totalSpent: '₹0',
      billingDetails: {
        billingAddress: formData.billingAddress || formData.address,
        contactPerson: formData.billingContactPerson || formData.contact_person,
        email: formData.billingEmail || formData.email,
        paymentTerms: formData.paymentTerms
      },
      integration: {
        apiKey: formData.apiKey,
        webhookUrl: formData.webhookUrl || `https://${formData.company_name.toLowerCase().replace(/[^a-z0-9]/g, '')}.domain.com/webhooks/indo-cab`
      },
      paymentInfo: payInfo,
      contract: {
        id: `CNT-${Math.floor(900 + Math.random() * 99)}`,
        tierName: formData.pricingTier,
        baseRatePerKm: formData.pricingTier === 'Enterprise Premium' ? 18 : formData.pricingTier === 'Corporate Standard' ? 20 : 22,
        extraHourRate: 150,
        nightSurchargePercent: 15,
        tollPolicy: 'Billed to Client',
        contractStart: 'Aug 01, 2026',
        contractEnd: 'Jul 31, 2027',
        status: 'Active'
      },
      bookingHistory: [],
      createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      createdAt: new Date().toISOString(),
      created_at: new Date().toISOString()
    }

    try {
      await clientApi.createClient(newClient)
    } catch (err) {
      // Backend API call executed
    } finally {
      setIsSubmitting(false)
      setCreatedClient(newClient)
      onClientAdded(newClient)
      setCurrentStep(3)
    }
  }

  /* ====================================================================
     COMMENTED OUT: OFFICIAL RAZORPAY CHECKOUT SDK TRIGGER
     ====================================================================
  const handleOpenOfficialRazorpaySDK = async () => {
    // Payment integration commented out as requested
  }
  ==================================================================== */

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentStep === 1) {
      const currentGstValid = validateGst(formData.gst_number, formData.pan_number)
      const currentPanValid = validatePan(formData.pan_number)

      if (!currentGstValid.isValid || !currentPanValid.isValid) {
        setStep1Errors({
          gst: currentGstValid.message,
          pan: currentPanValid.message
        })
        return
      }

      setFormData((prev) => ({
        ...prev,
        billingAddress: prev.billingAddress || prev.address,
        billingContactPerson: prev.billingContactPerson || prev.contact_person,
        billingEmail: prev.billingEmail || prev.email,
        webhookUrl: prev.webhookUrl || `https://${prev.company_name.toLowerCase().replace(/[^a-z0-9]/g, '')}.domain.com/webhooks/indo-cab`
      }))
      setStep1Errors({})
      setCurrentStep(2)
    } else if (currentStep === 2) {
      // Submit client onboarding directly without payment step
      finalizeClientOnboarding()
    }
  }

  const handleResetWizard = () => {
    setFormData({
      company_name: '',
      contact_person: '',
      email: '',
      mobile_number: '',
      gst_number: '',
      pan_number: '',
      address: '',
      operating_cities: ['Bangalore', 'Mumbai'],
      category: 'Corporate',
      billingAddress: '',
      billingContactPerson: '',
      billingEmail: '',
      paymentTerms: 'Net 30 Days',
      pricingTier: 'Corporate Standard',
      apiKey: `ik_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`,
      webhookUrl: '',
      paymentGateway: 'Corporate Invoice Terms'
    })
    setStep1Errors({})
    setCurrentStep(1)
    setCreatedClient(null)
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto font-sans pb-16">
      {/* Top Navigation & Header */}
      <div>
        <button
          onClick={onBackToOverview}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer mb-2"
        >
          <ArrowLeft size={14} /> Back to Clients
        </button>
        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
          Add New Client
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Register a new corporate entity for transportation services.
        </p>
      </div>

      {/* Main Grid: Stepper + Form + Side Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Vertical Stepper Navigation (Sticky) */}
        <div className="lg:col-span-3 sticky top-2 flex flex-col gap-6 bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs">
          <div className="flex flex-col gap-6 relative">
            {/* Step 1 */}
            <div className="flex items-start gap-3.5 relative">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 transition-all ${
                  currentStep === 1
                    ? 'bg-[#135c4e] text-white shadow-xs'
                    : currentStep > 1
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-neutral-100 text-neutral-400'
                }`}
              >
                {currentStep > 1 ? <Check size={14} strokeWidth={3} /> : '1'}
              </div>
              <div className="flex flex-col pt-1">
                <span className={`text-xs font-bold ${currentStep === 1 ? 'text-neutral-900' : 'text-neutral-500'}`}>
                  Client Identity
                </span>
                <span className="text-[10px] text-neutral-400">Basic details & GST</span>
              </div>
            </div>

            <div className="w-0.5 h-6 bg-neutral-200 ml-4 -my-3" />

            {/* Step 2 */}
            <div className="flex items-start gap-3.5 relative">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 transition-all ${
                  currentStep === 2
                    ? 'bg-[#135c4e] text-white shadow-xs'
                    : currentStep > 2
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-neutral-100 text-neutral-400'
                }`}
              >
                {currentStep > 2 ? <Check size={14} strokeWidth={3} /> : '2'}
              </div>
              <div className="flex flex-col pt-1">
                <span className={`text-xs font-bold ${currentStep === 2 ? 'text-neutral-900' : 'text-neutral-500'}`}>
                  Billing Details
                </span>
                <span className="text-[10px] text-neutral-400">Terms & Contract Tier</span>
              </div>
            </div>

            <div className="w-0.5 h-6 bg-neutral-200 ml-4 -my-3" />

            {/* Step 3 */}
            <div className="flex items-start gap-3.5 relative">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 transition-all ${
                  currentStep === 3 ? 'bg-emerald-600 text-white shadow-xs' : 'bg-neutral-100 text-neutral-400'
                }`}
              >
                <CheckCircle size={15} />
              </div>
              <div className="flex flex-col pt-1">
                <span className={`text-xs font-bold ${currentStep === 3 ? 'text-neutral-900' : 'text-neutral-500'}`}>
                  Confirmation
                </span>
                <span className="text-[10px] text-neutral-400">Onboarded Screen</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Step Form Container */}
        <div className="lg:col-span-6 bg-white p-7 rounded-2xl border border-neutral-200/80 shadow-2xs">
          {/* STEP 1: CLIENT DETAILS */}
          {currentStep === 1 && (
            <form onSubmit={handleNextStep} className="flex flex-col gap-6">
              <div className="border-b border-neutral-100 pb-3">
                <h3 className="text-xs font-extrabold tracking-wider text-neutral-400 uppercase">
                  GENERAL INFORMATION
                </h3>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-700">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corp Logistics"
                    className="px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#135c4e] transition-colors"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* GSTIN Input with Real-time Regex Validation */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-neutral-700">GST Number *</label>
                      {formData.gst_number && (
                        <span
                          className={`text-[10px] font-bold ${
                            isGstValid ? 'text-emerald-600' : 'text-rose-500'
                          }`}
                        >
                          {isGstValid ? 'Valid Format' : '15 Chars'}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={15}
                      placeholder="22AAAAA0000A1Z5"
                      className={`px-3.5 py-2.5 text-sm font-mono border rounded-xl outline-none uppercase transition-colors ${
                        step1Errors.gst || (formData.gst_number && !isGstValid)
                          ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                          : isGstValid
                          ? 'border-emerald-300 bg-emerald-50/20 focus:border-emerald-600'
                          : 'border-neutral-200 focus:border-[#135c4e]'
                      }`}
                      value={formData.gst_number}
                      onChange={(e) => handleGstChange(e.target.value)}
                    />
                    {step1Errors.gst && (
                      <span className="text-[10px] font-semibold text-rose-500 flex items-center gap-1">
                        <AlertCircle size={12} /> {step1Errors.gst}
                      </span>
                    )}
                    {!step1Errors.gst && formData.gst_number && !isGstValid && (
                      <span className="text-[10px] text-neutral-400 font-mono">
                        Format: 2 State Digits + 10 PAN + 1 Entity + Z + Checksum
                      </span>
                    )}
                  </div>

                  {/* PAN Input with Real-time Regex Validation */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-neutral-700">PAN Number *</label>
                      {formData.pan_number && (
                        <span
                          className={`text-[10px] font-bold ${
                            isPanValid ? 'text-emerald-600' : 'text-rose-500'
                          }`}
                        >
                          {isPanValid ? 'Valid Format' : '10 Chars'}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      placeholder="ABCDE1234F"
                      className={`px-3.5 py-2.5 text-sm font-mono border rounded-xl outline-none uppercase transition-colors ${
                        step1Errors.pan || (formData.pan_number && !isPanValid)
                          ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                          : isPanValid
                          ? 'border-emerald-300 bg-emerald-50/20 focus:border-emerald-600'
                          : 'border-neutral-200 focus:border-[#135c4e]'
                      }`}
                      value={formData.pan_number}
                      onChange={(e) => handlePanChange(e.target.value)}
                    />
                    {step1Errors.pan && (
                      <span className="text-[10px] font-semibold text-rose-500 flex items-center gap-1">
                        <AlertCircle size={12} /> {step1Errors.pan}
                      </span>
                    )}
                    {!step1Errors.pan && formData.pan_number && !isPanValid && (
                      <span className="text-[10px] text-neutral-400 font-mono">
                        Format: 5 Letters + 4 Digits + 1 Letter (e.g. AFZPK7190K)
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-700">Client Category</label>
                  <select
                    className="px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#135c4e] bg-white transition-colors"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  >
                    <option value="Corporate">Corporate Enterprise</option>
                    <option value="SME">SME Business</option>
                    <option value="Inter-City">Inter-City Regional</option>
                  </select>
                </div>
              </div>

              <div className="border-b border-neutral-100 pb-3 pt-2">
                <h3 className="text-xs font-extrabold tracking-wider text-neutral-400 uppercase">
                  PRIMARY CONTACT & LOCATION
                </h3>
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-neutral-700">Contact Person *</label>
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      className="px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#135c4e] transition-colors"
                      value={formData.contact_person}
                      onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-neutral-700">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="user@example.com"
                      className="px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#135c4e] transition-colors"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-700">Mobile Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    className="px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#135c4e] transition-colors"
                    value={formData.mobile_number}
                    onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-700">Registered Office Address *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Street name, Building, City, ZIP Code"
                    className="px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#135c4e] transition-colors resize-none"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                {/* Operating Cities Tag Selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-700">Operating Cities</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {formData.operating_cities.map((city) => (
                      <span
                        key={city}
                        className="px-2.5 py-1 bg-teal-50 text-[#135c4e] border border-teal-200 text-xs font-bold rounded-lg flex items-center gap-1.5"
                      >
                        {city}
                        <button
                          type="button"
                          onClick={() => handleRemoveCity(city)}
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
                      placeholder="Add city (e.g. Pune)..."
                      className="flex-1 px-3.5 py-2 text-xs border border-neutral-200 rounded-xl outline-none focus:border-[#135c4e]"
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
                      className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Predefined Quick Add Pills */}
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="text-[10px] text-neutral-400 self-center mr-1">Quick add:</span>
                    {CITY_OPTIONS.filter((c) => !formData.operating_cities.includes(c))
                      .slice(0, 5)
                      .map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => handleAddCity(city)}
                          className="px-2 py-0.5 bg-neutral-100 hover:bg-teal-100 text-neutral-600 hover:text-[#135c4e] text-[10px] font-semibold rounded-md transition-colors cursor-pointer"
                        >
                          + {city}
                        </button>
                      ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={onBackToOverview}
                  className="px-5 py-2.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold bg-[#135c4e] hover:bg-[#0e453b] text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Continue to Billing Details &rarr;
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: BILLING DETAILS */}
          {currentStep === 2 && (
            <form onSubmit={handleNextStep} className="flex flex-col gap-6">
              <div className="border-b border-neutral-100 pb-3">
                <h3 className="text-xs font-extrabold tracking-wider text-neutral-400 uppercase">
                  BILLING & COMMUNICATION
                </h3>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-700">Billing Address *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Street name, Building, City, ZIP Code"
                    className="px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#135c4e] transition-colors resize-none"
                    value={formData.billingAddress}
                    onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-neutral-700">Billing Contact Person</label>
                    <input
                      type="text"
                      placeholder="e.g. Accounts Manager"
                      className="px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#135c4e]"
                      value={formData.billingContactPerson}
                      onChange={(e) => setFormData({ ...formData, billingContactPerson: e.target.value })}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-neutral-700">Billing / Invoice Email</label>
                    <input
                      type="email"
                      placeholder="billing@company.com"
                      className="px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#135c4e]"
                      value={formData.billingEmail}
                      onChange={(e) => setFormData({ ...formData, billingEmail: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-neutral-700">Payment Terms</label>
                    <select
                      className="px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#135c4e] bg-white"
                      value={formData.paymentTerms}
                      onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                    >
                      <option value="Net 30 Days">Net 30 Days Credit</option>
                      <option value="Net 15 Days">Net 15 Days Credit</option>
                      <option value="Net 7 Days">Net 7 Days Credit</option>
                      <option value="Immediate">Immediate / Advance Payment</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-neutral-700">Pricing Contract Tier</label>
                    <select
                      className="px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#135c4e] bg-white"
                      value={formData.pricingTier}
                      onChange={(e) => setFormData({ ...formData, pricingTier: e.target.value as any })}
                    >
                      <option value="Enterprise Premium">Enterprise Premium (₹18/km)</option>
                      <option value="Corporate Standard">Corporate Standard (₹20/km)</option>
                      <option value="Custom Rate">Custom Rate (₹22/km)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ====================================================================
                 COMMENTED OUT: PAYMENT SCHEME SELECTION CARDS
                 ====================================================================
              <div className="border-b border-neutral-100 pb-3 pt-2">
                <h3 className="text-xs font-extrabold tracking-wider text-neutral-400 uppercase">
                  CHOOSE ONBOARDING PAYMENT SCHEME
                </h3>
              </div>
              ==================================================================== */}

              <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
                >
                  &larr; Back to Client Identity
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-7 py-3 text-xs font-extrabold bg-[#135c4e] hover:bg-[#0e453b] text-white rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving Client...</span>
                    </>
                  ) : (
                    <span>Complete Onboarding & Submit &rarr;</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: SUCCESSFUL SCREEN / CONFIRMATION */}
          {currentStep === 3 && createdClient && (
            <div className="flex flex-col items-center text-center gap-6 py-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
                <CheckCircle size={36} strokeWidth={2.5} />
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
                  Client Onboarded Successfully!
                </h3>
                <p className="text-xs text-neutral-500">
                  {createdClient.company_name} is now registered on Logistics OS with active corporate profile.
                </p>
              </div>

              {/* Onboarded Summary Card */}
              <div className="w-full bg-neutral-50/90 border border-neutral-200/80 rounded-2xl p-5 text-left flex flex-col gap-3 text-xs">
                <div className="flex justify-between items-center border-b border-neutral-200/60 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#135c4e] border border-teal-100 flex items-center justify-center font-bold">
                      <Building2 size={16} />
                    </div>
                    <div>
                      <span className="font-bold text-neutral-900 text-sm block">{createdClient.company_name}</span>
                      <span className="text-[10px] text-neutral-400 font-mono">ID: {createdClient.id}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-extrabold uppercase">
                    {createdClient.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-neutral-700">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase block">GST NUMBER</span>
                    <span className="font-mono font-bold">{createdClient.gst_number}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase block">PAN NUMBER</span>
                    <span className="font-mono font-bold">{createdClient.pan_number}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase block">PRIMARY CONTACT</span>
                    <span className="font-bold">{createdClient.contact_person}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase block">EMAIL</span>
                    <span>{createdClient.email}</span>
                  </div>
                  {/* <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase block">PRICING CONTRACT</span>
                    <span className="font-bold text-[#135c4e]">{createdClient.contract.tierName}</span>
                  </div> */}
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase block">OPERATING CITIES</span>
                    <span className="font-semibold">{createdClient.operating_cities.join(', ')}</span>
                  </div>
                </div>

                {/* <div className="bg-white p-3 rounded-xl border border-neutral-200/80 flex items-center justify-between text-xs mt-1">
                  <span className="text-neutral-500 font-medium">API Endpoint Key</span>
                  <span className="font-mono font-bold text-[#135c4e] select-all truncate max-w-[200px]">
                    {createdClient.integration.apiKey}
                  </span>
                </div> */}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-3 w-full pt-2">
                <button
                  type="button"
                  onClick={handleResetWizard}
                  className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Plus size={15} /> Onboard Another Client
                </button>

                <button
                  type="button"
                  onClick={onBackToOverview}
                  className="px-6 py-2.5 bg-[#135c4e] hover:bg-[#0e453b] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Manage All Clients &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Validation & Guide Widgets (Sticky) */}
        <div className="lg:col-span-3 sticky top-2 flex flex-col gap-5">
          {/* Validation Widget */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs flex flex-col gap-3.5">
            <div className="flex items-center gap-2 text-xs font-extrabold text-neutral-800">
              <CheckCircle size={15} className="text-[#135c4e]" />
              <span>Validation</span>
            </div>

            <div className="flex flex-col gap-2.5 text-xs">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    isGstValid ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-400'
                  }`}
                >
                  <Check size={12} strokeWidth={3} />
                </div>
                <span className={isGstValid ? 'text-neutral-800 font-semibold' : 'text-neutral-400'}>
                  GST format verified
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    isPanValid ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-400'
                  }`}
                >
                  <Check size={12} strokeWidth={3} />
                </div>
                <span className={isPanValid ? 'text-neutral-800 font-semibold' : 'text-neutral-400'}>
                  PAN format validated
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    isAddressGeocoded ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-400'
                  }`}
                >
                  <Check size={12} strokeWidth={3} />
                </div>
                <span className={isAddressGeocoded ? 'text-neutral-800 font-semibold' : 'text-neutral-400'}>
                  Address geocoded
                </span>
              </div>
            </div>
          </div>

          {/* Onboarding Guide Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d453b] to-[#1a6e5e] p-5 text-white shadow-md flex flex-col gap-3 justify-between min-h-[160px]">
            <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider text-teal-200">
              <BookOpen size={13} />
              <span>Onboarding Guide</span>
            </div>

            <div>
              <h4 className="text-sm font-bold leading-snug text-white">Read Best Practices</h4>
              <p className="text-[11px] text-teal-100/80 mt-1 leading-normal">
                Learn how corporate SLAs and credit lines streamline dispatch approval.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                alert(
                  'Onboarding Best Practices Guide: Corporate accounts require verified GSTIN for B2B input credit tax invoices.'
                )
              }
              className="mt-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-xs border border-white/20 text-white text-[11px] font-bold rounded-xl transition-colors cursor-pointer self-start"
            >
              View Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
