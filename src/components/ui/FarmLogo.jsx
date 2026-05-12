/**
 * FarmLogo — shows farm logo image if set, otherwise falls back to initials badge.
 * Props:
 *   farm   — farm object with { name, logo }
 *   size   — 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 *   round  — bool, use rounded-full instead of rounded-2xl
 */
export default function FarmLogo({ farm, size = 'md', round = false }) {
  const dim = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  }[size] || 'w-11 h-11 text-sm'

  const radius = round ? 'rounded-full' : 'rounded-2xl'

  if (farm?.logo) {
    return (
      <img
        src={farm.logo}
        alt={farm?.name || 'Farm logo'}
        className={`${dim} ${radius} object-contain bg-white`}
      />
    )
  }

  return (
    <div className={`${dim} ${radius} bg-farm-400 flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {farm?.name?.slice(0, 2).toUpperCase() || '??'}
    </div>
  )
}
