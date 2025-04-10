import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import en from './locales/en.json';
import es from './locales/es.json';

// Define available translations
const translations = {
  en,
  es,
};

// Define the i18n context type
interface I18nContextType {
  t: (key: string, params?: Record<string, string | number>) => string;
  changeLanguage: (lang: string) => void;
  language: string;
}

// Create context
const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Create provider
export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('en');

  // Get localized text with parameter replacement
  const t = (key: string, params?: Record<string, string | number>): string => {
    // Split the key by dots to access nested properties
    const keys = key.split('.');
    
    // Get the current locale
    const locale = translations[language as keyof typeof translations] || en;
    
    // Navigate to the nested property
    let text = keys.reduce((obj: any, key) => (obj && obj[key] !== undefined ? obj[key] : undefined), locale);
    
    // If no translation is found, return the key
    if (text === undefined) return key;
    
    // Replace parameters if provided
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        text = text.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
      });
    }
    
    return text;
  };

  // Change language
  const changeLanguage = (lang: string) => {
    if (translations[lang as keyof typeof translations]) {
      setLanguage(lang);
      
      // You might want to save the language preference for future visits
      localStorage.setItem('language', lang);
    }
  };

  // Load saved language on initial render
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && translations[savedLanguage as keyof typeof translations]) {
      setLanguage(savedLanguage);
    }
  }, []);

  return (
    <I18nContext.Provider value={{ t, changeLanguage, language }}>
      {children}
    </I18nContext.Provider>
  );
}

// Hook for easy access
export function useTranslation() {
  const context = useContext(I18nContext);
  
  if (context === undefined) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  
  return context;
}
