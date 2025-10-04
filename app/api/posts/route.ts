import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const POSTS_FILE = path.join(process.cwd(), 'public', 'static-data', 'posts.json')

export async function GET() {
  try {
    if (!fs.existsSync(POSTS_FILE)) {
      return NextResponse.json([])
    }
    const fileContent = fs.readFileSync(POSTS_FILE, 'utf-8')
    const posts = JSON.parse(fileContent)
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error reading posts:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const posts = await request.json()
    const dir = path.dirname(POSTS_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving posts:', error)
    return NextResponse.json({ error: 'Failed to save posts' }, { status: 500 })
  }
}
