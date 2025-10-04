import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${process.cwd()}/prisma/dev.db`
    }
  }
})

async function exportStaticData() {
  try {
    console.log('📦 Exporting data from local database...')
    
    // Get all published posts
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' }
    })
    
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
    
    // Create static data directory
    const staticDataDir = path.join(process.cwd(), 'public', 'static-data')
    if (!fs.existsSync(staticDataDir)) {
      fs.mkdirSync(staticDataDir, { recursive: true })
    }
    
    // Export posts
    fs.writeFileSync(
      path.join(staticDataDir, 'posts.json'),
      JSON.stringify(posts, null, 2)
    )
    
    // Export categories
    fs.writeFileSync(
      path.join(staticDataDir, 'categories.json'),
      JSON.stringify(categories, null, 2)
    )
    
    console.log(`✅ Exported ${posts.length} posts and ${categories.length} categories`)
    console.log('📁 Data saved to public/static-data/')
    
    await prisma.$disconnect()
    
  } catch (error) {
    console.error('❌ Error exporting data:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

exportStaticData()