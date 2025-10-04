import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const POSTS_FILE = path.join(process.cwd(), 'public', 'static-data', 'posts.json')

export async function GET() {
  try {
    const fileContents = fs.readFileSync(POSTS_FILE, 'utf8')
    const posts = JSON.parse(fileContents)
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error reading posts:', error)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const posts = await request.json()
    
    // Ensure the directory exists
    const dir = path.dirname(POSTS_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    
    // Write the posts to the file
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2), 'utf8')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving posts:', error)
    return NextResponse.json({ error: 'Failed to save posts' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  return POST(request) // Same logic for updates
}