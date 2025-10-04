"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Save } from "lucide-react"

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

export default function AdminPanel() {
  const [posts, setPosts] = useState<Post[]>([])
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [existingCategories, setExistingCategories] = useState<Array<{value: string, label: string}>>([])
  const [formData, setFormData] = useState<Partial<Post>>({
    title: "",
    excerpt: "",
    category: "",
    image: "",
    content: "",
    metaDescription: "",
    published: true,
    featured: false
  })

  // Predefined category options with descriptions
  const predefinedCategories = [
    { value: "Advent", label: "Advent" },
    { value: "Үхэл ба амилал", label: "Үхэл ба амилал" },
    { value: "Сайн мэдээ", label: "Сайн мэдээ" },
    { value: "Сургаалт зүйрлэлүүд", label: "Сургаалт зүйрлэлүүд" },
    { value: "Мөнх үгийн ойлголт", label: "Мөнх үгийн ойлголт" },
    { value: "Тамын тухай", label: "Тамын тухай" }
  ]

  useEffect(() => {
    loadPosts()
  }, [])

  useEffect(() => {
    // Extract unique categories from existing posts
    if (posts.length > 0) {
      const postCategories = [...new Set(posts.map(post => post.category).filter(Boolean))]
      const predefinedValues = predefinedCategories.map(cat => cat.value)
      
      // Add existing categories that aren't in predefined list
      const additionalCategories = postCategories
        .filter(cat => !predefinedValues.includes(cat))
        .map(cat => ({ value: cat, label: cat }))
      
      const allCategories = [...predefinedCategories, ...additionalCategories]
      setExistingCategories(allCategories)
    } else {
      setExistingCategories(predefinedCategories)
    }
  }, [posts])

  const loadPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      const postsData = await response.json()
      setPosts(postsData)
    } catch (error) {
      console.error('Error loading posts:', error)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      // Replace spaces and underscores with hyphens
      .replace(/[\s_]+/g, '-')
      // Remove special characters but keep Cyrillic and Latin letters, numbers, and hyphens
      .replace(/[^\u0400-\u04FF\w-]/g, '')
      // Replace multiple consecutive hyphens with single hyphen
      .replace(/-+/g, '-')
      // Remove leading and trailing hyphens
      .replace(/^-+|-+$/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.content) {
      alert('Title and content are required')
      return
    }

    const slug = generateSlug(formData.title)
    const now = new Date().toISOString()
    
    const postData: Post = {
      id: editingPost?.id || Date.now().toString(),
      title: formData.title || "",
      excerpt: formData.excerpt || "",
      category: formData.category || "general",
      date: new Date().toLocaleDateString("en-GB"),
      image: formData.image || "/placeholder.jpg",
      slug: slug,
      metaDescription: formData.metaDescription || formData.excerpt || "",
      content: formData.content || "",
      published: formData.published ?? true,
      featured: formData.featured ?? false,
      createdAt: editingPost?.createdAt || now
    }

    try {
      let updatedPosts
      if (editingPost) {
        updatedPosts = posts.map(p => p.id === editingPost.id ? postData : p)
      } else {
        updatedPosts = [...posts, postData]
      }

      // Save to server via API
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPosts)
      })

      if (!response.ok) {
        throw new Error('Failed to save post')
      }
      
      setPosts(updatedPosts)
      setEditingPost(null)
      setIsCreating(false)
      setFormData({
        title: "",
        excerpt: "",
        category: "",
        image: "",
        content: "",
        metaDescription: "",
        published: true,
        featured: false
      })
      
      alert(editingPost ? 'Post updated successfully!' : 'Post created successfully!')
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Error saving post')
    }
  }

  const handleEdit = (post: Post) => {
    setEditingPost(post)
    setFormData(post)
    setIsCreating(true)
  }

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return
    
    try {
      const updatedPosts = posts.filter(p => p.id !== postId)
      
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPosts)
      })

      if (!response.ok) {
        throw new Error('Failed to delete post')
      }

      setPosts(updatedPosts)
      alert('Post deleted successfully!')
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Error deleting post')
    }
  }

  const exportPosts = () => {
    const dataStr = JSON.stringify(posts, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = 'posts.json'
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          <div className="flex gap-4">
            <Button onClick={exportPosts} variant="outline">
              Export Posts
            </Button>
            <Button onClick={() => {
              setIsCreating(true)
              setEditingPost(null)
              setFormData({
                title: "",
                excerpt: "",
                category: "",
                image: "",
                content: "",
                metaDescription: "",
                published: true,
                featured: false
              })
            }}>
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>

        {isCreating && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingPost ? 'Edit Post' : 'Create New Post'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <div className="space-y-2">
                      <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {existingCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Or enter custom category:
                      </div>
                      <Input
                        id="custom-category"
                        value={formData.category && !existingCategories.some(cat => cat.value === formData.category) ? formData.category : ""}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        placeholder="e.g., new-category-name"
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="/path/to/image.jpg"
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={10}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({...formData, metaDescription: e.target.value})}
                    rows={2}
                  />
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData({...formData, published: e.target.checked})}
                    />
                    Published
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                    />
                    Featured
                  </label>
                </div>

                <div className="flex gap-4">
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    {editingPost ? 'Update Post' : 'Create Post'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setIsCreating(false)
                    setEditingPost(null)
                  }}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Posts ({posts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{post.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{post.excerpt}</p>
                    <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-500 mt-2">
                      <span>Category: {post.category}</span>
                      <span>Date: {post.date}</span>
                      <span>Status: {post.published ? 'Published' : 'Draft'}</span>
                      {post.featured && <span className="text-blue-600">Featured</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(post)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(post.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}