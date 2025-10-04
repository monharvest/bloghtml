import { NextRequest, NextResponse } from 'next/server'

// Type definitions for Cloudflare runtime
interface CloudflareEnv {
  IMAGES_BUCKET: R2Bucket
}

interface R2Bucket {
  put(key: string, value: ReadableStream | ArrayBuffer | ArrayBufferView | string | null, options?: R2PutOptions): Promise<R2Object | null>
}

interface R2PutOptions {
  httpMetadata?: R2HTTPMetadata
  customMetadata?: Record<string, string>
}

interface R2HTTPMetadata {
  contentType?: string
  contentLanguage?: string
  contentDisposition?: string
  contentEncoding?: string
  cacheControl?: string
  expires?: Date
}

interface R2Object {
  key: string
  version: string
  size: number
  etag: string
  httpEtag: string
  uploaded: Date
  httpMetadata?: R2HTTPMetadata
  customMetadata?: Record<string, string>
}

export async function POST(request: NextRequest) {
  try {
    // Check if we're in Cloudflare environment
    const runtime = process.env.CF_PAGES || process.env.CLOUDFLARE_ENV
    
    if (!runtime) {
      // Local development - save to public folder
      return await handleLocalUpload(request)
    }
    
    // Cloudflare R2 upload
    return await handleR2Upload(request)
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}

async function handleLocalUpload(request: NextRequest) {
  const fs = await import('fs')
  const path = await import('path')
  
  const formData = await request.formData()
  const file = formData.get('file') as File
  
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }
  
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
  }
  
  // Generate unique filename
  const timestamp = Date.now()
  const extension = path.extname(file.name)
  const filename = `upload-${timestamp}${extension}`
  
  // Save to public/images folder
  const publicPath = path.join(process.cwd(), 'public', 'images', filename)
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  
  fs.writeFileSync(publicPath, buffer)
  
  return NextResponse.json({
    success: true,
    url: `/images/${filename}`,
    filename
  })
}

async function handleR2Upload(request: NextRequest) {
  // Get Cloudflare binding (this works in Cloudflare Workers/Pages)
  const env = process.env as any
  const bucket = env.IMAGES_BUCKET as R2Bucket
  
  if (!bucket) {
    return NextResponse.json({ error: 'R2 bucket not configured' }, { status: 500 })
  }
  
  const formData = await request.formData()
  const file = formData.get('file') as File
  
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }
  
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
  }
  
  // Generate unique filename
  const timestamp = Date.now()
  const extension = file.name.split('.').pop()
  const filename = `uploads/${timestamp}.${extension}`
  
  // Upload to R2
  const arrayBuffer = await file.arrayBuffer()
  
  const uploadResult = await bucket.put(filename, arrayBuffer, {
    httpMetadata: {
      contentType: file.type,
    },
    customMetadata: {
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
    },
  })
  
  if (!uploadResult) {
    return NextResponse.json({ error: 'Failed to upload to R2' }, { status: 500 })
  }
  
  // Return the public URL (you'll need to configure your R2 bucket with a custom domain)
  const publicUrl = `https://images.udaxgui.com/${filename}`
  
  return NextResponse.json({
    success: true,
    url: publicUrl,
    filename,
    key: uploadResult.key
  })
}

// Also support GET for checking upload status
export async function GET() {
  return NextResponse.json({
    message: 'Upload endpoint ready',
    supports: ['POST'],
    maxSize: '10MB',
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  })
}