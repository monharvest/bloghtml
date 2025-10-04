import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PostCard } from "@/components/post-card"
import { notFound } from "next/navigation"

const categoryNames: Record<string, string> = {
  'sain-medee': "Сайн мэдээ",
  'surgaalt-zuirleluud': "Сургаалт зүйрлэлүүд", 
  'advent': "Advent",
  'ukhal-ba-amiral': "Ухал ба амилал",
  'munkh-uunii-oilgolt': "Мөнх үүний өйлгөлт",
  'tamyn-tukhai': "Тамын тухай",
  'teknologi': "Технологи",
  'amidral': "Амьдрал",
  'surgaal': "Сургаал",
  // Legacy support
  gospel: "Сайн мэдээ",
  health: "Ухал ба амилал",
  education: "Сургаалт зүйрлэлүүд",
  games: "Мөнх үүний өйлгөлт",
  youth: "Тамын тухай",
}

const categoryDescriptions: Record<string, string> = {
  'sain-medee': "Есүсийн хайр ба нигүүлслийн тухай өгүүлэх андраар сургаалт зүйрлэлийн түүн уттаг тайлбарлав.",
  'surgaalt-zuirleluud': "Сургаалт болон зүйрлэлүүд",
  'advent': "Advent сэдвийн нийтлэлүүд",
  'ukhal-ba-amiral': "Эрүүл мэнд, амидралтын тухай зөвлөмжүүд",
  'munkh-uunii-oilgolt': "Мөнх үүний ойлголт",
  'tamyn-tukhai': "Залуучуудад зориулсан сэдвүүд",
  'teknologi': "Технологи болон шинэлэг зүйлсийн тухай",
  'amidral': "Амьдралын туршлага ба зөвлөгөө",
  'surgaal': "Сургаалт болон боловсролын нийтлэлүүд",
  // Legacy support
  gospel: "Есүсийн хайр ба нигүүлслийн тухай өгүүлэх андраар сургаалт зүйрлэлийн түүн уттаг тайлбарлав.",
  health: "Эрүүл мэнд, амидралтын тухай зөвлөмжүүд",
  education: "Сургаалт болон зүйрлэлүүд",
  games: "Мөнх үүний ойлголт",
  youth: "Залуучуудад зориулсан сэдвүүд",
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
  // Generate static params for all category slugs
  return Object.keys(categoryNames).map((slug) => ({
    slug,
  }))
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  
  // Load posts from static data during build
  const fs = require('fs')
  const path = require('path')
  const filePath = path.join(process.cwd(), 'public', 'static-data', 'posts.json')
  const data = fs.readFileSync(filePath, 'utf8')
  const allPosts: Post[] = JSON.parse(data)
  
  // Get category name from slug
  const categoryName = categoryNames[slug] || slug
  
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
            <p className="text-gray-600 dark:text-gray-400">{categoryDescriptions[slug]}</p>
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
