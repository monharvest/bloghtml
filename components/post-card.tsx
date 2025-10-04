import Link from "next/link"
import Image from "next/image"
import type { Post } from "@/lib/posts"

interface PostCardProps {
  post: Post
  index: number
}

export function PostCard({ post, index }: PostCardProps) {
  return (
    <Link href={`/post/${post.slug}`}>
      <article className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800 hover:-translate-y-2">
        <div className="relative h-48">
          <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
        </div>

        <div className="p-6">
          <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs rounded-full mb-3">
            {post.category}
          </span>
          <h4 className="text-lg font-bold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {post.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>
          <time className="text-xs text-gray-500 dark:text-gray-500">{post.date}</time>
        </div>
      </article>
    </Link>
  )
}
