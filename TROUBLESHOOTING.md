# Blog Troubleshooting Guide

## Issue: Mongolian/Cyrillic Slug Posts Not Found (404 Errors)

### Problem Description
Posts with Cyrillic characters (Mongolian text) in their slugs were returning 404 errors or taking extremely long to load.

### Root Cause
When browsers encounter Cyrillic characters in URLs, they automatically URL-encode them:
- `шинэ-бүтээл` becomes `%D1%88%D0%B8%D0%BD%D1%8D-%D0%B1%D2%AF%D1%82%D1%8D%D1%8D%D0%BB`
- `хэмжээлшгүй-их-хайр-ивээл` becomes a very long encoded string

The Next.js dynamic route was receiving the URL-encoded version but trying to match against the original Cyrillic slug in the JSON data, causing a mismatch.

### Symptoms
- Mongolian title posts show 404 errors when clicked
- Development server logs show very long URL-encoded paths like `/post/%D1%85%D1%8D%D0%BC...`
- Posts with English/Latin slugs work fine
- Slow loading times (45-70ms) for affected posts

### Solution Applied
Updated `/app/post/[slug]/page.tsx` to handle URL decoding:

1. **Decode incoming slugs**:
```tsx
const decodedSlug = decodeURIComponent(slug)
```

2. **Match both encoded and decoded versions**:
```tsx
const post = allPosts.find(p => p.slug === slug || p.slug === decodedSlug)
```

3. **Added proper metadata generation** for URL-encoded slugs

### Files Modified
- `/app/post/[slug]/page.tsx` - Added URL decoding logic
- Added `generateMetadata` function to handle encoded slugs properly

### Prevention
When creating posts with Cyrillic characters:
- Consider using Latin transliteration for slugs (more SEO-friendly)
- If using Cyrillic slugs, ensure the slug handling logic includes URL decoding
- Test posts by clicking links from the homepage, not just typing URLs manually

### Testing
- Access posts through homepage links (real-world scenario)
- Test both direct Cyrillic URLs and encoded versions
- Check browser network tab for actual URL requests

### Related Issues
- URL encoding affects all non-ASCII characters
- This could apply to other languages (Arabic, Chinese, etc.)
- Static site generation needs to handle both encoded/decoded versions

---

## Other Common Issues

### Webpack Cache Corruption
**Symptoms**: Random build errors, missing modules
**Solution**: `rm -rf .next && npm run dev`

### JSON Corruption in posts.json
**Symptoms**: JSON parse errors, missing posts
**Solution**: Validate JSON syntax, check for trailing commas

### Category Mismatch
**Symptoms**: Posts not appearing in category pages
**Solution**: Ensure category names match exactly across all files

---

*Last updated: October 4, 2025*