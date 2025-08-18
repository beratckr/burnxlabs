export const languages = {
    en: 'English',
    tr: 'Türkçe'
} as const;

export type Language = keyof typeof languages;

export const defaultLang: Language = 'en';

export const locales = Object.keys(languages) as Language[];

export function getLangFromUrl(url: URL): Language {
    const [, lang] = url.pathname.split('/');
    if (lang in languages) {
        return lang as Language;
    }
    return defaultLang;
}

export function getLocalizedPath(path: string, lang: Language): string {
    return `/${lang}${path.startsWith('/') ? path : `/${path}`}`;
}