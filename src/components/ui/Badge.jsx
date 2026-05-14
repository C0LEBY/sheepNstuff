import { Badge as ReuiBadge } from '@/components/reui/badge'
import { cn } from '@/lib/utils'

// Map app-specific variant names → reui badge variants + any extra classes
const VARIANT_MAP = {
  // Status
  healthy:     { variant: 'success-light' },
  pregnant:    { variant: 'info-light' },
  sick:        { variant: 'destructive-light' },
  missing:     { variant: 'warning-light' },
  sold:        { variant: 'outline', extra: 'text-stone-500' },
  dead:        { variant: 'outline', extra: 'text-stone-400' },
  // Sex
  ewe:         { variant: 'outline', extra: 'border-pink-200 text-pink-700 bg-pink-50' },
  ram:         { variant: 'info-light' },
  lamb:        { variant: 'warning-light' },
  wether:      { variant: 'outline', extra: 'text-stone-600' },
  // Priority
  high:        { variant: 'destructive-light' },
  medium:      { variant: 'warning-light' },
  low:         { variant: 'success-light' },
  // Breeding
  mated:       { variant: 'info-light' },
  pregnant_br: { variant: 'info-light' },
  lambed:      { variant: 'success-light' },
  failed:      { variant: 'destructive-light' },
  // Transaction
  sale:        { variant: 'success-light' },
  purchase:    { variant: 'info-light' },
  // Health types
  vaccination: { variant: 'primary-light', extra: 'text-purple-700 bg-purple-50' },
  deworming:   { variant: 'outline', extra: 'border-teal-200 text-teal-700 bg-teal-50' },
  treatment:   { variant: 'warning-light' },
  injury:      { variant: 'destructive-light' },
  illness:     { variant: 'destructive-light' },
  checkup:     { variant: 'info-light' },
  vet_visit:   { variant: 'info-light' },
}

export default function Badge({ children, variant, className = '' }) {
  const mapping = VARIANT_MAP[variant] ?? { variant: 'outline' }
  return (
    <ReuiBadge
      variant={mapping.variant}
      radius="full"
      className={cn('capitalize', mapping.extra, className)}
    >
      {children}
    </ReuiBadge>
  )
}
