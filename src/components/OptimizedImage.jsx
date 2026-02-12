import { useState } from 'react';

const OptimizedImage = ({
    src,
    alt,
    className = '',
    width,
    height,
    priority = false,
    sizes = '100vw'
}) => {
    const [isLoaded, setIsLoaded] = useState(false);

    // Helper to determine if the image is from a CDN we can optimize via URL params
    const getResponsiveSrc = (baseUrl, targetWidth) => {
        if (baseUrl.includes('unsplash.com')) {
            const urlWithoutParams = baseUrl.split('?')[0];
            const params = new URLSearchParams(baseUrl.split('?')[1] || '');
            params.set('auto', 'format');
            params.set('fit', 'crop');
            params.set('w', targetWidth);
            params.set('q', '75');
            return `${urlWithoutParams}?${params.toString()}`;
        }

        // Pngtree optimization if possible (researching shows they often don't have simple URL params for resizing)
        // If it's a local image, we might want to return the webp version if we're in a browser that supports it
        // and we have it. But for srcset, we need multiple versions.

        return baseUrl;
    };

    // Generate srcset for responsive images
    const generateSrcSet = (baseUrl) => {
        if (baseUrl.includes('unsplash.com')) {
            const widths = [320, 640, 768, 1024, 1280, 1920];
            return widths
                .map(w => `${getResponsiveSrc(baseUrl, w)} ${w}w`)
                .join(', ');
        }

        // For local images in public folder, we use a simple approach:
        // Try to serve webp if it exists (via picture tag)
        return undefined;
    };

    const isLocal = src.startsWith('/');
    const webpSrc = isLocal ? src.replace(/\.(png|jpg|jpeg)$/, '.webp') : null;

    return (
        <picture className={className}>
            {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
            <img
                src={src}
                srcSet={generateSrcSet(src)}
                sizes={sizes}
                alt={alt}
                width={width}
                height={height}
                loading={priority ? 'eager' : 'lazy'}
                decoding={priority ? 'sync' : 'async'}
                className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
                onLoad={() => setIsLoaded(true)}
            />
        </picture>
    );
};

export default OptimizedImage;

