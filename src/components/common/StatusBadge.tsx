import React from 'react'

export type StatusVariant =
  | 'active'
  | 'verified'
  | 'completed'
  | 'success'
  | 'pending'
  | 'warning'
  | 'in_progress'
  | 'suspended'
  | 'blacklisted'
  | 'rejected'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'inactive'

interface StatusBadgeProps {
  status: string
  variant?: StatusVariant
  pulse?: boolean
  showDot?: boolean
  className?: string
}

// Maps status string/variant to exact status style configuration
const getBadgeConfig = (statusText: string, variant?: StatusVariant) => {
  const key = (variant || statusText || '').toLowerCase().trim()

  // GREEN (Active, Verified, Completed, Success, Approved, Paid)
  if (['active', 'verified', 'completed', 'success', 'approved', 'paid', 'live'].includes(key)) {
    return {
      badgeClass: 'status-success',
      dotClass: 'bg-[#047857]'
    }
  }

  // AMBER/ORANGE (Pending, Warning, In Progress, Review, Suspended)
  if (['pending', 'warning', 'in_progress', 'in progress', 'processing', 'review', 'suspended', 'suspend'].includes(key)) {
    return {
      badgeClass: 'status-warning',
      dotClass: 'bg-[#b45309]'
    }
  }

  // RED (Blacklisted, Rejected, Danger, Cancelled, Failed, Expired)
  if (['blacklisted', 'rejected', 'danger', 'cancelled', 'failed', 'expired'].includes(key)) {
    return {
      badgeClass: 'status-danger',
      dotClass: 'bg-[#be123c]'
    }
  }

  // BLUE (Info)
  if (['info'].includes(key)) {
    return {
      badgeClass: 'status-info',
      dotClass: 'bg-[#1d4ed8]'
    }
  }

  // GRAY (Inactive, Neutral, Draft)
  return {
    badgeClass: 'status-neutral',
    dotClass: 'bg-[#475569]'
  }
}

function StatusBadgeComponent({
  status,
  variant,
  pulse = false,
  showDot = true,
  className = ''
}: StatusBadgeProps) {
  const { badgeClass, dotClass } = getBadgeConfig(status, variant)

  return (
    <span className={`${badgeClass} ${className} inline-flex items-center gap-1.5`}>
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass} ${
            pulse ? 'animate-pulse' : ''
          }`}
        />
      )}
      <span className="capitalize">{status}</span>
    </span>
  )
}

export default React.memo(StatusBadgeComponent)
