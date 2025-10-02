"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { getPosts, savePosts, categories, type Post } from "@/lib/posts"
import { ArrowLeft, Plus, Trash2, Eye, Edit, CheckCircle, XCircle, Star } from "lucide-react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ImagePicker } from "@/components/image-picker"

export default function AdminPanel() {
  const [posts, setPosts] = useState<Post[]>([])
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Сайн мэдээ",
    image: "",
    metaDescription: "",
    published: true,
    featured: false,
  })

  useEffect(() => {
    setPosts(getPosts())
  }, [])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingPost) {
      // Update existing post
      const updatedPost: Post = {
        ...editingPost,
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        image: formData.image || editingPost.image,
        metaDescription: formData.metaDescription,
        published: formData.published,
        featured: formData.featured,
        slug: generateSlug(formData.title),
      }

      const updatedPosts = posts.map((post) => (post.id === editingPost.id ? updatedPost : post))
      setPosts(updatedPosts)
      savePosts(updatedPosts)
      setEditingPost(null)
      alert("Post updated successfully!")
    } else {
      // Create new post
      const newPost: Post = {
        id: Date.now().toString(),
        slug: generateSlug(formData.title),
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        image: formData.image || `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(formData.title)}`,
        metaDescription: formData.metaDescription,
        date: new Date().toLocaleDateString("en-GB"),
        published: formData.published,
        featured: formData.featured,
      }

      const updatedPosts = [newPost, ...posts]
      setPosts(updatedPosts)
      savePosts(updatedPosts)
      alert("Post created successfully!")
    }

    // Reset form
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "Сайн мэдээ",
      image: "",
      metaDescription: "",
      published: true,
      featured: false,
    })
  }

  const handleEdit = (post: Post) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content || "",
      category: post.category,
      image: post.image,
      metaDescription: post.metaDescription,
      published: post.published ?? true,
      featured: post.featured ?? false,
    })
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleCancelEdit = () => {
    setEditingPost(null)
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "Сайн мэдээ",
      image: "",
      metaDescription: "",
      published: true,
      featured: false,
    })
  }

  const handleTogglePublished = (post: Post) => {
    const updatedPost = { ...post, published: !post.published }
    const updatedPosts = posts.map((p) => (p.id === post.id ? updatedPost : p))
    setPosts(updatedPosts)
    savePosts(updatedPosts)
  }

  const handleToggleFeatured = (post: Post) => {
    const updatedPost = { ...post, featured: !post.featured }
    const updatedPosts = posts.map((p) => (p.id === post.id ? updatedPost : p))
    setPosts(updatedPosts)
    savePosts(updatedPosts)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      const updatedPosts = posts.filter((post) => post.id !== id)
      setPosts(updatedPosts)
      savePosts(updatedPosts)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <h1 className="text-4xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground mt-2">Create and manage blog posts (supports Markdown)</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Create/Edit Post Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {editingPost ? (
                <>
                  <Edit className="h-5 w-5" />
                  Edit Post
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  Create New Post
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Enter post title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((cat) => cat !== "Бүгд")
                      .map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  required
                  placeholder="Brief summary of the post"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content * (Markdown supported)</Label>
                <Tabs defaultValue="write" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="write">Write</TabsTrigger>
                    <TabsTrigger value="preview">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="write" className="mt-2">
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      required
                      placeholder="Full post content (supports **bold**, *italic*, # headings, - lists, etc.)"
                      rows={8}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Tip: Use Markdown syntax - **bold**, *italic*, # Heading, - list, [link](url)
                    </p>
                  </TabsContent>
                  <TabsContent value="preview" className="mt-2">
                    <div className="border rounded-md p-4 min-h-[200px] max-h-[400px] overflow-y-auto prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-a:text-primary prose-blockquote:text-muted-foreground prose-code:text-foreground">
                      {formData.content ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{formData.content}</ReactMarkdown>
                      ) : (
                        <p className="text-muted-foreground italic">Preview will appear here...</p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <ImagePicker value={formData.image} onChange={(value) => setFormData({ ...formData, image: value })} />

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description *</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  required
                  placeholder="SEO meta description"
                  rows={2}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="published">Published</Label>
                  <p className="text-sm text-muted-foreground">Make this post visible to readers</p>
                </div>
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="featured">Featured in Hero</Label>
                  <p className="text-sm text-muted-foreground">Show this post in the hero section</p>
                </div>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingPost ? (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Update Post
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Post
                    </>
                  )}
                </Button>
                {editingPost && (
                  <Button type="button" variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Posts List */}
        <Card>
          <CardHeader>
            <CardTitle>All Posts ({posts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[800px] overflow-y-auto">
              {posts.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No posts yet. Create your first post!</p>
              ) : (
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-start justify-between gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{post.title}</h3>
                        {post.featured && (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" title="Featured" />
                        )}
                        {post.published === false && (
                          <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded">Draft</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{post.category}</p>
                      <p className="text-xs text-muted-foreground mt-1">{post.date}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(post)}
                        title="Edit post"
                        className="hover:bg-primary/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleTogglePublished(post)}
                        title={post.published === false ? "Publish" : "Unpublish"}
                        className={
                          post.published === false
                            ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                            : "text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                        }
                      >
                        {post.published === false ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleFeatured(post)}
                        title={post.featured ? "Remove from hero" : "Add to hero"}
                        className={
                          post.featured ? "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50" : "hover:bg-accent"
                        }
                      >
                        <Star className={`h-4 w-4 ${post.featured ? "fill-yellow-600" : ""}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(post.id)}
                        title="Delete post"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
