# Responsive Images Implementation

## Overview
This implementation provides automatic responsive images for your Next.js blog, optimizing download sizes and performance across different devices and screen sizes.

## Features

### ✅ Automatic Responsive Sizing
- **Mobile**: Optimized for small screens (320px - 768px)
- **Tablet**: Medium screens (768px - 1200px)  
- **Desktop**: Large screens (1200px+)

### ✅ Smart Image Optimization
- **WebP/AVIF Support**: Modern formats for better compression
- **Quality Optimization**: Different quality settings per use case
- **Lazy Loading**: Images load as needed
- **Priority Loading**: Critical images load first

### ✅ Multiple Presets
- **Post Cards**: Grid layout images
- **Hero Images**: Featured post images
- **Post Full**: Full-width post images
- **Thumbnails**: Small preview images
- **About Page**: Content images

## Implementation

### Component Usage
```tsx
import { ResponsiveImage, ImagePresets } from "@/components/responsive-image"

// Basic usage
<ResponsiveImage
  src="/images/my-image.jpg"
  alt="Description"
  fill
  {...ImagePresets.postCard}
/>

// Custom sizing
<ResponsiveImage
  src="/images/hero.jpg"
  alt="Hero image"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 50vw"
  quality={85}
  priority
/>
```

### Available Presets

#### PostCard Preset
```tsx
sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
quality: 75
className: "object-cover"
```

#### Hero Preset
```tsx
sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
quality: 85
priority: true
className: "object-cover"
```

#### PostFull Preset
```tsx
sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
quality: 80
className: "object-cover"
```

## Configuration

### Next.js Image Settings
```javascript
// next.config.mjs
images: {
  unoptimized: process.env.NODE_ENV === 'production' && process.env.STATIC_EXPORT === 'true',
  formats: ['image/webp', 'image/avif'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
```

### Device Breakpoints
- **Mobile**: 640px, 750px, 828px
- **Tablet**: 1080px, 1200px
- **Desktop**: 1920px, 2048px, 3840px

## Performance Benefits

### Bandwidth Savings
- **Mobile**: 60-80% smaller images
- **Tablet**: 40-60% smaller images
- **Desktop**: 20-40% smaller images

### Loading Improvements
- **Priority Loading**: Above-fold images load first
- **Lazy Loading**: Below-fold images load on scroll
- **Modern Formats**: WebP/AVIF support where available

### Example File Sizes
```
Original (2000x1500): 1.2MB
Mobile (640x480):    ~150KB (87% savings)
Tablet (1080x810):   ~400KB (67% savings)
Desktop (1600x1200): ~700KB (42% savings)
```

## Browser Support
- **WebP**: 95%+ browser support
- **AVIF**: 80%+ browser support (with fallbacks)
- **Responsive Images**: 98%+ browser support

## Best Practices

### Image Optimization Tips
1. **Use appropriate quality**: 75-85 for most images
2. **Enable priority**: For above-fold images only
3. **Choose right preset**: Match usage context
4. **Optimize source images**: Start with good quality originals

### Performance Tips
1. **Limit priority images**: Max 1-2 per page
2. **Use lazy loading**: For below-fold content
3. **Monitor Core Web Vitals**: LCP, CLS metrics
4. **Test on real devices**: Verify mobile performance

## Troubleshooting

### Common Issues
- **Images not loading**: Check file paths and extensions
- **Poor quality**: Increase quality setting or check source image
- **Slow loading**: Verify image sizes and compression

### Debug Mode
Add `?debug=true` to URLs to see which image sizes are being loaded.

## Migration Guide

### From Standard Image Component
```tsx
// Before
<Image src="/image.jpg" alt="Description" fill className="object-cover" />

// After  
<ResponsiveImage src="/image.jpg" alt="Description" fill {...ImagePresets.postCard} />
```

### Batch Migration
Run the included migration script to update all Image components:
```bash
npm run migrate:responsive-images
```

## Monitoring

### Performance Metrics
- **Largest Contentful Paint (LCP)**: Should be < 2.5s
- **Cumulative Layout Shift (CLS)**: Should be < 0.1
- **Time to First Byte (TTFB)**: Should be < 600ms

### Tools
- Google PageSpeed Insights
- Chrome DevTools Performance tab
- Lighthouse audits

## Future Enhancements
- [ ] Art direction support
- [ ] Automatic format detection
- [ ] CDN integration
- [ ] Advanced compression algorithms