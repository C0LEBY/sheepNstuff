import { Settings2, Globe, Check } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const LANGUAGES = [
  { code: 'en', label: 'English',   native: 'English',    flag: '🇬🇧' },
  { code: 'af', label: 'Afrikaans', native: 'Afrikaans',  flag: '🇿🇦' },
]

export default function Settings() {
  const { t, lang, setLang } = useLanguage()

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 bg-farm-100 rounded-2xl flex items-center justify-center">
          <Settings2 size={22} className="text-farm-600" strokeWidth={1.8} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">{t('page.settings.title')}</h1>
        </div>
      </div>

      {/* Language section */}
      <div className="bg-white rounded-3xl shadow-card p-6 mb-5">
        <div className="flex items-center gap-3 mb-5">
          <Globe size={18} className="text-farm-500" />
          <div>
            <h2 className="text-base font-semibold text-stone-900">{t('page.settings.language')}</h2>
            <p className="text-xs text-stone-400 mt-0.5">{t('page.settings.chooseLanguage')}</p>
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
                  ? 'border-farm-400 bg-farm-50'
                  : 'border-cream-200 bg-white hover:border-cream-300 hover:bg-cream-50',
              ].join(' ')}
            >
              <span className="text-2xl leading-none">{lng.flag}</span>
              <div className="flex-1">
                <p className={`font-semibold text-sm ${lang === lng.code ? 'text-farm-700' : 'text-stone-800'}`}>
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

      {/* Coming soon sections */}
      {[
        { title: 'Notifications', titleAf: 'Kennisgewings' },
        { title: 'Data & Export',  titleAf: 'Data & Uitvoer' },
        { title: 'Appearance',     titleAf: 'Voorkoms' },
      ].map(s => (
        <div key={s.title} className="bg-white rounded-3xl shadow-card p-5 mb-3 flex items-center justify-between opacity-50">
          <p className="font-semibold text-stone-700 text-sm">{lang === 'af' ? s.titleAf : s.title}</p>
          <span className="text-xs text-stone-400 bg-cream-100 px-2.5 py-1 rounded-full">
            {t('label.comingSoon')}
          </span>
        </div>
      ))}
    </div>
  )
}
