"use client"

import Image from "next/image"
import { useState } from "react"

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
  quality = 75
}: ResponsiveImageProps) {
  const [imgError, setImgError] = useState(false)

  // Default responsive sizes for different use cases
  const defaultSizes = sizes || (
    fill 
      ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      : "(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
  )

  // Fallback image
  const fallbackSrc = imgError ? "/placeholder.svg" : src

  const imageProps = {
    src: fallbackSrc,
    alt,
    className: `transition-opacity duration-300 ${className}`,
    onError: () => setImgError(true),
    quality,
    sizes: defaultSizes,
    priority,
    // Enable optimization only for local images, disable for external or uploaded images
    unoptimized: src?.startsWith('/images/upload-') || src?.startsWith('http') || false,
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
  // For post cards in grid
  postCard: {
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    quality: 75,
    className: "object-cover"
  },
  
  // For hero images
  hero: {
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw",
    quality: 85,
    priority: true,
    className: "object-cover"
  },
  
  // For full-width post images
  postFull: {
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw",
    quality: 80,
    className: "object-cover"
  },
  
  // For thumbnails
  thumbnail: {
    sizes: "(max-width: 768px) 25vw, (max-width: 1200px) 20vw, 15vw",
    quality: 70,
    className: "object-cover"
  },
  
  // For about page images
  about: {
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw",
    quality: 80,
    className: "object-cover rounded-lg"
  }
}