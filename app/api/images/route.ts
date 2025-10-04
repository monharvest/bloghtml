import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export const dynamic = 'force-static'

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), "public")
    const files = fs.readdirSync(publicDir)

    // Filter for image files
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp"]
    const images = files
      .filter((file) => {
        const ext = path.extname(file).toLowerCase()
        return imageExtensions.includes(ext)
      })
      .map((file) => `/${file}`)

    return NextResponse.json({ images })
  } catch (error) {
    console.error("Error reading images:", error)
    return NextResponse.json({ images: [] })
  }
}
