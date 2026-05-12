export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  icon,
}) {
  const base = 'inline-flex items-center gap-2 font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:   'bg-farm-400 hover:bg-farm-500 text-white focus:ring-farm-400',
    secondary: 'bg-cream-200 hover:bg-cream-300 text-stone-800 focus:ring-cream-300',
    danger:    'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400',
    ghost:     'bg-transparent hover:bg-cream-100 text-stone-700 focus:ring-cream-200',
    outline:   'bg-white border border-cream-300 hover:bg-cream-50 text-stone-700 focus:ring-cream-200',
  }

  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2.5',
    lg: 'text-sm px-5 py-3',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  )
}
