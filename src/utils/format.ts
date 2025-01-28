export const formatPrice = (price: number | string | { toString: () => string }): string => {
  // Convert to number first to ensure we can use toFixed
  const numPrice = typeof price === 'number' ? price : Number(price.toString());
  
  // Check if it's a valid number
  if (isNaN(numPrice)) {
    console.error('Invalid price value:', price);
    return '0.00';
  }
  
  return numPrice.toFixed(2);
}; 