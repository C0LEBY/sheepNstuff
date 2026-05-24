import { Settings2, Globe, Check, Sun, Moon } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'

const LANGUAGES = [
  { code: 'en', label: 'English',   native: 'English',    flag: '🇬🇧' },
  { code: 'af', label: 'Afrikaans', native: 'Afrikaans',  flag: '🇿🇦' },
]

export default function Settings() {
  const { t, lang, setLang } = useLanguage()
  const { theme, setTheme } = useTheme()

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 bg-farm-100 dark:bg-farm-900/30 rounded-2xl flex items-center justify-center">
          <Settings2 size={22} className="text-farm-600 dark:text-farm-400" strokeWidth={1.8} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">{t('page.settings.title')}</h1>
        </div>
      </div>

      {/* Language section */}
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

      {/* Appearance section */}
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
            { value: 'light', label: lang === 'af' ? 'Lig' : 'Light', Icon: Sun },
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

      {/* Coming soon sections */}
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
    </div>
  )
}
