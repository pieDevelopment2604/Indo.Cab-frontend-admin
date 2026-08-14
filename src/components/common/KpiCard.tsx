import React from 'react'

interface KpiCardProps {
  title: string
  value: string | number
  badge?: string | null
  badgeStyle?: string
  subnote?: string | null
  subnoteStyle?: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  iconStyle?: string
  heightClass?: string
  borderStyle?: string
}

function KpiCardComponent({
  title,
  value,
  badge,
  badgeStyle = 'text-emerald-600 font-bold',
  subnote,
  subnoteStyle,
  icon: Icon,
  iconStyle = 'bg-teal-50 text-[#1B6B5C] border-teal-100',
  heightClass = 'h-36',
  borderStyle = 'border-neutral-200/80'
}: KpiCardProps) {
  return (
    <div className={`bg-white p-5 rounded-2xl border ${borderStyle} shadow-xs flex flex-col justify-between ${heightClass}`}>
      <div className="flex justify-between items-start">
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${iconStyle}`}>
          <Icon size={18} />
        </div>
        {badge && <span className={`text-[11px] ${badgeStyle}`}>{badge}</span>}
        {subnote && <div className={`${subnoteStyle}`}>{subnote}</div>}

      </div>

      <div>
        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">{title}</span>
        <span className="text-3xl font-extrabold text-neutral-900 tracking-tight mt-0.5 block">{value}</span>
      </div>
    </div>
  )
}

export default React.memo(KpiCardComponent)
