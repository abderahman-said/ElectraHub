import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = ({
    title = 'إلكترا هب - منصة B2B للأجهزة الكهربائية',
    description = 'منصة B2B رائدة تربط المستوردين والموردين للأجهزة الكهربائية والإلكترونية.',
    keywords = 'أجهزة كهربائية، إلكترونيات، تكييف، ثلاجات، غسالات، شاشات، B2B',
    image = 'https://electrahub.com/og-image.png',
    type = 'website'
}) => {
    const location = useLocation();
    const currentUrl = `https://electrahub.com${location.pathname}`;

    useEffect(() => {
        // Update document title
        document.title = title;

        // Update meta tags
        const updateMetaTag = (name, content, property = false) => {
            const attr = property ? 'property' : 'name';
            let element = document.querySelector(`meta[${attr}="${name}"]`);

            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attr, name);
                document.head.appendChild(element);
            }

            element.setAttribute('content', content);
        };

        // Primary Meta Tags
        updateMetaTag('description', description);
        updateMetaTag('keywords', keywords);

        // Open Graph
        updateMetaTag('og:title', title, true);
        updateMetaTag('og:description', description, true);
        updateMetaTag('og:image', image, true);
        updateMetaTag('og:url', currentUrl, true);
        updateMetaTag('og:type', type, true);

        // Twitter
        updateMetaTag('twitter:title', title, true);
        updateMetaTag('twitter:description', description, true);
        updateMetaTag('twitter:image', image, true);
        updateMetaTag('twitter:url', currentUrl, true);

        // Update canonical link
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', currentUrl);

    }, [title, description, keywords, image, type, currentUrl]);

    return null;
};

export default SEO;
