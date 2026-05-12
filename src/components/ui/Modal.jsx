import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-3xl' }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className={[
        'relative bg-white w-full rounded-t-4xl sm:rounded-3xl shadow-card-lg flex flex-col',
        sizes[size],
        'max-h-[92vh]',
      ].join(' ')}>

        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200">
          <h2 className="text-base font-semibold text-stone-900">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-stone-400 hover:bg-cream-100 hover:text-stone-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1 scrollbar-thin">
          {children}
        </div>
      </div>
    </div>
  )
}
