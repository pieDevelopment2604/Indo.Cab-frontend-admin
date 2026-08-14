import { Plus } from '@/utils/icons'
import PrimaryButton from './PrimaryButton'

export interface AddButtonProps {
  onClick: () => void
  label?: string
  className?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function AddButton({
  onClick,
  label = 'Add New',
  className = '',
  disabled = false,
  size = 'md'
}: AddButtonProps) {
  return (
    <PrimaryButton
      onClick={onClick}
      disabled={disabled}
      size={size}
      icon={<Plus size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} strokeWidth={2.5} />}
      className={className}
    >
      {label}
    </PrimaryButton>
  )
}
