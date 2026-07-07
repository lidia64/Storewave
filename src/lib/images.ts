import type { Product } from '../types';

export const heroImage =
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80';

export const authImage =
  'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=80';

export const fallbackProductImages = [
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=900&q=80',
];

export const getProductImage = (product?: Product | null) => {
  if (!product) return fallbackProductImages[0];

  const apiImage = product.images?.find((image) => Boolean(image.url))?.url;
  if (apiImage) return apiImage;

  const key = product.id || product.name;
  const index = Math.abs(
    Array.from(key).reduce((total, char) => total + char.charCodeAt(0), 0)
  ) % fallbackProductImages.length;

  return fallbackProductImages[index];
};
