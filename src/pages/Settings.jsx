import { useRef, useState } from 'react'
import { Settings2, Globe, Check, Sun, Moon, Film, Upload, Play, X, Trash2, Video } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useTheme }    from '../context/ThemeContext'
import { useMedia }    from '../context/MediaContext'

const LANGUAGES = [
  { code: 'en', label: 'English',   native: 'English',   flag: '🇬🇧' },
  { code: 'af', label: 'Afrikaans', native: 'Afrikaans', flag: '🇿🇦' },
]

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
}

/* ── Video player modal ─────────────────────────────────────────── */
function VideoModal({ video, onClose }) {
  if (!video) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-black rounded-3xl overflow-hidden shadow-2xl w-full max-w-3xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <X size={16} />
        </button>

        {/* Video */}
        <video
          src={video.url}
          controls
          autoPlay
          className="w-full max-h-[70vh] object-contain bg-black"
        />

        {/* Footer */}
        <div className="px-5 py-3 bg-[#1a1a1a] flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{video.name}</p>
            <p className="text-xs text-stone-400 mt-0.5">{formatBytes(video.size)} · {formatDate(video.addedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Settings page ─────────────────────────────────────────────── */
export default function Settings() {
  const { t, lang, setLang }  = useLanguage()
  const { theme, setTheme }   = useTheme()
  const { videos, loading: mediaLoading, addVideo, removeVideo } = useMedia()

  const fileInputRef    = useRef(null)
  const [playingVideo, setPlayingVideo] = useState(null)
  const [uploading, setUploading]       = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)   // id of video pending delete

  async function handleFilePick(e) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    for (const file of files) {
      await addVideo(file)
    }
    setUploading(false)
    e.target.value = ''
  }

  function handleDelete(id) {
    if (deleteConfirm === id) {
      removeVideo(id)
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(id)
      // auto-cancel after 3 s
      setTimeout(() => setDeleteConfirm(c => c === id ? null : c), 3000)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 bg-farm-100 dark:bg-farm-900/30 rounded-2xl flex items-center justify-center">
          <Settings2 size={22} className="text-farm-600 dark:text-farm-400" strokeWidth={1.8} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">{t('page.settings.title')}</h1>
        </div>
      </div>

      {/* ── Language ───────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#2D2D2D] rounded-3xl shadow-card p-6 mb-5">
        <div className="flex items-center gap-3 mb-5">
          <Globe size={18} className="text-farm-500" />
          <div>
            <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">{t('page.settings.language')}</h2>
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">{t('page.settings.chooseLanguage')}</p>
          </div>
        </div>
        <div className="space-y-2">
          {LANGUAGES.map(lng => (
            <button
              key={lng.code}
              onClick={() => setLang(lng.code)}
              className={[
                'w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl border-2 transition-all text-left',
                lang === lng.code
                  ? 'border-farm-400 bg-farm-50 dark:bg-farm-900/20'
                  : 'border-cream-200 dark:border-stone-700 bg-white dark:bg-[#2D2D2D] hover:border-cream-300 dark:hover:border-stone-600 hover:bg-cream-50 dark:hover:bg-[#333333]',
              ].join(' ')}
            >
              <span className="text-2xl leading-none">{lng.flag}</span>
              <div className="flex-1">
                <p className={`font-semibold text-sm ${lang === lng.code ? 'text-farm-700 dark:text-farm-400' : 'text-stone-800 dark:text-stone-200'}`}>
                  {lng.native}
                </p>
                {lng.label !== lng.native && (
                  <p className="text-xs text-stone-400 mt-0.5">{lng.label}</p>
                )}
              </div>
              {lang === lng.code && (
                <div className="w-6 h-6 bg-farm-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check size={13} className="text-white" strokeWidth={3} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Appearance ─────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#2D2D2D] rounded-3xl shadow-card p-6 mb-5">
        <div className="flex items-center gap-3 mb-5">
          <Sun size={18} className="text-farm-500" />
          <div>
            <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
              {lang === 'af' ? 'Voorkoms' : 'Appearance'}
            </h2>
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
              {lang === 'af' ? 'Kies lig of donker modus' : 'Choose light or dark mode'}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          {[
            { value: 'light', label: lang === 'af' ? 'Lig'    : 'Light', Icon: Sun  },
            { value: 'dark',  label: lang === 'af' ? 'Donker' : 'Dark',  Icon: Moon },
          ].map(({ value, label, Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={[
                'w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl border-2 transition-all text-left',
                theme === value
                  ? 'border-farm-400 bg-farm-50 dark:bg-farm-900/20'
                  : 'border-cream-200 dark:border-stone-700 bg-white dark:bg-[#2D2D2D] hover:border-cream-300 dark:hover:border-stone-600 hover:bg-cream-50 dark:hover:bg-[#333333]',
              ].join(' ')}
            >
              <Icon size={20} className={theme === value ? 'text-farm-600' : 'text-stone-400 dark:text-stone-500'} />
              <p className={`font-semibold text-sm ${theme === value ? 'text-farm-700 dark:text-farm-400' : 'text-stone-800 dark:text-stone-200'}`}>
                {label}
              </p>
              {theme === value && (
                <div className="ml-auto w-6 h-6 bg-farm-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check size={13} className="text-white" strokeWidth={3} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Media ──────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#2D2D2D] rounded-3xl shadow-card p-6 mb-5">
        {/* Section header + upload button */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Film size={18} className="text-farm-500" />
            <div>
              <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                {lang === 'af' ? 'Media' : 'Media'}
              </h2>
              <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
                {lang === 'af' ? 'Laai video\'s op en speel dit terug' : 'Upload and play farm videos'}
              </p>
            </div>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 bg-farm-400 hover:bg-farm-500 disabled:opacity-60 text-white font-semibold text-sm rounded-xl transition-colors"
          >
            {uploading ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Upload size={15} />
            )}
            {uploading ? 'Uploading…' : lang === 'af' ? 'Laai op' : 'Upload'}
          </button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            multiple
            className="hidden"
            onChange={handleFilePick}
          />
        </div>

        {/* Empty state */}
        {!mediaLoading && videos.length === 0 && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center gap-3 py-12 rounded-2xl border-2 border-dashed border-cream-300 dark:border-stone-600 hover:border-farm-400 dark:hover:border-farm-500 hover:bg-farm-50 dark:hover:bg-farm-900/10 transition-all group"
          >
            <div className="w-12 h-12 bg-cream-100 dark:bg-stone-700 group-hover:bg-farm-100 dark:group-hover:bg-farm-900/20 rounded-2xl flex items-center justify-center transition-colors">
              <Video size={22} className="text-stone-400 dark:text-stone-500 group-hover:text-farm-500 transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-stone-500 dark:text-stone-400 group-hover:text-farm-600 dark:group-hover:text-farm-400 transition-colors">
                {lang === 'af' ? 'Klik om video\'s op te laai' : 'Click to upload videos'}
              </p>
              <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">MP4, MOV, AVI and more</p>
            </div>
          </button>
        )}

        {/* Loading skeleton */}
        {mediaLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[1,2,3].map(i => (
              <div key={i} className="rounded-2xl bg-cream-100 dark:bg-stone-700 animate-pulse aspect-video" />
            ))}
          </div>
        )}

        {/* Video grid */}
        {!mediaLoading && videos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {videos.map(v => (
              <div
                key={v.id}
                className="group relative rounded-2xl overflow-hidden bg-stone-900 border border-cream-200 dark:border-stone-700"
              >
                {/* Thumbnail — muted video frame */}
                <video
                  src={v.url}
                  className="w-full aspect-video object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  preload="metadata"
                  muted
                />

                {/* Play overlay */}
                <button
                  onClick={() => setPlayingVideo(v)}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <div className="w-11 h-11 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                    <Play size={18} className="text-stone-900 translate-x-0.5" fill="currentColor" />
                  </div>
                </button>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(v.id)}
                  className={[
                    'absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all',
                    deleteConfirm === v.id
                      ? 'bg-red-500 text-white opacity-100'
                      : 'bg-black/50 text-white opacity-0 group-hover:opacity-100 hover:bg-red-500',
                  ].join(' ')}
                  title={deleteConfirm === v.id ? 'Tap again to confirm delete' : 'Delete video'}
                >
                  <Trash2 size={13} />
                </button>

                {/* Filename + size */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2.5 translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="text-white text-xs font-medium truncate">{v.name}</p>
                  <p className="text-white/60 text-[10px] mt-0.5">{formatBytes(v.size)} · {formatDate(v.addedAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Video count */}
        {videos.length > 0 && (
          <p className="text-xs text-stone-400 dark:text-stone-500 mt-4">
            {videos.length} {videos.length === 1 ? 'video' : 'videos'} stored locally on this device
          </p>
        )}
      </div>

      {/* ── Coming soon ────────────────────────────────────────── */}
      {[
        { title: 'Notifications', titleAf: 'Kennisgewings' },
        { title: 'Data & Export',  titleAf: 'Data & Uitvoer' },
      ].map(s => (
        <div key={s.title} className="bg-white dark:bg-[#2D2D2D] rounded-3xl shadow-card p-5 mb-3 flex items-center justify-between opacity-50">
          <p className="font-semibold text-stone-700 dark:text-stone-300 text-sm">{lang === 'af' ? s.titleAf : s.title}</p>
          <span className="text-xs text-stone-400 bg-cream-100 dark:bg-[#333333] px-2.5 py-1 rounded-full">
            {t('label.comingSoon')}
          </span>
        </div>
      ))}

      {/* ── Video player modal ─────────────────────────────────── */}
      <VideoModal video={playingVideo} onClose={() => setPlayingVideo(null)} />

    </div>
  )
}
