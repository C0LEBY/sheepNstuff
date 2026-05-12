export default function MiniStatPill({ label, value, accent = false }) {
  return (
    <div className={[
      'flex-shrink-0 rounded-2xl px-4 pt-3.5 pb-3 text-center min-w-[72px] shadow-card',
      accent ? 'bg-farm-400' : 'bg-white',
    ].join(' ')}>
      <p className={`text-2xl font-bold leading-none ${accent ? 'text-white' : 'text-stone-900'}`}>{value}</p>
      <p className={`text-[10px] font-medium mt-1.5 uppercase tracking-wide ${accent ? 'text-white/70' : 'text-stone-400'}`}>{label}</p>
    </div>
  )
}
