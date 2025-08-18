export default async (request, context) => {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // Skip processing for static assets and special paths
    const staticExtensions = ['.css', '.js', '.mjs', '.jsx', '.ts', '.tsx', '.json', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.otf', '.map'];
    const specialPaths = ['/_astro/', '/node_modules/', '/@vite/', '/@fs/', '/src/'];
    const excludedPages = ['/success', '/about', '/blog', '/contact'];
    
    const hasStaticExtension = staticExtensions.some(ext => pathname.endsWith(ext));
    const isSpecialPath = specialPaths.some(path => pathname.includes(path));
    const isExcludedPage = excludedPages.some(page => pathname === page || pathname === page + '/');
    
    if (hasStaticExtension || isSpecialPath || isExcludedPage) {
        return context.next();
    }
    
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