const variants = {
  healthy:     'bg-farm-100 text-farm-700',
  pregnant:    'bg-purple-100 text-purple-700',
  sick:        'bg-red-100 text-red-600',
  sold:        'bg-stone-100 text-stone-500',
  dead:        'bg-stone-100 text-stone-400',
  missing:     'bg-amber-100 text-amber-700',
  ewe:         'bg-pink-100 text-pink-700',
  ram:         'bg-blue-100 text-blue-700',
  lamb:        'bg-amber-100 text-amber-700',
  wether:      'bg-stone-100 text-stone-600',
  high:        'bg-red-100 text-red-600',
  medium:      'bg-amber-100 text-amber-700',
  low:         'bg-farm-100 text-farm-700',
  lambed:      'bg-farm-100 text-farm-700',
  failed:      'bg-red-100 text-red-600',
  mated:       'bg-blue-100 text-blue-700',
  sale:        'bg-farm-100 text-farm-700',
  purchase:    'bg-blue-100 text-blue-700',
  vaccination: 'bg-purple-100 text-purple-700',
  deworming:   'bg-teal-100 text-teal-700',
  treatment:   'bg-orange-100 text-orange-700',
  injury:      'bg-red-100 text-red-600',
  illness:     'bg-red-100 text-red-600',
  checkup:     'bg-blue-100 text-blue-700',
  vet_visit:   'bg-indigo-100 text-indigo-700',
  default:     'bg-stone-100 text-stone-500',
}

export default function Badge({ children, variant, className = '' }) {
  const cls = variants[variant] || variants.default
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${cls} ${className}`}>
      {children}
    </span>
  )
}
