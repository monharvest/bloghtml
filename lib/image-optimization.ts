// Image URL mappings for external CDN or optimized loading
// export const imageUrls = { ... }  // Commented out to use local images

// Helper function to get optimized image URL
export function getOptimizedImageUrl(originalPath: string, width = 800, quality = 75): string {
  // Always return original path for local images
  return originalPath
}

// Export for use in components
export default { getOptimizedImageUrl }