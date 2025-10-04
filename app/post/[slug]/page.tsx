import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

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

interface PostPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  
  // Load posts from static data
  const response = await fetch(process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000/static-data/posts.json' 
    : `${process.env.VERCEL_URL || 'https://d48791d5.blog-5nk.pages.dev'}/static-data/posts.json`
  )
  const allPosts: Post[] = await response.json()
  
  // Find the current post
  const post = allPosts.find(p => p.slug === slug)
  
  if (!post) {
    notFound()
  }

  // Find related posts (same category, different post)
  const relatedPosts = allPosts
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 2)

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 transition-colors duration-200">
      <Header />
      <main className="flex-1">
        <article className="max-w-4xl mx-auto px-4 py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Буцах
          </Link>

          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm rounded-full mb-4">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white text-balance">{post.title}</h1>
            <time className="text-gray-600 dark:text-gray-400">{post.date}</time>
          </div>

          <div className="relative w-full h-[240px] sm:h-[320px] md:h-[400px] lg:h-[480px] rounded-2xl overflow-hidden mb-8">
            <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" priority />
          </div>

          <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content || post.excerpt}
            </ReactMarkdown>
          </div>

          {relatedPosts.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-700">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Холбоотой нийтлэлүүд</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/post/${relatedPost.slug}`}
                    className="group p-4 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors bg-white dark:bg-slate-800"
                  >
                    <h4 className="font-bold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {relatedPost.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{relatedPost.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </div>
  )
}
