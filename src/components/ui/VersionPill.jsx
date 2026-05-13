/* global __APP_VERSION__, __GIT_HASH__ */

export default function VersionPill() {
  const version = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.1.0'
  const hash    = typeof __GIT_HASH__    !== 'undefined' ? __GIT_HASH__    : 'dev'

  return (
    <div className="fixed bottom-20 right-3 lg:bottom-4 lg:right-4 z-40 flex items-center gap-1.5 bg-stone-900/60 backdrop-blur-sm text-white/80 text-[10px] font-mono px-2.5 py-1 rounded-full pointer-events-none select-none">
      <span className="w-1.5 h-1.5 rounded-full bg-farm-400 flex-shrink-0" />
      v{version}&nbsp;·&nbsp;{hash}
    </div>
  )
}
