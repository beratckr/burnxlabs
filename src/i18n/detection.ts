import type { Language } from './config';
import { languages, defaultLang } from './config';

export function detectBrowserLanguage(): Language {
    if (typeof window === 'undefined') {
        return defaultLang;
    }

    const browserLang = navigator.language || (navigator as any).userLanguage;
    
    const shortLang = browserLang.split('-')[0].toLowerCase();
    
    if (shortLang in languages) {
        return shortLang as Language;
    }
    
    const langMap: Record<string, Language> = {
        'tr': 'tr',
        'en': 'en',
        'us': 'en',
        'gb': 'en',
        'au': 'en',
        'ca': 'en',
        'nz': 'en'
    };
    
    return langMap[shortLang] || defaultLang;
}

export function detectLanguageFromHeaders(acceptLanguage: string | null): Language {
    if (!acceptLanguage) {
        return defaultLang;
    }
    
    const languages = acceptLanguage.split(',').map(lang => {
        const [code, q = '1'] = lang.trim().split(';q=');
        return {
            code: code.split('-')[0].toLowerCase(),
            quality: parseFloat(q)
        };
    }).sort((a, b) => b.quality - a.quality);
    
    for (const lang of languages) {
        if (lang.code === 'tr') return 'tr';
        if (lang.code === 'en') return 'en';
    }
    
    return defaultLang;
}

export function getStoredLanguage(): Language | null {
    if (typeof window === 'undefined') {
        return null;
    }
    
    const stored = localStorage.getItem('preferredLanguage');
    if (stored && stored in languages) {
        return stored as Language;
    }
    
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('lang='))
        ?.split('=')[1];
    
    if (cookieValue && cookieValue in languages) {
        return cookieValue as Language;
    }
    
    return null;
}

export function storeLanguagePreference(lang: Language): void {
    if (typeof window === 'undefined') {
        return;
    }
    
    localStorage.setItem('preferredLanguage', lang);
    
    document.cookie = `lang=${lang}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}