import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { db } from "@/lib/db"

interface PostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const posts = await db.getPublishedPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await db.getPostBySlug(slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${post.title} | Udaxgui.com`,
    description: post.metaDescription,
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      type: "article",
      publishedTime: new Date(post.createdAt).toISOString(),
      images: [
        {
          url: post.image,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.metaDescription,
      images: [post.image],
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await db.getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const allPosts = await db.getPublishedPosts()
  const relatedPosts = allPosts.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 2)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <article className="container mx-auto px-4 py-12 max-w-4xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Буцах
          </Link>

          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm rounded-full mb-4">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground text-balance">{post.title}</h1>
            <time className="text-muted-foreground">{new Date(post.createdAt).toLocaleDateString("en-GB")}</time>
          </div>

          <div className="relative w-full h-[240px] sm:h-[320px] md:h-[400px] lg:h-[480px] rounded-2xl overflow-hidden mb-8">
            <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" priority />
          </div>

          <div className="prose prose-lg max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content || post.excerpt}</ReactMarkdown>
          </div>

          {relatedPosts.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="text-xl font-bold mb-4 text-foreground">Холбоотой нийтлэлүүд</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/post/${relatedPost.slug}`}
                    className="group p-4 rounded-lg border border-border hover:border-primary transition-colors"
                  >
                    <h4 className="font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                      {relatedPost.title}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{relatedPost.excerpt}</p>
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
