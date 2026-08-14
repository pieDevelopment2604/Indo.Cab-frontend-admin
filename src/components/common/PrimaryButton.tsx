import React from 'react'

export interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  icon?: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export default function PrimaryButton({
  children,
  icon,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}: PrimaryButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-bold rounded-xl transition-all cursor-pointer shrink-0 disabled:opacity-60 disabled:cursor-not-allowed'

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-xs gap-2',
    lg: 'px-6 py-3 text-sm gap-2.5'
  }

  const variantStyles = {
    primary: 'bg-[#135c4e] hover:bg-[#0e453b] text-white shadow-xs',
    secondary: 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs',
    outline: 'border border-neutral-200 hover:bg-neutral-50 text-neutral-700',
    ghost: 'hover:bg-neutral-100 text-neutral-600'
  }

  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  )
}
