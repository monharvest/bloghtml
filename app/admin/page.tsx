"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImagePicker } from "@/components/image-picker"
import { Plus, Edit, Trash2, Save, Home } from "lucide-react"
import Link from "next/link"

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
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
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

  // Filter posts by category and published status
  const filteredPosts = posts.filter(post => {
    const categoryMatch = selectedCategory === "all" || post.category === selectedCategory
    return categoryMatch
  })

  // Group posts by category for easier viewing
  const postsByCategory = filteredPosts.reduce((acc, post) => {
    const category = post.category || 'Uncategorized'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(post)
    return acc
  }, {} as Record<string, Post[]>)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-full mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          </div>
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

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Create/Edit Form */}
          <div>
            {isCreating && (
              <Card>
                <CardHeader>
                  <CardTitle>{editingPost ? 'Edit Post' : 'Create New Post'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
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

                    <div>
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        value={formData.excerpt}
                        onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                        rows={2}
                      />
                    </div>

                    <ImagePicker
                      value={formData.image || ""}
                      onChange={(value) => setFormData({...formData, image: value})}
                    />

                    <div>
                      <Label htmlFor="metaDescription">Meta Description</Label>
                      <Textarea
                        id="metaDescription"
                        value={formData.metaDescription}
                        onChange={(e) => setFormData({...formData, metaDescription: e.target.value})}
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label htmlFor="content">Content *</Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                        rows={8}
                        required
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
          </div>

          {/* Right side - Posts List */}
          <div>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Posts ({filteredPosts.length})</CardTitle>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="category-filter" className="text-sm">Filter:</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories ({posts.length})</SelectItem>
                        {existingCategories.map((category) => {
                          const count = posts.filter(p => p.category === category.value).length
                          return (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label} ({count})
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 max-h-screen overflow-y-auto">
                  {selectedCategory === "all" ? (
                    // Group view when showing all categories
                    Object.entries(postsByCategory).map(([category, categoryPosts]) => (
                      <div key={category} className="space-y-3">
                        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-slate-700 pb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">{category}</h4>
                          <span className="text-xs bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                            {categoryPosts.length} posts
                          </span>
                        </div>
                        <div className="space-y-2 pl-4">
                          {categoryPosts.map((post) => (
                            <div key={post.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800/50">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{post.title}</h3>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">{post.excerpt}</p>
                                <div className="flex gap-3 text-xs text-gray-500 dark:text-gray-500 mt-1">
                                  <span>Date: {post.date}</span>
                                  <span>Status: {post.published ? 'Published' : 'Draft'}</span>
                                  {post.featured && <span className="text-blue-600">Featured</span>}
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline" onClick={() => handleEdit(post)}>
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleDelete(post.id)}>
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    // Single category view
                    <div className="space-y-4">
                      {filteredPosts.map((post) => (
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
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}