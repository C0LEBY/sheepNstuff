import { Settings2 } from 'lucide-react'

export default function Settings() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="w-16 h-16 bg-farm-100 rounded-3xl flex items-center justify-center mb-5">
        <Settings2 size={30} className="text-farm-500" strokeWidth={1.5} />
      </div>
      <h1 className="text-2xl font-bold text-stone-900 tracking-tight mb-2">Settings</h1>
      <p className="text-stone-400 text-sm max-w-xs leading-relaxed">
        This section is coming soon. Farm preferences, notifications, and data management will live here.
      </p>
    </div>
  )
}
