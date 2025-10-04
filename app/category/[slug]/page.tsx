import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PostCard } from "@/components/post-card"
import { notFound } from "next/navigation"

const categoryNames: Record<string, string> = {
  'Advent': "Advent",
  'Үхэл ба амилал': "Үхэл ба амилал",
  'Сайн мэдээ': "Сайн мэдээ",
  'Сургаалт зүйрлэлүүд': "Сургаалт зүйрлэлүүд",
  'Мөнх үгийн ойлголт': "Мөнх үгийн ойлголт",
  'Тамын тухай': "Тамын тухай",
}

const categoryDescriptions: Record<string, string> = {
  'Advent': "Advent сэдвийн нийтлэлүүд",
  'Үхэл ба амилал': "Үхэл ба амилалын тухай нийтлэлүүд",
  'Сайн мэдээ': "Есүсийн хайр ба нигүүлслийн тухай өгүүлэх андраар сургаалт зүйрлэлийн түүн уттаг тайлбарлав.",
  'Сургаалт зүйрлэлүүд': "Сургаалт болон зүйрлэлүүд",
  'Мөнх үгийн ойлголт': "Мөнх үгийн ойлголт",
  'Тамын тухай': "Тамын тухай нийтлэлүүд",
}

interface Post {
  id: string
  title: string
  excerpt: string
  category: string
  date: string
  image: string
  slug: string
  metaDescription: string
  content?: string
  published?: boolean
  featured?: boolean
  createdAt?: string
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  // Generate static params for all category slugs, including URL-encoded versions
  const slugs = Object.keys(categoryNames)
  const allSlugs = [
    ...slugs,
    ...slugs.map(slug => encodeURIComponent(slug)) // Add encoded versions
  ]
  
  return allSlugs.map((slug) => ({
    slug,
  }))
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  
  // Decode the slug in case it contains URL-encoded characters (for Cyrillic)
  const decodedSlug = decodeURIComponent(slug)
  
  // Load posts from static data during build
  const fs = require('fs')
  const path = require('path')
  const filePath = path.join(process.cwd(), 'public', 'static-data', 'posts.json')
  const data = fs.readFileSync(filePath, 'utf8')
  const allPosts: Post[] = JSON.parse(data)
  
  // Get category name from both original and decoded slug
  const categoryName = categoryNames[slug] || categoryNames[decodedSlug] || decodedSlug
  
  // Filter posts by category
  const posts = allPosts.filter(post => 
    post.category === categoryName
  )

  if (posts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 transition-colors duration-200">
        <Header />
        <main className="flex-1">
          <section className="max-w-6xl mx-auto px-4 py-12">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{categoryName}</h1>
              <p className="text-gray-600 dark:text-gray-400">Энэ ангилалд нийтлэл олдсонгүй.</p>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 transition-colors duration-200">
      <Header />
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">{categoryName}</h1>
            <p className="text-gray-600 dark:text-gray-400">{categoryDescriptions[slug] || categoryDescriptions[decodedSlug]}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
