import type { Language } from './config';
import { defaultLang } from './config';
import enTranslations from './en.json';
import trTranslations from './tr.json';

const translations = {
    en: enTranslations,
    tr: trTranslations
} as const;

export type TranslationKeys = typeof enTranslations;

export function useTranslations(lang: Language) {
    return function t(key: string): string {
        const keys = key.split('.');
        let value: any = translations[lang] || translations[defaultLang];
        
        for (const k of keys) {
            value = value?.[k];
            if (value === undefined) {
                console.warn(`Translation key not found: ${key} for language: ${lang}`);
                const fallbackValue: any = keys.reduce((acc, k) => acc?.[k], translations[defaultLang]);
                return fallbackValue || key;
            }
        }
        
        return value;
    };
}

export function getTranslations(lang: Language): TranslationKeys {
    return translations[lang] || translations[defaultLang];
}

export function getLangFromUrl(url: URL): Language {
    const [, lang] = url.pathname.split('/');
    if (lang === 'en' || lang === 'tr') {
        return lang as Language;
    }
    return defaultLang;
}