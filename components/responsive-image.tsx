"use client"

import Image from "next/image"
import { useState } from "react"
import { getOptimizedImageUrl } from "@/lib/image-optimization"

interface ResponsiveImageProps {
  src: string
  alt: string
  className?: string
  fill?: boolean
  width?: number
  height?: number
  priority?: boolean
  sizes?: string
  quality?: number
  fetchPriority?: "high" | "low" | "auto"
}

export function ResponsiveImage({ 
  src, 
  alt, 
  className = "", 
  fill = false,
  width,
  height,
  priority = false,
  sizes,
  quality = 75,
  fetchPriority
}: ResponsiveImageProps) {
  const [imgError, setImgError] = useState(false)

  // Default responsive sizes for different use cases
  const defaultSizes = sizes || (
    fill 
      ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      : "(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
  )

  // Optimize image URL for CDN delivery
  const optimizedSrc = getOptimizedImageUrl(src, width || 800, quality)
  
  // Fallback image
  const fallbackSrc = imgError ? "/placeholder.svg" : optimizedSrc

  // Determine fetchPriority - auto-set to "high" for priority images
  const effectiveFetchPriority = fetchPriority || (priority ? "high" : "auto")

  const imageProps = {
    src: fallbackSrc,
    alt,
    className: `transition-opacity duration-300 ${className}`,
    onError: () => setImgError(true),
    quality,
    sizes: defaultSizes,
    priority, // This prevents lazy loading when true
    fetchPriority: effectiveFetchPriority, // This sets fetch priority
    // Disable lazy loading for priority images
    loading: priority ? ("eager" as const) : ("lazy" as const),
    // Enable optimization only for local images, disable for external or uploaded images
    unoptimized: optimizedSrc?.startsWith('http') || optimizedSrc?.startsWith('/images/upload-') || optimizedSrc?.endsWith('.webp') || false,
    ...(fill 
      ? { fill: true } 
      : { 
          width: width || 800, 
          height: height || 600,
          style: { width: '100%', height: 'auto' }
        }
    )
  }

  return <Image {...imageProps} />
}

// Preset configurations for common use cases
export const ImagePresets = {
  // For post cards in grid - make lazy
  postCard: {
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    quality: 75,
    className: "object-cover"
    // Removed priority to enable lazy loading
  },
  
  // For first post card (high priority for LCP) - keep priority
  postCardFirst: {
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    quality: 80,
    priority: true,
    fetchPriority: "high" as const,
    className: "object-cover"
  },
  
  // Hero images - keep priority
  hero: {
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw",
    quality: 85,
    priority: true,
    fetchPriority: "high" as const,
    className: "object-cover"
  },
  
  // For full-width post images - make lazy
  postFull: {
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw",
    quality: 80,
    className: "object-cover"
    // Removed priority
  },
  
  // Thumbnails - lazy
  thumbnail: {
    sizes: "(max-width: 768px) 25vw, (max-width: 1200px) 20vw, 15vw",
    quality: 70,
    className: "object-cover"
  },
  
  // About page - lazy
  about: {
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw",
    quality: 80,
    className: "object-cover rounded-lg"
  }
}