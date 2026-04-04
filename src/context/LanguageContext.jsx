import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '../translations'

const LanguageContext = createContext({})

export const useLanguage = () => useContext(LanguageContext)

const STORAGE_KEY = 'cycleTrackerLanguage'

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && (saved === 'en' || saved === 'ja')) {
      return saved
    }
    // Check browser language
    const browserLang = navigator.language.toLowerCase()
    if (browserLang.startsWith('ja')) {
      return 'ja'
    }
    return 'en'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language)
    // Update document language
    document.documentElement.lang = language
  }, [language])

  const setLanguage = (lang) => {
    if (lang === 'en' || lang === 'ja') {
      setLanguageState(lang)
    }
  }

  const toggleLanguage = () => {
    setLanguageState(prev => prev === 'en' ? 'ja' : 'en')
  }

  // Translation function
  const t = (key) => {
    const keys = key.split('.')
    let value = translations[language]
    for (const k of keys) {
      value = value?.[k]
    }
    // Fallback to English if not found
    if (value === undefined) {
      value = translations.en
      for (const k of keys) {
        value = value?.[k]
      }
    }
    return value || key
  }

  // Get phase data with translations
  const getPhase = (phaseKey) => {
    return translations[language]?.phases?.[phaseKey] || translations.en?.phases?.[phaseKey]
  }

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    getPhase,
    isJapanese: language === 'ja',
    isEnglish: language === 'en',
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
