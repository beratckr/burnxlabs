export default async (request, context) => {
    const country = context.geo?.country?.code || 'US';
    
    const countryToLanguage = {
        'TR': 'tr',
        'US': 'en',
        'GB': 'en',
        'CA': 'en',
        'AU': 'en',
        'NZ': 'en',
        'IE': 'en'
    };
    
    const detectedLang = countryToLanguage[country] || 'en';
    
    const acceptLanguage = request.headers.get('accept-language');
    let browserLang = 'en';
    
    if (acceptLanguage) {
        const languages = acceptLanguage.split(',').map(lang => {
            const [code] = lang.trim().split(';');
            return code.split('-')[0].toLowerCase();
        });
        
        if (languages.includes('tr')) {
            browserLang = 'tr';
        } else if (languages.includes('en')) {
            browserLang = 'en';
        }
    }
    
    const cookieLang = context.cookies.get('lang');
    
    const finalLang = cookieLang || browserLang || detectedLang;
    
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    if (pathname === '/' || pathname === '') {
        return new Response(null, {
            status: 302,
            headers: {
                'Location': `/${finalLang}/`,
                'Cache-Control': 'no-cache'
            }
        });
    }
    
    const pathSegments = pathname.split('/').filter(Boolean);
    const firstSegment = pathSegments[0];
    
    if (!['en', 'tr'].includes(firstSegment) && pathSegments.length > 0) {
        const newPath = `/${finalLang}/${pathSegments.join('/')}`;
        return new Response(null, {
            status: 302,
            headers: {
                'Location': newPath,
                'Cache-Control': 'no-cache'
            }
        });
    }
    
    return context.next();
};

export const config = {
    path: '/*'
};