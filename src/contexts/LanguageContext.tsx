'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Language, translations } from '@/constants/translations';

interface LanguageContextType {
  language: Language;
  t: typeof translations.en | typeof translations.sv;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'opticode-language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Initialize with 'en' as default, will be updated on mount from localStorage
  const [language, setLanguage] = useState<Language>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  // Load language from localStorage on mount
  useEffect(() => {
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage === 'sv' || storedLanguage === 'en') {
      setLanguage(storedLanguage);
    }
    setIsInitialized(true);
  }, []);

  // Save language to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
  }, [language, isInitialized]);

  const toggleLanguage = useCallback(() => {
    const newLanguage = language === 'en' ? 'sv' : 'en';
    setLanguage(newLanguage);
  }, [language]);

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        t: translations[language], 
        toggleLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

