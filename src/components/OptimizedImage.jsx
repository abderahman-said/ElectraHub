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

    // Extract Unsplash image ID and parameters
    const getResponsiveSrc = (baseUrl, targetWidth) => {
        if (!baseUrl.includes('unsplash.com')) return baseUrl;

        // Remove existing width and quality parameters
        const urlWithoutParams = baseUrl.split('?')[0];
        const params = new URLSearchParams(baseUrl.split('?')[1] || '');

        // Set optimized parameters
        params.set('auto', 'format');
        params.set('fit', 'crop');
        params.set('w', targetWidth);
        params.set('q', '75');

        return `${urlWithoutParams}?${params.toString()}`;
    };

    // Generate srcset for responsive images
    const generateSrcSet = (baseUrl) => {
        if (!baseUrl.includes('unsplash.com')) return undefined;

        const widths = [320, 640, 768, 1024, 1280, 1920];
        return widths
            .map(w => `${getResponsiveSrc(baseUrl, w)} ${w}w`)
            .join(', ');
    };

    return (
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
    );
};

export default OptimizedImage;
