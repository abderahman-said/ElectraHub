/**
 * Utility functions for handling product images
 */

/**
 * Get the appropriate image URL for a product
 * @param {Object} product - The product object
 * @returns {string} - The image URL or placeholder
 */
export const getProductImage = (product) => {
  // Check if product has images array
  if (product.images && product.images.length > 0) {
    const firstImage = product.images[0];
    // Check if it's a base64 image
    if (typeof firstImage === 'string' && firstImage.startsWith('data:image/')) {
      return firstImage;
    }
    // Check if it's a relative path
    if (typeof firstImage === 'string' && !firstImage.startsWith('http')) {
      return firstImage;
    }
  }
  // Check if product has image property
  if (product.image) {
    return product.image;
  }
  // Return placeholder
  return 'placeholder-product.webp';
};

/**
 * Handle image error by setting placeholder
 * @param {Event} e - The error event
 */
export const handleImageError = (e) => {
  e.target.src = 'placeholder-product.webp';
};
