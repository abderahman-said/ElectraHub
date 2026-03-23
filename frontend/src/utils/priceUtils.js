/**
 * Utility functions for handling product prices and currency formatting
 */

/**
 * Format a price value into EGP (ج.م) currency string
 * @param {number} price - The price to format
 * @param {string} locale - The locale to use (default: 'ar-EG')
 * @returns {string} - The formatted price string
 */
export const formatPrice = (price, locale = 'ar-EG') => {
  if (price === undefined || price === null) return '0 ج.م';
  
  return new Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price) + ' ج.م';
};

/**
 * Get the appropriate display price for a product (handles wholesale vs retail)
 * @param {Object} product - The product object
 * @returns {number} - The price value to display
 */
export const getDisplayPrice = (product) => {
  return product.wholesale_price || product.averagePrice || product.price || 0;
};
