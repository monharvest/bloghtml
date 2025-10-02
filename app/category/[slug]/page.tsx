import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PostCard } from "@/components/post-card"
import { db } from "@/lib/db"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

const categoryNames: Record<string, string> = {
  'sain-medee': "Сайн мэдээ",
  'surgaalt-zuirleluud': "Сургаалт зүйрлэлүүд",
  'advent': "Advent",
  'ukhal-ba-amiral': "Ухал ба амилал",
  'munkh-uunii-oilgolt': "Мөнх үүний өйлгөлт",
  'tamyn-tukhai': "Тамын тухай",
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
  // Legacy support
  gospel: "Есүсийн хайр ба нигүүлслийн тухай өгүүлэх андраар сургаалт зүйрлэлийн түүн уттаг тайлбарлав.",
  health: "Эрүүл мэнд, амидралтын тухай зөвлөмжүүд",
  education: "Сургаалт болон зүйрлэлүүд",
  games: "Мөнх үүний ойлголт",
  youth: "Залуучуудад зориулсан сэдвүүд",
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const categoryName = categoryNames[slug] || slug

  return {
    title: `${categoryName} - Udaxgui.com`,
    description: categoryDescriptions[slug] || `${categoryName} сэдвийн нийтлэлүүд`,
    openGraph: {
      title: `${categoryName} - Udaxgui.com`,
      description: categoryDescriptions[slug] || `${categoryName} сэдвийн нийтлэлүүд`,
    },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  
  // Get category name or use the slug as fallback
  const categoryName = categoryNames[slug] || slug
  
  // Fetch posts by category name (not slug)
  const dbPosts = await db.getPostsByCategory(categoryName)

  if (dbPosts.length === 0) {
    notFound()
  }

  // Convert database posts to match PostCard expected format
  const categoryPosts = dbPosts.map(post => ({
    ...post,
    date: new Date(post.createdAt).toLocaleDateString("en-GB")
  }))

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">{categoryName}</h1>
            <p className="text-muted-foreground">{categoryDescriptions[slug]}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryPosts.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
