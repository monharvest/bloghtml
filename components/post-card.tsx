import Link from "next/link"
import Image from "next/image"
import type { Post } from "@/lib/posts"

interface PostCardProps {
  post: Post
  index: number
}

export function PostCard({ post, index }: PostCardProps) {
  const getCardStyle = (idx: number) => {
    const styles = [
      "bg-gradient-to-br from-primary/80 to-primary",
      "bg-gradient-to-br from-accent to-accent/80",
      "bg-gradient-to-br from-secondary to-secondary/80",
      "bg-gradient-to-br from-chart-1 to-chart-1/80",
      "bg-gradient-to-br from-chart-2 to-chart-2/80",
      "bg-gradient-to-br from-chart-3 to-chart-3/80",
    ]
    return styles[idx % styles.length]
  }

  return (
    <Link href={`/post/${post.slug}`}>
      <article className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-card">
        <div className={`relative h-48 ${getCardStyle(index)}`}>
          <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
        </div>

        <div className="p-6">
          <span className="inline-block px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full mb-3">
            {post.category}
          </span>
          <h4 className="text-lg font-bold mb-2 text-card-foreground group-hover:text-primary transition-colors">
            {post.title}
          </h4>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>
          <time className="text-xs text-muted-foreground">{post.date}</time>
        </div>
      </article>
    </Link>
  )
}
