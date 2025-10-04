import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), 'public')
    const imagesDir = path.join(publicDir, 'images')
    let images: string[] = []
    
    if (fs.existsSync(imagesDir)) {
      const files = fs.readdirSync(imagesDir)
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
      images = files
        .filter(file => {
          const ext = path.extname(file).toLowerCase()
          return imageExtensions.includes(ext)
        })
        .map(file => `/images/${file}`)
        .sort()
    }
    
    return NextResponse.json({ images })
  } catch (error) {
    console.error('Error reading images:', error)
    return NextResponse.json({ images: [] })
  }
}
