// Image URL mappings for external CDN or optimized loading
export const imageUrls = {
  // Hero and featured images
  'hatuusetgelt.webp': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=75',
  'gospel1.jpeg.webp': 'https://images.unsplash.com/photo-1544198365-f5d60b6d8190?w=800&q=75',
  
  // Advent series
  'advent.webp': 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&q=75',
  'advent1.webp': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=75',
  'advent2.webp': 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=75',
  'advent4.webp': 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&q=75',
  'advnet3.webp': 'https://images.unsplash.com/photo-1544198365-f5d60b6d8190?w=800&q=75',
  
  // Good news series
  'goodnews6.webp': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=75',
  'goodnews7.webp': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=75',
  'goodnews9.webp': 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=75',
  'goodnews10.webp': 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&q=75',
  'goodniews8.webp': 'https://images.unsplash.com/photo-1544198365-f5d60b6d8190?w=800&q=75',
  'goodnewscollection.webp': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=75',
  
  // Photo series
  'photo_2024-08-18 18.03.05.webp': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=75',
  'photo_2024-08-18 18.03.14.webp': 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=75',
  'photo_2024-08-18 18.03.33.webp': 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&q=75',
  'photo_2024-08-18 18.03.37.webp': 'https://images.unsplash.com/photo-1544198365-f5d60b6d8190?w=800&q=75',
  'photo_2024-08-18 18.03.42.webp': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=75',
  'photo_2024-09-01 09.33.29.webp': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=75',
  
  // About page
  'about.webp': 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=75',
}

// Helper function to get optimized image URL
export function getOptimizedImageUrl(originalPath: string, width = 800, quality = 75): string {
  // Extract filename from path
  const filename = originalPath.split('/').pop() || originalPath
  
  // Check if we have a mapping for this image
  if (imageUrls[filename as keyof typeof imageUrls]) {
    const baseUrl = imageUrls[filename as keyof typeof imageUrls]
    // Add size and quality parameters
    return `${baseUrl}&w=${width}&q=${quality}`
  }
  
  // Fallback to original path for local images
  return originalPath
}

// Export for use in components
export default { imageUrls, getOptimizedImageUrl }