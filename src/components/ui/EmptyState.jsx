export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="w-16 h-16 bg-cream-200 rounded-3xl flex items-center justify-center mb-4 text-stone-400">
          <Icon size={28} />
        </div>
      )}
      <h3 className="text-base font-semibold text-stone-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-stone-400 max-w-xs">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
