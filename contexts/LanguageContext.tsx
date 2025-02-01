"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import enTranslations from '@/messages/en.json';
import teTranslations from '@/messages/te.json';

type Translations = typeof enTranslations;

interface LanguageContextType {
  language: string;
  translations: Translations;
  setLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('tel');

  const [translations, setTranslations] = useState(teTranslations);

  useEffect(() => {
    setTranslations(language === 'eng' ? enTranslations : teTranslations);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, translations, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}