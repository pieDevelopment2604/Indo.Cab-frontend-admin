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
  isLoading = false,
  className = '',
  disabled,
  ...props
}: PrimaryButtonProps) {
  const variantClass =
    variant === 'primary'
      ? 'btn-submit'
      : variant === 'secondary' || variant === 'outline' || variant === 'ghost'
      ? 'btn-neutral'
      : variant === 'danger'
      ? 'btn-delete'
      : 'btn-submit'

  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      className={`btn ${variantClass} ${className}`}
      {...props}
    >
      {isLoading ? (
        <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  )
}
